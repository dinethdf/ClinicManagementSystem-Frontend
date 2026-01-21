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

// Hook Import
import { useRealtimeSchedule } from '@/hooks/useRealtimeSchedule'

// Icons
const IconUser = () => <i className="tabler-user text-sm" />

interface Props {
  scheduleId: number
  yourToken: number
}

const RealtimeLiveQueueCard = ({ scheduleId, yourToken }: Props) => {
  
  const { schedule, loading, error } = useRealtimeSchedule(scheduleId)

  // --- 1. DATA LOGIC ---
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
          <Skeleton variant="text" width="60%" height={30} className='mb-4' />
          <div className="flex gap-4 items-center">
             <Skeleton variant="rectangular" height={80} className="w-24 rounded-xl" />
             <div className='flex-1'><Skeleton variant="text" /></div>
             <Skeleton variant="rectangular" height={80} className="w-24 rounded-xl" />
          </div>
       </CardContent>
    </Card>
  )

  if (error || !schedule) return null;

  const currentServing = schedule.currentServing || 0
  const isStarted = schedule.scheduleStatus === 'STARTED'
  const { peopleAhead, waitingList } = queueStats

  // Colors & Theme
  const isLive = schedule.scheduleStatus === 'STARTED';
  const statusLabel = isLive ? "Live Now" : schedule.scheduleStatus;
  
  // Calculate Progress Percentage: (Current / Yours) * 100
  // If Current > Yours (passed), max at 100%.
  const progressPercent = Math.min(100, Math.max(0, (currentServing / yourToken) * 100));

  return (
    <Fade in={true} timeout={500}>
        <Card 
            className='mb-6 relative overflow-hidden shadow-xl border-none rounded-2xl text-white'
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
        >
        
        {/* Background Decoration */}
        <div className='absolute -right-6 -top-6 opacity-10 rotate-12 pointer-events-none'>
            <i className='tabler-activity-heartbeat text-[180px]' />
        </div>

        <CardContent className='relative z-10 p-5'>
            
            {/* --- HEADER --- */}
            <div className='flex justify-between items-start mb-8'>
                <div className="flex gap-3 items-center">
                    <Avatar className="w-10 h-10 bg-white/20 text-white backdrop-blur-md shadow-sm">
                        <i className="tabler-stethoscope text-xl" />
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
                <Chip 
                    label={statusLabel}
                    size='small' 
                    className={`font-bold uppercase tracking-wide h-6 shadow-sm border-none ${isLive ? 'bg-green-400 text-green-900' : 'bg-white/20 text-white'}`}
                />
            </div>

            {/* --- NEW PROGRESS ROW --- */}
            <div className="flex items-center gap-4 mb-8">
                
                {/* 1. NOW SERVING (Left Anchor) */}
                <div className="flex flex-col items-center z-10">
                    <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md
                        ${isLive ? 'bg-white text-indigo-600' : 'bg-white/10 text-white'}
                    `}>
                        <Typography variant='h4' fontWeight={800}>{currentServing}</Typography>
                    </div>
                    <Typography variant='caption' className='mt-2 font-bold text-white/60 text-[10px] uppercase'>Serving</Typography>
                </div>

                {/* 2. MIDDLE PROGRESS BAR */}
                <div className="flex-1 flex flex-col justify-center relative">
                    
                    {/* Waiting Count Badge (Floating above bar) */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                        <div className="bg-black/20 backdrop-blur-md border border-white/10 px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                            <i className='tabler-users text-white text-xs' />
                            <Typography variant='caption' className='font-bold text-white text-[11px]'>
                                {peopleAhead} Waiting
                            </Typography>
                        </div>
                    </div>

                    {/* The Bar Track */}
                    <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden relative">
                        {/* The Fill */}
                        <div 
                            className="h-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)] relative transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        >
                            {/* Pulse effect at the tip of the bar */}
                            {isLive && (
                                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse"></div>
                            )}
                        </div>
                    </div>

                    {/* Status Text Below Bar */}
                    <div className="flex justify-between mt-1 px-1">
                        <Typography variant='caption' className='text-white/40 text-[9px]'>Start</Typography>
                        <Typography variant='caption' className='text-white/40 text-[9px]'>You</Typography>
                    </div>
                </div>

                {/* 3. YOUR TOKEN (Right Anchor) */}
                <div className="flex flex-col items-center z-10">
                    <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-yellow-900 flex items-center justify-center shadow-lg border-2 border-yellow-200">
                        <Typography variant='h4' fontWeight={800}>{yourToken}</Typography>
                    </div>
                    <Typography variant='caption' className='mt-2 font-bold text-yellow-300 text-[10px] uppercase'>You</Typography>
                </div>

            </div>

            {/* --- TIMELINE / QUEUE LIST (Collapsible) --- */}
            {peopleAhead > 0 && (
                <Box className='bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 p-4'>
                    <div className="relative pl-2">
                        {/* Dotted Line */}
                        <div className="absolute left-[29px] top-2 bottom-2 w-0.5 border-l-2 border-dashed border-white/20 -z-10"></div>

                        <div className="space-y-4">
                            {/* Current (Small Row) */}
                            <div className="flex items-center gap-3 opacity-60">
                                <div className="w-3 h-3 rounded-full bg-white shrink-0 ml-[15px]"></div>
                                <Typography variant="caption" className="text-white">Current: Token {currentServing}</Typography>
                            </div>

                            {/* The Waiting List Logic */}
                            {waitingList.length > 3 ? (
                                // COLLAPSED
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-white/40 shrink-0 ml-[17px]"></div>
                                    <div className="flex-1 bg-white/5 border border-white/10 border-dashed rounded-lg p-2 flex justify-between items-center text-white/80">
                                        <span className='text-xs font-bold flex items-center gap-1'>
                                            <i className="tabler-users text-sm" /> +{waitingList.length} Others
                                        </span>
                                        <span className="text-[10px] opacity-60">Tokens {waitingList[0].queueNo}-{waitingList[waitingList.length - 1].queueNo}</span>
                                    </div>
                                </div>
                            ) : (
                                // DETAILED
                                <div className="space-y-2">
                                    {waitingList.map((appt: any) => (
                                        <div key={appt.queueNo} className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0 ml-[18px]"></div>
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

                            {/* You (Small Row) */}
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-yellow-400 shrink-0 ml-[15px]"></div>
                                <Typography variant="caption" className="text-yellow-300 font-bold">You are next (Token {yourToken})</Typography>
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