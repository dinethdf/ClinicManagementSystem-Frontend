'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import dayjs from 'dayjs'

// Form Imports
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

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

// Custom Components
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import CustomDatePicker from '@/components/custome/DatePickerTextField'

// Services & Schemas
import { updateStaff, type ClinicStaffResponseDTO } from '@/services/staff/staff.server.service'
import { getStaffValidationSchema } from '@/schemas/staffDetailsValidation'
import { staffService, type RoleDTO } from '@/services/staff/staff.service'

type EditStaffDetailsProps = {
  open: boolean
  setOpen: (open: boolean) => void
  staffData?: ClinicStaffResponseDTO & { assignedRoleId?: string; address?: string; district?: string } // Extend DTO if backend is missing these
}

const EditStaffDetails = ({ open, setOpen, staffData }: EditStaffDetailsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [roles, setRoles] = useState<RoleDTO[]>([])

  // Validation Schema
  const validationSchema = useMemo(() => {
    return getStaffValidationSchema()
  }, [])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<any>({ // Use 'any' or define a specific EditFormData type
    resolver: valibotResolver(validationSchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      nameWithInitials: '',
      gender: '',
      nic: '',
      dob: null,
      address: '',
      city: '',
      district: '',
      email: '',
      mobileNo: '',
      designation: '',
      assignedRoleId: '',
      status: 'ACTIVE'
    }
  })

  // Fetch Roles on Mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await staffService.getStandardRoles();
        const staffRoles = fetchedRoles.filter(r => r.name !== 'DOCTOR' && r.name !== 'PATIENT');

        setRoles(staffRoles);
      } catch (error) {
        console.error('Failed to load system roles');
      }
    };

    fetchRoles();
  }, []);

  // Populate form when dialog opens
  useEffect(() => {
    if (open && staffData) {
      reset({
        ...staffData,
        gender: staffData.gender ? String(staffData.gender) : '', // Convert back to string for Select
        assignedRoleId: staffData.assignedRoleId ? String(staffData.assignedRoleId) : '',
        dob: staffData.dob ? new Date(staffData.dob).toISOString().split('T')[0] : null,
      })
    }
  }, [open, staffData, reset])

  const handleClose = () => {
    setOpen(false)
    setErrorMessage(null)
  }

  const onSubmit = async (data: any) => {
    if (!staffData?.id) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const payload = {
         ...data,
         gender: parseInt(data.gender), 
         assignedRoleId: parseInt(data.assignedRoleId),
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
            {/* --- 1. Personal Details --- */}
            <Grid size={{ xs: 12 }}>
                <Typography variant='h6' color='primary'>1. Personal Details</Typography>
                <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='First Name' error={!!errors.firstName} helperText={errors.firstName?.message as string} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Last Name' error={!!errors.lastName} helperText={errors.lastName?.message as string} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='nameWithInitials'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Name with Initials' error={!!errors.nameWithInitials} helperText={errors.nameWithInitials?.message as string} />
                )}
              />
            </Grid>
            
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
                    value={field.value ?? ''}
                    error={!!errors.gender}
                    helperText={errors.gender?.message as string}
                  >
                      <MenuItem value='1'>Male</MenuItem>
                      <MenuItem value='2'>Female</MenuItem>
                      <MenuItem value='3'>Other</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='dob'
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => field.onChange(newValue ? newValue.format('YYYY-MM-DD') : null)}
                    label='Date Of Birth'
                    format='YYYY-MM-DD'
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dob,
                        helperText: errors.dob?.message as string
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='nic'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='NIC' error={!!errors.nic} helperText={errors.nic?.message as string} />
                )}
              />
            </Grid>

            {/* --- 2. Contact Details --- */}
            <Grid size={{ xs: 12 }} className='mt-2'>
                <Typography variant='h6' color='primary'>2. Contact Details</Typography>
                <Divider />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Address' error={!!errors.address} helperText={errors.address?.message as string} />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='City' error={!!errors.city} helperText={errors.city?.message as string} />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='district'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='District' error={!!errors.district} helperText={errors.district?.message as string} />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='mobileNo'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Mobile No' error={!!errors.mobileNo} helperText={errors.mobileNo?.message as string} />
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Email' error={!!errors.email} helperText={errors.email?.message as string} />
                )}
              />
            </Grid>

            {/* --- 3. Job Information --- */}
            <Grid size={{ xs: 12 }} className='mt-2'>
                <Typography variant='h6' color='primary'>3. Job Information</Typography>
                <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='designation'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Designation' error={!!errors.designation} helperText={errors.designation?.message as string} />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='assignedRoleId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='System Role'
                    value={field.value ?? ''}
                    error={!!errors.assignedRoleId}
                    helperText={errors.assignedRoleId?.message as string}
                  >
                    {roles.map((role) => (
                       <MenuItem key={role.id} value={role.id.toString()}>
                          {role.name}
                       </MenuItem>
                    ))}
                    {roles.length === 0 && (
                        <MenuItem value='' disabled>Loading roles...</MenuItem>
                    )}
                  </CustomTextField>
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
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-6'>
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