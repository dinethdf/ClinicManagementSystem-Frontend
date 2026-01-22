'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton' // Optional: Good for loading state

// Service & Types
import { doctorSheduleService } from '@/services/doctor.shedule.service' 
import type { DoctorScheduleDTO } from '@/types/doctor.types' 

const TodaySessionsSlider = ({ doctorId }: { doctorId: number }) => {
  const [todaySchedules, setTodaySchedules] = useState<DoctorScheduleDTO[]>([])
  const [loading, setLoading] = useState(true)
  
  // New state to track which button is currently processing
  const [startingSessionId, setStartingSessionId] = useState<number | null>(null)
  
  const router = useRouter() // Initialize router

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const allUpcoming = await doctorSheduleService.getDoctorSchedulesByDoctor(doctorId)
        
        const today = new Date().toLocaleDateString('en-CA')
        const todays = allUpcoming
          .filter(s => s.scheduleDate === today)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
        
        setTodaySchedules(todays)
      } catch (error) {
        console.error("Failed to load today's sessions", error)
      } finally {
        setLoading(false)
      }
    }

    if (doctorId) {
      fetchSchedules()
    }
  }, [doctorId])

  // Helper to calculate duration from "HH:mm:ss"
  const getDurationString = (start: string, end: string) => {
    try {
        const startDate = new Date(`1970-01-01T${start}`)
        const endDate = new Date(`1970-01-01T${end}`)
        const diffMs = endDate.getTime() - startDate.getTime()
        const diffMins = Math.round(diffMs / 60000)

        if (diffMins >= 60) {
            const hours = Math.floor(diffMins / 60)
            const mins = diffMins % 60
            return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
        }
        return `${diffMins} mins`
    } catch (e) {
        return '--'
    }
  }

  // --- NEW: Handle Enter Room Click ---
  const handleEnterRoom = async (schedule: DoctorScheduleDTO) => {
    // Prevent multiple clicks
    if (startingSessionId) return;

    setStartingSessionId(schedule.id || 0);

    try {
        // 1. Call the API to start the session
        // Note: Assuming `clinicId` is present in your DoctorScheduleDTO. 
        // If it's not, you might need to fetch it or pass it in props.
        await doctorSheduleService.startQueueSession( schedule.id || 0);

        // 2. On success, navigate to the consultation page
      
    } catch (error) {
        console.error("Failed to start session FireBase ", error);
        setStartingSessionId(null);

    }

      router.push(`/doctor/consultation/${schedule.id}`);
  };

  if (loading) {
    return (
      <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Scenario 1: No Sessions
  if (todaySchedules.length === 0) {
    return (
      <Card className='bg-primary/5 border-dashed border-primary border h-[180px] flex items-center justify-center'>
        <CardContent className='flex flex-col items-center justify-center text-center'>
           <Avatar variant='rounded' className='bg-white text-primary mb-2'>
              <i className='tabler-mug text-2xl' />
           </Avatar>
           <Typography variant='h6' color="text.secondary">No Sessions Today</Typography>
        </CardContent>
      </Card>
    )
  }

  // Scenario 2: Horizontal Slider
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between px-1'>
        <Typography variant='h6' className='font-bold flex items-center gap-2'>
            <i className='tabler-timeline text-primary'/> Today's Timeline
        </Typography>
        <Typography variant='caption' className='bg-gray-100 px-2 py-1 rounded text-gray-500 font-medium'>
            {todaySchedules.length} Sessions
        </Typography>
      </div>

      <div className='flex flex-nowrap gap-5 overflow-x-auto py-6 px-2 snap-x snap-mandatory scroll-smooth custom-scrollbar'>
        {todaySchedules.map((schedule, index) => (
            <div key={schedule.id} className='min-w-[280px] max-w-[280px] snap-center'>
                <Card className='relative overflow-visible border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl'>
                    
                    {/* Badge */}
                    <div className='absolute -top-3 -left-3 z-20'>
                        <div className='bg-primary text-white font-bold w-8 h-8 flex items-center justify-center rounded-lg shadow-lg border-2 border-white'>
                            {index + 1}
                        </div>
                    </div>

                    <CardContent className='flex flex-col gap-4 p-5 pt-6'>
                        
                        {/* Time & Status */}
                        <div className='flex justify-between items-start'>
                            <div>
                                <Typography variant='h4' color='primary' className='font-black tracking-tight'>
                                    {schedule.startTime.substring(0, 5)}
                                </Typography>
                                <Typography variant='caption' className='text-gray-400 font-medium ml-1'>
                                    to {schedule.endTime.substring(0, 5)}
                                </Typography>
                            </div>
                            <Chip 
                                label={schedule.status} 
                                size='small' 
                                color={schedule.status === 'ACTIVE' ? 'success' : 'default'}
                                className='font-bold h-6'
                            />
                        </div>

                        {/* REPLACED ROOM WITH DURATION */}
                        <div className='bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between gap-2'>
                             
                             {/* Patient Count */}
                             <div className='flex flex-col items-center w-1/2'>
                                <span className='text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1'>Patients</span>
                                <div className='flex items-baseline gap-1'>
                                    <i className='tabler-users text-gray-400 text-xs' />
                                    <Typography variant='h6' className='font-bold leading-none'>
                                        {schedule.registeredPatientCount}
                                        <span className='text-gray-300 text-sm font-normal'>/{schedule.maxPatientCount}</span>
                                    </Typography>
                                </div>
                             </div>

                             {/* Divider */}
                             <div className='h-8 w-px bg-gray-200'></div>

                             {/* DURATION (New Section) */}
                             <div className='flex flex-col items-center w-1/2'>
                                <span className='text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1'>Duration</span>
                                <div className='flex items-baseline gap-1'>
                                    <i className='tabler-clock text-gray-400 text-xs' />
                                    <Typography variant='h6' className='font-bold leading-none text-gray-700'>
                                        {getDurationString(schedule.startTime, schedule.endTime)}
                                    </Typography>
                                </div>
                             </div>
                        </div>

                        {/* ENTER ROOM BUTTON */}
                        <Button 
                            variant='contained' 
                            fullWidth 
                            disableElevation
                            onClick={() => handleEnterRoom(schedule)}
                            disabled={startingSessionId === schedule.id}
                            className='bg-primary hover:bg-primary-dark shadow-sm hover:shadow-md py-2 rounded-lg font-semibold relative'
                            endIcon={startingSessionId !== schedule.id && <i className='tabler-arrow-narrow-right' />}
                        >
                            {startingSessionId === schedule.id ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Enter Room"
                            )}
                        </Button>

                    </CardContent>
                </Card>
            </div>
        ))}
      </div>
    </div>
  )
}

export default TodaySessionsSlider