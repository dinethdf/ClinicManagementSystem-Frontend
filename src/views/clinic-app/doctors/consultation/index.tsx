'use client'

import { useState, useEffect } from 'react'
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

// Component Imports
import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps' 
import PatientProfileSidebar from './PatientProfileSidebar'
import PrescriptionManager from './PrescriptionManager'

// Service Imports
import { checkAppointmentStatus } from '@/services/appoinment.server.service'
import { getConsultationPatientDetails } from '@/services/consultation.server.service'
import { doctorSheduleService } from '@/services/doctor.shedule.service'

// Type Imports
import type { AppointmentStatusDTO } from '@/types/appoinments.types'
import type { PatientDetailDTO } from '@/types/consultation.types'
import type { ThemeColor } from '@core/types'

// Types for Analytics
interface AnalyticsData {
    total: number
    completed: number
    booked: number
    pendingPayment: number
    cancelled: number
}

const ConsultationView = ({ scheduleId }: { scheduleId: string }) => {
  const router = useRouter()

  // --- STATES ---
  const [viewState, setViewState] = useState<'SEARCH' | 'CONSULTATION'>('SEARCH')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentStatusDTO | null>(null)
  const [patientDetail, setPatientDetail] = useState<PatientDetailDTO | null>(null)
  
  // Analytics State
  const [stats, setStats] = useState<AnalyticsData>({ total: 0, completed: 0, booked: 0, pendingPayment: 0, cancelled: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  // Dialog State
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  // --- EFFECTS ---
  
  // Load Analytics on Mount
  useEffect(() => {
    loadAnalytics()
  }, [scheduleId])

  const loadAnalytics = async () => {
      setLoadingStats(true)
      const data = await doctorSheduleService.getScheduleAnalytics(Number(scheduleId))
      if (data) {
          setStats(data)
      }
      setLoadingStats(false)
  }

  // --- HANDLERS ---

  const handleCheckStatus = async () => {
    if (!selectedPatient?.id) {
        setError("Please select a patient first.")
        return
    }
    
    setLoading(true); setError(null); setAppointmentInfo(null);

    try {
      const res = await checkAppointmentStatus(Number(scheduleId), selectedPatient.id)
       
      if (res.success && res.data) {
        console.log("Appoinemnt details")
        console.log(res.data)
           setAppointmentInfo(res.data)
       } else {
           setError(res.error?.message || "Patient has no appointment in this schedule.")
       }
    } catch (e) { setError("System Error") }
   
    setLoading(false)
  }

  const handleStartConsultation = async () => {
    if(!selectedPatient?.id) return;

    setLoading(true)
    const res = await getConsultationPatientDetails(selectedPatient.id)
    
    if(res.success && res.data) {
      setPatientDetail(res.data)
      setViewState('CONSULTATION')
    } else {
      setError("Failed to load patient profile")
    }
    setLoading(false)
  }

  const handleReset = () => {
    setViewState('SEARCH')
    setAppointmentInfo(null)
    setSelectedPatient(null)
    setPatientDetail(null)
    setError(null)
    loadAnalytics() // Refresh stats after finishing a consultation
  }

  // --- NEW: Handle "Complete Schedule" ---
  const handleCompleteScheduleClick = () => {
      // Logic: If there are booked or pending payment patients, warn the doctor.
      const pendingCount = stats.booked + stats.pendingPayment;

      if (pendingCount > 0) {
          setConfirmDialogOpen(true)
      } else {
          // If all clear, navigate immediately
          finishSchedule()
      }
  }

  const finishSchedule = () => {
      // Navigate to the schedule list or summary page
     router.push(`/doctor/schedule/${scheduleId}/finish`)
  }

  // --- RENDER HELPERS ---
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

  if (viewState === 'SEARCH') {
    return (
      <div className='flex flex-col gap-6 animate-in fade-in duration-500'>
        
        {/* 1. TOP: Header & Analytics */}
        <div className='flex justify-between items-end'>
             <div>
                <Typography variant='h4'>Session Dashboard</Typography>
                <Typography variant='body2' color='text.secondary'>Overview of Schedule #{scheduleId}</Typography>
             </div>
             
             {/* THE COMPLETE SCHEDULE BUTTON */}
             <Button 
                variant='contained' 
                color={stats.booked > 0 ? 'warning' : 'primary'} // Orange if pending, Blue if done
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
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                    {renderStatCard('Total', stats.total, 'tabler-users', 'primary')}
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                    {renderStatCard('Completed', stats.completed, 'tabler-circle-check', 'success')}
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                    {renderStatCard('Waiting', stats.booked, 'tabler-clock', 'warning')}
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                    {renderStatCard('Pay Pending', stats.pendingPayment, 'tabler-currency-dollar', 'info')}
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                    {renderStatCard('Cancelled', stats.cancelled, 'tabler-circle-x', 'error')}
                </Grid>
            </Grid>
        )}

        {/* 2. CENTER: Search Interface */}
        <div className='flex flex-col items-center justify-center min-h-[40vh] gap-6'>
            <Card className='w-full max-w-md overflow-visible shadow-lg border border-gray-100'>
                <CardContent className='flex flex-col gap-5 p-6'>
                    
                    <div className='text-center'>
                         <Typography variant='h5' className='mb-1'>Next Patient</Typography>
                         <Typography variant='body2' color='text.secondary'>Search queue to start consultation</Typography>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <AsyncAutocomplete
                            value={selectedPatient}
                            onChange={(newValue: any) => setSelectedPatient(newValue)}
                            label='Search Patient'
                            fetchUrl='/api/patient/search-by-no' 
                            searchParamKey='patientNo'
                            placeholder='Type Name, No or NIC'
                            getOptionLabel={(option: any) => `${option.firstName} ${option.lastName} (${option.patientNo})`}
                            fetchInputLenth={2}
                            fullWidth
                        />

                        <Button 
                            variant='contained' fullWidth size='large' 
                            onClick={handleCheckStatus} disabled={loading || !selectedPatient}
                            className='shadow-none'
                        >
                            {loading ? <CircularProgress size={24} color='inherit'/> : 'Check Status'}
                        </Button>
                        
                        {error && (
                            <Alert severity='error' className='mt-2'>{error}</Alert>
                        )}
                    </div>

                    {appointmentInfo && (
                        <div className='mt-2 border rounded-lg p-4 bg-primary/5 border-primary/20 flex flex-col gap-4 animate-in zoom-in-95 duration-300'>
                            <div className='flex items-center gap-4'>
                                    <Avatar className='bg-white text-primary font-bold border border-primary/20'>
                                        {appointmentInfo.fullName.charAt(0)}
                                    </Avatar>
                                    <div>
                                        <Typography className='font-bold'>{appointmentInfo.fullName}</Typography>
                                        <Typography variant='caption' color='text.secondary'>{appointmentInfo.patientNo}</Typography>
                                    </div>
                            </div>
                            <Divider className='border-dashed' />
                            <div className='flex justify-between items-center px-2'>
                                <div className='flex flex-col items-center'>
                                    <Typography variant='caption' className='uppercase tracking-wide text-gray-500'>Queue No</Typography>
                                    <Typography variant='h2' color='primary' className='font-bold leading-none'>{appointmentInfo.queueNo}</Typography>
                                </div>
                                    <div className='flex flex-col items-end'>
                                    <Typography variant='caption' className='mb-1'>Current Status</Typography>
                                    <Chip label={appointmentInfo.status} color={appointmentInfo.status === 'BOOKED' ? 'warning' : 'default'} variant='filled' size='small'/>
                                </div>
                            </div>
                            <Button 
                                variant='contained' color='success' fullWidth 
                                startIcon={<i className='tabler-stethoscope' />}
                                onClick={handleStartConsultation} disabled={loading}
                                className='mt-2'
                            >
                                {loading ? 'Loading...' : 'Start Consultation'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
            <DialogTitle className='text-warning-main flex items-center gap-2'>
                <i className='tabler-alert-triangle' /> 
                Pending Patients
            </DialogTitle>
            <DialogContent>
                <Typography>
                    There are <strong>{stats.booked} Booked</strong> and <strong>{stats.pendingPayment} Payment Pending</strong> patients remaining in this schedule.
                </Typography>
                <Typography className='mt-2 font-semibold'>
                    Are you sure you want to finish this schedule session?
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
        {/* Left: Patient Profile */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
             {patientDetail && <PatientProfileSidebar patient={patientDetail} />}
        </Grid>

        {/* Right: Prescription */}
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