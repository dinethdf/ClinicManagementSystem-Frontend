'use client'

// React Imports
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'

// Form Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { valibotResolver } from '@hookform/resolvers/valibot'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import { CardHeader, Divider } from '@mui/material'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomDatePicker from '@/components/custome/DatePickerTextField' // Check your path
import BackDropFullScreen from '@/components/BackDropFullScreen'

// Logic Imports
import { getStaffValidationSchema } from '@/schemas/staffDetailsValidation'
import { staffService } from '@/services/staff.service' // Ensure this exists

interface StaffFormData {
  firstName: string
  lastName: string
  nameWithInitials: string
  gender: string
  nic: string
  dob: string | null
  address: string
  city: string
  district: string
  email: string
  mobileNo: string
  designation: string
  assignedRoleId: string
}

const initialData: StaffFormData = {
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
  assignedRoleId: '5' // Default to STAFF (5)
}

const StaffAccountDetails = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const validationSchema = useMemo(() => {
    return getStaffValidationSchema()
  }, [])

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<StaffFormData>({
    resolver: valibotResolver(validationSchema) as any,
    defaultValues: { ...initialData }
  })

  const handelFormSubmit = async (data: StaffFormData) => {
    setIsLoading(true)

    // Format data for API
    const apiPayload = {
      ...data,
      gender: parseInt(data.gender),
      assignedRoleId: parseInt(data.assignedRoleId), // Send as number
      joinDate: new Date().toISOString(),
      status: 'ACTIVE'
    }

    try {
      await staffService.createStaff(apiPayload)

      router.replace(`/en/clinic/staff/list`)
      reset()
      
      toast.success(`Staff registered successfully!`, {
        hideProgressBar: false,
        className: 'custom-toast',
      })

    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Registration failed', {
        autoClose: false,
        hideProgressBar: false,
        className: 'custom-toast'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title={'Staff Registration'}
        className='pb-2'
        titleTypographyProps={{ variant: 'h4' }}
      />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit(handelFormSubmit)}>
          <Grid container spacing={6}>
            
            {/* --- 1. Personal Info --- */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='body1' className='font-medium'>
                1. Personal Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='First Name'
                    placeholder='John'
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Last Name'
                    placeholder='Doe'
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='nameWithInitials'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Name with Initials'
                    placeholder='J. D. Doe'
                    error={!!errors.nameWithInitials}
                    helperText={errors.nameWithInitials?.message}
                  />
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
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
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
                        helperText: errors.dob?.message
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
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='NIC Number'
                    placeholder='853456789V'
                    error={!!errors.nic}
                    helperText={errors.nic?.message}
                  />
                )}
              />
            </Grid>

            {/* --- Address & Contact --- */}
            <Grid size={{ xs: 12 }}>
                <Divider className='my-2' />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Address'
                    placeholder='123 Main St'
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='City'
                    placeholder='Colombo'
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='district'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='District'
                    placeholder='Colombo'
                    error={!!errors.district}
                    helperText={errors.district?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Email'
                    placeholder='staff@clinic.com'
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='mobileNo'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Mobile Number'
                    placeholder='0771234567'
                    error={!!errors.mobileNo}
                    helperText={errors.mobileNo?.message}
                  />
                )}
              />
            </Grid>

            {/* --- 2. Professional Info --- */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='body1' className='font-medium mt-4'>
                2. Job Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='designation'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Designation'
                    placeholder='Nurse / Receptionist'
                    error={!!errors.designation}
                    helperText={errors.designation?.message}
                  />
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
                    error={!!errors.assignedRoleId}
                    helperText={errors.assignedRoleId?.message}
                  >
                    {/* Only showing allowed roles based on your prompt */}
                    <MenuItem value='5'>Staff</MenuItem>
                    <MenuItem value='2'>User</MenuItem>
                    {/* User(2), Doctor(3), Patient(4) excluded as requested */}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* --- Buttons --- */}
            <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap mt-4'>
              <Button variant='contained' type='submit'>
                Register Staff
              </Button>
              <Button variant='tonal' type='reset' color='secondary' onClick={() => reset()}>
                Reset
              </Button>
            </Grid>

          </Grid>
        </form>
      </CardContent>
      <BackDropFullScreen open={isLoading} />
    </Card>
  )
}

export default StaffAccountDetails