'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'

// Hook Import
import { useRealtimeSchedule } from '@/hooks/useRealtimeSchedule'

interface Props {
  clinicId: number
  scheduleId: number
  yourToken: number
}

const RealtimeLiveQueueCard = ({ clinicId, scheduleId, yourToken }: Props) => {
  
  // 1. Connect to Firebase
  const { schedule, loading, error } = useRealtimeSchedule(clinicId, scheduleId)

  // 2. Loading State
  if (loading) return (
    <Card className='mb-6'>
       <CardContent>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="rectangular" height={100} className='mt-4 rounded-lg' />
       </CardContent>
    </Card>
  )

  // 3. Error or No Data State
  if (error || !schedule) return null; 

  // 4. Status Logic
  const currentToken = schedule.currentServing || 0
  const isStarted = schedule.scheduleStatus === 'STARTED'
  const isFinished = schedule.scheduleStatus === 'FINISHED'
  
  // Calculate Progress
  const progress = !isStarted ? 0 : Math.min((currentToken / yourToken) * 100, 100)
  
  // People Ahead Calculation
  const peopleAhead = yourToken - currentToken

  // Dynamic Background Colors
  const getBgColor = () => {
      if (isFinished) return 'bg-gray-700'; 
      if (!isStarted) return 'bg-orange-500'; 
      if (peopleAhead === 0) return 'bg-green-600 animate-pulse'; 
      if (peopleAhead < 0) return 'bg-blue-800'; 
      return 'bg-primary'; 
  }

  return (
    <Card className={`${getBgColor()} text-white mb-6 relative overflow-hidden shadow-xl border-none transition-colors duration-500`}>
      
      {/* Background Icon Decoration */}
      <div className='absolute -right-5 -top-5 opacity-10'>
        <i className='tabler-broadcast text-[150px]' />
      </div>

      <CardContent>
        {/* Header Section */}
        <div className='flex justify-between items-center mb-6 relative z-10'>
          <div className='flex items-center gap-3'>
            {isStarted && peopleAhead > 0 && (
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            )}
            <Typography variant='h6' fontWeight={700} color='white' className='uppercase tracking-widest'>
              {isFinished ? 'SESSION ENDED' : !isStarted ? 'WAITING TO START' : 'LIVE QUEUE'}
            </Typography>
          </div>
          
          <Chip 
            icon={<i className='tabler-clock text-primary' />}
            label={schedule.time} 
            size='small' 
            sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold' }} 
          />
        </div>

        {/* Main Numbers Display */}
        <div className='flex justify-between items-end mb-4 relative z-10'>
          {/* Current Serving */}
          <div className='text-center'>
            <Typography variant='caption' className='opacity-80 uppercase font-bold tracking-wider'>
                Now Serving
            </Typography>
            <Typography variant='h1' fontWeight={800} className='leading-none mt-1 drop-shadow-md'>
                {schedule.currentServing}
            </Typography>
          </div>
          
          <div className='text-center pb-4 opacity-50'>
             <i className='tabler-chevrons-right text-4xl' />
          </div>

          {/* Your Token */}
          <div className='text-center'>
            <Typography variant='caption' className='opacity-80 uppercase font-bold tracking-wider'>
                Your Token
            </Typography>
            <Typography variant='h1' fontWeight={800} className='leading-none mt-1 drop-shadow-md'>
                {yourToken}
            </Typography>
          </div>
        </div>

        {/* Footer / Progress Section */}
        <div className='mt-4 relative z-10 bg-black/10 p-3 rounded-lg backdrop-blur-sm'>
           {isFinished ? (
               <Typography align='center' fontWeight={600}>
                   This session has ended.
               </Typography>
           ) : !isStarted ? (
               <Typography align='center' fontWeight={600}>
                   Doctor has not started yet.
               </Typography>
           ) : peopleAhead === 0 ? (
               <div className='text-center'>
                   <Typography variant='h5' fontWeight={800} className='uppercase animate-bounce'>
                       It's Your Turn!
                   </Typography>
                   <Typography variant='caption'>Please proceed to the room.</Typography>
               </div>
           ) : peopleAhead < 0 ? (
               <Typography align='center' fontWeight={600}>
                   Your number has passed. Please contact reception.
               </Typography>
           ) : (
               <>
                   <div className='flex justify-between text-xs mb-1 font-bold uppercase tracking-wide opacity-80'>
                       <span>Progress</span>
                       <span>{Math.round(progress)}%</span>
                   </div>
                   <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ 
                          height: 8, 
                          borderRadius: 5, 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          '& .MuiLinearProgress-bar': { bgcolor: 'white' } 
                      }} 
                   />
                   <div className='flex justify-center mt-3 gap-2 items-center'>
                        <i className='tabler-users' />
                        <Typography variant='body2' fontWeight={600}>
                            {peopleAhead} people ahead of you
                        </Typography>
                   </div>
               </>
           )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RealtimeLiveQueueCard