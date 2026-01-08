'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/redux-store'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'

// Redux Actions
import { fetchPatientDashboard } from '@/redux-store/slices/patientPortalSlice'

// --- HELPER COMPONENTS ---

const StatCard = ({ title, value, icon, color, loading, subtext }: any) => (
  <Card className='h-full shadow-sm hover:shadow-md transition-shadow border-l-4' style={{ borderLeftColor: `var(--mui-palette-${color}-main)` }}>
    <CardContent className='flex items-center gap-4 p-4'>
      <Avatar variant='rounded' className={`bg-${color}/10 text-${color} w-12 h-12`}>
        {loading ? <CircularProgress size={20} color="inherit" /> : <i className={icon} style={{ fontSize: '1.5rem' }} />}
      </Avatar>
      <div className='flex-1'>
        <Typography variant='h5' fontWeight={600} sx={{ color: `${color}.main` }}>
          {loading ? <Skeleton width={40} /> : value}
        </Typography>
        <Typography variant='body2' color='text.secondary' fontWeight={500}>
          {title}
        </Typography>
        {subtext && <Typography variant='caption' className='text-gray-400'>{subtext}</Typography>}
      </div>
    </CardContent>
  </Card>
)

import CircularProgress from '@mui/material/CircularProgress'

const PatientDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  
  // Select data from Redux store
  const { data, status, error } = useSelector((state: RootState) => state.patientPortal.dashboard)

  const loading = status === 'loading' || status === 'idle'

  // Extract Data Safe Access
  const nextAppt = data?.nextAppointment
  const history = data?.recentHistory || []
  const financials = data?.financials
  const attendance = data?.attendance
  const preferredDoc = data?.preferredDoctor

  // --- INITIAL LOAD ---
  useEffect(() => {
    dispatch(fetchPatientDashboard())
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(fetchPatientDashboard())
  }

  // --- RENDER ---
  return (
    <div className='flex flex-col gap-6 p-2 md:p-0 animate-in fade-in duration-500'>
      
      {/* Error State */}
      {status === 'failed' && (
        <Alert severity="error" className="mb-4">Error: {error}</Alert>
      )}

      {/* Header */}
      <div className='flex justify-between items-center mb-2'>
         <Typography variant='h4'>My Health Overview</Typography>
         <Button 
            variant='outlined' 
            startIcon={<i className={`tabler-refresh ${loading ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
            disabled={loading}
         >
            Refresh
         </Button>
      </div>

      {/* 1. Welcome Banner */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden'>
        <div className='relative z-10'>
          <Typography variant='h4' fontWeight={700} color='inherit'>
            Welcome Back! 👋
          </Typography>
          <Typography variant='body1' className='opacity-90 mt-1'>
             {nextAppt 
               ? `You have an appointment scheduled with ${nextAppt.doctorName} on ${nextAppt.scheduleDate}.` 
               : "You have no upcoming appointments scheduled."}
          </Typography>
        </div>
        <Button variant='contained' sx={{ backgroundColor: 'white', color: 'primary.main', fontWeight: 'bold', zIndex: 10 }}>
          Book Appointment
        </Button>
        <div className='absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl' />
      </div>

      {/* 2. Stats Grid */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard 
            title='Next Visit' 
            value={nextAppt ? nextAppt.scheduleDate : 'None'} 
            icon='tabler-calendar-event' 
            color='primary' 
            loading={loading}
            subtext={nextAppt?.startTime} 
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard 
            title='Visits Completed' 
            value={attendance?.completed || 0} 
            icon='tabler-circle-check' 
            color='success' 
            loading={loading}
            subtext={`Last: ${attendance?.lastVisit || 'N/A'}`} 
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard 
            title='Total Paid' 
            value={`LKR ${(financials?.totalPaid || 0).toLocaleString()}`} 
            icon='tabler-wallet' 
            color='info' 
            loading={loading} 
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard 
            title='Amount Due' 
            value={`LKR ${(financials?.totalDue || 0).toLocaleString()}`} 
            icon='tabler-alert-circle' 
            color={financials?.totalDue && financials.totalDue > 0 ? 'error' : 'secondary'} 
            loading={loading} 
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        
        {/* 3. Left Column: Next Appointment & Financials */}
        <Grid size={{ xs: 12, md: 7 }}>
           
           {/* Next Appointment Card */}
           <Typography variant='h5' fontWeight={600} className='mb-4'>Next Appointment</Typography>
           {loading ? <Skeleton height={200} /> : nextAppt ? (
              <Card className='mb-6 border-l-4 border-primary'>
                <CardContent className='flex flex-col md:flex-row gap-6 items-center'>
                    <div className='flex flex-col items-center justify-center bg-primary/5 p-4 rounded-lg min-w-[120px] text-center'>
                        <Typography variant='h4' color='primary' fontWeight={700}>
                            {new Date(nextAppt.scheduleDate).getDate()}
                        </Typography>
                        <Typography variant='body2' fontWeight={600} className='uppercase'>
                            {new Date(nextAppt.scheduleDate).toLocaleString('default', { month: 'short' })}
                        </Typography>
                        <Chip label={nextAppt.startTime} size='small' color='primary' className='mt-2' />
                    </div>
                    <div className='flex-1 text-center md:text-left'>
                        <Typography variant='h5' fontWeight={600}>{nextAppt.doctorName}</Typography>
                        <Typography variant='body1' color='text.secondary' className='mb-2'>
                           Standard Consultation
                        </Typography>
                        <div className='flex gap-2 justify-center md:justify-start'>
                           <Chip label="Confirmed" color='success' size='small' variant='tonal' />
                        </div>
                    </div>
                </CardContent>
              </Card>
           ) : (
              <Card className='mb-6 p-6 text-center border-dashed border-2'>
                 <i className='tabler-calendar-off text-4xl text-gray-300 mb-2' />
                 <Typography color="text.secondary">No upcoming appointments found.</Typography>
              </Card>
           )}

           {/* Preferred Doctor Card */}
           {preferredDoc && (
             <Card className='bg-blue-50'>
                <CardContent className='flex justify-between items-center'>
                   <div>
                      <Typography variant='subtitle2' color="text.secondary">Preferred Doctor</Typography>
                      <Typography variant='h6' fontWeight={600}>{preferredDoc.doctorName}</Typography>
                   </div>
                   <div className='text-right'>
                      <Typography variant='h4' color='primary'>{preferredDoc.visitCount}</Typography>
                      <Typography variant='caption'>Visits</Typography>
                   </div>
                </CardContent>
             </Card>
           )}
        </Grid>

        {/* 4. Right Column: History List */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant='h5' fontWeight={600} className='mb-4'>Recent History</Typography>
          <Card className='h-full'>
            <CardContent className='p-0'>
                {loading ? (
                    <div className='p-4'><Skeleton height={50} /><Skeleton height={50} /></div>
                ) : history.length === 0 ? (
                    <div className='p-6 text-center text-gray-400'>No history found</div>
                ) : (
                    history.map((item, index) => (
                        <div key={index}>
                            <div className='p-4 hover:bg-gray-50 transition-colors flex justify-between items-center'>
                                <div className='flex items-center gap-3'>
                                    <Avatar className='bg-gray-100 text-gray-600'>
                                        <i className='tabler-stethoscope' />
                                    </Avatar>
                                    <div>
                                        <Typography variant='subtitle2' fontWeight={600}>{item.doctorName}</Typography>
                                        <Typography variant='caption' className='text-gray-500'>{item.scheduleDate}</Typography>
                                    </div>
                                </div>
                                <Chip 
                                    label={item.status} 
                                    size='small' 
                                    color={item.status === 'COMPLETED' ? 'success' : 'default'} 
                                    variant='tonal' 
                                    className='text-[10px]' 
                                />
                            </div>
                            {index < history.length - 1 && <Divider />}
                        </div>
                    ))
                )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default PatientDashboard