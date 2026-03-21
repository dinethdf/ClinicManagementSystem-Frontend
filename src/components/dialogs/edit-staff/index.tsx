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
import MenuItem from '@mui/material/MenuItem'

import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

// Service & Types
import { updateStaff, type ClinicStaffResponseDTO } from '@/services/staff/staff.server.service'

type EditStaffDetailsProps = {
  open: boolean
  setOpen: (open: boolean) => void
  staffData?: ClinicStaffResponseDTO
}

const EditStaffDetails = ({ open, setOpen, staffData }: EditStaffDetailsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ClinicStaffResponseDTO>({
    defaultValues: {
      gender: '', // 1. FIX: Set default value here to avoid undefined
      firstName: '',
      lastName: '',
      mobileNo: ''
    } as any
  })

  // Populate form
  useEffect(() => {
    if (open && staffData) {
      reset({
        ...staffData,
        gender: typeof staffData.gender === 'number' ? staffData.gender : undefined,
        dob: staffData.dob ? new Date(staffData.dob).toISOString().split('T')[0] : '',
      })
    }
  }, [open, staffData, reset])

  const handleClose = () => {
    setOpen(false)
    setErrorMessage(null)
  }

  const onSubmit = async (data: ClinicStaffResponseDTO) => {
    if (!staffData?.id) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const payload = {
         ...data,
         gender: Number(data.gender), // Ensure number format
         id: staffData.id
      }

      await updateStaff(String(staffData.id), payload)
      router.refresh()
      handleClose()
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update staff details')
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
        Edit Staff Information
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
                <Typography variant='h6' color='primary'>Personal Details</Typography>
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='nameWithInitials'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Name w/ Initials' />
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='designation'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Designation' />
                )}
              />
            </Grid>
            
            {/* 3. FIX: Updated Gender Logic & Added "Other" option */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='gender'
                control={control}
                render={({ field }) => (
                  <CustomTextField 
                    {...field} 
                    select 
                    fullWidth 
                    label='Gender'
                    // Ensure value is never undefined
                    value={field.value ?? ''}
                  >
                      <MenuItem value={1}>Male</MenuItem>
                      <MenuItem value={2}>Female</MenuItem>
                      <MenuItem value={3}>Other</MenuItem>
                  </CustomTextField>
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
                name='nic'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='NIC' />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }} className='mt-2'>
                <Typography variant='h6' color='primary'>Contact Details</Typography>
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='City' />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} select fullWidth label='Account Status'>
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="INACTIVE">Inactive</MenuItem>
                      <MenuItem value="SUSPENDED">Suspended</MenuItem>
                  </CustomTextField>
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

export default EditStaffDetails