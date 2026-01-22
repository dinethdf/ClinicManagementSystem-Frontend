'use client'

import { useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'

// Hooks
import { useRealtimeSchedule } from '@/hooks/useRealtimeSchedule'

// Types (Defining locally for clarity based on your JSON)
interface AppointmentData {
  patientName: string;
  queueNo: number;
  status: string; // "WAITING" | "SERVING" | "COMPLETED"
}

interface Props {
  clinicId: number
  scheduleId: number
}

const QueueManagementView = ({ clinicId, scheduleId }: Props) => {
  
  // 1. Connect to Realtime DB
  const { schedule, loading, error } = useRealtimeSchedule(clinicId, scheduleId)

  // 2. Convert Appointments Object to Sorted Array
  const patientList = useMemo(() => {
    if (!schedule || !schedule.appointments) return []
    
    // Safely cast the appointments object values to an array and sort
    return Object.values(schedule.appointments as Record<string, AppointmentData>)
      .sort((a, b) => a.queueNo - b.queueNo)
  }, [schedule])

  // 3. Status Color Helper
  const getStatusColor = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'SERVING': return 'success';   // Green
      case 'COMPLETED': return 'primary'; // Blue
      case 'CANCELLED': return 'error';   // Red
      case 'WAITING': return 'warning';   // Orange
      default: return 'grey';             // Default
    }
  }

  // 4. Loading / Error States
  if (loading) return (
    <div className='flex flex-col items-center justify-center h-[50vh] gap-4'>
      <CircularProgress />
      <Typography>Connecting to live queue...</Typography>
    </div>
  )

  if (error || !schedule) return (
    <div className='p-6 text-center bg-red-50 text-red-600 rounded-lg border border-red-200'>
      <i className='tabler-wifi-off text-4xl mb-2' />
      <Typography variant='h6'>Live Queue Unavailable</Typography>
      <Typography variant='body2'>Please check your internet connection or schedule ID.</Typography>
    </div>
  )

  // 5. Data Extraction
  const currentServing = schedule.currentServing || 0
  // Check statuses: 'STARTED' is active, 'SCHEDULED' means waiting to start
  const isSessionActive = schedule.scheduleStatus === 'STARTED'
  const isSessionScheduled = schedule.scheduleStatus === 'SCHEDULED'

  return (
    <Grid container spacing={4}>
      
      {/* --- LEFT COLUMN: BIG NUMBER DISPLAY --- */}
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Card className={`h-full text-white relative overflow-hidden transition-colors duration-500 ${isSessionActive ? 'bg-slate-900' : 'bg-slate-700'}`}>
            
            {/* Decorative Icon */}
            <div className='absolute -right-10 -top-10 opacity-10'>
                <i className='tabler-broadcast text-[200px]' />
            </div>

            <CardContent className='flex flex-col items-center text-center h-full justify-center p-8 relative z-10'>
                <Chip 
                    label={isSessionActive ? '🔴 LIVE NOW' : (isSessionScheduled ? '🕒 WAITING TO START' : 'SESSION ENDED')}
                    color={isSessionActive ? 'error' : 'default'}
                    className='font-bold mb-4 animate-pulse'
                    variant={isSessionActive ? 'filled' : 'filled'}
                    sx={{ backgroundColor: isSessionActive ? '#ff3e3e' : 'rgba(255,255,255,0.2)' }}
                />
                
                <Typography variant='overline' className='tracking-[0.2em] opacity-80'>
                    Now Serving Token
                </Typography>
                
                <Typography variant='h1' fontWeight={900} className={`text-[120px] leading-none my-2 drop-shadow-lg ${isSessionActive ? 'text-green-400' : 'text-gray-400'}`}>
                    {currentServing === 0 ? '-' : currentServing}
                </Typography>

                <div className='bg-white/10 p-5 rounded-xl w-full backdrop-blur-sm mt-6 border border-white/10'>
                    <Typography variant='h5' fontWeight={700} color='white'>
                        {schedule.doctorName}
                    </Typography>
                    <Typography variant='body2' className='opacity-80 mb-3'>
                        {schedule.specialization}
                    </Typography>
                    
                    <Divider className='bg-white/20 mb-3' />
                    
                    <div className='flex justify-between items-center text-sm font-medium'>
                        <span className='flex items-center gap-1'><i className='tabler-clock' /> {schedule.time}</span>
                        <span className='flex items-center gap-1'><i className='tabler-calendar' /> {schedule.date}</span>
                    </div>
                </div>

                {/* Queue Actions (Mock functionality for now) */}
                <div className='mt-8 w-full grid grid-cols-2 gap-3'>
                     <Button 
                        variant='contained' 
                        color='success' 
                        size='large' 
                        disabled={!isSessionActive}
                        startIcon={<i className='tabler-player-track-next' />}
                        className='shadow-lg'
                     >
                        Next
                     </Button>
                     <Button 
                        variant='contained' 
                        color='warning' 
                        size='large' 
                        disabled={!isSessionActive}
                        startIcon={<i className='tabler-player-pause' />}
                        className='bg-orange-500 hover:bg-orange-600 shadow-lg'
                     >
                        Hold
                     </Button>
                </div>
            </CardContent>
        </Card>
      </Grid>

      {/* --- RIGHT COLUMN: PATIENT LIST --- */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Card className='h-full border-none shadow-md'>
            <div className='p-5 border-b flex justify-between items-center bg-gray-50/50'>
                <div className='flex items-center gap-2'>
                    <Avatar className='bg-primary/10 text-primary w-10 h-10'>
                        <i className='tabler-list-numbers text-xl' />
                    </Avatar>
                    <div>
                        <Typography variant='h6' fontWeight={600}>Queue List</Typography>
                        <Typography variant='caption' color='text.secondary'>Real-time patient updates</Typography>
                    </div>
                </div>
                <Chip label={`${patientList.length} Patients`} color='primary' variant='outlined' size='small' className='font-bold' />
            </div>
            
            <CardContent className='max-h-[600px] overflow-auto p-0 sm:p-5'>
                {patientList.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 opacity-50 text-gray-400'>
                        <i className='tabler-users-group text-6xl mb-4' />
                        <Typography>No patients in queue yet.</Typography>
                    </div>
                ) : (
                    <Timeline position="right" sx={{ [`& .MuiTimelineItem-root:before`]: { flex: 0, padding: 0 } }}>
                        {patientList.map((patient, index) => {
                            const isCurrent = patient.queueNo === currentServing;
                            const isDone = patient.status === 'COMPLETED';
                            const isWaiting = patient.status === 'WAITING';
                            
                            return (
                                <TimelineItem key={patient.queueNo}>
                                    <TimelineSeparator>
                                        <TimelineDot 
                                            variant={isCurrent ? 'filled' : 'outlined'} 
                                            color={getStatusColor(patient.status) as any}
                                            className={`mx-4 ${isCurrent ? 'animate-pulse shadow-lg ring-4 ring-green-100' : ''}`}
                                        >
                                            <span className='text-[10px] font-bold w-6 h-6 flex items-center justify-center'>
                                                {patient.queueNo}
                                            </span>
                                        </TimelineDot>
                                        {index < patientList.length - 1 && <TimelineConnector className='mx-4 bg-gray-100' />}
                                    </TimelineSeparator>
                                    
                                    <TimelineContent className='w-full py-2 pr-4'>
                                        <div className={`p-4 rounded-xl border transition-all duration-300
                                            ${isCurrent 
                                                ? 'bg-linear-to-r from-green-50 to-white border-green-200 shadow-md transform scale-[1.01]' 
                                                : 'border-gray-100 hover:border-gray-300 bg-white hover:shadow-sm'}
                                            ${isDone ? 'opacity-50 grayscale-[0.5]' : ''}
                                        `}>
                                            <div className='flex justify-between items-center flex-wrap gap-2'>
                                                <div className='flex items-center gap-4'>
                                                    <Avatar 
                                                        className={`w-12 h-12 font-bold text-lg 
                                                            ${isCurrent ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}
                                                            ${isWaiting ? 'bg-orange-100 text-orange-600' : ''}
                                                        `}
                                                    >
                                                        {/* {patient.patientName.charAt(0)} */}
                                                    </Avatar>
                                                    <div>
                                                        <Typography variant='h6' fontWeight={isCurrent ? 800 : 600} className='leading-tight'>
                                                            {patient.patientName}
                                                        </Typography>
                                                        <Typography variant='body2' className={`flex items-center gap-1 mt-1 ${isCurrent ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                                                            <i className='tabler-ticket' /> Token Number: <strong>#{patient.queueNo}</strong>
                                                        </Typography>
                                                    </div>
                                                </div>

                                                <Chip 
                                                    label={patient.status} 
                                                    size='small' 
                                                    color={getStatusColor(patient.status) as any} 
                                                    variant={isCurrent ? 'filled' : 'tonal'} 
                                                    className='font-bold px-2'
                                                />
                                            </div>
                                        </div>
                                    </TimelineContent>
                                </TimelineItem>
                            )
                        })}
                    </Timeline>
                )}
            </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default QueueManagementView