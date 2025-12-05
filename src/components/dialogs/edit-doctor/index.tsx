
'use client'

// React Imports
import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'

import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

// Type Imports
import type { Doctor } from '@/types/doctor.types'

// Service Imports
import { doctorService } from '@/services/doctor.service' 

type EditDoctorDetailsProps = {
  open: boolean
  setOpen: (open: boolean) => void
  doctorData?: Doctor
}

const EditDoctorDetails = ({ open, setOpen, doctorData }: EditDoctorDetailsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Doctor>({
    defaultValues: {}
  })

  // Populate form
  useEffect(() => {
    if (open && doctorData) {
      reset({
        ...doctorData,
        dob: doctorData.dob ? new Date(doctorData.dob).toISOString().split('T')[0] : '',
        gender: doctorData.gender?.toString(), 
      } as any)
    }
  }, [open, doctorData, reset])

  const handleClose = () => {
    setOpen(false)
    setErrorMessage(null)
  }

  const onSubmit = async (data: Doctor) => {
    if (!doctorData?.id) return

    setIsLoading(true)
    setErrorMessage(null)

    const payload = {
        ...data,
        gender: Number(data.gender),
        experienceYears: Number(data.experienceYears),
        specializationId: Number(data.specialization) 
    }

    try {
      await doctorService.updateDoctor(String(doctorData.id), payload)
      router.refresh()
      handleClose()
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update doctor details')
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
        Edit Doctor Information
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          {errorMessage && (
            <Grid size={{ xs: 12 }} className='mb-4'>
               <Alert severity='error'>{errorMessage}</Alert>
            </Grid>
          )}

          <Grid container spacing={5}>

            <Grid size={{ xs: 12 }}>
                <Typography variant='h6' color='primary'>1. Personal Details</Typography>
                <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstName'
                control={control}
                rules={{ required: 'First Name is required' }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='First Name' error={!!errors.firstName} helperText={errors.firstName?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastName'
                control={control}
                rules={{ required: 'Last Name is required' }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Last Name' error={!!errors.lastName} helperText={errors.lastName?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='nameWithInitials'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Name w/ Initials' placeholder='K. Perera' />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='nic'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='NIC'/>
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='dob'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth type='date' label='Date of Birth' InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='gender'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} select fullWidth label='Gender'>
                     <MenuItem value="1">Male</MenuItem>
                     <MenuItem value="2">Female</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }} className='mt-2'>
                <Typography variant='h6' color='primary'>2. Professional Details</Typography>
                <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='slmcNumber'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='SLMC Number' placeholder='SLMC-XXXX' />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='experienceYears'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth type='number' label='Experience (Years)' />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='qualification'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth multiline rows={2} label='Qualifications' placeholder='MBBS, MD...' />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='availabilityStatus'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} select fullWidth label='Availability Status'>
                     <MenuItem value="AVAILABLE">Available</MenuItem>
                     <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                     <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }} className='mt-2'>
                <Typography variant='h6' color='primary'>3. Contact Details</Typography>
                <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='mobileNo'
                control={control}
                rules={{ required: 'Mobile is required' }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Mobile No' error={!!errors.mobileNo} helperText={errors.mobileNo?.message} />
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Email' />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Address' />
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

export default EditDoctorDetails
