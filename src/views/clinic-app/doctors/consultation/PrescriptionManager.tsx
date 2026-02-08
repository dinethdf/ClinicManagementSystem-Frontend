'use client'

import { useState, useEffect, useCallback, memo } from 'react' // ADDED: useCallback, memo

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid' 
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Services & Types
import { createPrescription } from '@/services/doctor/consultation.server.service'
import { prescriptionService } from '@/services/appointment/prescription.service'
import type { PrescriptionItemDTO } from '@/types/consultation.types' 
import type { MedicineDTO, PrescriptionConfigDTO } from '@/types/prescription.types'

type Props = {
  appointmentId: number
  onConsultationComplete: () => void
}

const PrescriptionManager = ({ appointmentId, onConsultationComplete }: Props) => {
  
  // --- STATES ---
  const [items, setItems] = useState<PrescriptionItemDTO[]>([]) 
  const [config, setConfig] = useState<PrescriptionConfigDTO>({ categories: [], units: [], frequencies: [] })
  
  // Search Dialog State
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [medicineOptions, setMedicineOptions] = useState<MedicineDTO[]>([])
  const [loadingMedicines, setLoadingMedicines] = useState(false)
  const [searchTerm, setSearchTerm] = useState('') 

  // Form Data
  const [diagnosisTitle, setDiagnosisTitle] = useState('')
  const [diagnosisDesc, setDiagnosisDesc] = useState('')
  const [mainNote, setMainNote] = useState('') 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Internal Form State
  const [form, setForm] = useState({
    category: '',         
    medicineName: '',     
    packSize: '', 
    frequency: '',        
    duration: '',         
    prescriptionNote: ''  
  })
  
  const [isCategoryLocked, setIsCategoryLocked] = useState(false)

  // Combine Diagnosis Title & Desc
  useEffect(() => {
    const note = diagnosisTitle ? `${diagnosisTitle} - ${diagnosisDesc}` : diagnosisDesc;
    setMainNote(note)
  }, [diagnosisTitle, diagnosisDesc])

  // OPTIMIZATION: Memoize config loader
  const loadConfig = useCallback(async () => {
    const data = await prescriptionService.getPrescriptionConfig()
    if (data) setConfig(data)
  }, [])

  // Load Config
  useEffect(() => {
    loadConfig()
  }, [loadConfig]) // MODIFIED: Added loadConfig to deps

  // --- SEARCH MEDICINES ---
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
        setMedicineOptions([])
        return
    }
    setLoadingMedicines(true)
    const timerId = setTimeout(async () => {
        try {
            const results = await prescriptionService.searchMedicines(searchTerm, form.category)
            setMedicineOptions(results)
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingMedicines(false)
        }
    }, 500) 
    return () => clearTimeout(timerId)
  }, [searchTerm, form.category])

  // OPTIMIZATION: Memoize all handlers
  const handleOpenSearch = useCallback(() => {
      setSearchTerm('')
      setMedicineOptions([])
      setIsSearchOpen(true)
  }, [])

  const handleSelectMedicine = useCallback((med: any) => {
      setForm(prev => ({
          ...prev,
          medicineName: med.name, 
          category:  prev.category, 
          packSize: med.packSize || prev.packSize 
      }))
      setIsCategoryLocked(true)
      setIsSearchOpen(false)
  }, [])

  const handleClearMedicine = useCallback((e: any) => {
      e.stopPropagation()
      setForm(prev => ({
          ...prev, 
          medicineName: '', 
          packSize: '', 
      }))
      setIsCategoryLocked(false)
  }, [])

  const handleResetForm = useCallback(() => {
      setForm({
        category: '',         
        medicineName: '',     
        packSize: '', 
        frequency: '',        
        duration: '',         
        prescriptionNote: '' 
      })
      setIsCategoryLocked(false)
      setErrorMsg(null)
  }, [])

  const handleAdd = useCallback(() => {
    if (!form.medicineName || !form.frequency) {
        setErrorMsg("Please select a Medicine and Frequency")
        return;
    }
    setErrorMsg(null)

    let combinedInstructions = form.frequency;
    if (form.packSize) combinedInstructions += ` [Pack: ${form.packSize}]`;
    if (form.prescriptionNote) combinedInstructions += ` (${form.prescriptionNote})`;
    
    const newItem: PrescriptionItemDTO = {
        medicineName: form.medicineName, 
        dosage: 'N/A', 
        duration: form.duration || '0',  
        quantity: "1",                   
        instructions: combinedInstructions       
    }

    setItems(prev => [...prev, newItem]) // MODIFIED: Use functional update
    
    setForm(prev => ({ 
        category: prev.category, 
        medicineName: '', 
        packSize: '', 
        frequency: '', 
        duration: '', 
        prescriptionNote: '' 
    }))
    setIsCategoryLocked(false)
  }, [form])

  const handleRemove = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index)) // MODIFIED: Use functional update
  }, [])

  const handleFinalize = useCallback(async () => {
    if (!appointmentId) {
        setErrorMsg("Error: Invalid Appointment ID")
        return
    }
    setIsSubmitting(true)
    setErrorMsg(null)

    const payload = {
        appointmentId: appointmentId,
        note: mainNote || "Routine Checkup",
        items: items
    }

    const res = await createPrescription(payload)

    if (res.success) {
        onConsultationComplete() 
    } else {
        setErrorMsg(res.error || "Failed to submit prescription")
    }
    setIsSubmitting(false)
  }, [appointmentId, mainNote, items, onConsultationComplete])

  const handleCloseDialog = useCallback(() => {
    setIsSearchOpen(false)
  }, [])

  return (
    <Card className='h-full'>
      <CardHeader title="Prescription & Diagnosis" action={
         <Button variant='tonal' color='secondary' size='small'>Draft Saved</Button>
      }/>
      <Divider />
      <CardContent>
        {errorMsg && <Alert severity='error' className='mb-4'>{errorMsg}</Alert>}

        {/* --- 1. DIAGNOSIS --- */}
        <Grid container spacing={3} className='mb-6'>
            <Grid size={{ xs: 12, md: 4 }}>
                <CustomTextField 
                    fullWidth label="Diagnosis Title" placeholder="e.g. Viral Fever"
                    value={diagnosisTitle} onChange={(e) => setDiagnosisTitle(e.target.value)}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                <CustomTextField 
                    fullWidth label="Diagnosis Description" placeholder="Detailed observation..."
                    value={diagnosisDesc} onChange={(e) => setDiagnosisDesc(e.target.value)}
                />
            </Grid>
        </Grid>

        {/* --- 2. ADD MEDICINE FORM --- */}
        <Box className='bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6'>
            <div className='flex justify-between items-center mb-4'>
                <Typography variant='subtitle1' className='font-semibold flex items-center gap-2'>
                    <i className='tabler-pill text-primary' /> Add Medicine
                </Typography>
                
                <Button 
                    variant="text" color="secondary" size="small" 
                    onClick={handleResetForm}
                    startIcon={<i className="tabler-rotate-clockwise" />}
                >
                    Reset Form
                </Button>
            </div>
            
            <Grid container spacing={2} alignItems="center">
                
                {/* Category */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <CustomTextField 
                        select fullWidth label="Category" size="small"
                        value={form.category}
                        disabled={isCategoryLocked}
                        onChange={(e) => setForm({...form, category: e.target.value})}
                    >
                        <MenuItem value=""><em>All Categories</em></MenuItem>
                        {config.categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>

                {/* Medicine Search */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <div onClick={handleOpenSearch} className="cursor-pointer">
                        <CustomTextField 
                            fullWidth label="Select Medicine" size="small"
                            placeholder={form.category ? `Search in ${form.category}...` : "Click to search database..."}
                            value={form.medicineName} 
                            InputProps={{
                                readOnly: true, 
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <i className='tabler-search text-gray-500' />
                                    </InputAdornment>
                                ),
                                endAdornment: form.medicineName && (
                                    <InputAdornment position="end">
                                        <Tooltip title="Clear Medicine">
                                            <IconButton size="small" onClick={handleClearMedicine}>
                                                <i className='tabler-x' />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                </Grid>

                {/* Details */}
                <Grid size={{ xs: 6, md: 2 }}>
                    <CustomTextField 
                        fullWidth size="small" label="Pack Size" placeholder="10's" 
                        value={form.packSize}
                        onChange={(e) => setForm({...form, packSize: e.target.value})}
                    />
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                    <CustomTextField 
                        select fullWidth size="small" label="Frequency" 
                        value={form.frequency}
                        onChange={(e) => setForm({...form, frequency: e.target.value})}
                    >
                         {config.frequencies.map((f) => (
                            <MenuItem key={f} value={f}>{f}</MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>

                <Grid size={{ xs: 6, md: 2 }}>
                    <CustomTextField 
                        fullWidth size="small" label="Duration" placeholder="5 Days" 
                        value={form.duration}
                        onChange={(e) => setForm({...form, duration: e.target.value})}
                    />
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                    <CustomTextField 
                        fullWidth size="small" placeholder="Instructions" 
                        value={form.prescriptionNote}
                        onChange={(e) => setForm({...form, prescriptionNote: e.target.value})}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                    <Button 
                        fullWidth variant='contained' onClick={handleAdd} sx={{ height: '40px' }}
                        startIcon={<i className='tabler-plus' />}
                    >
                        Add
                    </Button>
                </Grid>

            </Grid>
        </Box>

        {/* --- 3. MEDICINE TABLE --- */}
        <TableContainer component={Paper} variant='outlined'>
            <Table size='small'>
                <TableHead>
                    <TableRow className='bg-gray-100'>
                        <TableCell width="40%" sx={{ fontWeight: 'bold' }}>Medicine Name</TableCell>
                        <TableCell width="30%" sx={{ fontWeight: 'bold' }}>Instructions / Pack</TableCell>
                        <TableCell width="15%" sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                        <TableCell width="15%" align='right' sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align='center' className='py-12 text-gray-400'>
                                <div className='flex flex-col items-center gap-2'>
                                    <i className='tabler-pill-off text-2xl opacity-50'/>
                                    <Typography variant='body2'>No medicines added yet.</Typography>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((row, index) => (
                            <TableRow key={index} hover>
                                <TableCell className='font-medium text-primary'>{row.medicineName}</TableCell>
                                <TableCell className='text-gray-600'>{row.instructions}</TableCell>
                                <TableCell>{row.duration} Days</TableCell>
                                <TableCell align='right'>
                                    <IconButton size='small' color='error' onClick={() => handleRemove(index)}>
                                        <i className='tabler-trash' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        
        {/* --- 4. FOOTER ACTIONS --- */}
        <div className='mt-6 flex justify-end gap-3'>
             <Button variant='outlined' color='secondary' disabled={isSubmitting}>
                Cancel
             </Button>
             <Button 
                variant='contained' color='primary' 
                onClick={handleFinalize} 
                disabled={isSubmitting || (items.length === 0 && !mainNote)}
                startIcon={isSubmitting ? <CircularProgress size={20} color='inherit'/> : <i className='tabler-check' />}
             >
                {isSubmitting ? 'Finalizing...' : 'Finalize Prescription'}
            </Button>
        </div>
      </CardContent>

      {/* --- MEDICINE SELECTION POPUP --- */}
      <Dialog 
        open={isSearchOpen} 
        onClose={handleCloseDialog} // MODIFIED: Use memoized callback
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
            Select Medicine
             <IconButton
                aria-label="close"
                onClick={handleCloseDialog} // MODIFIED: Use memoized callback
                sx={{ position: 'absolute', right: 8, top: 8 }}
            >
                <i className="tabler-x" />
            </IconButton>
        </DialogTitle>
        <DialogContent dividers className='p-0'>
            <div className='p-4 bg-gray-50 border-b'>
                 <CustomTextField 
                    fullWidth 
                    autoFocus
                    placeholder={form.category ? `Search ${form.category} (min 3 chars)...` : "Search all medicines (min 3 chars)..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <i className='tabler-search' />
                            </InputAdornment>
                        ),
                        endAdornment: loadingMedicines && <CircularProgress size={20} />
                    }}
                />
                {form.category && (
                    <Typography variant="caption" className="text-blue-600 mt-1 block">
                        Filtering by: <b>{form.category}</b>
                    </Typography>
                )}
            </div>

            <List sx={{ minHeight: '300px', maxHeight: '500px', overflow: 'auto' }}>
                {searchTerm.length < 3 && medicineOptions.length === 0 && (
                    <div className='flex items-center justify-center h-40 text-gray-400'>
                        Start typing to search...
                    </div>
                )}
                
                {searchTerm.length >= 3 && !loadingMedicines && medicineOptions.length === 0 && (
                    <div className='flex items-center justify-center h-40 text-gray-500'>
                        No medicines found.
                    </div>
                )}

                {medicineOptions.map((med: any) => (
                    <ListItem key={med.id} disablePadding divider>
                        <ListItemButton onClick={() => handleSelectMedicine(med)}>
                            <ListItemText 
                                primary={
                                    <div className='flex items-center gap-2'>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {med.name} 
                                        </Typography>
                                        {med.packSize && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border">
                                                {med.packSize}
                                            </span>
                                        )}
                                    </div>
                                }
                                secondaryTypographyProps={{ component: 'div' }}
                                secondary={
                                    <div className='mt-1 flex flex-col gap-0.5'>
                                        <Typography variant="caption" className='text-gray-500'>
                                            Generic: {med.genericName}
                                        </Typography>
                                        <Typography variant="caption" className='text-blue-600'>
                                            {med.category}
                                        </Typography>
                                    </div>
                                }
                            />
                            <div className='text-primary'>
                                <i className='tabler-circle-plus' />
                            </div>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </DialogContent>
      </Dialog>

    </Card>
  )
}

PrescriptionManager.displayName = 'PrescriptionManager' // ADDED
export default memo(PrescriptionManager) // MODIFIED: Wrapped in memo