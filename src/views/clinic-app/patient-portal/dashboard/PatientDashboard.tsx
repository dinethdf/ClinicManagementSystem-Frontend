'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid' // Using Grid v2 as requested
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'

// Service & Types
import { patientPortalService } from '@/services/patient-portal/patient.portal.mock.service'
import type { PortalStats, PortalAppointmentDTO, PortalLabReportDTO } from '@/types/patient-portal/patient.portal.types'

// --- HELPER COMPONENTS ---

// 1. Stat Card
const StatCard = ({ title, value, icon, color, loading }: any) => (
  <Card className='h-full shadow-sm hover:shadow-md transition-shadow border-l-4' style={{ borderLeftColor: `var(--mui-palette-${color}-main)` }}>
    <CardContent className='flex items-center gap-4 p-4'>
      <Avatar variant='rounded' className={`bg-${color}/10 text-${color} w-12 h-12`}>
        {loading ? <CircularProgress size={20} color="inherit" /> : <i className={icon} style={{ fontSize: '1.5rem' }} />}
      </Avatar>
      <div>
        <Typography variant='h4' fontWeight={600} sx={{ color: `${color}.main` }}>
          {loading ? <Skeleton width={40} /> : value}
        </Typography>
        <Typography variant='body2' color='text.secondary' fontWeight={500}>
          {title}
        </Typography>
      </div>
    </CardContent>
  </Card>
)

// 2. Appointment Card (Mobile/Desktop Hybrid)
const AppointmentCard = ({ appt }: { appt: PortalAppointmentDTO }) => (
  <Card className='mb-3 border border-gray-100 shadow-sm'>
    <CardContent className='p-4'>
      <div className='flex justify-between items-start mb-3'>
        <div className='flex gap-3'>
          <Avatar className='bg-primary/10 text-primary w-12 h-12'>
            {appt.doctorName.charAt(4)}
          </Avatar>
          <div>
            <Typography variant='subtitle1' fontWeight={600}>{appt.doctorName}</Typography>
            <Typography variant='caption' className='text-gray-500 bg-gray-100 px-2 py-0.5 rounded'>
              {appt.specialization}
            </Typography>
          </div>
        </div>
        <Chip 
          label={appt.status.replace('_', ' ')} 
          size='small' 
          color={appt.status === 'SCHEDULED' ? 'success' : 'warning'} 
          variant='tonal'
          className='font-bold text-[10px]' 
        />
      </div>
      
      <Divider className='my-3 border-dashed' />
      
      <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
        <div className='flex items-center gap-2'>
          <i className='tabler-calendar text-primary' /> 
          <Typography variant='body2' fontWeight={500}>
            {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Typography>
        </div>
        <div className='flex items-center gap-2'>
          <i className='tabler-clock text-primary' />
          <Typography variant='body2' fontWeight={500}>{appt.time}</Typography>
        </div>
        <div className='flex items-center gap-2 ml-auto'>
          <i className='tabler-ticket text-primary' />
          <Typography variant='body2' fontWeight={600}>Queue: #{appt.queueNo}</Typography>
        </div>
      </div>
    </CardContent>
  </Card>
)

const PatientDashboard = () => {
  // --- STATE ---
  const [stats, setStats] = useState<PortalStats | null>(null)
  const [upcoming, setUpcoming] = useState<PortalAppointmentDTO[]>([])
  const [reports, setReports] = useState<PortalLabReportDTO[]>([])
  const [loading, setLoading] = useState(true)

  // --- FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, apptData, reportData] = await Promise.all([
          patientPortalService.getStats(),
          patientPortalService.getAppointments('UPCOMING'),
          patientPortalService.getRecentLabReports()
        ])
        setStats(statsData)
        setUpcoming(apptData)
        setReports(reportData)
      } catch (error) {
        console.error("Failed to load dashboard", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // --- RENDER ---
  return (
    <div className='flex flex-col gap-6 p-2 md:p-0 animate-in fade-in duration-500'>
      
      {/* 1. Welcome Section */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden'>
        <div className='relative z-10'>
          <Typography variant='h4' fontWeight={700} color='inherit'>
            Hello, Isuru! 👋
          </Typography>
          <Typography variant='body1' className='opacity-90 mt-1'>
            Welcome to your health portal. You have <span className='font-bold bg-white/20 px-2 rounded'>{loading ? '...' : stats?.upcomingAppointments}</span> appointments coming up.
          </Typography>
        </div>
        <Button variant='contained' sx={{ backgroundColor: 'white', color: 'primary.main', fontWeight: 'bold', zIndex: 10 }}>
          Book New Appointment
        </Button>
        
        {/* Decorative Circle */}
        <div className='absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl' />
      </div>

      {/* 2. Quick Stats Grid */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title='Upcoming' value={stats?.upcomingAppointments} icon='tabler-calendar-time' color='primary' loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title='Lab Reports' value={stats?.pendingLabReports} icon='tabler-flask' color='warning' loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title='Visits Done' value={stats?.completedVisits} icon='tabler-circle-check' color='success' loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard title='Total Spent' value={`LKR ${(stats?.totalSpent || 0)/1000}k`} icon='tabler-wallet' color='info' loading={loading} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* 3. Upcoming Appointments */}
        <Grid size={{ xs: 12, md: 8 }}>
          <div className='flex justify-between items-center mb-4'>
            <Typography variant='h5' fontWeight={600}>Upcoming Appointments</Typography>
            <Button size='small' variant='text'>View All</Button>
          </div>
          
          {loading ? (
             <Skeleton variant="rectangular" height={150} className='rounded-lg' />
          ) : upcoming.length === 0 ? (
             <Card className='p-8 text-center text-gray-500 bg-gray-50 border-dashed border-2'>
                <i className='tabler-calendar-off text-4xl mb-2 opacity-50' />
                <Typography>No upcoming appointments</Typography>
             </Card>
          ) : (
             upcoming.map(appt => <AppointmentCard key={appt.id} appt={appt} />)
          )}
        </Grid>

        {/* 4. Recent Lab Reports */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant='h5' fontWeight={600} className='mb-4'>Recent Reports</Typography>
          <Card className='h-full shadow-sm'>
            <CardContent className='p-0'>
                {loading ? (
                    <div className='p-4'><Skeleton height={40} /><Skeleton height={40} className='mt-2' /></div>
                ) : (
                    reports.map((report, index) => (
                        <div key={report.id}>
                            <div className='p-4 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer'>
                                <div className='flex items-center gap-3'>
                                    <Avatar className={`w-10 h-10 ${report.status === 'READY' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                        <i className='tabler-file-analytics' />
                                    </Avatar>
                                    <div>
                                        <Typography variant='subtitle2' fontWeight={600}>{report.testName}</Typography>
                                        <Typography variant='caption' className='text-gray-500'>{report.date}</Typography>
                                    </div>
                                </div>
                                {report.status === 'READY' ? (
                                    <IconButton size='small' color='primary'>
                                        <i className='tabler-download' />
                                    </IconButton>
                                ) : (
                                    <Chip label="Pending" size='small' color='warning' variant='tonal' className='text-[10px]' />
                                )}
                            </div>
                            {index < reports.length - 1 && <Divider />}
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