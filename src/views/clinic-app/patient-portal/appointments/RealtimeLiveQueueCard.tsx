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

// Hook Import
import { useRealtimeSchedule } from '@/hooks/useRealtimeSchedule'

interface Props {
  scheduleId: number
  yourToken: number
}

const RealtimeLiveQueueCard = ({ scheduleId, yourToken }: Props) => {
  
  const { schedule, loading, error } = useRealtimeSchedule(scheduleId)
  const { mode } = useColorScheme()

  // --- 1. DATA LOGIC (UPDATED) ---
  const queueStats = useMemo(() => {
    if (!schedule || !schedule.appointments) return { peopleAhead: 0, waitingList: [], yourStatus: null }

    const list = Array.isArray(schedule.appointments) 
        ? schedule.appointments 
        : Object.values(schedule.appointments)

    // Find your appointment
    const yourAppointment = list.find((appt: any) => appt && appt.queueNo === yourToken)
    
    // Get all appointments before your token that are WAITING
    const waitingBeforeYou = list.filter((appt: any) => {
        if (!appt) return false
        
return appt.queueNo < yourToken && appt.status === 'WAITING'
    }).sort((a: any, b: any) => a.queueNo - b.queueNo)
    
    return {
        peopleAhead: waitingBeforeYou.length,
        waitingList: waitingBeforeYou,
        yourStatus: yourAppointment?.status || null
    }
  }, [schedule, yourToken])


  // --- 2. RENDER STATES ---

  if (loading) return (
    <Card sx={{ bgcolor: 'background.default', borderRadius: 3, boxShadow: 1 }}>
       <CardContent className="p-5">
          <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2, bgcolor: 'action.hover' }} />
          <div className="flex gap-4 items-center">
             <Skeleton variant="rectangular" height={80} className="w-24 rounded-xl" sx={{ bgcolor: 'action.hover' }} />
             <div className='flex-1'><Skeleton variant="text" sx={{ bgcolor: 'action.hover' }} /></div>
             <Skeleton variant="rectangular" height={80} className="w-24 rounded-xl" sx={{ bgcolor: 'action.hover' }} />
          </div>
       </CardContent>
    </Card>
  )

  if (error || !schedule) return null;

  const currentServing = schedule.currentServing || 0
  const isStarted = schedule.scheduleStatus === 'STARTED'
  const { peopleAhead, waitingList, yourStatus } = queueStats

  // Theme Logic
  const isLive = schedule.scheduleStatus === 'STARTED';
  const statusLabel = isLive ? "Live Now" : schedule.scheduleStatus;
  
  // Progress Bar Calculation
  const progressPercent = Math.min(100, Math.max(0, (currentServing / yourToken) * 100));

  // Alert logic for when you're almost up
  const showAlert = peopleAhead < 2 && peopleAhead >= 0 && isLive && yourStatus === 'WAITING';
  
  // Show completed/cancelled status
  const showStatusAlert = yourStatus === 'COMPLETED' || yourStatus === 'CANCELLED';

  return (
    <Fade in={true} timeout={500}>
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: mode === 'dark' ? 3 : 2,
          bgcolor: 'background.default',
          mb: 3
        }}>
        
        <CardContent className='relative z-10 p-5'>
            
            {/* --- HEADER --- */}
            <div className='flex justify-between items-start mb-8'>
                <div className="flex gap-3 items-center">
                    <Avatar sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: 'action.hover',
                      borderRadius: 2
                    }}>
                        <i className="tabler-stethoscope text-xl" style={{ color: 'var(--mui-palette-primary-main)' }} />
                    </Avatar>
                    <div>
                        <Typography variant='h6' fontWeight={700} sx={{ color: 'text.primary', lineHeight: 1.2 }}>
                            {schedule.doctorName}
                        </Typography>
                        <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', fontWeight: 500 }}>
                            {schedule.specialization}
                        </Typography>
                    </div>
                </div>
                <Chip 
                    label={statusLabel}
                    size='small' 
                    sx={{
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      height: 24,
                      border: 'none',
                      bgcolor: isLive ? 'success.lightOpacity' : 'action.hover',
                      color: isLive ? 'success.main' : 'text.secondary'
                    }}
                />
            </div>

            {/* --- ALERT BANNER (When almost your turn) --- */}
            {showAlert && (
                <Fade in={true} timeout={800}>
                    <Alert 
                        severity={peopleAhead === 0 ? "success" : "warning"}
                        icon={peopleAhead === 0 ? <i className="tabler-check" /> : <i className="tabler-bell-ringing" />}
                        sx={{ mb: 3, borderRadius: 2 }}
                    >
                       <Typography variant='body2' fontWeight={600}>
                            {peopleAhead === 0 
                            ? "🎉 You're next! Please be ready." 
                            : `⚡ Almost your turn! Only ${peopleAhead} person ahead.`
                            }
                       </Typography>
                    </Alert>
                </Fade>
            )}

            {/* --- STATUS ALERT (Completed/Cancelled) --- */}
            {showStatusAlert && (
                <Fade in={true} timeout={800}>
                    <Alert 
                        severity={yourStatus === 'COMPLETED' ? "success" : "error"}
                        icon={yourStatus === 'COMPLETED' ? <i className="tabler-circle-check" /> : <i className="tabler-circle-x" />}
                        sx={{ mb: 3, borderRadius: 2 }}
                    >
                       <Typography variant='body2' fontWeight={600}>
                            {yourStatus === 'COMPLETED' 
                            ? "✅ Your appointment is completed. Thank you!" 
                            : "❌ Your appointment has been cancelled."
                            }
                       </Typography>
                    </Alert>
                </Fade>
            )}

            {/* --- PROGRESS ROW --- */}
            <div className="flex items-center gap-4 mb-8">
                
                {/* 1. NOW SERVING (Left Anchor) */}
                <div className="flex flex-col items-center z-10">
                    <Box sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 3,
                        borderColor: isLive ? 'info.dark' : 'divider',
                        bgcolor: isLive ? 'info.main' : 'action.hover',
                        color: 'white',
                        boxShadow: isLive ? '0 0 25px rgba(0, 186, 209, 0.7)' : 'none',
                        transition: 'all 0.3s'
                    }}>
                        <Typography variant='h3' fontWeight={900}>{currentServing}</Typography>
                    </Box>
                    <Typography variant='caption' sx={{ mt: 1.5, fontWeight: 800, color: isLive ? 'info.main' : 'text.secondary', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Serving
                    </Typography>
                </div>

                {/* 2. MIDDLE PROGRESS BAR */}
                <div className="flex-1 flex flex-col justify-center relative">
                    
                    {/* Inject Custom Animation Styles */}
                    <style jsx global>{`
                        @keyframes ripple-effect {
                            0% { transform: scale(1); opacity: 0.8; }
                            100% { transform: scale(2.5); opacity: 0; }
                        }
                        .blink-ring {
                            animation: ripple-effect 1.5s infinite cubic-bezier(0, 0, 0.2, 1);
                        }
                        @keyframes pulse-glow {
                            0%, 100% { box-shadow: 0 0 10px rgba(255, 159, 67, 0.4); }
                            50% { box-shadow: 0 0 20px rgba(255, 159, 67, 0.8); }
                        }
                        .pulse-alert {
                            animation: pulse-glow 2s infinite;
                        }
                    `}</style>

                    {/* Waiting Count Badge (Floating) */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
                        <Box sx={{
                          bgcolor: 'background.paper',
                          border: 1,
                          borderColor: 'divider',
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
                            <i className='tabler-users' style={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }} />
                            <Typography variant='caption' sx={{ fontWeight: 800, color: 'text.primary', fontSize: 13 }}>
                                {peopleAhead} Waiting
                            </Typography>
                        </Box>
                    </div>

                    <Box sx={{ 
                      height: 10, 
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
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 flex items-center justify-center w-3 h-3">
                                    <div
                                        className="blink-ring absolute w-full h-full rounded-full opacity-60"
                                        style={{ backgroundColor: "var(--mui-palette-error-main)" }}
                                    ></div>
                                    <div
                                        className="relative w-3 h-3 bg-white rounded-full shadow-[0_0_5px_rgba(0,0,0,0.3)]"
                                        style={{ border: "2px solid var(--mui-palette-success-dark)" }}
                                    ></div>
                                </div>
                            )}
                        </Box>
                    </Box>

                    {/* Status Text Below Bar */}
                    <div className="flex justify-between mt-1 px-1">
                        <Typography variant='caption' sx={{ color: 'text.disabled', fontSize: 9 }}>Start</Typography>
                        <Typography variant='caption' sx={{ color: 'text.disabled', fontSize: 9 }}>You</Typography>
                    </div>
                </div>

                {/* 3. YOUR TOKEN (Right Anchor) */}
                <div className="flex flex-col items-center z-10">
                    <Box sx={{
                        width: 64,
                        height: 64,
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
                        <Typography variant='h4' fontWeight={800}>{yourToken}</Typography>
                    </Box>
                    <Typography variant='caption' sx={{ mt: 1, fontWeight: 700, color: 'warning.main', fontSize: 10, textTransform: 'uppercase' }}>
                      You
                    </Typography>
                </div>

            </div>

            {/* --- TIMELINE / QUEUE LIST (Collapsible) --- */}
            {peopleAhead > 0 && yourStatus === 'WAITING' && (
                <Box sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  p: 2,
                  boxShadow: 1
                }}>
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
                          zIndex: -1
                        }} />

                        <div className="space-y-4">
                            
                            {/* Current (Small Row) */}
                            <div className="flex items-center gap-3 opacity-60">
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'text.disabled', flexShrink: 0, ml: '15px' }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Current: Token {currentServing}
                                </Typography>
                            </div>

                            {/* The Waiting List Logic */}
                            {waitingList.length > 3 ? (

                                // COLLAPSED VIEW
                                <div className="flex items-center gap-3">
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'text.disabled', flexShrink: 0, ml: '17px' }} />
                                    <Box sx={{
                                      flex: 1,
                                      bgcolor: 'action.selected',
                                      border: 1,
                                      borderColor: 'divider',
                                      borderStyle: 'dashed',
                                      borderRadius: 1.5,
                                      p: 1,
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center'
                                    }}>
                                        <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <i className="tabler-users" style={{ fontSize: 14 }} /> +{waitingList.length} Others
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: 10, opacity: 0.6, color: 'text.secondary' }}>
                                          Tokens {waitingList[0].queueNo}-{waitingList[waitingList.length - 1].queueNo}
                                        </Typography>
                                    </Box>
                                </div>
                            ) : (

                                // DETAILED VIEW
                                <div className="space-y-2">
                                    {waitingList.map((appt: any) => (
                                        <div key={appt.queueNo} className="flex items-center gap-3">
                                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'text.disabled', flexShrink: 0, ml: '18px' }} />
                                            <Box sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: 1.5,
                                              bgcolor: 'action.selected',
                                              px: 1.5,
                                              py: 0.75,
                                              borderRadius: 1.5,
                                              width: '100%',
                                              border: 1,
                                              borderColor: 'divider'
                                            }}>
                                                <i className="tabler-user" style={{ fontSize: 14, color: 'var(--mui-palette-text-disabled)' }} />
                                                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', color: 'text.primary' }}>
                                                   {appt.patientName
                                                    ? appt.patientName.slice(0, 5) + '*'.repeat(Math.max(0, appt.patientName.length - 4))
                                                    : ''}
                                                </Typography>
                                                <Box component="span" sx={{ fontSize: 10, bgcolor: 'action.hover', px: 0.75, py: 0.25, borderRadius: 0.5, color: 'text.secondary' }}>
                                                    #{appt.queueNo}
                                                </Box>
                                            </Box>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* You (Small Row) */}
                            <div className="flex items-center gap-3">
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main', flexShrink: 0, ml: '15px' }} />
                                <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 700 }}>
                                  {yourStatus === 'WAITING' ? 'You are next' : 'Your position'} (Token {yourToken})
                                </Typography>
                            </div>
                        </div>
                    </div>
                </Box>
            )}

        </CardContent>
        </Card>
    </Fade>
  )
}

export default RealtimeLiveQueueCard