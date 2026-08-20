'use client'

import { useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Avatar from '@mui/material/Avatar'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { useColorScheme } from '@mui/material/styles'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'

// Hook Import
import { useRealtimeSchedule } from '@/hooks/useRealtimeSchedule'

interface Props {
  scheduleId: number
  queueNo: number
}

const PublicQueueTrackerView = ({ scheduleId, queueNo }: Props) => {
  
  const { schedule, loading, error } = useRealtimeSchedule(scheduleId)
  const { mode } = useColorScheme()

  // Calculate queue statistics
  const queueStats = useMemo(() => {
    if (!schedule || !schedule.appointments) {
      return { 
        peopleAhead: 0, 
        waitingList: [], 
        yourStatus: null,
        yourAppointment: null 
      }
    }

    const list = Array.isArray(schedule.appointments) 
      ? schedule.appointments 
      : Object.values(schedule.appointments)

    // Find your appointment
    const yourAppointment = list.find((appt: any) => appt && appt.queueNo === queueNo)
    
    // Get all appointments before your token that are WAITING
    const waitingBeforeYou = list.filter((appt: any) => {
      if (!appt) return false
      
return appt.queueNo < queueNo && appt.status === 'WAITING'
    }).sort((a: any, b: any) => a.queueNo - b.queueNo)
    
    return {
      peopleAhead: waitingBeforeYou.length,
      waitingList: waitingBeforeYou,
      yourStatus: yourAppointment?.status || null,
      yourAppointment
    }
  }, [schedule, queueNo])

  // Loading State
  if (loading) {
    return (
      <Container maxWidth="sm" className='py-6'>
        <Card sx={{ bgcolor: 'background.default', borderRadius: 3, boxShadow: 3 }}>
          <CardContent className="p-5">
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 3, bgcolor: 'action.hover' }} />
            <div className="flex gap-4 items-center mb-6">
              <Skeleton variant="rectangular" height={100} className="w-28 rounded-xl" sx={{ bgcolor: 'action.hover' }} />
              <div className='flex-1'>
                <Skeleton variant="text" height={30} sx={{ bgcolor: 'action.hover', mb: 1 }} />
                <Skeleton variant="text" width="70%" sx={{ bgcolor: 'action.hover' }} />
              </div>
              <Skeleton variant="rectangular" height={100} className="w-28 rounded-xl" sx={{ bgcolor: 'action.hover' }} />
            </div>
            <Skeleton variant="rectangular" height={150} className="rounded-xl" sx={{ bgcolor: 'action.hover' }} />
          </CardContent>
        </Card>
      </Container>
    )
  }

  // Error State
  if (error || !schedule) {
    return (
      <Container maxWidth="sm" className='py-6'>
        <Alert 
          severity='error' 
          icon={<i className='tabler-alert-circle text-3xl' />}
          sx={{ borderRadius: 2 }}
        >
          <Typography variant='h6' gutterBottom>Queue Not Found</Typography>
          <Typography variant='body2'>
            Unable to load queue information. Please check your QR code or contact the clinic.
          </Typography>
        </Alert>
      </Container>
    )
  }

  const currentServing = schedule.currentServing || 0
  const isLive = schedule.scheduleStatus === 'STARTED'
  const { peopleAhead, waitingList, yourStatus, yourAppointment } = queueStats

  // Progress calculation
  const progressPercent = Math.min(100, Math.max(0, (currentServing / queueNo) * 100))

  // Alert logic
  const showAlert = peopleAhead < 2 && peopleAhead >= 0 && isLive && yourStatus === 'WAITING'
  const showStatusAlert = yourStatus === 'COMPLETED' || yourStatus === 'CANCELLED'

  // Estimated wait time (10 min per patient)
  const estimatedWaitTime = peopleAhead * 10

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: mode === 'dark' ? 'background.default' : 'grey.50',
      py: 4
    }}>
      <Container maxWidth="sm">
        
        {/* Header Card - Clinic/Doctor Info */}
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 3, 
            p: 2, 
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText'
          }}
        >
          <Box className='flex items-center gap-3'>
            <Avatar sx={{ 
              width: 48, 
              height: 48, 
              bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: 2
            }}>
              <i className="tabler-building-hospital text-2xl" />
            </Avatar>
            <Box className='flex-1'>
              <Typography variant='h6' fontWeight={700}>
                Appointment Queue Tracker
              </Typography>
              <Typography variant='caption' sx={{ opacity: 0.9 }}>
                Real-time queue status
              </Typography>
            </Box>
            <Chip 
              label={isLive ? 'LIVE' : schedule.scheduleStatus}
              size='small'
              sx={{
                fontWeight: 700,
                bgcolor: isLive ? 'success.main' : 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none'
              }}
            />
          </Box>
        </Paper>

        <Fade in={true} timeout={500}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3,
            bgcolor: 'background.paper',
            mb: 3
          }}>
            <CardContent className='relative z-10 p-5'>
              
              {/* Doctor Info Header */}
              <Box className='mb-6'>
                <Box className="flex gap-3 items-start mb-4">
                  <Avatar sx={{ 
                    width: 50, 
                    height: 50, 
                    bgcolor: 'primary.light',
                    borderRadius: 2
                  }}>
                    <i className="tabler-stethoscope text-2xl" />
                  </Avatar>
                  <Box className='flex-1'>
                    <Typography variant='h5' fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
                      {schedule.doctorName}
                    </Typography>
                    <Typography variant='body2' sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}>
                      {schedule.specialization}
                    </Typography>
                    <Box className='flex items-center gap-3 flex-wrap'>
                      <Typography variant='caption' sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <i className='tabler-calendar text-sm' /> {schedule.date}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <i className='tabler-clock text-sm' /> {schedule.time}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Alert Banners */}
              {showAlert && (
                <Fade in={true} timeout={800}>
                  <Alert 
                    severity={peopleAhead === 0 ? "success" : "warning"}
                    icon={peopleAhead === 0 ? <i className="tabler-check" /> : <i className="tabler-bell-ringing" />}
                    sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}
                  >
                    {peopleAhead === 0 
                      ? "🎉 You're next! Please be ready at the clinic." 
                      : `⚡ Almost your turn! Only ${peopleAhead} ${peopleAhead === 1 ? 'person' : 'people'} ahead.`
                    }
                  </Alert>
                </Fade>
              )}

              {showStatusAlert && (
                <Fade in={true} timeout={800}>
                  <Alert 
                    severity={yourStatus === 'COMPLETED' ? "success" : "error"}
                    icon={yourStatus === 'COMPLETED' ? <i className="tabler-circle-check" /> : <i className="tabler-circle-x" />}
                    sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}
                  >
                    {yourStatus === 'COMPLETED' 
                      ? "✅ Your appointment is completed. Thank you!" 
                      : "❌ Your appointment has been cancelled. Please contact the clinic."
                    }
                  </Alert>
                </Fade>
              )}

              {/* Progress Visualization */}
              <Box className="mb-6">
                
                {/* Inject Animations */}
                <style jsx global>{`
                  @keyframes ripple-effect {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(2.5); opacity: 0; }
                  }
                  .blink-ring {
                    animation: ripple-effect 1.5s infinite cubic-bezier(0, 0, 0.2, 1);
                  }
                  @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 15px rgba(255, 159, 67, 0.4); }
                    50% { box-shadow: 0 0 25px rgba(255, 159, 67, 0.8); }
                  }
                  .pulse-alert {
                    animation: pulse-glow 2s infinite;
                  }
                `}</style>

                <div className="flex items-center gap-4">
                  
                  {/* Now Serving Box */}
                  <div className="flex flex-col items-center z-10">
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 3,
                      borderColor: isLive ? 'info.main' : 'divider',
                      bgcolor: isLive ? 'info.main' : 'action.hover',
                      color: isLive ? 'white' : 'text.secondary',
                      boxShadow: isLive ? '0 0 25px rgba(0, 186, 209, 0.5)' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      <Typography variant='h3' fontWeight={900}>{currentServing}</Typography>
                    </Box>
                    <Typography variant='caption' sx={{ 
                      mt: 1.5, 
                      fontWeight: 800, 
                      color: isLive ? 'info.main' : 'text.secondary', 
                      fontSize: 11, 
                      textTransform: 'uppercase',
                      letterSpacing: 0.5 
                    }}>
                      Serving
                    </Typography>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 flex flex-col justify-center relative">
                    
                    {/* Waiting Count Badge */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                      <Box sx={{
                        bgcolor: 'background.paper',
                        border: 2,
                        borderColor: peopleAhead < 2 && isLive ? 'warning.main' : 'divider',
                        px: 2,
                        py: 0.75,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        boxShadow: 2
                      }}
                      className={peopleAhead < 2 && isLive ? 'pulse-alert' : ''}
                      >
                        <i className='tabler-users' style={{ fontSize: 16, color: 'var(--mui-palette-text-secondary)' }} />
                        <Typography variant='body2' sx={{ fontWeight: 800, color: 'text.primary' }}>
                          {peopleAhead} Ahead
                        </Typography>
                      </Box>
                    </div>

                    {/* Progress Bar */}
                    <Box sx={{ 
                      height: 12, 
                      width: '100%', 
                      bgcolor: 'action.hover',
                      borderRadius: 10,
                      position: 'relative',
                      overflow: 'visible'
                    }}>
                      <Box sx={{
                        height: '100%',
                        bgcolor: 'success.main',
                        boxShadow: '0 0 10px rgba(40, 199, 111, 0.6)',
                        position: 'relative',
                        transition: 'all 1s ease-out',
                        borderRadius: '10px 0 0 10px',
                        width: `${progressPercent}%`
                      }}>
                        {isLive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 flex items-center justify-center w-4 h-4">
                            <div
                              className="blink-ring absolute w-full h-full rounded-full opacity-60"
                              style={{ backgroundColor: "var(--mui-palette-error-main)" }}
                            />
                            <div
                              className="relative w-4 h-4 bg-white rounded-full shadow-lg"
                              style={{ border: "2px solid var(--mui-palette-success-dark)" }}
                            />
                          </div>
                        )}
                      </Box>
                    </Box>

                    {/* Status Text */}
                    <div className="flex justify-between mt-1.5 px-1">
                      <Typography variant='caption' sx={{ color: 'text.disabled', fontSize: 9 }}>START</Typography>
                      <Typography variant='caption' sx={{ color: 'text.disabled', fontSize: 9 }}>YOU</Typography>
                    </div>
                  </div>

                  {/* Your Token Box */}
                  <div className="flex flex-col items-center z-10">
                    <Box sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 2,
                      bgcolor: peopleAhead < 2 && isLive ? 'warning.light' : 'warning.main',
                      color: 'warning.contrastText',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 2,
                      borderColor: 'warning.light',
                      boxShadow: '0 0 15px rgba(255, 159, 67, 0.4)',
                      transition: 'all 0.3s'
                    }}
                    className={peopleAhead < 2 && isLive ? 'pulse-alert' : ''}
                    >
                      <Typography variant='h4' fontWeight={800}>{queueNo}</Typography>
                    </Box>
                    <Typography variant='caption' sx={{ 
                      mt: 1, 
                      fontWeight: 700, 
                      color: 'warning.main', 
                      fontSize: 10, 
                      textTransform: 'uppercase' 
                    }}>
                      Your Token
                    </Typography>
                  </div>

                </div>
              </Box>

              {/* Stats Cards */}
              <Box className='grid grid-cols-2 gap-3 mb-6'>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Estimated Wait
                  </Typography>
                  <Typography variant='h6' fontWeight={700} sx={{ color: 'text.primary' }}>
                    {estimatedWaitTime} min
                  </Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Your Status
                  </Typography>
                  <Chip 
                    label={yourStatus || 'WAITING'}
                    size='small'
                    color={
                      yourStatus === 'ONGOING' ? 'success' :
                      yourStatus === 'COMPLETED' ? 'primary' :
                      yourStatus === 'CANCELLED' ? 'error' : 'warning'
                    }
                    sx={{ fontWeight: 700, height: 24 }}
                  />
                </Paper>
              </Box>

              {/* Patient Info (if available) */}
              {yourAppointment && (
                <Box sx={{ 
                  bgcolor: 'primary.light', 
                  borderRadius: 2, 
                  p: 2.5,
                  mb: 4
                }}>
                  <Typography variant='subtitle2' sx={{ color: 'primary.dark', fontWeight: 700, mb: 1.5 }}>
                    Your Appointment Details
                  </Typography>
                  <Box className='flex items-center gap-2 mb-2'>
                    <i className='tabler-user text-primary' style={{ fontSize: 18 }} />
                    <Typography variant='body2' fontWeight={600}>
                      {yourAppointment.patientName}
                    </Typography>
                  </Box>
                  {yourAppointment.phone && (
                    <Box className='flex items-center gap-2'>
                      <i className='tabler-phone text-primary' style={{ fontSize: 18 }} />
                      <Typography variant='body2' fontWeight={600}>
                        {yourAppointment.phone}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Queue Timeline */}
              {peopleAhead > 0 && yourStatus === 'WAITING' && (
                <Box sx={{ 
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  p: 2.5
                }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                    People Ahead of You
                  </Typography>
                  
                  <div className="relative pl-2">
                    {/* Dotted Line */}
                    <Box sx={{
                      position: 'absolute',
                      left: '29px',
                      top: 8,
                      bottom: 8,
                      width: 0.5,
                      borderLeft: 2,
                      borderStyle: 'dashed',
                      borderColor: 'divider',
                      zIndex: 0
                    }} />

                    <div className="space-y-4">
                      
                      {/* Current Serving */}
                      <div className="flex items-center gap-3 opacity-60">
                        <Box sx={{ 
                          width: 14, 
                          height: 14, 
                          borderRadius: '50%', 
                          bgcolor: 'info.main', 
                          flexShrink: 0, 
                          ml: '15px',
                          border: 2,
                          borderColor: 'background.paper'
                        }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          Now Serving: Token {currentServing}
                        </Typography>
                      </div>

                      {/* Waiting List */}
                      {waitingList.length > 3 ? (

                        // Collapsed View
                        <div className="flex items-center gap-3">
                          <Box sx={{ 
                            width: 10, 
                            height: 10, 
                            borderRadius: '50%', 
                            bgcolor: 'warning.main', 
                            flexShrink: 0, 
                            ml: '17px' 
                          }} />
                          <Box sx={{
                            flex: 1,
                            bgcolor: 'background.paper',
                            border: 1,
                            borderColor: 'divider',
                            borderStyle: 'dashed',
                            borderRadius: 1.5,
                            p: 1.5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <i className="tabler-users" style={{ fontSize: 16 }} /> {waitingList.length} People
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Tokens {waitingList[0].queueNo}-{waitingList[waitingList.length - 1].queueNo}
                            </Typography>
                          </Box>
                        </div>
                      ) : (

                        // Detailed View
                        <div className="space-y-2">
                          {waitingList.map((appt: any) => (
                            <div key={appt.queueNo} className="flex items-center gap-3">
                              <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: 'warning.main', 
                                flexShrink: 0, 
                                ml: '18px' 
                              }} />
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                bgcolor: 'background.paper',
                                px: 2,
                                py: 1,
                                borderRadius: 1.5,
                                width: '100%',
                                border: 1,
                                borderColor: 'divider'
                              }}>
                                <i className="tabler-user" style={{ fontSize: 16, color: 'var(--mui-palette-text-disabled)' }} />
                                <Typography variant="body2" sx={{ fontWeight: 500, flex: 1, color: 'text.primary' }}>
                                  Token #{appt.queueNo}
                                </Typography>
                              </Box>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Your Position */}
                      <div className="flex items-center gap-3">
                        <Box sx={{ 
                          width: 14, 
                          height: 14, 
                          borderRadius: '50%', 
                          bgcolor: 'warning.main', 
                          flexShrink: 0, 
                          ml: '15px',
                          border: 2,
                          borderColor: 'background.paper',
                          boxShadow: '0 0 10px rgba(255, 159, 67, 0.5)'
                        }} />
                        <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 700 }}>
                          You (Token {queueNo})
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Box>
              )}

            </CardContent>
          </Card>
        </Fade>

        {/* Footer Info */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', textAlign: 'center' }}>
          <Typography variant='caption' sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <i className='tabler-refresh' style={{ fontSize: 14 }} />
            Auto-refreshing in real-time
          </Typography>
        </Paper>

      </Container>
    </Box>
  )
}

export default PublicQueueTrackerView