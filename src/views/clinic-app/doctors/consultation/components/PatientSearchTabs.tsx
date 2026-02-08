import { RefObject, memo, useCallback } from 'react' // ADDED: memo, useCallback
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps'

interface Props {
  activeTab: string
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void
  error: string | null
  loading: boolean
  
  // Manual Search Props
  searchInputValue: any
  onManualSelect: (val: any) => void
  onCheckStatus: () => void
  processingPatient: any

  // Barcode Props
  barcodeVal: string
  setBarcodeVal: (val: string) => void
  onBarcodeSubmit: (val?: string) => void
  barcodeInputRef: RefObject<HTMLInputElement | null>
}

const PatientSearchTabs = (props: Props) => {

    // ADDED: Memoized callback for barcode input
    const handleBarcodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        if (!/^\d*$/.test(newVal)) return; 
        props.setBarcodeVal(newVal);
        if (newVal.length === 10) props.onBarcodeSubmit(newVal);
    }, [props])

    // ADDED: Memoized callback for Enter key
    const handleBarcodeKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') props.onBarcodeSubmit();
    }, [props])

  return (
    <div className='flex flex-col items-center justify-center mt-2'>
        <Card className='w-full max-w-md overflow-visible shadow-lg border border-gray-100'>
            <TabContext value={props.activeTab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f9fafb' }}>
                    <TabList 
                        onChange={props.onTabChange} 
                        variant="fullWidth"
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: '42px', fontSize: '0.9rem' } }}
                    >
                        <Tab label="Search" value="1" icon={<i className='tabler-search' />} iconPosition="start" />
                        <Tab label="Scan Barcode" value="2" icon={<i className='tabler-scan' />} iconPosition="start" />
                    </TabList>
                </Box>

                {/* Tab 1: Manual Search */}
                <TabPanel value="1" sx={{ p: 2 }}>
                    <div className='flex flex-col gap-3'>
                        <AsyncAutocomplete
                            value={props.searchInputValue}
                            onChange={props.onManualSelect}
                            label='Search Patient'
                            fetchUrl='/api/patient/search-by-no' 
                            searchParamKey='patientNo'
                            placeholder='Name / ID / Phone'
                            getOptionLabel={(option: any) => `${option.firstName} ${option.lastName} (${option.patientNo})`}
                            fetchInputLenth={2}
                            fullWidth
                            size='small'
                        />
                        <Button 
                            variant='contained' fullWidth 
                            onClick={props.onCheckStatus} 
                            disabled={props.loading || !props.processingPatient} 
                            className='shadow-none font-bold'
                        >
                            {props.loading ? <CircularProgress size={20} color='inherit'/> : 'Check Status'}
                        </Button>
                    </div>
                </TabPanel>

                {/* Tab 2: Barcode Scan */}
                <TabPanel value="2" sx={{ p: 2 }}>
                    <div className='flex flex-col gap-2 text-center'>
                        <div 
                            className={`border-2 border-dashed rounded-lg p-4 transition-all flex flex-col items-center justify-center gap-2 ${props.loading ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
                            onClick={() => props.barcodeInputRef.current?.focus()} 
                        >
                            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                                <i className='tabler-barcode text-xl' />
                            </Avatar>
                            <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>Ready to Scan</Typography>
                            <TextField
                                inputRef={props.barcodeInputRef}
                                fullWidth autoFocus
                                placeholder="Scanning..."
                                value={props.barcodeVal}
                                onChange={handleBarcodeChange} // MODIFIED: Use memoized callback
                                onKeyDown={handleBarcodeKeyDown} // MODIFIED: Use memoized callback
                                sx={{ '& .MuiInputBase-input': { textAlign: 'center', letterSpacing: '1px' } }}
                                variant="outlined" size="small"
                            />
                        </div>
                    </div>
                </TabPanel>
            </TabContext>
            
            <CardContent className='pt-2 pb-4 px-4'>
                {props.error && <Alert severity='error' className='mb-0'>{props.error}</Alert>}
            </CardContent>
        </Card>
    </div>
  )
}

PatientSearchTabs.displayName = 'PatientSearchTabs' // ADDED
export default memo(PatientSearchTabs) // MODIFIED: Wrapped in memo