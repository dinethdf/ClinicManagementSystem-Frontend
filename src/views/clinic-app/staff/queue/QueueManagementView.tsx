'use client'

import { useMemo, useState, useCallback, memo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'

// Hooks
import { useRealtimeSchedule } from '@/hooks/useRealtimeSchedule'

// Types
interface AppointmentData {
  patientName: string
  queueNo: number
  status: 'WAITING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  appointmentId?: string
  phone?: string
  notes?: string
}

interface Props {
  clinicId: number
  scheduleId: number
}

// ============================================
// MEMOIZED PATIENT CARD COMPONENT
// ============================================

interface PatientCardProps {
  patient: AppointmentData
  isCurrent: boolean
  onPatientClick: (patient: AppointmentData) => void
}

const PatientCard = memo(({ patient, isCurrent, onPatientClick }: PatientCardProps) => {
  const isDone = patient.status === 'COMPLETED'
  const isWaiting = patient.status === 'WAITING'
  const isCancelled = patient.status === 'CANCELLED'
  const isOngoing = patient.status === 'ONGOING'

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'ONGOING': 
        return { 
          color: 'success', 
          icon: 'tabler-user-check', 
          bg: 'bg-green-600', 
          ring: 'ring-green-100',
          label: 'ONGOING'
        }
      case 'COMPLETED': 
        return { 
          color: 'primary', 
          icon: 'tabler-circle-check', 
          bg: 'bg-blue-500', 
          ring: '',
          label: 'COMPLETED'
        }
      case 'CANCELLED': 
        return { 
          color: 'error', 
          icon: 'tabler-circle-x', 
          bg: 'bg-red-500', 
          ring: '',
          label: 'CANCELLED'
        }
      case 'WAITING': 
        return { 
          color: 'warning', 
          icon: 'tabler-clock', 
          bg: 'bg-orange-500', 
          ring: '',
          label: 'WAITING'
        }
      default: 
        return { 
          color: 'default', 
          icon: 'tabler-help-circle', 
          bg: 'bg-gray-300', 
          ring: '',
          label: 'UNKNOWN'
        }
    }
  }

  const statusConfig = getStatusConfig(patient.status)

  return (
    <Box
      className={`p-4 transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
        isOngoing ? 'bg-green-50 border-l-4 border-green-500' : ''
      } ${isDone ? 'opacity-60' : ''} ${isCancelled ? 'opacity-40 bg-red-50/30' : ''}`}
      onClick={() => onPatientClick(patient)}
    >
      <Box className='flex items-center gap-3'>
        
        {/* Queue Number Badge */}
        <Badge
          badgeContent={isOngoing ? <i className='tabler-broadcast text-xs animate-pulse' /> : null}
          color='success'
          overlap='circular'
        >
          <Avatar 
            className={`w-12 h-12 font-bold text-lg shadow-md ${statusConfig.bg} text-white ${
              isOngoing ? `shadow-lg ring-4 ${statusConfig.ring}` : ''
            }`}
          >
            {patient.queueNo}
          </Avatar>
        </Badge>

        {/* Patient Info */}
        <Box className='flex-1 min-w-0'>
          <Typography 
            variant='subtitle1' 
            fontWeight={isOngoing ? 700 : 600}
            className='truncate'
          >
            {patient.patientName}
          </Typography>
          <Box className='flex items-center gap-2 flex-wrap'>
            <Typography 
              variant='caption' 
              className={`flex items-center gap-1 ${
                isOngoing ? 'text-green-700 font-medium' : 'text-gray-500'
              }`}
            >
              <i className='tabler-ticket text-sm' /> Token #{patient.queueNo}
            </Typography>
            {patient.phone && (
              <Typography variant='caption' color='text.secondary' className='hidden sm:flex items-center gap-1'>
                <i className='tabler-phone text-xs' /> {patient.phone}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Status Chip */}
        <Tooltip title={statusConfig.label}>
          <Chip
            icon={<i className={statusConfig.icon} />}
            label={statusConfig.label}
            size='small'
            color={statusConfig.color as any}
            variant={isOngoing ? 'filled' : 'outlined'}
            className='font-semibold min-w-[110px]'
          />
        </Tooltip>
      </Box>
    </Box>
  )
})

PatientCard.displayName = 'PatientCard'

// ============================================
// STAT CARD COMPONENT
// ============================================

interface StatCardProps {
  icon: string
  label: string
  value: number | string
  color: 'primary' | 'warning' | 'success' | 'info' | 'secondary'
  suffix?: string
}

const StatCard = memo(({ icon, label, value, color, suffix = '' }: StatCardProps) => {
  const colorMap = {
    primary: { bg: 'bg-blue-50', text: 'text-blue-600' },
    warning: { bg: 'bg-orange-50', text: 'text-orange-600' },
    success: { bg: 'bg-green-50', text: 'text-green-600' },
    info: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
    secondary: { bg: 'bg-purple-50', text: 'text-purple-600' }
  }

  const colors = colorMap[color]

  return (
    <Paper elevation={0} className='p-4 border border-gray-100 hover:shadow-md transition-shadow'>
      <Box className='flex items-start justify-between'>
        <Box className='flex-1'>
          <Typography variant='caption' color='text.secondary' className='block mb-1'>
            {label}
          </Typography>
          <Typography variant='h5' fontWeight={700} className={`flex items-baseline gap-1 ${colors.text}`}>
            {value}
            {suffix && <Typography variant='caption' color='text.secondary'>{suffix}</Typography>}
          </Typography>
        </Box>
        <Avatar className={`w-10 h-10 ${colors.bg} ${colors.text}`}>
          <i className={`${icon} text-lg`} />
        </Avatar>
      </Box>
    </Paper>
  )
})

StatCard.displayName = 'StatCard'

// ============================================
// MAIN COMPONENT
// ============================================

const QueueManagementView = ({ clinicId, scheduleId }: Props) => {
  
  // State Management
  const [selectedPatient, setSelectedPatient] = useState<AppointmentData | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(true)
  
  // Connect to Realtime DB
  const { schedule, loading, error } : any = useRealtimeSchedule(scheduleId)

  // ============================================
  // MEMOIZED DATA PROCESSING
  // ============================================

  // Convert appointments array to filtered list
  const patientList = useMemo(() => {
    if (!schedule?.appointments) return []
    
    return schedule.appointments
      .filter((apt: AppointmentData | null): apt is AppointmentData => apt !== null && apt !== undefined)
      .sort((a: AppointmentData, b: AppointmentData) => a.queueNo - b.queueNo)
  }, [schedule?.appointments])

  // Calculate comprehensive queue statistics
  const queueStats = useMemo(() => {
    const waiting = patientList.filter((p: AppointmentData) => p.status === 'WAITING').length
    const ongoing = patientList.filter((p: AppointmentData) => p.status === 'ONGOING').length
    const completed = patientList.filter((p: AppointmentData) => p.status === 'COMPLETED').length
    const cancelled = patientList.filter((p: AppointmentData) => p.status === 'CANCELLED').length
    const total = patientList.length
    const activePatients = waiting + ongoing
    
    // Calculate progress percentage
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    // Estimate remaining time (assuming 10 min per patient)
    const estimatedMinutesPerPatient = 10
    const estimatedRemainingTime = waiting * estimatedMinutesPerPatient
    
    return { 
      waiting, 
      ongoing, 
      completed, 
      cancelled, 
      total,
      activePatients,
      progressPercentage,
      estimatedRemainingTime
    }
  }, [patientList])

  // Get current patient
  const currentPatient = useMemo(() => 
    patientList.find((p: AppointmentData) => p.queueNo === schedule?.currentServing),
    [patientList, schedule?.currentServing]
  )

  // Get next waiting patients
  const upcomingPatients = useMemo(() => 
    patientList.filter((p: AppointmentData) => p.status === 'WAITING').slice(0, 3),
    [patientList]
  )

  // ============================================
  // CALLBACKS
  // ============================================

  const handlePatientClick = useCallback((patient: AppointmentData) => {
    setSelectedPatient(patient)
  }, [])

  const handleRefresh = useCallback(() => {
    window.location.reload()
  }, [])

  // ============================================
  // RENDER CONDITIONS
  // ============================================

  if (loading) {
    return (
      <Box className='flex flex-col items-center justify-center min-h-[70vh] gap-4'>
        <CircularProgress size={60} thickness={4} />
        <Typography variant='h6' color='text.secondary'>Connecting to live queue...</Typography>
        <Typography variant='body2' color='text.secondary'>Please wait</Typography>
      </Box>
    )
  }

  if (error || !schedule) {
    return (
      <Alert 
        severity='error' 
        icon={<i className='tabler-wifi-off text-3xl' />}
        className='mx-auto max-w-md'
        sx={{ '& .MuiAlert-message': { width: '100%' }, padding: 3 }}
      >
        <Typography variant='h6' gutterBottom>Live Queue Unavailable</Typography>
        <Typography variant='body2' className='mb-3'>
          Unable to connect to the queue system. Please check your internet connection.
        </Typography>
        <Button 
          variant='outlined' 
          size='small' 
          onClick={handleRefresh}
          startIcon={<i className='tabler-refresh' />}
        >
          Retry Connection
        </Button>
      </Alert>
    )
  }

  const isSessionActive = schedule.scheduleStatus === 'STARTED'
  const isSessionScheduled = schedule.scheduleStatus === 'SCHEDULED'

  return (
    <Box className='space-y-4'>
      
      {/* ============================================ */}
      {/* SESSION HEADER WITH DOCTOR INFO */}
      {/* ============================================ */}
      <Card className='shadow-sm border border-gray-100 overflow-hidden'>
        <Box className='bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4'>
          <Grid container spacing={2} alignItems='center'>
            
            {/* Doctor Info */}
            <Grid size={{ xs: 12, sm: 8, md: 6 }}>
              <Box className='flex items-center gap-3'>
                <Avatar className='bg-white text-primary w-14 h-14 shadow-lg'>
                  <i className='tabler-stethoscope text-2xl' />
                </Avatar>
                <Box className='flex-1'>
                  <Typography variant='h6' fontWeight={700} className='leading-tight text-white'>
                    {schedule.doctorName}
                  </Typography>
                  <Typography variant='body2' className='opacity-90 mb-1'>
                    {schedule.specialization}
                  </Typography>
                  <Box className='flex items-center gap-3 flex-wrap'>
                    <Typography variant='caption' className='flex items-center gap-1 opacity-90'>
                      <i className='tabler-calendar text-sm' /> {schedule.date}
                    </Typography>
                    <Typography variant='caption' className='flex items-center gap-1 opacity-90'>
                      <i className='tabler-clock text-sm' /> {schedule.time}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Session Status & Controls */}
            <Grid size={{ xs: 12, sm: 4, md: 6 }}>
              <Box className='flex items-center justify-between gap-3'>
                <Box className='flex-1 text-center sm:text-left'>
                  <Typography variant='caption' className='opacity-80 block mb-1'>Session Status</Typography>
                  <Chip 
                    label={
                      isSessionActive ? '🔴 LIVE NOW' : 
                      isSessionScheduled ? '🕒 SCHEDULED' : 
                      '⚫ ENDED'
                    }
                    className={`font-bold ${isSessionActive ? 'animate-pulse' : ''}`}
                    sx={{ 
                      backgroundColor: isSessionActive ? '#ff3e3e' : 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 700
                    }}
                  />
                  {schedule.startedAt && isSessionActive && (
                    <Typography variant='caption' className='block mt-1 opacity-80'>
                      Started at {schedule.startedAt}
                    </Typography>
                  )}
                </Box>

                {/* Analytics Toggle */}
                <Tooltip title={showAnalytics ? 'Hide Analytics' : 'Show Analytics'}>
                  <IconButton
                    size='small'
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    sx={{ 
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    <i className={showAnalytics ? 'tabler-chart-bar-off' : 'tabler-chart-bar'} />
                  </IconButton>
                </Tooltip>

                {/* Refresh Button */}
                <Tooltip title='Refresh'>
                  <IconButton
                    size='small'
                    onClick={handleRefresh}
                    sx={{ 
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    <i className='tabler-refresh' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Progress Bar */}
        <Box className='px-4 pt-3 pb-2 bg-gray-50'>
          <Box className='flex justify-between items-center mb-2'>
            <Typography variant='caption' fontWeight={600} color='text.secondary'>
              Session Progress
            </Typography>
            <Typography variant='caption' fontWeight={700} color='primary'>
              {queueStats.completed} / {queueStats.total} Completed ({queueStats.progressPercentage}%)
            </Typography>
          </Box>
          <LinearProgress 
            variant='determinate' 
            value={queueStats.progressPercentage} 
            className='h-2 rounded-full'
            sx={{ backgroundColor: '#e5e7eb' }}
          />
        </Box>
      </Card>

      {/* ============================================ */}
      {/* ANALYTICS DASHBOARD */}
      {/* ============================================ */}
      {showAnalytics && (
        <Card className='shadow-sm border border-gray-100'>
          <CardContent className='p-4'>
            <Box className='flex items-center gap-2 mb-3'>
              <i className='tabler-chart-dots text-primary text-xl' />
              <Typography variant='subtitle1' fontWeight={700}>Queue Analytics</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                <StatCard
                  icon='tabler-users'
                  label='Total Patients'
                  value={queueStats.total}
                  color='primary'
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                <StatCard
                  icon='tabler-hourglass'
                  label='Waiting'
                  value={queueStats.waiting}
                  color='warning'
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                <StatCard
                  icon='tabler-user-check'
                  label='Ongoing'
                  value={queueStats.ongoing}
                  color='success'
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                <StatCard
                  icon='tabler-circle-check'
                  label='Completed'
                  value={queueStats.completed}
                  color='info'
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        
        {/* ============================================ */}
        {/* LEFT COLUMN: Current Patient Display */}
        {/* ============================================ */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            
            {/* NOW SERVING CARD */}
            <Card className={`shadow-lg border-2 transition-all duration-300 ${
              isSessionActive ? 'border-green-400 bg-gradient-to-br from-green-50 via-white to-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <CardContent className='p-6'>
                
                {/* Header */}
                <Box className='flex justify-between items-start mb-4'>
                  <Box>
                    <Typography variant='overline' className='text-xs tracking-widest opacity-70 flex items-center gap-2'>
                      {isSessionActive && <i className='tabler-broadcast animate-pulse' />}
                      Now Serving
                    </Typography>
                    <Typography variant='h3' fontWeight={900} className={`leading-none mt-1 ${isSessionActive ? 'text-green-600' : 'text-gray-400'}`}>
                      Token #{schedule.currentServing || '-'}
                    </Typography>
                  </Box>
                  {isSessionActive && (
                    <Box className='flex items-center gap-1'>
                      <Box className='w-3 h-3 bg-green-500 rounded-full animate-pulse' />
                      <Typography variant='caption' className='text-green-700 font-semibold'>
                        LIVE
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider className='my-4' />

                {/* Current Patient Details */}
                {currentPatient ? (
                  <Box className='space-y-4'>
                    <Box className='flex items-center gap-3'>
                      <Avatar className='w-16 h-16 text-2xl font-bold bg-green-600 text-white shadow-lg ring-4 ring-green-100'>
                        {currentPatient.patientName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box className='flex-1'>
                        <Typography variant='h6' fontWeight={700}>
                          {currentPatient.patientName}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' className='flex items-center gap-1 mt-1'>
                          <i className='tabler-ticket text-sm' /> Token #{currentPatient.queueNo}
                        </Typography>
                        {currentPatient.phone && (
                          <Typography variant='body2' color='text.secondary' className='flex items-center gap-1 mt-1'>
                            <i className='tabler-phone text-sm' /> {currentPatient.phone}
                          </Typography>
                        )}
                      </Box>
                      <Chip 
                        label='ONGOING'
                        color='success'
                        size='small'
                        className='font-bold'
                        icon={<i className='tabler-user-check' />}
                      />
                    </Box>

                    {currentPatient.notes && (
                      <Alert severity='info' icon={<i className='tabler-note' />} className='text-sm'>
                        <Typography variant='caption' fontWeight={600}>Notes:</Typography>
                        <Typography variant='body2'>{currentPatient.notes}</Typography>
                      </Alert>
                    )}
                  </Box>
                ) : (
                  <Box className='text-center py-10 opacity-50'>
                    <i className='tabler-user-x text-7xl text-gray-300 mb-3' />
                    <Typography variant='h6' color='text.secondary' className='mb-1'>
                      No Patient Being Served
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {isSessionActive ? 'Waiting for next patient' : 'Session has not started yet'}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* UPCOMING PATIENTS PREVIEW */}
            {upcomingPatients.length > 0 && (
              <Card className='shadow-sm border border-gray-100'>
                <CardContent className='p-4'>
                  <Typography variant='subtitle1' fontWeight={700} className='mb-3 flex items-center gap-2'>
                    <i className='tabler-clock text-warning' />
                    Upcoming Patients ({queueStats.waiting} waiting)
                  </Typography>
                  
                  <Stack spacing={2}>
                    {upcomingPatients.map((patient: AppointmentData, index: number) => (
                      <Box 
                        key={patient.queueNo}
                        className='flex items-center gap-3 p-3 bg-orange-50 border border-orange-100 rounded-lg hover:shadow-sm transition-shadow cursor-pointer'
                        onClick={() => handlePatientClick(patient)}
                      >
                        <Avatar className='w-10 h-10 bg-orange-600 text-white font-bold shadow-sm'>
                          {patient.queueNo}
                        </Avatar>
                        <Box className='flex-1'>
                          <Typography variant='subtitle2' fontWeight={700}>
                            {patient.patientName}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            Token #{patient.queueNo}
                          </Typography>
                        </Box>
                        {index === 0 && (
                          <Chip 
                            label='NEXT' 
                            size='small' 
                            color='warning' 
                            className='font-bold'
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>

                  {queueStats.waiting > 3 && (
                    <Typography variant='caption' color='text.secondary' className='block text-center mt-2'>
                      + {queueStats.waiting - 3} more patients waiting
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}

          </Stack>
        </Grid>

        {/* ============================================ */}
        {/* RIGHT COLUMN: Full Patient Queue List */}
        {/* ============================================ */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card className='shadow-sm h-full border border-gray-100'>
            
            {/* Header */}
            <Box className='p-4 border-b bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10'>
              <Box className='flex justify-between items-center flex-wrap gap-2'>
                <Box className='flex items-center gap-3'>
                  <Avatar className='bg-primary/10 text-primary w-11 h-11'>
                    <i className='tabler-list-details text-xl' />
                  </Avatar>
                  <Box>
                    <Typography variant='h6' fontWeight={700}>Patient Queue</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {queueStats.total} total • {queueStats.waiting} waiting • {queueStats.completed} done
                    </Typography>
                  </Box>
                </Box>

                {/* Status Legend */}
                <Box className='flex gap-1 flex-wrap'>
                  <Chip label={`${queueStats.waiting} Waiting`} size='small' color='warning' variant='outlined' />
                  <Chip label={`${queueStats.ongoing} Ongoing`} size='small' color='success' variant='outlined' />
                  <Chip label={`${queueStats.completed} Done`} size='small' color='primary' variant='outlined' />
                </Box>
              </Box>
            </Box>

            {/* Patient List */}
            <CardContent className='p-0 max-h-[calc(100vh-400px)] overflow-y-auto'>
              {patientList.length === 0 ? (
                <Box className='flex flex-col items-center justify-center py-20 opacity-40'>
                  <i className='tabler-users-group text-8xl text-gray-300 mb-4' />
                  <Typography variant='h6' color='text.secondary'>No Patients in Queue</Typography>
                  <Typography variant='body2' color='text.secondary' className='mt-1'>
                    The appointment queue is currently empty
                  </Typography>
                </Box>
              ) : (
                <Box className='divide-y divide-gray-100'>
                  {patientList.map((patient: AppointmentData) => (
                    <PatientCard
                      key={patient.queueNo}
                      patient={patient}
                      isCurrent={patient.queueNo === schedule.currentServing}
                      onPatientClick={handlePatientClick}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* ============================================ */}
      {/* PATIENT DETAILS DIALOG */}
      {/* ============================================ */}
      <Dialog 
        open={!!selectedPatient} 
        onClose={() => setSelectedPatient(null)}
        maxWidth='sm'
        fullWidth
      >
        {selectedPatient && (
          <>
            <DialogTitle className='flex items-center justify-between border-b'>
              <Box className='flex items-center gap-3'>
                <Avatar 
                  className={`w-12 h-12 font-bold ${
                    selectedPatient.status === 'ONGOING' ? 'bg-green-600' :
                    selectedPatient.status === 'WAITING' ? 'bg-orange-600' :
                    selectedPatient.status === 'COMPLETED' ? 'bg-blue-600' :
                    'bg-gray-600'
                  } text-white`}
                >
                  {selectedPatient.queueNo}
                </Avatar>
                <Box>
                  <Typography variant='h6' fontWeight={700}>
                    {selectedPatient.patientName}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Token #{selectedPatient.queueNo}
                  </Typography>
                </Box>
              </Box>
              <IconButton size='small' onClick={() => setSelectedPatient(null)}>
                <i className='tabler-x' />
              </IconButton>
            </DialogTitle>
            
            <DialogContent className='pt-4'>
              <Stack spacing={3}>
                
                {/* Status */}
                <Box>
                  <Typography variant='caption' color='text.secondary' className='block mb-1'>
                    Current Status
                  </Typography>
                  <Chip 
                    label={selectedPatient.status}
                    color={
                      selectedPatient.status === 'ONGOING' ? 'success' :
                      selectedPatient.status === 'WAITING' ? 'warning' :
                      selectedPatient.status === 'COMPLETED' ? 'primary' : 'error'
                    }
                    className='font-bold'
                    icon={
                      <i className={
                        selectedPatient.status === 'ONGOING' ? 'tabler-user-check' :
                        selectedPatient.status === 'WAITING' ? 'tabler-clock' :
                        selectedPatient.status === 'COMPLETED' ? 'tabler-circle-check' :
                        'tabler-circle-x'
                      } />
                    }
                  />
                </Box>
                
                {/* Phone */}
                {selectedPatient.phone && (
                  <Box>
                    <Typography variant='caption' color='text.secondary' className='block mb-1'>
                      Contact Number
                    </Typography>
                    <Typography variant='body1' className='flex items-center gap-2'>
                      <i className='tabler-phone text-primary' />
                      {selectedPatient.phone}
                    </Typography>
                  </Box>
                )}
                
                {/* Notes */}
                {selectedPatient.notes && (
                  <Box>
                    <Typography variant='caption' color='text.secondary' className='block mb-1'>
                      Notes
                    </Typography>
                    <Alert severity='info' icon={<i className='tabler-note' />}>
                      {selectedPatient.notes}
                    </Alert>
                  </Box>
                )}

                {/* Queue Position Info */}
                {selectedPatient.status === 'WAITING' && (
                  <Box>
                    <Typography variant='caption' color='text.secondary' className='block mb-1'>
                      Estimated Wait Time
                    </Typography>
                    <Box className='flex items-center gap-2 p-3 bg-orange-50 border border-orange-100 rounded-lg'>
                      <i className='tabler-clock text-orange-600 text-xl' />
                      <Box>
                        <Typography variant='body2' fontWeight={600}>
                          Approximately {(selectedPatient.queueNo - (schedule.currentServing || 0)) * 10} minutes
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {selectedPatient.queueNo - (schedule.currentServing || 0)} patient(s) ahead
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            
            <DialogActions className='p-4 border-t'>
              <Button onClick={() => setSelectedPatient(null)} variant='contained' fullWidth>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </Box>
  )
}

export default QueueManagementView