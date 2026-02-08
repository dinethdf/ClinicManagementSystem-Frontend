'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

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
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Grow from '@mui/material/Grow'
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

// ✅ Memoized formatter (created once, reused)
const currencyFormatter = new Intl.NumberFormat('en-LK', { 
  style: 'currency', 
  currency: 'LKR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})

const formatCurrency = (amount: number) => currencyFormatter.format(amount)

const getStatusColor = (status: string): "success" | "error" | "warning" | "info" | "grey" => {
  const normalizedStatus = status.toUpperCase().replace(/\s+/g, '_')
  
  switch (normalizedStatus) {
    case 'COMPLETED': return 'success'
    case 'CANCELLED': return 'error'
    case 'NOSHOW': 
    case 'NO_SHOW': return 'warning'
    case 'BOOKED': return 'info'
    case 'PENDING_PAYMENT': return 'warning'
    default: return 'grey'
  }
}

// --- LOADING SKELETON COMPONENTS ---
const FinancialSkeleton = () => (
  <div className='bg-white p-4 rounded-xl border border-gray-200 h-full'>
    <div className='flex justify-between items-start mb-4'>
      <Skeleton variant="text" width={120} height={30} />
      <Skeleton variant="rounded" width={80} height={24} />
    </div>
    <Skeleton variant="rectangular" height={8} sx={{ mb: 2, borderRadius: 1 }} />
    <div className='grid grid-cols-3 gap-2 pt-2'>
      <div>
        <Skeleton variant="text" width={50} />
        <Skeleton variant="text" width={80} height={30} />
      </div>
      <div>
        <Skeleton variant="text" width={50} />
        <Skeleton variant="text" width={80} height={30} />
      </div>
      <div>
        <Skeleton variant="text" width={50} />
        <Skeleton variant="text" width={80} height={30} />
      </div>
    </div>
  </div>
)

const AppointmentSkeleton = () => (
  <div className='bg-gray-100 p-5 rounded-xl h-full'>
    <Skeleton variant="text" width={150} height={20} />
    <Skeleton variant="text" width={200} height={40} sx={{ my: 1 }} />
    <Skeleton variant="rounded" width={80} height={24} sx={{ mb: 3 }} />
    <Skeleton variant="text" width="100%" />
  </div>
)

const AttendanceSkeleton = () => (
  <Grid container spacing={2}>
    {[1, 2, 3, 4].map((i) => (
      <Grid key={i} size={{ xs: 6, sm: 3 }}>
        <div className='p-3 rounded-lg bg-gray-50 border border-gray-200 text-center'>
          <Skeleton variant="text" width={60} height={50} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width={80} sx={{ mx: 'auto' }} />
        </div>
      </Grid>
    ))}
  </Grid>
)

const TimelineSkeleton = () => (
  <Timeline>
    {[1, 2, 3].map((i) => (
      <TimelineItem key={i}>
        <TimelineSeparator>
          <TimelineDot color="grey" />
          {i !== 3 && <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent>
          <Skeleton variant="text" width={150} />
          <Skeleton variant="text" width="100%" />
        </TimelineContent>
      </TimelineItem>
    ))}
  </Timeline>
)

// --- MAIN COMPONENT ---
const Analysis = ({ patientId }: { patientId: number | string }) => {
  const [data, setData] = useState<PatientAnalysisData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ Fetch data with error handling and cleanup
  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      if (!patientId || patientId === '0' || patientId === 0) {
        setLoading(false)
        setError('Invalid patient ID')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const result = await patientAnalysisService.getPatientAnalysis(patientId)
        console.log('Analysis Data:', result)
        
        if (isMounted) {
          setData(result)
        }
      } catch (err: any) {
        console.error('Failed to load patient analysis:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load analysis data')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [patientId])

  // ✅ Memoize expensive calculations
  const paidPercentage = useMemo(() => {
    if (!data?.financials) return 0
    return data.financials.totalBilled > 0 
      ? (data.financials.totalPaid / data.financials.totalBilled) * 100 
      : 0
  }, [data?.financials])

  // --- LOADING STATE ---
  if (loading) {
    return (
      <Card className='h-full shadow-sm'>
        <CardHeader 
          title={<Skeleton variant="text" width={200} />}
          subheader={<Skeleton variant="text" width={150} />}
          action={<Skeleton variant="rounded" width={80} height={28} />}
        />
        
        <CardContent>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FinancialSkeleton />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <AppointmentSkeleton />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Skeleton variant="text" width={150} sx={{ mb: 2 }} />
              <AttendanceSkeleton />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Skeleton variant="text" width={150} sx={{ mb: 2 }} />
              <TimelineSkeleton />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <Card className='h-full shadow-sm'>
        <CardContent sx={{ py: 8 }}>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button 
                size="small" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
          <div className='text-center'>
            <i className='tabler-alert-triangle text-error text-6xl opacity-50' />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Unable to load patient analysis
            </Typography>
          </div>
        </CardContent>
      </Card>
    )
  }

  // --- NO DATA STATE ---
  if (!data) {
    return (
      <Card className='h-full shadow-sm'>
        <CardContent sx={{ py: 8, textAlign: 'center' }}>
          <i className='tabler-database-off text-6xl opacity-30' />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No analysis data available
          </Typography>
        </CardContent>
      </Card>
    )
  }

  // --- MAIN RENDER ---
  return (
    <Card className='h-full shadow-sm'>
      <CardHeader 
        title='Patient Insights'
        subheader={
          <Fade in timeout={500}>
            <div className='flex items-center gap-2 mt-1'>
              <i className='tabler-calendar-time text-textSecondary text-lg'/>
              <Typography variant='caption' className='text-textSecondary'>
                Last Visit: {data.attendance.lastVisit || 'Never'}
              </Typography>
            </div>
          </Fade>
        }
        action={
          <Chip 
            label="Live Analysis" 
            color='primary' 
            size='small' 
            variant='outlined' 
            className='font-bold rounded-sm' 
          />
        }
      />
      
      <CardContent>
        <Grid container spacing={4}>
          
          {/* --- FINANCIALS --- */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grow in timeout={600}>
              <div className='bg-white p-4 rounded-xl border border-gray-200 h-full flex flex-col justify-between shadow-sm'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex items-center gap-2'>
                    <div className='p-2 bg-primary/10 rounded-lg text-primary'>
                      <i className='tabler-currency-dollar text-xl' />
                    </div>
                    <Typography variant='subtitle2' className='text-gray-700 font-bold uppercase tracking-wide'>
                      Financials
                    </Typography>
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
                  <LinearProgress 
                    variant="determinate" 
                    value={paidPercentage} 
                    color="success" 
                    className='h-2 rounded-full bg-gray-100'
                    sx={{
                      '& .MuiLinearProgress-bar': {
                        transition: 'transform 1s ease-in-out'
                      }
                    }}
                  />
                </div>

                <div className='grid grid-cols-3 gap-2 pt-2 border-t border-gray-100'>
                  <div>
                    <Typography variant='caption' className='text-gray-400 block'>Billed</Typography>
                    <Typography variant='subtitle2' fontWeight={700}>
                      {formatCurrency(data.financials.totalBilled)}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant='caption' className='text-gray-400 block'>Paid</Typography>
                    <Typography variant='subtitle2' fontWeight={700} className='text-success'>
                      {formatCurrency(data.financials.totalPaid)}
                    </Typography>
                  </div>
                  <div className='text-right'>
                    <Typography variant='caption' className='text-gray-400 block'>Due</Typography>
                    <Typography variant='subtitle2' fontWeight={700} className={data.financials.totalDue > 0 ? 'text-error' : 'text-gray-700'}>
                      {formatCurrency(data.financials.totalDue)}
                    </Typography>
                  </div>
                </div>
              </div>
            </Grow>
          </Grid>

          {/* --- NEXT APPOINTMENT --- */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grow in timeout={800}>
              <div>
                {data.nextAppointment ? (
                  <div className='bg-primary text-white p-5 rounded-xl h-full shadow-lg shadow-primary/20 flex flex-col justify-center relative overflow-hidden group'>
                    <i className='tabler-calendar absolute -right-6 -bottom-6 text-9xl text-white opacity-10 transform -rotate-12 transition-transform group-hover:scale-110' />
                    <div className='relative z-10'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <Typography variant='caption' className='text-white/80 uppercase font-bold tracking-wider'>
                            Next Appointment
                          </Typography>
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
                    <Typography variant='body2' color='text.secondary' fontWeight={500}>
                      No upcoming appointments scheduled
                    </Typography>
                  </div>
                )}
              </div>
            </Grow>
          </Grid>

          {/* --- ATTENDANCE STATS --- */}
          <Grid size={{ xs: 12 }}>
            <Fade in timeout={1000}>
              <div>
                <Typography variant="overline" color="text.secondary" className="font-bold mb-3 block">
                  Attendance Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <div className='p-3 rounded-lg bg-gray-50 border border-gray-200 text-center'>
                      <Typography variant='h4' fontWeight={700} color='text.primary'>
                        {data.attendance.total}
                      </Typography>
                      <Typography variant='caption' color='text.secondary' className='uppercase font-bold'>
                        Total Visits
                      </Typography>
                    </div>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <div className='p-3 rounded-lg bg-success/5 border border-success/20 text-center'>
                      <Typography variant='h4' fontWeight={700} color='success.main'>
                        {data.attendance.completed}
                      </Typography>
                      <Typography variant='caption' className='text-success font-bold uppercase'>
                        Completed
                      </Typography>
                    </div>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <div className='p-3 rounded-lg bg-warning/5 border border-warning/20 text-center'>
                      <Typography variant='h4' fontWeight={700} color='warning.main'>
                        {data.attendance.noshow}
                      </Typography>
                      <Typography variant='caption' className='text-warning font-bold uppercase'>
                        No Show
                      </Typography>
                    </div>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <div className='p-3 rounded-lg bg-error/5 border border-error/20 text-center'>
                      <Typography variant='h4' fontWeight={700} color='error.main'>
                        {data.attendance.cancelled}
                      </Typography>
                      <Typography variant='caption' className='text-error font-bold uppercase'>
                        Cancelled
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Fade>
          </Grid>

          {/* --- RECENT HISTORY --- */}
          <Grid size={{ xs: 12 }}>
            <Fade in timeout={1200}>
              <div>
                <div className='flex items-center gap-2 mt-4 mb-2'>
                  <i className='tabler-history text-primary text-xl' />
                  <Typography variant='h6' className='uppercase text-sm font-bold tracking-wide text-gray-700'>
                    Recent History
                  </Typography>
                </div>

                {data.recentHistory && data.recentHistory.length > 0 ? (
                  <Timeline>
                    {data.recentHistory.map((history, index) => {
                      const isLast = index === data.recentHistory.length - 1
                      const statusColor = getStatusColor(history.status)

                      return (
                        <TimelineItem key={index}>
                          <TimelineSeparator>
                            <TimelineDot color={statusColor} />
                            {!isLast && <TimelineConnector />}
                          </TimelineSeparator>
                          <TimelineContent>
                            <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                              <Typography className='font-medium' color='text.primary'>
                                {history.status.replace(/_/g, ' ')}
                              </Typography>
                              <Typography variant='caption' color="text.secondary">
                                {history.scheduleDate}
                              </Typography>
                            </div>
                            
                            <div className='flex items-center justify-between'>
                              <Typography variant="body2" className='text-gray-600'>
                                {history.doctorName}
                              </Typography>
                              
                              <Chip 
                                label={history.status.replace(/_/g, ' ')} 
                                color={statusColor === 'grey' ? 'default' : statusColor} 
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
                  <Typography variant="body2" color="text.secondary" className="text-center py-6 italic border rounded-lg mt-4 border-dashed">
                    No recent history found.
                  </Typography>
                )}
              </div>
            </Fade>
          </Grid>

          {/* --- PREFERRED DOCTOR --- */}
          {data.preferredDoctor && (
            <Grid size={{ xs: 12 }}>
              <Grow in timeout={1400}>
                <div className='flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100'>
                  <Avatar sx={{ bgcolor: 'purple', width: 34, height: 34 }}>
                    <i className='tabler-heart text-white text-sm' />
                  </Avatar>
                  <div className='grow'>
                    <Typography variant="caption" className='text-purple-700 font-bold uppercase'>
                      Preferred Doctor
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {data.preferredDoctor.doctorName}
                    </Typography>
                  </div>
                  <Chip 
                    label={`${data.preferredDoctor.visitCount} Visits`} 
                    size="small" 
                    sx={{ bgcolor: 'white', color: 'purple', fontWeight: 'bold' }} 
                  />
                </div>
              </Grow>
            </Grid>
          )}

        </Grid>
      </CardContent>
    </Card>
  )
}

export default Analysis