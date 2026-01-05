'use client'

import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import { getLiveQueueStatus } from '@/services/patient-portal/patient.appointments.service'
import type { LiveQueueDTO } from '@/types/patient-portal/patient.appointments.types'

const LiveQueueCard = ({ appointmentId }: { appointmentId: number }) => {
  const [status, setStatus] = useState<LiveQueueDTO | null>(null)

  useEffect(() => {
    fetchStatus();
    // Auto-refresh every 10 seconds (Story 2.4)
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [appointmentId]);

  const fetchStatus = async () => {
    const data = await getLiveQueueStatus(appointmentId);
    setStatus(data);
  }

  if (!status) return null;

  // Calculate Progress %
  const progress = Math.min((status.currentToken / status.yourToken) * 100, 100);

  return (
    <Card className='bg-primary text-white mb-6 relative overflow-hidden shadow-lg'>
      {/* Background Icon Decoration */}
      <div className='absolute -right-5 -top-5 opacity-10'>
        <i className='tabler-broadcast text-[150px]' />
      </div>

      <CardContent>
        <div className='flex justify-between items-center mb-6 relative z-10'>
          <div className='flex items-center gap-3'>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <Typography variant='h6' fontWeight={700} color='white'>
              LIVE QUEUE
            </Typography>
          </div>
          <Chip 
            label={`Est. Time: ${status.estimatedTime}`} 
            size='small' 
            sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold' }} 
          />
        </div>

        <div className='flex justify-between items-end mb-4 relative z-10'>
          <div className='text-center'>
            <Typography variant='caption' className='opacity-80 uppercase font-bold tracking-wider'>Current Token</Typography>
            <Typography variant='h2' fontWeight={800} className='leading-none mt-1'>{status.currentToken}</Typography>
          </div>
          
          <div className='text-center pb-2'>
             <Typography variant='h6' className='opacity-60'>vs</Typography>
          </div>

          <div className='text-center'>
            <Typography variant='caption' className='opacity-80 uppercase font-bold tracking-wider'>Your Token</Typography>
            <Typography variant='h2' fontWeight={800} className='leading-none mt-1'>{status.yourToken}</Typography>
          </div>
        </div>

        <div className='mt-2 relative z-10'>
           <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} 
           />
           <div className='flex justify-between mt-2'>
                <Typography variant='caption' className='opacity-90 font-medium'>
                    {status.yourToken - status.currentToken} people ahead of you
                </Typography>
                <Typography variant='caption' className='opacity-90 font-medium'>
                    Doctor is in Room 1
                </Typography>
           </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LiveQueueCard