'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'

// MUI Timeline Imports
import MuiTimeline from '@mui/lab/Timeline'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import type { TimelineProps } from '@mui/lab/Timeline'

// Service & Type Imports
import { patientAnalysisService } from '@/services/patient/patient.analysis.service'
import type { PatientAnalysisData } from '@/types/analysis.types'

// --- STYLED COMPONENTS ---
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)
}

// FIX 1: Changed return type to match TimelineDot props (removed 'default', added 'grey')
const getStatusColor = (status: string): "success" | "error" | "warning" | "info" | "grey" => {
  switch (status.toUpperCase()) {
    case 'COMPLETED': return 'success'
    case 'CANCELLED': return 'error'
    case 'NOSHOW': return 'warning'
    case 'BOOKED': return 'info'
    default: return 'grey' // 'grey' is valid for TimelineDot
  }
}

const Analysis = ({ patientId }: { patientId: number | string }) => {
  const [data, setData] = useState<PatientAnalysisData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      if (patientId) {
        const result = await patientAnalysisService.getPatientAnalysis(patientId)
        setData(result)
      }
      setLoading(false)
    }
    fetchData()
  }, [patientId])

  if (loading) return <Card sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Card>
  if (!data) return <Card><CardContent><Typography color="text.secondary">No data available.</Typography></CardContent></Card>

  const paidPercentage = data.financials.totalBilled > 0 
    ? (data.financials.totalPaid / data.financials.totalBilled) * 100 
    : 0

  return (
    <Card className='h-full shadow-sm'>
      <CardHeader 
        title='Patient Insights'
        subheader={
            <div className='flex items-center gap-2 mt-1'>
                <i className='tabler-calendar-time text-textSecondary text-lg'/>
                <Typography variant='caption' className='text-textSecondary'>Last Visit: {data.attendance.lastVisit || 'Never'}</Typography>
            </div>
        }
        action={
            <Chip label="Analysis" color='primary' size='small' variant='outlined' className='font-bold rounded-sm' />
        }
      />
      
      <CardContent>
        <Grid container spacing={4}>
          
          {/* --- TOP ROW: FINANCIALS & NEXT APPT --- */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div className='bg-white p-4 rounded-xl border border-gray-200 h-full flex flex-col justify-between shadow-sm'>
                <div className='flex justify-between items-start mb-4'>
                    <div className='flex items-center gap-2'>
                        <div className='p-2 bg-primary/10 rounded-lg text-primary'>
                            <i className='tabler-currency-dollar text-xl' />
                        </div>
                        <Typography variant='subtitle2' className='text-gray-700 font-bold uppercase tracking-wide'>Financials</Typography>
                    </div>
                    {data.financials.totalDue > 0 ? (
                        <Chip label="Outstanding" color="error" size="small" className="font-bold h-6" />
                    ) : (
                        <Chip label="Settled" color="success" size="small" className="font-bold h-6" />
                    )}
                </div>

                <div className='flex flex-col gap-1 mb-4'>
                    <div className='flex justify-between items-end'>
                         <Typography variant='body2' className='text-gray-500'>Total Paid</Typography>
                         <Typography variant='body2' className='text-gray-500'>Total Billed</Typography>
                    </div>
                    <LinearProgress variant="determinate" value={paidPercentage} color="success" className='h-2 rounded-full bg-gray-100' />
                </div>

                <div className='grid grid-cols-3 gap-2 pt-2 border-t border-gray-100'>
                    <div>
                        <Typography variant='caption' className='text-gray-400 block'>Billed</Typography>
                        <Typography variant='subtitle2' fontWeight={700}>{formatCurrency(data.financials.totalBilled)}</Typography>
                    </div>
                    <div>
                        <Typography variant='caption' className='text-gray-400 block'>Paid</Typography>
                        <Typography variant='subtitle2' fontWeight={700} className='text-success'>{formatCurrency(data.financials.totalPaid)}</Typography>
                    </div>
                    <div className='text-right'>
                        <Typography variant='caption' className='text-gray-400 block'>Due</Typography>
                        <Typography variant='subtitle2' fontWeight={700} className={data.financials.totalDue > 0 ? 'text-error' : 'text-gray-700'}>
                            {formatCurrency(data.financials.totalDue)}
                        </Typography>
                    </div>
                </div>
            </div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {data.nextAppointment ? (
                <div className='bg-primary text-white p-5 rounded-xl h-full shadow-lg shadow-primary/20 flex flex-col justify-center relative overflow-hidden group'>
                    <i className='tabler-calendar absolute -right-6 -bottom-6 text-9xl text-white opacity-10 transform -rotate-12 transition-transform group-hover:scale-110' />
                    <div className='relative z-10'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <Typography variant='caption' className='text-white/80 uppercase font-bold tracking-wider'>Next Appointment</Typography>
                                <Typography variant='h5' className='text-white font-bold mt-1 mb-1'>
                                    {data.nextAppointment.scheduleDate}
                                </Typography>
                                <Chip 
                                    label={data.nextAppointment.startTime.substring(0,5)} 
                                    size='small' 
                                    sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold' }} 
                                />
                            </div>
                            <div className='bg-white/20 p-2 rounded-lg backdrop-blur-sm'>
                                <i className='tabler-calendar-event text-2xl text-white' />
                            </div>
                        </div>
                        <div className='mt-6 pt-4 border-t border-white/20 flex items-center gap-2'>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'white', color: 'primary.main' }}>
                                <i className='tabler-stethoscope text-xs' />
                            </Avatar>
                            <Typography variant='body2' className='text-white font-medium'>
                                {data.nextAppointment.doctorName}
                            </Typography>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='border-2 border-dashed border-gray-300 p-4 rounded-xl h-full flex flex-col items-center justify-center text-center gap-2 bg-gray-50'>
                    <Avatar sx={{ bgcolor: 'action.disabledBackground', width: 48, height: 48 }}>
                        <i className='tabler-calendar-off text-gray-400 text-xl' />
                    </Avatar>
                    <Typography variant='body2' color='text.secondary' fontWeight={500}>No upcoming appointments scheduled</Typography>
                </div>
            )}
          </Grid>

          {/* --- ATTENDANCE STATS --- */}
          <Grid size={{ xs: 12 }}>
             <Typography variant="overline" color="text.secondary" className="font-bold mb-3 block">Attendance Overview</Typography>
             <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <div className='p-3 rounded-lg bg-gray-50 border border-gray-200 text-center'>
                        <Typography variant='h4' fontWeight={700} color='text.primary'>{data.attendance.total}</Typography>
                        <Typography variant='caption' color='text.secondary' className='uppercase font-bold'>Total Visits</Typography>
                    </div>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <div className='p-3 rounded-lg bg-success/5 border border-success/20 text-center'>
                        <Typography variant='h4' fontWeight={700} color='success.main'>{data.attendance.completed}</Typography>
                        <Typography variant='caption' className='text-success font-bold uppercase'>Completed</Typography>
                    </div>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <div className='p-3 rounded-lg bg-warning/5 border border-warning/20 text-center'>
                        <Typography variant='h4' fontWeight={700} color='warning.main'>{data.attendance.noshow}</Typography>
                        <Typography variant='caption' className='text-warning font-bold uppercase'>No Show</Typography>
                    </div>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <div className='p-3 rounded-lg bg-error/5 border border-error/20 text-center'>
                        <Typography variant='h4' fontWeight={700} color='error.main'>{data.attendance.cancelled}</Typography>
                        <Typography variant='caption' className='text-error font-bold uppercase'>Cancelled</Typography>
                    </div>
                </Grid>
             </Grid>
          </Grid>

          {/* --- TIMELINE HISTORY --- */}
          <Grid size={{ xs: 12 }}>
            <div className='flex items-center gap-2 mt-4 mb-2'>
                <i className='tabler-history text-primary text-xl' />
                <Typography variant='h6' className='uppercase text-sm font-bold tracking-wide text-gray-700'>Recent History</Typography>
            </div>

            {data.recentHistory.length > 0 ? (
                <Timeline>
                    {data.recentHistory.map((history, index) => {
                        const isLast = index === data.recentHistory.length - 1
                        const statusColor = getStatusColor(history.status); // Fixed color type

                        return (
                            <TimelineItem key={index}>
                                <TimelineSeparator>
                                    <TimelineDot color={statusColor} />
                                    {!isLast && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent>
                                    <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                                        <Typography className='font-medium' color='text.primary'>
                                            {history.status.replace('_', ' ')}
                                        </Typography>
                                        <Typography variant='caption' color="text.secondary">{history.scheduleDate}</Typography>
                                    </div>
                                    
                                    {/* FIX 2: Flex Container to push Chip to the right side */}
                                    <div className='flex items-center justify-between'>
                                        <Typography variant="body2" className='text-gray-600'>
                                            {history.doctorName}
                                        </Typography>
                                        
                                        <Chip 
                                            label={history.status} 
                                            color={statusColor === 'grey' ? 'default' : statusColor as any} 
                                            size='small' 
                                            className='font-bold h-6 text-[10px]'
                                        />
                                    </div>
                                </TimelineContent>
                            </TimelineItem>
                        )
                    })}
                </Timeline>
            ) : (
                <Typography variant="body2" color="text.secondary" className="text-center py-6 italic border rounded-lg mt-4 border-dashed">No recent history found.</Typography>
            )}
          </Grid>

          {/* Optional: Preferred Doctor */}
          {data.preferredDoctor && (
             <Grid size={{ xs: 12 }}>
                <div className='flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100'>
                    <Avatar sx={{ bgcolor: 'purple', width: 34, height: 34 }}>
                      <i className='tabler-heart text-white text-sm' />
                    </Avatar>
                    <div className='grow'>
                      <Typography variant="caption" className='text-purple-700 font-bold uppercase'>Preferred Doctor</Typography>
                      <Typography variant="body2" fontWeight={600}>{data.preferredDoctor.doctorName}</Typography>
                    </div>
                    <Chip label={`${data.preferredDoctor.visitCount} Visits`} size="small" sx={{ bgcolor: 'white', color: 'purple', fontWeight: 'bold' }} />
                </div>
             </Grid>
          )}

        </Grid>
      </CardContent>
    </Card>
  )
}

export default Analysis