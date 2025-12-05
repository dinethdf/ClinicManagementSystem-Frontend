'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import { doctorSheduleService } from '@/services/doctor.shedule.service'
import type { DoctorScheduleDTO } from '@/types/doctor.types' 

type DialogBoxProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onSelectShedule: (shedule: DoctorScheduleDTO | null) => void
}

const specializations = [
  'General Practitioner', 'Dermatologist', 'Orthopedic Surgeon', 
  'Cardiologist', 'Endocrinologist', 'Nephrologist', 
  'Neurologist', 'Surgeon', 'Ophthalmologist', 'Dental Surgeon'
];

// Helper to format date
const getDateParts = (dateString: string) => {
    
  const date = new Date(dateString);
    
    return {
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        year: date.getFullYear()
    };
};

const DoctorSheduleSelect = ({ open, setOpen, onSelectShedule }: DialogBoxProps) => {
  
  // --- States ---
  const [schedules, setSchedules] = useState<DoctorScheduleDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<DoctorScheduleDTO | null>(null)

  // Pagination
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  // Filters
  const [filters, setFilters] = useState({
    date: '',
    specialization: '',
    doctorName: ''
  })

  // --- Actions ---

  const handleClose = () => {
    setOpen(false)
  }

  // The actual API call function
  const fetchSchedulesInternal = async (
    pageIndex: number, 
    currentFilters: typeof filters
  ) => {
   
    setLoading(true)
   
    try {
     
      const response = await doctorSheduleService.getUpcomingSchedules({
        page: pageIndex - 1, 
        size: 8,       
        date: currentFilters.date || undefined,
        specialization: currentFilters.specialization || undefined,
        doctorName: currentFilters.doctorName || undefined
      })

      if (response && response.content) {
      
        setSchedules(response.content)
        setTotalPages(response.totalPages)
      }
    } catch (error) {
      console.error("Failed to load schedules", error)
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }

  // --- Auto-Search Effect ---
  useEffect(() => {
    if (!open) return;

    // 1. Debounce Logic: Wait 500ms after user stops typing/changing filters
    const timeoutId = setTimeout(() => {
        
        // 2. Doctor Name Logic: 
        // If name is typed BUT length < 2, do NOT fetch (wait for more letters)
        // Unless it is empty (length 0), then fetch all.
        if (filters.doctorName.length > 0 && filters.doctorName.length < 2) {
            return; 
        }

        fetchSchedulesInternal(page, filters)

    }, 500); 

    // Cleanup function: clears the timer if user types again before 500ms
    return () => clearTimeout(timeoutId);

  }, [open, page, filters]) // Dependency on 'filters' triggers this whenever inputs change

  const handleReset = () => {

    setFilters({
        date: '',
        specialization: '',
        doctorName: ''
    })
    setPage(1)

  }

  const handleFilterChange = (field: string, value: string) => {
    setPage(1) // Always reset to page 1 when filtering
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleCardClick = (item: DoctorScheduleDTO, isFull: boolean) => {
    if (!isFull) {
      setSelectedSchedule(item)
    }
  }

  const handleConfirm = () => {
    if (selectedSchedule) {
      onSelectShedule(selectedSchedule)
      setOpen(false)
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth='lg' 
      scroll='paper'
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='bi bi-x-lg' style={{ fontSize: '1.2rem' }} />
      </DialogCloseButton>
      
      <DialogTitle variant='h4' className='text-center sm:pbs-8 sm:pbe-6'>
        Select Appointment Schedule
        <Typography variant="subtitle2" component="span" color="text.secondary" className='block mt-1'>
          Find an available slot and confirm your booking.
        </Typography>
      </DialogTitle>

      <DialogContent className='sm:pli-16'>
        
        {/* 1. FILTER BAR (Auto-Search) */}
        <Card variant='outlined' sx={{ mb: 6, mt: 1, p: 3, backgroundColor: 'var(--mui-palette-action-hover)' }}>
            <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField 
                        fullWidth 
                        label="Doctor Name" 
                        placeholder='Type 2+ letters...' 
                        value={filters.doctorName}
                        onChange={(e) => handleFilterChange('doctorName', e.target.value)}
                        size="small"
                        sx={{ backgroundColor: 'background.paper' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <i className="bi bi-search" />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField 
                        select 
                        fullWidth 
                        label="Specialization" 
                        value={filters.specialization} 
                        onChange={(e) => handleFilterChange('specialization', e.target.value)}
                        size="small"
                        sx={{ backgroundColor: 'background.paper' }}
                    >
                        <MenuItem value="">All Specializations</MenuItem>
                        {specializations.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField 
                        type='date' 
                        fullWidth 
                        label="Date" 
                        InputLabelProps={{ shrink: true }} 
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        size="small"
                        sx={{ backgroundColor: 'background.paper' }}
                    />
                </Grid>
                {/* Reset Button (Icon Only or Small Text) */}
                <Grid size={{ xs: 12, md: 2 }} className="flex justify-end">
                    <Tooltip title="Clear all filters">
                        <Button 
                            variant='outlined' 
                            color='secondary'
                            onClick={handleReset}
                            fullWidth
                            startIcon={<i className="bi bi-eraser"/>}
                        >
                            Clear
                        </Button>
                    </Tooltip>
                </Grid>
            </Grid>
        </Card>

        {/* 2. SCHEDULE GRID */}
        {loading ? (
             <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                <CircularProgress />
             </Box>
        ) : (
             <Grid container spacing={4}>
                {schedules.length > 0 ? (
                    schedules.map((item) => {
                        const availableSlots = item.maxPatientCount - item.registeredPatientCount;
                        const isFullyBooked = availableSlots <= 0;
                        const isSelected = selectedSchedule?.id === item.id;
                        const dateParts = getDateParts(item.scheduleDate);

                        return (
                            <Grid key={item.id} size={{ xs: 12, md: 6, lg: 4 }}>
                                <Card 
                                    elevation={isSelected ? 6 : 2}
                                    onClick={() => handleCardClick(item, isFullyBooked)}
                                    sx={{ 
                                        position: 'relative',
                                        cursor: isFullyBooked ? 'default' : 'pointer',
                                        transition: 'all 0.2s',
                                        border: isSelected ? '2px solid var(--mui-palette-primary-main)' : '1px solid transparent',
                                        opacity: isFullyBooked ? 0.7 : 1,
                                        overflow: 'visible',
                                        '&:hover': {
                                            transform: isFullyBooked ? 'none' : 'translateY(-3px)',
                                            boxShadow: 4
                                        }
                                    }}
                                >
                                    {/* Selected Checkmark */}
                                    {isSelected && (
                                        <Box sx={{
                                            position: 'absolute', top: -10, right: -10, zIndex: 10,
                                            backgroundColor: 'primary.main', color: 'white', borderRadius: '50%',
                                            width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: 3
                                        }}>
                                            <i className="bi bi-check-lg" style={{fontSize: '1.2rem'}}></i>
                                        </Box>
                                    )}

                                    <Box className="flex h-full">
                                        {/* Left: Date Column (White Text on Primary BG) */}
                                        <Box sx={{ 
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                            width: '85px', 
                                            bgcolor: 'var(--mui-palette-primary-main)', 
                                            color: '#ffffff', 
                                            p: 1,
                                            borderTopLeftRadius: 'var(--mui-shape-borderRadius)',
                                            borderBottomLeftRadius: 'var(--mui-shape-borderRadius)'
                                        }}>
                                            <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.9, letterSpacing: 1, fontWeight: 500 }}>
                                                {dateParts.month}
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#ffffff' }}>
                                                {dateParts.day}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.9 }}>
                                                {dateParts.year}
                                            </Typography>
                                        </Box>

                                        {/* Right: Info Column */}
                                        <Box className="flex-1 p-4 flex flex-col gap-2">
                                            {/* Doctor Info */}
                                            <Box className="flex gap-3 items-center">
                                                <Avatar sx={{ width: 40, height: 40, bgcolor: 'action.hover', color: 'primary.main', fontSize: '1rem' }}>
                                                    {item?.doctorName?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    {/* FIX: Doctor Name is now Black (text.primary) and Bolder */}
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ 
                                                            fontWeight: 600, 
                                                            fontSize: '1rem', 
                                                            lineHeight: 1.2,
                                                            color: 'text.primary' // Ensures black/dark color
                                                        }}
                                                    >
                                                        {item.doctorName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.specialization}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            
                                            <Divider sx={{ my: 0.5 }} />

                                            {/* Time & Fees */}
                                            <Box className="flex justify-between items-center">
                                                <Box className="flex items-center gap-2 text-gray-600">
                                                    <i className="bi bi-clock" />
                                                    <Typography variant="body2" fontSize={'0.9rem'} fontWeight={500}>
                                                        {item.startTime.substring(0,5)} - {item.endTime.substring(0,5)}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box className="flex justify-between items-end mt-1">
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Total Fee</Typography>
                                                    <Typography variant="subtitle1" color="primary.main" fontWeight={700}>
                                                        Rs. {(item.doctorFee + item.clinicFee).toLocaleString()}
                                                    </Typography>
                                                </Box>

                                                {/* Availability Pill */}
                                                <Chip 
                                                    label={isFullyBooked ? "SOLD OUT" : `${availableSlots} Left`} 
                                                    color={isFullyBooked ? "error" : availableSlots < 5 ? "warning" : "success"}
                                                    size="small" 
                                                    sx={{ fontWeight: 'bold', height: 24 }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        )
                    })
                ) : (
                    <Grid size={12}>
                        <Box sx={{ p: 6, textAlign: 'center', color: 'text.secondary', bgcolor: 'background.paper', borderRadius: 1 }}>
                            <i className="bi bi-calendar-x" style={{ fontSize: '3rem', opacity: 0.5 }} />
                            <Typography variant="h6" sx={{ mt: 2 }}>No schedules found</Typography>
                            <Typography variant="body2">Try removing filters or selecting a different date.</Typography>
                        </Box>
                    </Grid>
                )}
             </Grid>
        )}

        {/* 3. PAGINATION */}
        {!loading && schedules.length > 0 && (
             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={(_, v) => setPage(v)} 
                    color="primary" 
                    shape="rounded"
                />
             </Box>
        )}

      </DialogContent>
      
      <DialogActions className='sm:pbe-8 sm:pli-16 flex justify-center gap-4 border-t pt-4'>
        <Button variant='tonal' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Button 
            variant='contained' 
            onClick={handleConfirm}
            disabled={!selectedSchedule}
            endIcon={<i className="bi bi-arrow-right"/>}
        >
          Confirm Schedule
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DoctorSheduleSelect
