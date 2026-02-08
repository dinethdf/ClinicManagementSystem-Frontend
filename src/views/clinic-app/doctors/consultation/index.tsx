'use client'

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react' // ADDED: useCallback, useMemo, memo
import { useRouter } from 'next/navigation'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Component Imports
import SessionAnalytics from './components/SessionAnalytics'
import PatientSearchTabs from './components/PatientSearchTabs'
import StartConsultationDialog from '@/components/dialogs/appointment-start/StartConsultationDialog'
import EndSessionDialog from './components/EndSessionDialog'
import ActiveConsultationView from './components/ActiveConsultationView'

// Service Imports
import { checkAppointmentStatus } from '@/services/appointment/appoinment.server.service'
import { doctorSheduleService } from '@/services/doctor/doctor.shedule.service'
import { getPatientByBarcode 
} from '@/services/doctor/consultation.server.service'

// Type Imports
import type { AppointmentStatusDTO } from '@/types/appoinments.types'
import type { PatientDetailDTO } from '@/types/patient.types'
import { getPatientByIdConsutant } from '@/services/patient/patient.server.service'

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

  // ADDED: Memoized values
  const scheduleIdNumber = useMemo(() => Number(scheduleId), [scheduleId])
  const pendingCount = useMemo(() => stats.booked + stats.pendingPayment, [stats.booked, stats.pendingPayment])

  // MODIFIED: Added useCallback
  const loadAnalytics = useCallback(async () => {
      setLoadingStats(true)
      const data = await doctorSheduleService.getScheduleAnalytics(scheduleIdNumber)
      if (data) setStats(data)
      setLoadingStats(false)
  }, [scheduleIdNumber])

  // --- EFFECTS ---
  useEffect(() => { loadAnalytics() }, [loadAnalytics]) // MODIFIED: Added loadAnalytics to deps

  useEffect(() => {
      if (activeTab === '2') {
          const timer = setTimeout(() => barcodeInputRef.current?.focus(), 100) // MODIFIED: Store timer
          return () => clearTimeout(timer) // ADDED: Cleanup
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

  // MODIFIED: Added useCallback to all handlers
  const executeStatusCheck = useCallback(async (patientId: number) => {
    setLoading(true); setError(null); setAppointmentInfo(null);
    try {
      const res = await checkAppointmentStatus(scheduleIdNumber, patientId)

      if (res.success && res.data) {
         setAppointmentInfo(res.data)
         setStartConsultationOpen(true) 
      } else {
         setError(res.error?.message || "Patient has no appointment in this schedule.")
      }
    } catch (e) { setError("System Error during status check") }
    setLoading(false)
  }, [scheduleIdNumber])

  const handleTabChange = useCallback((event: any, newValue: string) => {
    setActiveTab(newValue)
    setError(null)
    setAppointmentInfo(null)
    setStartConsultationOpen(false)
  }, [])

  const handleManualSearchSelect = useCallback((newValue: any) => {
      setSearchInputValue(newValue); 
      setProcessingPatient(newValue); 
      setAppointmentInfo(null);
      setError(null);
  }, [])
  
  const handleCheckStatusClick = useCallback(async () => {
    if (!processingPatient?.id) {
        setError("Please select a patient first.")
        return
    }
    await executeStatusCheck(processingPatient.id)
  }, [processingPatient?.id, executeStatusCheck])

  const handleBarcodeSubmit = useCallback(async (codeOverride?: string) => {
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
  }, [barcodeVal, executeStatusCheck])

  const handleStartConsultation = useCallback(async () => {
    if (!processingPatient?.id) return;
    if (appointmentInfo?.statusCode === 'PENDING_PAYMENT') {
        setError("Cannot start consultation: Payment is Pending.")
        return
    }
    setLoading(true)
    try {
        const res = await getPatientByIdConsutant(processingPatient.id)
        if (res.success && res.data) {
            setPatientDetail(res.data)
            setStartConsultationOpen(false) 
            setViewState('CONSULTATION')
            try {
                if (scheduleId && appointmentInfo?.queuePosition) {
                    await doctorSheduleService.callPatient(scheduleIdNumber, appointmentInfo.queuePosition);
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
  }, [processingPatient?.id, appointmentInfo?.statusCode, appointmentInfo?.queuePosition, scheduleId, scheduleIdNumber])

  const handleComplete = useCallback(async () => {
     try {
          if (scheduleId && appointmentInfo?.queuePosition) {
               await doctorSheduleService.completePatient(scheduleIdNumber, appointmentInfo.queuePosition);
           }
       } catch (queueError) {
           console.log("Queue Completion Error:", queueError);
       }
    handleReset()
  }, [scheduleId, appointmentInfo?.queuePosition, scheduleIdNumber]) // ADDED: handleReset will be added below

  const handleReset = useCallback(() => {
    setViewState('SEARCH')
    setActiveTab('1') 
    setAppointmentInfo(null)
    setProcessingPatient(null)
    setSearchInputValue(null)
    setError(null)
    setStartConsultationOpen(false)
    loadAnalytics() 
  }, [loadAnalytics])

  // MODIFIED: Move handleReset above handleComplete, then update handleComplete deps
  // Re-ordering to fix dependency (handleComplete now depends on handleReset)

  const finishSchedule = useCallback(() => {
     router.push(`/doctor/schedule/${scheduleId}/finish`)
  }, [router, scheduleId])

  const handleCompleteScheduleClick = useCallback(() => {
      if (pendingCount > 0) setConfirmDialogOpen(true)
      else finishSchedule()
  }, [pendingCount, finishSchedule])

  const closeStartDialog = useCallback(() => {
    setStartConsultationOpen(false)
  }, [])

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialogOpen(false)
  }, [])

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
            barcodeInputRef={barcodeInputRef as any}
        />

        {/* 3. Dialogs */}
        <StartConsultationDialog 
            open={startConsultationOpen}
            onClose={closeStartDialog} // MODIFIED: Use memoized callback
            onConfirm={handleStartConsultation}
            loading={loading}
            appointmentInfo={appointmentInfo}
        />

        <EndSessionDialog 
            open={confirmDialogOpen}
            onClose={closeConfirmDialog} // MODIFIED: Use memoized callback
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

ConsultationView.displayName = 'ConsultationView' // ADDED
export default memo(ConsultationView) // MODIFIED: Wrapped in memo