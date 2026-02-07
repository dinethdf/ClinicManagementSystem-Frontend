'use client'

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
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
import { getPatientByBarcode } from '@/services/doctor/consultation.server.service'
import { getPatientByIdConsutant } from '@/services/patient/patient.server.service'

// Type Imports
import type { AppointmentStatusDTO } from '@/types/appoinments.types'
import type { PatientDetailDTO } from '@/types/patient.types'

interface AnalyticsData {
  total: number
  completed: number
  booked: number
  pendingPayment: number
  cancelled: number
}

interface ConsultationViewProps {
  scheduleId: string
}

const ConsultationView = ({ scheduleId }: ConsultationViewProps) => {
  const router = useRouter()

  // ============================================================================
  // STATE MANAGEMENT (Grouped by concern)
  // ============================================================================
  
  // View State
  const [viewState, setViewState] = useState<'SEARCH' | 'CONSULTATION'>('SEARCH')
  const [activeTab, setActiveTab] = useState('1')
  
  // UI State
  const [loading, setLoading] = useState(false)
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Patient Data
  const [searchInputValue, setSearchInputValue] = useState<any | null>(null)
  const [processingPatient, setProcessingPatient] = useState<any | null>(null)
  const [patientDetail, setPatientDetail] = useState<PatientDetailDTO | null>(null)
  
  // Appointment Data
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentStatusDTO | null>(null)
  const [stats, setStats] = useState<AnalyticsData>({
    total: 0,
    completed: 0,
    booked: 0,
    pendingPayment: 0,
    cancelled: 0
  })
  
  // Dialog State
  const [startConsultationOpen, setStartConsultationOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  
  // Barcode State
  const [barcodeVal, setBarcodeVal] = useState('')
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================
  
  const pendingCount = useMemo(() => 
    stats.booked + stats.pendingPayment, 
    [stats.booked, stats.pendingPayment]
  )
  
  const scheduleIdNumber = useMemo(() => 
    Number(scheduleId), 
    [scheduleId]
  )

  // ============================================================================
  // CALLBACKS (Prevents function recreation on every render)
  // ============================================================================
  
  const loadAnalytics = useCallback(async () => {
    setLoadingStats(true)
    const data = await doctorSheduleService.getScheduleAnalytics(scheduleIdNumber)
    if (data) setStats(data)
    setLoadingStats(false)
  }, [scheduleIdNumber])

  const executeStatusCheck = useCallback(async (patientId: number) => {
    setLoading(true)
    setError(null)
    setAppointmentInfo(null)
    
    try {
      const res = await checkAppointmentStatus(scheduleIdNumber, patientId)

      if (res.success && res.data) {
        setAppointmentInfo(res.data)
        setStartConsultationOpen(true)
      } else {
        setError(res.error?.message || "Patient has no appointment in this schedule.")
      }
    } catch (e) {
      setError("System Error during status check")
    } finally {
      setLoading(false)
    }
  }, [scheduleIdNumber])

  const handleTabChange = useCallback((event: any, newValue: string) => {
    setActiveTab(newValue)
    setError(null)
    setAppointmentInfo(null)
    setStartConsultationOpen(false)
  }, [])

  const handleManualSearchSelect = useCallback((newValue: any) => {
    setSearchInputValue(newValue)
    setProcessingPatient(newValue)
    setAppointmentInfo(null)
    setError(null)
  }, [])

  const handleCheckStatusClick = useCallback(async () => {
    if (!processingPatient?.id) {
      setError("Please select a patient first.")
      return
    }
    await executeStatusCheck(processingPatient.id)
  }, [processingPatient?.id, executeStatusCheck])

  const handleBarcodeSubmit = useCallback(async (codeOverride?: string) => {
    const scannedCode = codeOverride || barcodeVal
    if (!scannedCode.trim()) return

    setLoading(true)
    setError(null)
    setAppointmentInfo(null)

    try {
      const result = await getPatientByBarcode(scannedCode.trim())

      if (result.success && result.data) {
        const scannedPatient = result.data
        setProcessingPatient(scannedPatient)
        setBarcodeVal('')
        await executeStatusCheck(scannedPatient.id)
      } else {
        setError(result.error?.message || "Invalid barcode or patient not found.")
        setBarcodeVal('')
        setTimeout(() => barcodeInputRef.current?.focus(), 100)
      }
    } catch (err) {
      setError("Network error scanning barcode")
    } finally {
      setLoading(false)
    }
  }, [barcodeVal, executeStatusCheck])

  const handleStartConsultation = useCallback(async () => {
    if (!processingPatient?.id) return

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

        // Non-blocking queue update
        if (appointmentInfo?.queuePosition) {
          doctorSheduleService
            .callPatient(scheduleIdNumber, appointmentInfo.queuePosition)
            .catch(err => console.log("Queue Update Error (Non-blocking):", err))
        }
      } else {
        setError("Failed to load patient profile")
      }
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred loading profile")
    } finally {
      setLoading(false)
    }
  }, [processingPatient?.id, appointmentInfo?.statusCode, appointmentInfo?.queuePosition, scheduleIdNumber])

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

  const handleComplete = useCallback(async () => {
    try {
      if (appointmentInfo?.queuePosition) {
        await doctorSheduleService.completePatient(
          scheduleIdNumber, 
          appointmentInfo.queuePosition
        )
      }
    } catch (queueError) {
      console.log("Queue Completion Error:", queueError)
    }
    handleReset()
  }, [appointmentInfo?.queuePosition, scheduleIdNumber, handleReset])

  const finishSchedule = useCallback(() => {
    router.push(`/doctor/schedule/${scheduleId}/finish`)
  }, [router, scheduleId])

  const handleCompleteScheduleClick = useCallback(() => {
    if (pendingCount > 0) {
      setConfirmDialogOpen(true)
    } else {
      finishSchedule()
    }
  }, [pendingCount, finishSchedule])

  const closeStartDialog = useCallback(() => {
    setStartConsultationOpen(false)
  }, [])

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialogOpen(false)
  }, [])

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  // Load analytics on mount
  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  // Focus barcode input when tab switches
  useEffect(() => {
    if (activeTab === '2') {
      const timer = setTimeout(() => barcodeInputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [activeTab])

  // Keyboard shortcut (Space to switch to barcode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInputActive = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable

      if (
        e.code === 'Space' && 
        !isInputActive && 
        viewState === 'SEARCH' && 
        !startConsultationOpen && 
        !confirmDialogOpen
      ) {
        e.preventDefault()
        setActiveTab('2')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewState, startConsultationOpen, confirmDialogOpen])

  // ============================================================================
  // RENDER: CONSULTATION VIEW
  // ============================================================================
  
  if (viewState === 'CONSULTATION') {
    return (
      <ActiveConsultationView
        appointmentInfo={appointmentInfo}
        patientDetail={patientDetail}
        onEnd={handleReset}
        onComplete={handleComplete}
      />
    )
  }

  // ============================================================================
  // RENDER: SEARCH VIEW
  // ============================================================================
  
  return (
    <div className='flex flex-col gap-3 animate-in fade-in duration-500'>
      {/* Header */}
      <div className='flex justify-between items-end'>
        <div>
          <Typography variant='h5'>Session Dashboard</Typography>
          <Typography variant='caption' color='text.secondary'>
            Schedule #{scheduleId}
          </Typography>
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

      {/* Analytics */}
      <SessionAnalytics stats={stats} loading={loadingStats} />

      {/* Search Tabs */}
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

      {/* Dialogs */}
      <StartConsultationDialog
        open={startConsultationOpen}
        onClose={closeStartDialog}
        onConfirm={handleStartConsultation}
        loading={loading}
        appointmentInfo={appointmentInfo}
      />

      <EndSessionDialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={finishSchedule}
        stats={stats}
      />
    </div>
  )
}

export default memo(ConsultationView)