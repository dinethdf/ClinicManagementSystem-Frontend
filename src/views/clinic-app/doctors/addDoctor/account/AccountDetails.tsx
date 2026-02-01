'use client'

// React Imports
import { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import dayjs from 'dayjs'

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
import CustomDatePicker from '@/components/custome/DatePickerTextField'
import BackDropFullScreen from '@/components/BackDropFullScreen'

// Logic Imports
import { getDoctorValidationSchema } from '@/schemas/doctorDetailsValidation' 
import { doctorService } from '@/services/doctor/doctor.service'

// Types (Define this in @/types/doctor.types.ts)
interface DoctorFormData {
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
  slmcNumber: string
  specializationId: string
  qualification: string
  experienceYears: string
  availabilityStatus: string
}

const initialData: DoctorFormData = {
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
  slmcNumber: '',
  specializationId: '',
  qualification: '',
  experienceYears: '',
  availabilityStatus: 'AVAILABLE'
}

const DoctorAccountDetails = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const validationSchema = useMemo(() => {
    return getDoctorValidationSchema()
  }, [])

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<DoctorFormData>({
    resolver: valibotResolver(validationSchema) as any,
    defaultValues: { ...initialData }
  })

  const handelFormSubmit = async (data: DoctorFormData) => {
    setIsLoading(true)

    // Format data for API (match the structure you provided)
    const apiPayload = {
      
      ...data,
      gender: parseInt(data.gender), 
      specialization: {
        id: data.specializationId
      },

      specializationId: undefined, 
      registrationDate: new Date().toISOString(), 
      isApproved: false,
      profileImg: null
    }

    try {
     
      // Ensure you have this service method created
      const response = await doctorService.createDoctor(apiPayload)


      router.replace(`/en/clinic/doctors/list`) 
      reset()
      
      toast.success(`Doctor registered successfully!`, {
        hideProgressBar: false,
        className: 'custom-toast',
      })

    } catch (error: any) {
      toast.error(error.message || 'Registration failed', {
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
        title={'Doctor Registration'}
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
                    placeholder='doctor@clinic.com'
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
                2. Professional Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='slmcNumber'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='SLMC Registration Number'
                    placeholder='SLMC-1234'
                    error={!!errors.slmcNumber}
                    helperText={errors.slmcNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='specializationId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Specialization'
                    error={!!errors.specializationId}
                    helperText={errors.specializationId?.message}
                  >
                    <MenuItem value=''>Select Specialization</MenuItem>
                    {/* You should ideally fetch these from an API */}
                    <MenuItem value='1'>General Physician</MenuItem>
                    <MenuItem value='2'>Dermatologist</MenuItem>
                    <MenuItem value='3'>Orthopedic Surgeon</MenuItem>
                    <MenuItem value='4'>Cardiologist</MenuItem>
                    <MenuItem value='5'>Pediatrician</MenuItem>
                    <MenuItem value='7'>Neurologist</MenuItem>
                    <MenuItem value='10'>Dental Surgeon</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='experienceYears'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Experience (Years)'
                    placeholder='5'
                    error={!!errors.experienceYears}
                    helperText={errors.experienceYears?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='availabilityStatus'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Availability Status'
                    error={!!errors.availabilityStatus}
                    helperText={errors.availabilityStatus?.message}
                  >
                    <MenuItem value='AVAILABLE'>Available</MenuItem>
                    <MenuItem value='UNAVAILABLE'>Unavailable</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='qualification'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label='Qualifications'
                    placeholder='MBBS, MD, etc.'
                    error={!!errors.qualification}
                    helperText={errors.qualification?.message}
                  />
                )}
              />
            </Grid>

            {/* --- Buttons --- */}
            <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap mt-4'>
              <Button variant='contained' type='submit'>
                Register Doctor
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

export default DoctorAccountDetails
