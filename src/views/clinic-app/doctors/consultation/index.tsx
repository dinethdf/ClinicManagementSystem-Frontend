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

  // Keydown Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const isInputActive = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        if (e.code === 'Space' && !isInputActive && viewState === 'SEARCH' && !startConsultationOpen && !confirmDialogOpen) {
            e.preventDefault(); 
            setActiveTab('2'); 
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewState, startConsultationOpen, confirmDialogOpen]);

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
         setStartConsultationOpen(true) 
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

    // --- VALIDATION: Prevent starting if payment is pending ---
    if (appointmentInfo?.status === 'PENDING_PAYMENT') {
        setError("Cannot start consultation: Payment is Pending.")
        return
    }

    setLoading(true)
    const res = await getConsultationPatientDetails(processingPatient.id)
    if(res.success && res.data) {
      setPatientDetail(res.data)
      setStartConsultationOpen(false) 
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
     router.push(`/doctor/schedule/${scheduleId}/finish`)
  }

  // --- COMPACT STAT CARD ---
  const renderStatCard = (title: string, count: number, icon: string, color: ThemeColor) => (
      <Card className='h-full border-b-4 border-b-transparent hover:border-b-primary transition-all shadow-sm'>
        <CardContent className='flex flex-col items-center justify-center gap-1 p-3 text-center'>
            <Avatar variant='rounded' className={`bg-${color}/10 text-${color} w-9 h-9`}>
                <i className={`${icon} text-lg`} />
            </Avatar>
            <div className='flex flex-col'>
                <Typography variant='h5' className={`font-bold text-${color}`}>{count}</Typography>
                <Typography variant='caption' color='text.secondary'>{title}</Typography>
            </div>
        </CardContent>
      </Card>
  )

  // ==========================================
  // VIEW 1: SEARCH DASHBOARD (LAPTOP OPTIMIZED)
  // ==========================================
  if (viewState === 'SEARCH') {
    return (
      <div className='flex flex-col gap-3 animate-in fade-in duration-500'>
        
        {/* Header & Buttons */}
        <div className='flex justify-between items-end'>
             <div>
                <Typography variant='h5'>Session Dashboard</Typography>
                <Typography variant='caption' color='text.secondary'>Schedule #{scheduleId}</Typography>
             </div>
             <Button 
                variant='contained' 
                color={stats.booked > 0 ? 'warning' : 'primary'}
                startIcon={<i className='tabler-check' />}
                onClick={handleCompleteScheduleClick}
                size='small'
             >
                Complete
             </Button>
        </div>

        {/* Analytics Grid */}
        {loadingStats ? (
             <div className='flex justify-center p-2'><CircularProgress size={24} /></div>
        ) : (
            <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>{renderStatCard('Total', stats.total, 'tabler-users', 'primary')}</Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>{renderStatCard('Done', stats.completed, 'tabler-circle-check', 'success')}</Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>{renderStatCard('Waiting', stats.booked, 'tabler-clock', 'warning')}</Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>{renderStatCard('Payment', stats.pendingPayment, 'tabler-currency-dollar', 'info')}</Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>{renderStatCard('Cancelled', stats.cancelled, 'tabler-circle-x', 'error')}</Grid>
            </Grid>
        )}

        {/* --- MAIN INTERFACE: TABS (COMPACT) --- */}
        <div className='flex flex-col items-center justify-center mt-2'>
            <Card className='w-full max-w-md overflow-visible shadow-lg border border-gray-100'>
                <TabContext value={activeTab}>
                    
                    {/* Compact Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f9fafb' }}>
                        <TabList 
                            onChange={handleTabChange} 
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
                                value={searchInputValue}
                                onChange={handleManualSearchSelect}
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
                                onClick={handleCheckStatusClick} 
                                disabled={loading || !processingPatient} 
                                className='shadow-none font-bold'
                            >
                                {loading ? <CircularProgress size={20} color='inherit'/> : 'Check Status'}
                            </Button>
                        </div>
                    </TabPanel>

                    {/* Tab 2: Barcode Scan */}
                    <TabPanel value="2" sx={{ p: 2 }}>
                        <div className='flex flex-col gap-2 text-center'>
                            <div 
                                className={`
                                    border-2 border-dashed rounded-lg p-4 transition-all
                                    flex flex-col items-center justify-center gap-2
                                    ${loading ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
                                `}
                                onClick={() => barcodeInputRef.current?.focus()} 
                            >
                                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                                    <i className='tabler-barcode text-xl' />
                                </Avatar>
                                
                                <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>Ready to Scan</Typography>
                                
                                <TextField
                                    inputRef={barcodeInputRef}
                                    fullWidth
                                    autoFocus
                                    placeholder="Scanning..."
                                    value={barcodeVal}
                                    onChange={(e) => {
                                        const newVal = e.target.value;
                                        if (!/^\d*$/.test(newVal)) return; 
                                        setBarcodeVal(newVal);
                                        if (newVal.length === 10) handleBarcodeSubmit(newVal);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleBarcodeSubmit();
                                    }}
                                    sx={{ '& .MuiInputBase-input': { textAlign: 'center', letterSpacing: '1px' } }}
                                    variant="outlined"
                                    size="small"
                                />
                            </div>
                        </div>
                    </TabPanel>
                </TabContext>
                
                {/* --- FIX: ADDED PADDING TO ERROR DISPLAY --- */}
                <CardContent className='pt-2 pb-4 px-4'> {/* Increased padding here */}
                    {error && <Alert severity='error' className='mb-0'>{error}</Alert>}
                </CardContent>
            </Card>
        </div>

        {/* --- POPUP 1: START CONSULTATION --- */}
        <Dialog 
            open={startConsultationOpen} 
            onClose={() => setStartConsultationOpen(false)}
            maxWidth="md"
            fullWidth
            sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '90vw' } }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                    e.preventDefault();
                    handleStartConsultation();
                }
            }}
        >
            <DialogTitle className='bg-primary text-white flex justify-between items-center py-3'>
                <span className='flex items-center gap-2 text-lg'>
                    <i className='tabler-user-check' /> 
                    Patient Found
                </span>
                <Chip label={appointmentInfo?.status} size='small' className='bg-white/20 text-white font-bold' />
            </DialogTitle>
            
            <DialogContent className='pt-6 pb-2'>
                 {appointmentInfo && (
                    <div className='flex flex-col items-center gap-4'>
                        {/* Patient Info */}
                        <div className='flex flex-col items-center gap-1 text-center'>
                            <Avatar className='w-16 h-16 bg-primary/10 text-primary text-2xl border-2 border-primary mb-1'>
                                {appointmentInfo.fullName.charAt(0)}
                            </Avatar>
                            <div>
                                <Typography variant='h5' className='font-bold'>{appointmentInfo.fullName}</Typography>
                                <Typography variant='body2' color='text.secondary'>ID: {appointmentInfo.patientNo}</Typography>
                            </div>
                        </div>

                        <Divider flexItem className='w-full' />

                        {/* Queue Number */}
                        <div className='bg-gray-50 rounded-lg p-4 w-full flex justify-between items-center border border-gray-100'>
                            <div>
                                <Typography variant='caption' className='uppercase tracking-wider text-gray-500 font-bold'>Queue No</Typography>
                                <Typography variant='h2' className='text-primary font-black leading-none'>
                                    {appointmentInfo.queueNo}
                                </Typography>
                            </div>
                            <div className='text-right'>
                                <Typography variant='caption' color='text.secondary'>Type</Typography>
                                <Typography variant='subtitle1' className='font-bold text-gray-700'>Standard</Typography>
                            </div>
                        </div>

                        {/* --- VALIDATION WARNING UI --- */}
                        {appointmentInfo.status === 'PENDING_PAYMENT' && (
                            <Alert severity="error" className="w-full font-bold">
                                <Typography variant="subtitle2" color="error" fontWeight={700}>
                                    Cannot Start: Payment is Pending
                                </Typography>
                            </Alert>
                        )}
                    </div>
                 )}
            </DialogContent>
            
            <DialogActions className='p-4 gap-2'>
                <Button onClick={() => setStartConsultationOpen(false)} color='inherit'>Cancel</Button>
                <Button 
                    variant='contained' 
                    color='success' 
                    fullWidth 
                    startIcon={<i className='tabler-stethoscope' />}
                    onClick={handleStartConsultation} 
                    // --- DISABLE IF PAYMENT PENDING ---
                    disabled={loading || appointmentInfo?.status !== 'BOOKED'}
                    autoFocus 
                >
                    Start (Enter)
                </Button>
            </DialogActions>
        </Dialog>

        {/* --- POPUP 2: CONFIRM --- */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
            <DialogTitle className='text-warning-main flex items-center gap-2'>
                <i className='tabler-alert-triangle' /> End Session?
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2">
                    <strong>{stats.booked}</strong> waiting, <strong>{stats.pendingPayment}</strong> pending payment.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setConfirmDialogOpen(false)} color='inherit'>No</Button>
                <Button onClick={finishSchedule} variant='contained' color='warning'>Yes, End</Button>
            </DialogActions>
        </Dialog>
      </div>
    )
  }

  // ==========================================
  // VIEW 2: CONSULTATION DASHBOARD
  // ==========================================
  return (
    <div className='flex flex-col gap-4 animate-in slide-in-from-right duration-300'>
      
      {/* Header */}
      <div className='flex justify-between items-center flex-wrap gap-4 bg-white p-3 rounded shadow-sm border border-gray-100'>
        <div>
            <div className='flex items-center gap-2'>
                <Typography variant='h5' className='text-primary'>Consultation</Typography>
                <Chip label="Active" color='success' size='small' />
            </div>
            <Typography variant="caption" color='text.secondary'>
                Queue: <strong>#{appointmentInfo?.queueNo}</strong> | {patientDetail?.fullName}
            </Typography>
        </div>
        <Button variant='outlined' color='error' size='small' startIcon={<i className='tabler-x' />} onClick={handleReset}>
            End
        </Button>
      </div>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
             {patientDetail && <PatientProfileSidebar patient={patientDetail} />}
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
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