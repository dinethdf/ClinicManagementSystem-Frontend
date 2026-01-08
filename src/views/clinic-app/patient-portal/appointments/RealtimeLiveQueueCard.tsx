'use client'

import { useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'

// Hook Import
import { useRealtimeSchedule } from '@/hooks/useRealtimeSchedule'

interface Props {
  clinicId: number
  scheduleId: number
  yourToken: number
}

const RealtimeLiveQueueCard = ({ clinicId, scheduleId, yourToken }: Props) => {
  
  const { schedule, loading, error } = useRealtimeSchedule(clinicId, scheduleId)

  // Memoize Appointments for O(1) Lookup
  const appointmentsLookup = useMemo(() => {
    if (!schedule || !schedule.appointments) return {}

    const list = Array.isArray(schedule.appointments) 
        ? schedule.appointments 
        : Object.values(schedule.appointments)

    return list.reduce((acc: any, appt: any) => {
        if (appt && appt.queueNo) {
            acc[appt.queueNo] = appt
        }
        return acc
    }, {})
  }, [schedule])

  if (loading) return (
    <Card className='mb-4 rounded-xl shadow-sm'>
       <CardContent className="p-4">
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="rectangular" height={100} className='mt-3 rounded-lg' />
       </CardContent>
    </Card>
  )

  if (error || !schedule) return null;

  const currentToken = schedule.currentServing || 0
  const isStarted = schedule.scheduleStatus === 'STARTED'
  const isFinished = schedule.scheduleStatus === 'FINISHED'
  const peopleAhead = yourToken - currentToken

  // Render Queue Stream
  const renderQueueVisualizer = () => {
    const items = [];
    // const visibleStart = Math.max(1, currentToken - 1);
    const visibleStart = currentToken
    const visibleEnd = Math.min(currentToken + 3, 9999);

    for (let i = visibleStart; i <= visibleEnd; i++) {
        items.push(i);
    }

    if (yourToken > visibleEnd + 1) {
        items.push('DOTS');
        items.push(yourToken);
    } else if (yourToken > visibleEnd) {
        items.push(yourToken);
    }

    const uniqueItems = Array.from(new Set(items));

    return (
        // ADJUSTED: Reduced gap to 'gap-2' and padding to 'py-2' for tighter fit
        <div className='flex gap-2 items-center justify-center overflow-x-auto no-scrollbar py-2 px-2 w-full'>
            {uniqueItems.map((item, index) => {
                if (item === 'DOTS') {
                    return (
                        <div key="dots" className="flex items-center justify-center w-6 h-6 opacity-40 shrink-0">
                            <span className="text-white text-lg leading-none mt-[-4px]">...</span>
                        </div>
                    );
                }

                const tokenNum = item as number;
                const apptData = appointmentsLookup[tokenNum] || {};
                const isYou = tokenNum === yourToken;
                const isCurrent = tokenNum === currentToken;
                const status = apptData.status;

                // Base Styles
                let bgClass = "bg-white/10 text-white/80"; 
                let borderClass = "border border-white/5";
                let sizeClass = "w-9 h-9 text-sm"; // Slightly smaller base size
                let extraStyles = "";

                // --- STATUS COLORS ---
                if (status === 'COMPLETED') {
                    bgClass = "bg-[#37ee27] text-[#1c1a2c]";
                    borderClass = "border border-emerald-500/30";
                } else if (status === 'CANCELLED') {
                    bgClass = "bg-red-500/20 text-red-100";
                    borderClass = "border border-red-500/30";
                    extraStyles = "line-through decoration-red-400/50 decoration-2 opacity-70";
                } else if (status === 'ONGOING' || isCurrent) {
                    // Current Serving
                    bgClass = "bg-white text-[#5b4fe1]";
                    borderClass = "border-0 shadow-lg shadow-indigo-500/30";
                    sizeClass = "w-10 h-10 text-xl font-bold";
                    extraStyles = "scale-105 z-10";
                }

                // Highlight You
                if (isYou) {
                    bgClass = "bg-yellow-400 text-yellow-900";
                    borderClass = "border-4 border-yellow-200/50 shadow-md";
                    if (!isCurrent) {
                        sizeClass = "w-10 h-10 text-base font-bold";
                        extraStyles = "z-10";
                    }
                }

                const tooltipText = isYou ? "You" : 
                                    isCurrent ? "Serving Now" : 
                                    status ? `Token ${tokenNum} (${status})` : `Token ${tokenNum}`;

                return (
                    <Tooltip key={tokenNum} title={tooltipText} arrow placement="top">
                        <div className={`
                            flex items-center justify-center rounded-full transition-all duration-300 shrink-0 cursor-default
                            ${sizeClass} ${bgClass} ${borderClass} ${extraStyles}
                        `}>
                            {tokenNum}
                        </div>
                    </Tooltip>
                )
            })}
        </div>
    )
  }

  return (
    <Card 
        className='mb-6 relative overflow-hidden shadow-xl border-none rounded-2xl text-white'
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }} 
    >
      
      <div className='absolute -right-10 -top-10 opacity-10 rotate-12 pointer-events-none'>
        <i className='tabler-broadcast text-[200px]' />
      </div>

      <CardContent className='relative z-10 p-5'>
        
        {/* --- HEADER --- */}
        <div className='flex justify-between items-start mb-6'>
            <div className="flex gap-3 items-center">
                 <Avatar className="w-10 h-10 bg-white/20 text-white backdrop-blur-md">
                    <i className="tabler-stethoscope text-xl" />
                 </Avatar>
                 <div>
                    <Typography variant='h6' fontWeight={700} className='leading-tight text-white'>
                        {schedule.doctorName}
                    </Typography>
                    <Typography variant='caption' className='text-white/70 block'>
                        {schedule.specialization}
                    </Typography>
                </div>
            </div>
            
            <div className='text-right'>
                <Chip 
                    label="Live Queue" 
                    size='small' 
                    className='bg-white text-[#5b4fe1] font-bold shadow-sm h-6'
                />
                {schedule.startedAt && (
                    <div className='flex items-center justify-end gap-1 mt-1 opacity-70 text-[10px] font-bold uppercase'>
                        <i className='tabler-clock text-[10px]' />
                        <span>Started: {schedule.startedAt}</span>
                    </div>
                )}
            </div>
        </div>

        {/* --- MAIN STATS ROW --- */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch mb-5">
            
            {/* 1. NOW SERVING */}
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 relative overflow-hidden flex flex-col justify-center items-center min-h-[90px]">
                 <div className="w-full flex justify-between items-start px-1 mb-1">
                    <Typography variant='caption' className='text-white/60 text-[10px] font-bold uppercase tracking-wider'>
                        Now Serving
                    </Typography>
                    {isStarted && (
                       <span className="flex h-2.5 w-2.5">
                         <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                       </span>
                    )}
                 </div>
                 
                 <Typography variant='h2' fontWeight={800} className='text-5xl relative z-10'>
                    {schedule.currentServing}
                 </Typography>
            </div>

            {/* 2. PROGRESS */}
            <div className="flex flex-col justify-center items-center px-2 flex-grow-0 min-w-[120px]">
                 <div className="bg-[#4f46e5]/40 border border-white/10 rounded-full px-3 py-0.5 mb-2 backdrop-blur-md">
                     <Typography variant='caption' fontWeight={700} className='text-[10px] uppercase text-white'>
                        {peopleAhead > 0 ? `${peopleAhead} Ahead` : peopleAhead === 0 ? 'Your Turn' : 'Passed'}
                     </Typography>
                 </div>
                 
                 <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden relative min-w-[100px]">
                      <div 
                        className="h-full bg-white absolute top-0 left-0 transition-all duration-1000"
                        style={{ width: `${peopleAhead <= 0 ? 100 : 50}%` }} 
                      ></div>
                 </div>
                 <i className='tabler-arrow-right text-white/50 text-lg mt-1' />
            </div>

            {/* 3. YOUR TOKEN */}
            <div className="flex-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 relative flex flex-col justify-center items-center min-h-[90px]">
                 <div className="w-full text-right mb-1">
                    <Typography variant='caption' className='text-yellow-300/80 text-[10px] font-bold uppercase tracking-wider'>
                        Your Token
                    </Typography>
                 </div>
                 
                 <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full border-4 border-yellow-400/30 bg-yellow-500/10">
                     <Typography variant='h3' fontWeight={800} className='text-3xl text-white'>
                        {yourToken}
                     </Typography>
                 </div>
            </div>
        </div>

        {/* --- ALERT --- */}
        {peopleAhead <= 2 && peopleAhead >= 0 && isStarted && (
             <Alert 
                icon={false}
                className='mb-4 bg-white text-[#1e1b4b] font-bold py-0 px-3 justify-center shadow-lg border-l-4 border-yellow-500'
                sx={{ '& .MuiAlert-message': { padding: '4px 0', fontSize: '0.85rem' } }}
             >
                <div className="flex items-center gap-2">
                    {peopleAhead === 0 && <><i className='tabler-door-enter text-green-600 text-lg'/> <span>It's your turn. Please enter.</span></>}
                    {peopleAhead === 1 && <><i className='tabler-bell-ringing text-orange-600 text-lg'/> <span>You are next! Get ready.</span></>}
                    {peopleAhead === 2 && <><i className='tabler-info-circle text-blue-600 text-lg'/> <span>Almost there. Prepare yourself.</span></>}
                </div>
             </Alert>
        )}

        {/* --- QUEUE STREAM --- */}
        <div className='bg-black/20 rounded-xl border border-white/5 overflow-hidden'>
            <div className='flex justify-between items-center px-3 py-1.5 border-b border-white/5'>
                <Typography variant='caption' className='text-white/50 text-[10px] font-bold uppercase tracking-widest'>
                    Queue Stream
                </Typography>
                <Typography variant='caption' className='text-white/50 text-[10px] font-medium'>
                    {schedule.time}
                </Typography>
            </div>
            
            {renderQueueVisualizer()}
        </div>

      </CardContent>
    </Card>
  )
}

export default RealtimeLiveQueueCard