'use client'

// React Imports
import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

// Type Imports
import type { DoctorScheduleDTO, UpdateScheduleDTO } from '@/types/doctor.types'

// Service Imports
import { doctorSheduleService } from '@/services/doctor/doctor.shedule.service'

type EditScheduleProps = {
  open: boolean
  setOpen: (open: boolean) => void
  scheduleData?: DoctorScheduleDTO
}

const EditScheduleDialog = ({ open, setOpen, scheduleData }: EditScheduleProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateScheduleDTO>({
    defaultValues: {}
  })

  // Populate form on open
  useEffect(() => {
    if (open && scheduleData) {
      reset({
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
        doctorFee: scheduleData.doctorFee,
        clinicFee: scheduleData.clinicFee,
        maxPatientCount: scheduleData.maxPatientCount
      })
    }
  }, [open, scheduleData, reset])

  const handleClose = () => {
    setOpen(false)
    setErrorMessage(null)
  }

  const onSubmit = async (data: UpdateScheduleDTO) => {
    if (!scheduleData?.id) return

    setIsLoading(true)
    setErrorMessage(null)

    // Ensure numbers are actually numbers before sending
    const payload: UpdateScheduleDTO = {
        startTime: data.startTime,
        endTime: data.endTime,
        doctorFee: Number(data.doctorFee),
        clinicFee: Number(data.clinicFee),
        maxPatientCount: Number(data.maxPatientCount)
    }

    try {
      await doctorSheduleService.updateSchedule(scheduleData.id, payload)
      router.refresh()
      handleClose()
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update schedule')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit Schedule Details
        <Typography component='span' className='flex flex-col text-center'>
          Update timing and fees for {scheduleData?.doctorName}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          {errorMessage && (
            <Grid size={{ xs: 12 }} className='mb-4'>
               <Alert severity='error'>{errorMessage}</Alert>
            </Grid>
          )}

          <Grid container spacing={5}>
            
            {/* --- 1. Timing --- */}
            <Grid size={{ xs: 12 }}>
                <Typography variant='h6' color='primary'>1. Schedule Timing</Typography>
                <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='startTime'
                control={control}
                rules={{ required: 'Start Time is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='time'
                    label='Start Time'
                    InputLabelProps={{ shrink: true }} // Keeps the label up for time inputs
                    error={!!errors.startTime}
                    helperText={errors.startTime?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='endTime'
                control={control}
                rules={{ required: 'End Time is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='time'
                    label='End Time'
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endTime}
                    helperText={errors.endTime?.message}
                  />
                )}
              />
            </Grid>

            {/* --- 2. Fees & Capacity --- */}
            <Grid size={{ xs: 12 }} className='mt-2'>
                <Typography variant='h6' color='primary'>2. Fees & Capacity</Typography>
                <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='doctorFee'
                control={control}
                rules={{ required: 'Doctor Fee is required', min: 0 }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Doctor Fee (LKR)'
                    error={!!errors.doctorFee}
                    helperText={errors.doctorFee?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='clinicFee'
                control={control}
                rules={{ required: 'Clinic Fee is required', min: 0 }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Clinic Fee (LKR)'
                    error={!!errors.clinicFee}
                    helperText={errors.clinicFee?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='maxPatientCount'
                control={control}
                rules={{ required: 'Capacity is required', min: 1 }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Max Patient Count'
                    error={!!errors.maxPatientCount}
                    helperText={errors.maxPatientCount?.message}
                  />
                )}
              />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit' disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
          <Button variant='tonal' color='secondary' type='button' onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditScheduleDialog
