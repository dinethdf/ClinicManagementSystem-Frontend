'use client'

import { useState, useEffect, useCallback } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { Chip } from '@mui/material'

import type { PublicScheduleDTO, SpecializationDTO } from '@/types/public-booking.types'

import { getPublicSchedulesList } from '@/services/doctor/doctor.shedule.server.service'


interface Props {
  onSelectSchedule: (schedule: PublicScheduleDTO) => void;
}

const ScheduleSelection = ({ onSelectSchedule }: Props) => {


  const [schedules, setSchedules] = useState<PublicScheduleDTO[]>([])
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState<number>(1) 
  const [totalPages, setTotalPages] = useState<number>(1)


  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSpec, setSelectedSpec] = useState<string>('') // Empty string = all
  // const [selectedDoc, setSelectedDoc] = useState<string>('')   // Empty string = all


const specializations: SpecializationDTO[] = [
  { id: 1, name: 'General Practitioner' },
  { id: 2, name: 'Dermatologist' },
  { id: 3, name: 'Orthopedic Surgeon' },
  { id: 4, name: 'Cardiologist' },
  { id: 5, name: 'Endocrinologist' },
  { id: 6, name: 'Nephrologist' },
  { id: 7, name: 'Neurologist' },
  { id: 8, name: 'Surgeon' },
  { id: 9, name: 'Ophthalmologist' },
  { id: 10, name: 'Dental Surgeon' }
];

  const fetchSchedules = useCallback(async () => {
  
    setLoading(true)
  
    try {

      const response = await getPublicSchedulesList({
        page: page - 1, 
        size: 8, // Cards per page
        date: selectedDate || undefined, 
        specialization: selectedSpec || undefined, 

        // doctorName: selectedDoc || undefined
      })


      if (response && response.content) {
         setSchedules(response.content)
         setTotalPages(response.totalPages)
      } else if (Array.isArray(response)) {
         // Fallback if backend just returns a list (no pagination metadata)
         setSchedules(response)
      }
      
    } catch (error) {
      console.error("Failed to load schedules", error)
    } finally {
      setLoading(false)
    }
  }, [page, selectedDate, selectedSpec])

  // --- Effects ---
  
  // Initial Load & Page Change
  useEffect(() => {
    fetchSchedules()
  }, [page]) // Only trigger when Page changes. Filters wait for "Find" button.

  // --- Handlers ---

  const handleSearch = () => {
    setPage(1) // Reset to first page when filtering
    fetchSchedules()
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  return (
    <div className='flex flex-col gap-6'>
      
      {/* 1. Filter Section */}
      <Card>
        <CardContent>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                <Grid size={{ xs: 12, md: 3 }}>
                     <TextField 
                        type='date' 
                        fullWidth 
                        label="Date" 
                        InputLabelProps={{ shrink: true }} 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                     <TextField 
                        select 
                        fullWidth 
                        label="Specialization" 
                        value={selectedSpec} 
                        onChange={(e) => setSelectedSpec(e.target.value)}
                      >
                        <MenuItem value="">All Specializations</MenuItem>
                        {specializations.map(s => <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>)}
                     </TextField>
                </Grid>
                {/* <Grid size={{ xs: 12, md: 3 }}>
                    <TextField 
                      select 
                      fullWidth 
                      label="Doctor" 
                      value={selectedDoc} 
                      disabled
                      onChange={(e) => setSelectedDoc(e.target.value)}
                    >
                        <MenuItem value="">All Doctors</MenuItem>
                        {doctors.map(d => <MenuItem key={d.id} value={d.name}>{d.name}</MenuItem>)}
                     </TextField>
                </Grid> */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Button 
                      variant='contained' 
                      fullWidth 
                      onClick={handleSearch}
                      disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Find Schedules'}
                    </Button>
                </Grid>
            </Grid>
        </CardContent>
      </Card>

      {/* 2. Results Grid */}
      {loading ? (
        <Box className="flex justify-center p-10">
            <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={6}>
            {schedules.length > 0 ? (
              schedules.map((item) => {
                    // 1. Calculate Available Slots
                    const availableSlots = item.maxPatientCount - item.registeredPatientCount;
                    const isFullyBooked = availableSlots <= 0;

                    return (
                        <Grid key={item.id} size={{ xs: 12, md: 4, lg: 3 }}>
                        <Card 
                            className={`border transition-all h-full ${
                                isFullyBooked 
                                ? 'opacity-70 border-gray-200' // Dim card if full
                                : 'border-transparent hover:border-primary cursor-pointer'
                            }`} 
                            onClick={() => !isFullyBooked && onSelectSchedule(item)}
                        >
                            <CardContent className='flex flex-col gap-3 items-center text-center p-6'>
                            
                            {/* Doctor Avatar */}
                            <div className='w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2'>
                                <span className="text-2xl font-bold">
                                    {item.doctorName.split(' ')[1]?.[0] || item.doctorName[0]}
                                </span>
                            </div>

                            <div>
                                <Typography variant='h6'>{item.doctorName}</Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    {item.specialization}
                                </Typography>
                            </div>

                            {/* Time & Date Box */}
                            <div className='flex flex-col gap-1 w-full bg-actionHover p-2 rounded'>
                                <div className='flex items-center justify-center gap-2'>
                                <Typography className='font-medium'>{item.scheduleDate}</Typography>
                                </div>
                                <Typography variant='caption'>
                                    {`${item.startTime.substring(0, 5)} - ${item.endTime.substring(0, 5)}`}
                                </Typography>
                            </div>

                            {/* --- NEW: Availability Section --- */}
                            <div className='flex justify-between w-full px-2 items-center bg-gray-50 p-1 rounded'>
                                <Typography variant='body2' color="text.secondary">Availability:</Typography>
                                
                                {isFullyBooked ? (
                                    <Chip label="FULL" color="error" size="small" className="font-bold" />
                                ) : (
                                    <Chip 
                                        label={`${availableSlots} Left`} 
                                        color={availableSlots < 5 ? "warning" : "success"} // Orange if low, Green if plenty
                                        size="small" 
                                        variant="outlined"
                                    />
                                )}
                            </div>

                            {/* Fee Section */}
                            <div className='flex justify-between w-full px-2 mt-auto'>
                                <Typography variant='body2'>Total Fee:</Typography>
                                <Typography variant='subtitle1' color='primary'>
                                LKR {(item.doctorFee + item.clinicFee).toFixed(0)}
                                </Typography>
                            </div>

                            {/* Book Button (Disabled if full) */}
                            <Button 
                                variant='contained' 
                                fullWidth 
                                size='small' 
                                className='mt-2'
                                disabled={isFullyBooked}
                                color={isFullyBooked ? 'inherit' : 'primary'}
                            >
                                {isFullyBooked ? 'Sold Out' : 'Book Now'}
                            </Button>

                            </CardContent>
                        </Card>
                        </Grid>
                    );
                    })
            ) : (
              <Grid size={{ xs: 12 }}>
                <Typography align="center" color="text.secondary">No schedules found matching your criteria.</Typography>
              </Grid>
            )}
          </Grid>

          {/* 3. Pagination Control */}
          <div className='flex justify-center mt-4'>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              showFirstButton 
              showLastButton
            />
          </div>
        </>
      )}
    </div>
  )
}

export default ScheduleSelection
