'use client'

import { useState, useEffect, useRef, SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'

// Component Imports
import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps' 
import PatientProfileSidebar from './PatientProfileSidebar'
import PrescriptionManager from './PrescriptionManager'

// Service Imports
import { checkAppointmentStatus } from '@/services/appoinment.server.service'
import { doctorSheduleService } from '@/services/doctor.shedule.service'
import { 
  getConsultationPatientDetails, 
  getPatientByBarcode 
} from '@/services/consultation.server.service'

// Type Imports
import type { AppointmentStatusDTO } from '@/types/appoinments.types'
import type { PatientDetailDTO } from '@/types/consultation.types'
import type { ThemeColor } from '@core/types'

interface AnalyticsData {
  total: number
  completed: number
  booked: number
  pendingPayment: number
  cancelled: number
}

const ConsultationView = ({ scheduleId }: { scheduleId: string }) => {
  const router = useRouter()

  // --- VIEW STATES ---
  const [viewState, setViewState] = useState<'SEARCH' | 'CONSULTATION'>('SEARCH')
  const [activeTab, setActiveTab] = useState('1') 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- DATA STATES ---
  const [searchInputValue, setSearchInputValue] = useState<any | null>(null)
  const [processingPatient, setProcessingPatient] = useState<any | null>(null)
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentStatusDTO | null>(null)
  const [patientDetail, setPatientDetail] = useState<PatientDetailDTO | null>(null)
  
  // --- DIALOG STATES ---
  const [startConsultationOpen, setStartConsultationOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  // Analytics
  const [stats, setStats] = useState<AnalyticsData>({ total: 0, completed: 0, booked: 0, pendingPayment: 0, cancelled: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  // Barcode Ref
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  const [barcodeVal, setBarcodeVal] = useState('')

  // --- EFFECTS ---
  useEffect(() => {
    loadAnalytics()
  }, [scheduleId])

  useEffect(() => {
      if (activeTab === '2') {
          setTimeout(() => barcodeInputRef.current?.focus(), 100)
      }
  }, [activeTab])

  // Keydown Listener (Space for Scan / Enter handled by button autoFocus)
// --- GLOBAL SHORTCUT: SPACEBAR ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // 1. Check if the user is currently typing in an input or textarea
        const target = e.target as HTMLElement;
        const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        // 2. If pressing SPACE, NOT typing, and NOT already in a popup
        if (e.code === 'Space' && !isTyping && !startConsultationOpen && !confirmDialogOpen) {
            
            // Prevent the default "Page Scroll Down" behavior of Spacebar
            e.preventDefault(); 
            
            // Switch to Barcode Tab
            setActiveTab('2'); 
            
            // Force focus immediately (small delay ensures tab switch renders first)
            setTimeout(() => {
                barcodeInputRef.current?.focus();
            }, 50);
        }
    };

    // Attach to window so it works "anywhere you select"
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startConsultationOpen, confirmDialogOpen]); // Dependencies ensure we don't trigger if a dialog is open

  const loadAnalytics = async () => {
      setLoadingStats(true)
      const data = await doctorSheduleService.getScheduleAnalytics(Number(scheduleId))
      if (data) setStats(data)
      setLoadingStats(false)
  }

  // --- LOGIC HANDLERS ---
  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
    setError(null)
    setAppointmentInfo(null)
    setStartConsultationOpen(false)
  }

  const executeStatusCheck = async (patientId: number) => {
    setLoading(true); setError(null); setAppointmentInfo(null);
    try {
      const res = await checkAppointmentStatus(Number(scheduleId), patientId)
      if (res.success && res.data) {
         setAppointmentInfo(res.data)
         setStartConsultationOpen(true) // Open Popup on success
      } else {
         setError(res.error?.message || "Patient has no appointment in this schedule.")
      }
    } catch (e) { setError("System Error during status check") }
    setLoading(false)
  }

  // 1. Manual Search Logic
  const handleManualSearchSelect = (newValue: any) => {
      setSearchInputValue(newValue); 
      setProcessingPatient(newValue); 
      setAppointmentInfo(null);
      setError(null);
  }
  
  const handleCheckStatusClick = async () => {
    if (!processingPatient?.id) {
        setError("Please select a patient first.")
        return
    }
    await executeStatusCheck(processingPatient.id)
  }

  // 2. Barcode Scan Logic
  const handleBarcodeSubmit = async (codeOverride?: string) => {
      const scannedCode = codeOverride || barcodeVal;
      if (!scannedCode.trim()) return;

      setLoading(true); setError(null); setAppointmentInfo(null);
      
      try {
        const result = await getPatientByBarcode(scannedCode.trim());

        if (result.success && result.data) {
            const scannedPatient = result.data;
            setProcessingPatient(scannedPatient);
            setBarcodeVal('');          
            await executeStatusCheck(scannedPatient.id);
        } else {
            setError(result.error?.message || "Invalid barcode or patient not found.");
            setLoading(false); 
            setBarcodeVal(''); 
            setTimeout(() => barcodeInputRef.current?.focus(), 100); 
        }
      } catch (err) {
        setError("Network error scanning barcode");
        setLoading(false);
      }
  }

  const handleStartConsultation = async () => {
    if(!processingPatient?.id) return;

    setLoading(true)
    const res = await getConsultationPatientDetails(processingPatient.id)
    if(res.success && res.data) {
      setPatientDetail(res.data)
      setStartConsultationOpen(false) // Close Popup
      setViewState('CONSULTATION')
    } else {
      setError("Failed to load patient profile")
    }
    setLoading(false)
  }

  const handleReset = () => {
    setViewState('SEARCH')
    setActiveTab('1') 
    setAppointmentInfo(null)
    setProcessingPatient(null)
    setSearchInputValue(null)
    setError(null)
    setStartConsultationOpen(false)
    loadAnalytics() 
  }

  const handleCompleteScheduleClick = () => {
      const pendingCount = stats.booked + stats.pendingPayment;
      if (pendingCount > 0) setConfirmDialogOpen(true)
      else finishSchedule()
  }

  const finishSchedule = () => {
     router.push(`/clinic/doctor/schedule/${scheduleId}/finish`)
  }

  // --- STAT CARD HELPER ---
  const renderStatCard = (title: string, count: number, icon: string, color: ThemeColor) => (
      <Card className='h-full border-b-4 border-b-transparent hover:border-b-primary transition-all shadow-sm'>
        <CardContent className='flex flex-col items-center justify-center gap-2 p-4 text-center'>
            <Avatar variant='rounded' className={`bg-${color}/10 text-${color}`}>
                <i className={`${icon} text-xl`} />
            </Avatar>
            <div className='flex flex-col'>
                <Typography variant='h4' className={`font-bold text-${color}`}>{count}</Typography>
                <Typography variant='body2' color='text.secondary'>{title}</Typography>
            </div>
        </CardContent>
      </Card>
  )

  // ==========================================
  // VIEW 1: SEARCH DASHBOARD
  // ==========================================
  if (viewState === 'SEARCH') {
    return (
      <div className='flex flex-col gap-6 animate-in fade-in duration-500'>
        
        {/* Header & Analytics */}
        <div className='flex justify-between items-end'>
             <div>
                <Typography variant='h4'>Session Dashboard</Typography>
                <Typography variant='body2' color='text.secondary'>Overview of Schedule #{scheduleId}</Typography>
             </div>
             <Button 
                variant='contained' 
                color={stats.booked > 0 ? 'warning' : 'primary'}
                startIcon={<i className='tabler-check' />}
                onClick={handleCompleteScheduleClick}
             >
                Complete Schedule
             </Button>
        </div>

        {loadingStats ? (
             <div className='flex justify-center p-4'><CircularProgress /></div>
        ) : (
            <Grid container spacing={4}>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>{renderStatCard('Total', stats.total, 'tabler-users', 'primary')}</Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>{renderStatCard('Completed', stats.completed, 'tabler-circle-check', 'success')}</Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>{renderStatCard('Waiting', stats.booked, 'tabler-clock', 'warning')}</Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>{renderStatCard('Pay Pending', stats.pendingPayment, 'tabler-currency-dollar', 'info')}</Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>{renderStatCard('Cancelled', stats.cancelled, 'tabler-circle-x', 'error')}</Grid>
            </Grid>
        )}

        {/* --- MAIN INTERFACE: TABS --- */}
        <div className='flex flex-col items-center justify-center min-h-[40vh] gap-6'>
            <Card className='w-full max-w-md overflow-visible shadow-lg border border-gray-100'>
                <TabContext value={activeTab}>
                    
                    {/* Header */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f9fafb' }}>
                        <TabList 
                            onChange={handleTabChange} 
                            variant="fullWidth"
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: '55px', fontSize: '0.95rem' } }}
                        >
                            <Tab label="Search Patient" value="1" icon={<i className='tabler-search text-lg' />} iconPosition="start" />
                            <Tab label="Scan Barcode" value="2" icon={<i className='tabler-scan text-lg' />} iconPosition="start" />
                        </TabList>
                    </Box>

                    {/* Tab 1: Manual Search */}
                    <TabPanel value="1" sx={{ p: 3 }}> 
                        <div className='flex flex-col gap-5'>
                            <div className='bg-blue-50 text-blue-600 p-3 rounded-md text-sm flex items-center gap-2'>
                                <i className='tabler-info-circle' />
                                <span>Enter Name, Patient ID, or Phone Number</span>
                            </div>
                            
                            <AsyncAutocomplete
                                value={searchInputValue}
                                onChange={handleManualSearchSelect}
                                label='Find Patient'
                                fetchUrl='/api/patient/search-by-no' 
                                searchParamKey='patientNo'
                                placeholder='e.g. Kamal Perera...'
                                getOptionLabel={(option: any) => `${option.firstName} ${option.lastName} (${option.patientNo})`}
                                fetchInputLenth={2}
                                fullWidth
                            />

                            <Button 
                                variant='contained' fullWidth size='large' 
                                onClick={handleCheckStatusClick} 
                                disabled={loading || !processingPatient} 
                                className='shadow-none py-3 font-bold'
                            >
                                {loading ? <CircularProgress size={24} color='inherit'/> : 'Check Appointment Status'}
                            </Button>
                        </div>
                    </TabPanel>

                    {/* Tab 2: Barcode Scan */}
                    <TabPanel value="2" sx={{ p: 3 }}>
                        <div className='flex flex-col gap-4 text-center'>
                            <div 
                                className={`
                                    border-2 border-dashed rounded-xl p-8 transition-all
                                    flex flex-col items-center justify-center gap-3
                                    ${loading ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
                                `}
                                onClick={() => barcodeInputRef.current?.focus()} 
                            >
                                <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main', mb: 1 }}>
                                    <i className='tabler-barcode text-3xl' />
                                </Avatar>
                                
                                <Typography variant='h6' sx={{ fontWeight: 600 }}>Ready to Scan</Typography>
                                
                                <TextField
                                    inputRef={barcodeInputRef}
                                    fullWidth
                                    autoFocus
                                    placeholder="Listening for scanner..."
                                    value={barcodeVal}
                                    size='small'
                                    onChange={(e) => {
                                        const newVal = e.target.value;
                                        if (!/^\d*$/.test(newVal)) return; 
                                        setBarcodeVal(newVal);
                                        if (newVal.length === 10) handleBarcodeSubmit(newVal);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleBarcodeSubmit();
                                    }}
                                    sx={{ '& .MuiInputBase-input': { textAlign: 'center', letterSpacing: '2px', fontSize: '1.2rem' } }}
                                    variant="outlined"
                                />
                                <Typography variant='caption' color="text.secondary">
                                    Ensure cursor is blinking in the box above.<br/>
                                    Scanner will auto-submit after 10 digits.
                                </Typography>
                            </div>
                        </div>
                    </TabPanel>
                </TabContext>
                
                {/* Error Display */}
                <CardContent className='pt-0'>
                    {error && <Alert severity='error' className='mb-2'>{error}</Alert>}
                </CardContent>
            </Card>
        </div>

        {/* --- POPUP 1: START CONSULTATION (Updated Size & Key Bind) --- */}
        <Dialog 
            open={startConsultationOpen} 
            onClose={() => setStartConsultationOpen(false)}
            // 'md' gives it more width than 'sm', and we constrain it with sx for the "Sweet Spot"
            maxWidth="md"
            fullWidth
            sx={{ '& .MuiDialog-paper': { width: '700px', maxWidth: '95vw' } }} // <--- Custom "A bit large" Width
            // Handle global Enter key on the dialog just in case
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                    e.preventDefault();
                    handleStartConsultation();
                }
            }}
        >
            <DialogTitle className='bg-primary text-white flex justify-between items-center'>
                <span className='flex items-center gap-2'>
                    <i className='tabler-user-check' /> 
                    Patient Found
                </span>
                <Chip label={appointmentInfo?.status} size='small' color='default' className='bg-white/20 text-white font-bold' />
            </DialogTitle>
            
            <DialogContent className='pt-8'>
                 {appointmentInfo && (
                    <div className='flex flex-col items-center gap-6'>
                        
                        {/* 1. Patient Info */}
                        <div className='flex flex-col items-center gap-2 text-center'>
                            <Avatar className='w-24 h-24 bg-primary/10 text-primary text-4xl border-2 border-primary mb-2'>
                                {appointmentInfo.fullName.charAt(0)}
                            </Avatar>
                            <div>
                                <Typography variant='h4' className='font-bold'>{appointmentInfo.fullName}</Typography>
                                <Typography variant='subtitle1' color='text.secondary'>ID: {appointmentInfo.patientNo}</Typography>
                            </div>
                        </div>

                        <Divider flexItem className='w-full' />

                        {/* 2. Queue Number Display */}
                        <div className='bg-gray-50 rounded-xl p-8 w-full flex justify-between items-center border border-gray-100'>
                            <div>
                                <Typography variant='caption' className='uppercase tracking-wider text-gray-500 font-bold'>Queue Number</Typography>
                                <Typography variant='h1' className='text-primary font-black leading-none text-6xl'>
                                    {appointmentInfo.queueNo}
                                </Typography>
                            </div>
                            <div className='text-right'>
                                <Typography variant='body2' color='text.secondary'>Appt Type</Typography>
                                <Typography variant='h6' className='font-bold text-gray-700'>Standard Visit</Typography>
                            </div>
                        </div>

                    </div>
                 )}
            </DialogContent>
            
            <DialogActions className='p-6 pt-2 gap-2'>
                <Button 
                    onClick={() => setStartConsultationOpen(false)} 
                    size='large' 
                    color='inherit'
                    className='px-6'
                >
                    Cancel
                </Button>
                <Button 
                    variant='contained' 
                    color='success' 
                    size='large'
                    fullWidth 
                    startIcon={<i className='tabler-stethoscope' />}
                    onClick={handleStartConsultation} 
                    disabled={loading}
                    className='py-3 text-lg font-bold'
                    // IMPORTANT: Auto-focus allows "Enter" key to work immediately
                    autoFocus 
                >
                    {loading ? 'Starting...' : 'Start Consultation (Enter)'}
                </Button>
            </DialogActions>
        </Dialog>


        {/* --- POPUP 2: CONFIRM CLOSE SCHEDULE --- */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
            <DialogTitle className='text-warning-main flex items-center gap-2'>
                <i className='tabler-alert-triangle' /> 
                Pending Patients
            </DialogTitle>
            <DialogContent>
                <Typography>
                    There are <strong>{stats.booked} Booked</strong> and <strong>{stats.pendingPayment} Payment Pending</strong> patients remaining.
                </Typography>
                <Typography className='mt-2 font-semibold'>
                    Are you sure you want to finish this session?
                </Typography>
            </DialogContent>
            <DialogActions className='p-4 pt-0'>
                <Button onClick={() => setConfirmDialogOpen(false)} color='inherit'>Cancel</Button>
                <Button onClick={finishSchedule} variant='contained' color='warning'>
                    Yes, Finish Anyway
                </Button>
            </DialogActions>
        </Dialog>
      </div>
    )
  }

  // ==========================================
  // VIEW 2: CONSULTATION DASHBOARD
  // ==========================================
  return (
    <div className='flex flex-col gap-6 animate-in slide-in-from-right duration-300'>
      {/* ... (Same as before) ... */}
       {/* Header */}
      <div className='flex justify-between items-center flex-wrap gap-4 bg-white p-4 rounded shadow-sm border border-gray-100'>
        <div>
            <div className='flex items-center gap-3'>
                <Typography variant='h4' className='text-primary'>Consultation Room</Typography>
                <Chip label="Ongoing Session" color='success' size='small' className='animate-pulse' />
            </div>
            <Typography color='text.secondary' className='mt-1'>
                Queue: <span className='font-bold text-black text-lg mr-3'>#{appointmentInfo?.queueNo}</span> 
                Patient: <span className='font-semibold text-black'>{patientDetail?.fullName}</span>
            </Typography>
        </div>
        <Button variant='outlined' color='error' startIcon={<i className='tabler-x' />} onClick={handleReset}>
            End Session
        </Button>
      </div>

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
             {patientDetail && <PatientProfileSidebar patient={patientDetail} />}
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
             <PrescriptionManager 
                appointmentId={Number(appointmentInfo?.appointmentId || 0)} 
                onConsultationComplete={handleReset} 
             />
        </Grid>
      </Grid>
    </div>
  )
}

export default ConsultationView