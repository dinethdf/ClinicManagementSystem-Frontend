'use client'

import { useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'

// Hook Import
import { useRealtimeSchedule } from '@/hooks/useRealtimeSchedule'

// Icons (Using Tabler Icons classes directly for consistency)
const IconUser = () => <i className="tabler-user text-sm" />

interface Props {
  scheduleId: number
  yourToken: number
}

const RealtimeLiveQueueCard = ({ scheduleId, yourToken }: Props) => {
  
  const { schedule, loading, error } = useRealtimeSchedule(scheduleId)

  // --- 1. SMART CALCULATION LOGIC ---
  const queueStats = useMemo(() => {
    if (!schedule || !schedule.appointments) return { peopleAhead: 0, waitingList: [] }

    const currentServing = schedule.currentServing || 0
    const list = Array.isArray(schedule.appointments) 
        ? schedule.appointments 
        : Object.values(schedule.appointments)

    const intermediateAppointments = list.filter((appt: any) => {
        if (!appt) return false
        return appt.queueNo > currentServing && appt.queueNo < yourToken
    })

    const waitingList = intermediateAppointments
        .filter((appt: any) => appt.status === 'WAITING')
        .sort((a: any, b: any) => a.queueNo - b.queueNo)
    
    return {
        peopleAhead: waitingList.length,
        waitingList: waitingList
    }
  }, [schedule, yourToken])


  // --- 2. RENDER STATES ---

  if (loading) return (
    <Card className='mb-6 rounded-xl border-none shadow-sm bg-gray-50'>
       <CardContent className="p-5">
          <div className="flex gap-4 mb-6">
             <Skeleton variant="circular" width={48} height={48} />
             <div className='flex-1'>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" />
             </div>
          </div>
          <div className="flex gap-4">
             <Skeleton variant="rectangular" height={100} className="flex-1 rounded-xl" />
             <Skeleton variant="rectangular" height={100} className="flex-1 rounded-xl" />
          </div>
       </CardContent>
    </Card>
  )

  if (error || !schedule) return null;

  const currentServing = schedule.currentServing || 0
  const isStarted = schedule.scheduleStatus === 'STARTED'
  const { peopleAhead, waitingList } = queueStats

  // Status Logic
  const isLive = schedule.scheduleStatus === 'STARTED';
  const statusLabel = isLive ? "Live Now" : schedule.scheduleStatus;
  
  // Dynamic Background Gradient
  const cardGradient = isLive 
    ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' // Indigo to Violet
    : 'linear-gradient(135deg, #334155 0%, #475569 100%)'; // Slate Gray (Inactive)

  return (
    <Fade in={true} timeout={500}>
        <Card 
            className='mb-6 relative overflow-hidden shadow-xl border-none rounded-2xl text-white'
            style={{ background: cardGradient }}
        >
        
        {/* Background Icon Decoration */}
        <div className='absolute -right-6 -top-6 opacity-10 rotate-12 pointer-events-none'>
            <i className='tabler-activity-heartbeat text-[180px]' />
        </div>

        <CardContent className='relative z-10 p-5'>
            
            {/* --- HEADER --- */}
            <div className='flex justify-between items-start mb-6'>
                <div className="flex gap-3 items-center">
                    <Avatar className="w-12 h-12 bg-white/20 text-white backdrop-blur-md shadow-sm">
                        <i className="tabler-stethoscope text-2xl" />
                    </Avatar>
                    <div>
                        <Typography variant='h6' fontWeight={700} className='leading-tight text-white'>
                            {schedule.doctorName}
                        </Typography>
                        <Typography variant='caption' className='text-white/70 block font-medium'>
                            {schedule.specialization}
                        </Typography>
                    </div>
                </div>
                
                <div className='text-right'>
                    <Chip 
                        label={statusLabel}
                        size='small' 
                        className={`font-bold uppercase tracking-wide h-6 shadow-sm border-none ${isLive ? 'bg-green-400 text-green-900' : 'bg-white/20 text-white'}`}
                    />
                    {schedule.startedAt && (
                        <div className='flex items-center justify-end gap-1 mt-1 opacity-80 text-[10px] font-bold uppercase'>
                            <i className='tabler-clock text-[10px]' />
                            <span>Started: {schedule.startedAt}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* --- BIG STATS ROW --- */}
            <div className="flex gap-3 mb-6">
                
                {/* CURRENT SERVING */}
                <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                    <Typography variant='caption' className='text-white/70 font-bold uppercase tracking-widest text-[10px] mb-1'>
                        Now Serving
                    </Typography>
                    <Typography variant='h2' fontWeight={800} className='text-white drop-shadow-md'>
                        {currentServing || '-'}
                    </Typography>
                    {isLive && (
                        <div className="absolute top-3 right-3 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                        </div>
                    )}
                </div>

                {/* YOUR TOKEN */}
                <div className="flex-1 bg-linear-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg">
                    <Typography variant='caption' className='text-yellow-300 font-bold uppercase tracking-widest text-[10px] mb-1'>
                        Your Token
                    </Typography>
                    <Typography variant='h2' fontWeight={800} className='text-white drop-shadow-md'>
                        {yourToken}
                    </Typography>
                </div>
            </div>

            {/* --- ALERT BANNER --- */}
            {isLive && (
                <div className={`
                    mb-6 rounded-xl p-3 flex items-center justify-center gap-2 text-sm font-bold shadow-md backdrop-blur-md border border-white/10
                    ${peopleAhead === 0 ? 'bg-green-500/90 text-white' : 'bg-white/90 text-indigo-900'}
                `}>
                    {peopleAhead === 0 ? (
                        <>
                            <i className='tabler-door-enter text-xl'/> 
                            <span>It's your turn! Please enter.</span>
                        </>
                    ) : (
                        <>
                            <i className='tabler-users text-xl text-indigo-500'/>
                            <span>Approx. {peopleAhead} people ahead of you</span>
                        </>
                    )}
                </div>
            )}

            {/* --- TIMELINE SECTION --- */}
            {peopleAhead > 0 && (
                <Box className='bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 p-4'>
                    <Typography variant='caption' className='text-white/50 text-[10px] font-bold uppercase tracking-widest block mb-4 border-b border-white/10 pb-2'>
                        Realtime Queue
                    </Typography>

                    <div className="relative pl-2">
                        
                        {/* Dotted Vertical Line connecting nodes */}
                        <div className="absolute left-[29px] top-3 bottom-6 w-0.5 border-l-2 border-dashed border-white/20 -z-10"></div>

                        <div className="space-y-5">
                            
                            {/* 1. START POINT (Current) */}
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-white/30 shadow-[0_0_10px_rgba(74,222,128,0.6)] shrink-0 ml-[13px] animate-pulse"></div>
                                <div className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-md">
                                    <Chip label="Serving" size="small" className="bg-green-500 text-white font-bold h-5 text-[10px]" />
                                    <Typography variant="caption" className="font-bold text-white">Token {currentServing}</Typography>
                                </div>
                            </div>

                            {/* 2. MIDDLE (Waiting List) */}
                            {waitingList.length > 4 ? (
                                // >>> COLLAPSED VIEW
                                <div className="flex items-center gap-3 py-1">
                                    <div className="w-2 h-2 rounded-full bg-white/40 shrink-0 ml-[17px]"></div>
                                    <div className="flex-1 bg-white/5 border border-white/10 border-dashed rounded-lg p-3 flex justify-between items-center text-white/80">
                                        <div className="flex items-center gap-2">
                                            <i className="tabler-users text-lg text-white/60" />
                                            <Typography variant="body2" fontWeight={600} className='text-sm'>
                                                +{waitingList.length} Waiting
                                            </Typography>
                                        </div>
                                        <Typography variant="caption" className="text-white/50 text-[10px]">
                                            Tokens {waitingList[0].queueNo} - {waitingList[waitingList.length - 1].queueNo}
                                        </Typography>
                                    </div>
                                </div>
                            ) : (
                                // >>> DETAILED VIEW (1-3 people)
                                <div className="space-y-3 pl-1">
                                    {waitingList.map((appt: any) => (
                                        <div key={appt.queueNo} className="flex items-center gap-3">
                                            {/* Small dot on timeline */}
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0 ml-[18px]"></div>
                                            
                                            {/* Patient Row */}
                                            <div className="flex items-center gap-3 text-white/70 bg-white/5 px-3 py-1.5 rounded-lg w-full border border-white/5">
                                                <IconUser />
                                                <Typography variant="body2" className='text-xs font-medium truncate flex-1'>
                                                    {appt.patientName}
                                                </Typography>
                                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/90">
                                                    #{appt.queueNo}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 3. END POINT (You) */}
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-yellow-400 border-2 border-white/50 shadow-[0_0_15px_rgba(250,204,21,0.6)] shrink-0 ml-[11px] flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-yellow-800 rounded-full"></div>
                                </div>
                                <div className="bg-yellow-500/20 border border-yellow-400/50 px-3 py-2 rounded-lg flex items-center justify-between w-full backdrop-blur-md">
                                    <div>
                                        <Typography variant="caption" className="block text-yellow-200 font-bold uppercase text-[9px] tracking-wider mb-0.5">You are here</Typography>
                                        <Typography variant="subtitle2" className="font-bold text-white leading-none">Token {yourToken}</Typography>
                                    </div>
                                    <i className="tabler-map-pin-filled text-yellow-400 text-xl" />
                                </div>
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