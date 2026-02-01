'use client'

import { useState, useEffect, useRef, SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Component Imports
import SessionAnalytics from './components/SessionAnalytics'
import PatientSearchTabs from './components/PatientSearchTabs'
import StartConsultationDialog from './components/StartConsultationDialog'
import EndSessionDialog from './components/EndSessionDialog'
import ActiveConsultationView from './components/ActiveConsultationView'

// Service Imports
import { checkAppointmentStatus } from '@/services/appointment/appoinment.server.service'
import { doctorSheduleService } from '@/services/doctor/doctor.shedule.service'
import { 
  getConsultationPatientDetails, 
  getPatientByBarcode 
} from '@/services/doctor/consultation.server.service'

// Type Imports
import type { AppointmentStatusDTO } from '@/types/appoinments.types'
import type { PatientDetailDTO } from '@/types/consultation.types'

interface AnalyticsData {
  total: number; completed: number; booked: number; pendingPayment: number; cancelled: number;
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
  useEffect(() => { loadAnalytics() }, [scheduleId])

  useEffect(() => {
      if (activeTab === '2') {
          setTimeout(() => barcodeInputRef.current?.focus(), 100)
      }
  }, [activeTab])

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
    if (!processingPatient?.id) return;
    if (appointmentInfo?.status === 'PENDING_PAYMENT') {
        setError("Cannot start consultation: Payment is Pending.")
        return
    }
    setLoading(true)
    try {
        const res = await getConsultationPatientDetails(processingPatient.id)
        if (res.success && res.data) {
            setPatientDetail(res.data)
            setStartConsultationOpen(false) 
            setViewState('CONSULTATION')
            try {
                if (scheduleId && appointmentInfo?.queueNo) {
                    await doctorSheduleService.callPatient(Number(scheduleId), appointmentInfo.queueNo);
                }
            } catch (queueError) {
                console.log("Queue Update Error (Non-blocking):", queueError);
            }

        } else {
            setError("Failed to load patient profile")
        }

    } catch (err: any) {
        console.error(err)
        setError("An unexpected error occurred loading profile")
    } finally {
        setLoading(false)
    }
  }

  const handleComplete = async () => {
     try {
          if (scheduleId && appointmentInfo?.queueNo) {
               await doctorSheduleService.completePatient(Number(scheduleId), appointmentInfo.queueNo);
           }
       } catch (queueError) {
           console.log("Queue Completion Error:", queueError);
       }
    handleReset()
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

  if (viewState === 'SEARCH') {
    return (
      <div className='flex flex-col gap-3 animate-in fade-in duration-500'>
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

        {/* 1. Analytics */}
        <SessionAnalytics stats={stats} loading={loadingStats} />

        {/* 2. Search Tabs */}
        <PatientSearchTabs 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            error={error}
            loading={loading}
            // Manual
            searchInputValue={searchInputValue}
            onManualSelect={handleManualSearchSelect}
            onCheckStatus={handleCheckStatusClick}
            processingPatient={processingPatient}
            // Barcode
            barcodeVal={barcodeVal}
            setBarcodeVal={setBarcodeVal}
            onBarcodeSubmit={handleBarcodeSubmit}
            barcodeInputRef={barcodeInputRef}
        />

        {/* 3. Dialogs */}
        <StartConsultationDialog 
            open={startConsultationOpen}
            onClose={() => setStartConsultationOpen(false)}
            onConfirm={handleStartConsultation}
            loading={loading}
            appointmentInfo={appointmentInfo}
        />

        <EndSessionDialog 
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
            onConfirm={finishSchedule}
            stats={stats}
        />
      </div>
    )
  }

  return (
    <ActiveConsultationView 
        appointmentInfo={appointmentInfo}
        patientDetail={patientDetail}
        onEnd={handleReset}
        onComplete={handleComplete}
    />
  )
}

export default ConsultationView