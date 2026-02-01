'use client'

import { useState, useEffect, useRef, SyntheticEvent } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import DialogCloseButton from './../DialogCloseButton'
import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps'

// Service Imports
import { getPatientByBarcode } from '@/services/doctor/consultation.server.service'
import type { PatientDetailDTO } from '@/types/consultation.types'

type PatientSelectorDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onPatientSelect: (patient: PatientDetailDTO) => void
  initialTab?: string // <--- NEW PROP
}

const PatientSelectorDialog = ({ open, setOpen, onPatientSelect, initialTab = '1' }: PatientSelectorDialogProps) => {
  // Use initialTab prop for default state
  const [activeTab, setActiveTab] = useState(initialTab)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  const [barcodeVal, setBarcodeVal] = useState('')
  const [searchInputValue, setSearchInputValue] = useState<any | null>(null)

  // --- EFFECT: Handle Focus & Tab Switching ---
  useEffect(() => {
      // If dialog opens, reset to the requested initial tab
      if (open) {
          setActiveTab(initialTab)
          setError(null)
          setSearchInputValue(null)
          setBarcodeVal('')
      }
  }, [open, initialTab])

  // Focus input when switching to Barcode tab (Tab '2')
  useEffect(() => {
      if (open && activeTab === '2') {
          // Slight delay to ensure modal animation finishes
          setTimeout(() => barcodeInputRef.current?.focus(), 100)
      }
  }, [activeTab, open])


  // --- HANDLERS ---
  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
    setError(null)
  }

  const handleManualSearchSelect = (newValue: any) => {
      setSearchInputValue(newValue);
      setError(null);
  }

  const handleSelectClick = () => {
     if (searchInputValue) {
         onPatientSelect(searchInputValue)
         setOpen(false)
     }
  }

  const handleBarcodeSubmit = async (codeOverride?: string) => {
      const scannedCode = codeOverride || barcodeVal;
      if (!scannedCode.trim()) return;

      setLoading(true); setError(null);
      
      try {
        const result = await getPatientByBarcode(scannedCode.trim());

        if (result.success && result.data) {
            onPatientSelect(result.data as unknown as PatientDetailDTO); 
            setOpen(false);
            setBarcodeVal('');          
        } else {
            setError(result.error?.message || "Invalid barcode or patient not found.");
            setBarcodeVal(''); 
            setTimeout(() => barcodeInputRef.current?.focus(), 100); 
        }
      } catch (err) {
        setError("Network error scanning barcode");
      } finally {
        setLoading(false);
      }
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle variant='h4' className='text-center p-6'>
        Find Patient
        <Typography component='span' className='flex flex-col text-center text-sm text-gray-500 mt-1'>
          {activeTab === '2' ? 'Scan patient ID card now' : 'Search by Name, ID or Phone'}
        </Typography>
      </DialogTitle>

      <DialogContent className='p-0 overflow-hidden'>
        <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f9fafb' }}>
                <TabList onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Search" value="1" icon={<i className='tabler-search' />} iconPosition="start" />
                    <Tab label="Scan Barcode" value="2" icon={<i className='tabler-scan' />} iconPosition="start" />
                </TabList>
            </Box>

            {error && (
                <div className="px-6 pt-4">
                    <Alert severity="error">{error}</Alert>
                </div>
            )}

            {/* TAB 1: SEARCH */}
            <TabPanel value="1" className="p-6">
                <div className='flex flex-col gap-4'>
                    <AsyncAutocomplete
                        value={searchInputValue}
                        onChange={handleManualSearchSelect}
                        label='Search Patient'
                        fetchUrl='/api/patient/search-by-no' 
                        searchParamKey='patientNo'
                        placeholder='Name / ID / Phone'
                        getOptionLabel={(option: any) => `${option.firstName} ${option.lastName} (${option.patientNo})`}
                        fetchInputLenth={2}
                        fullWidth
                    />
                    <Button 
                        variant='contained' 
                        fullWidth 
                        onClick={handleSelectClick} 
                        disabled={!searchInputValue} 
                        size="large"
                    >
                        Select Patient
                    </Button>
                </div>
            </TabPanel>

            {/* TAB 2: BARCODE */}
            <TabPanel value="2" className="p-6">
                 <div className='flex flex-col gap-4 items-center text-center'>
                    <div 
                        className={`
                            w-full border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer
                            flex flex-col items-center justify-center gap-3
                            ${loading ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
                        `}
                        onClick={() => barcodeInputRef.current?.focus()} 
                    >
                        <Avatar sx={{ width: 48, height: 48, bgcolor: loading ? 'grey.300' : 'primary.main' }}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : <i className='tabler-barcode text-2xl' />}
                        </Avatar>
                        
                        <div>
                            <Typography variant='h6'>Scan ID Card</Typography>
                            <Typography variant='caption' color="text.secondary">Make sure the input field is focused</Typography>
                        </div>
                        
                        <TextField
                            inputRef={barcodeInputRef}
                            fullWidth
                            autoFocus
                            placeholder="Scanning..."
                            value={barcodeVal}
                            disabled={loading}
                            onChange={(e) => {
                                const newVal = e.target.value;
                                if (!/^\d*$/.test(newVal)) return; 
                                setBarcodeVal(newVal);
                                if (newVal.length === 10) handleBarcodeSubmit(newVal);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleBarcodeSubmit();
                            }}
                            sx={{ '& .MuiInputBase-input': { textAlign: 'center', letterSpacing: '2px', fontWeight: 'bold' } }}
                            size="small"
                        />
                    </div>
                </div>
            </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}

export default PatientSelectorDialog