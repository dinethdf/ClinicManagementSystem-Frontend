'use client'

// React Imports
import { useMemo, useState, useEffect } from 'react'
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
import CustomDatePicker from '@/components/custome/DatePickerTextField' 
import BackDropFullScreen from '@/components/BackDropFullScreen'

// Logic Imports
import { getStaffValidationSchema } from '@/schemas/staffDetailsValidation'
import { staffService, type RoleDTO } from '@/services/staff/staff.service' 

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
  assignedRoleId: '' // Start empty, will be set once roles load if needed
}

const StaffAccountDetails = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState<RoleDTO[]>([]) // State for dynamic roles

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

  // --- FETCH ROLES ON MOUNT ---
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await staffService.getStandardRoles();
        
        // Optional: Filter out DOCTOR and PATIENT, as this is a STAFF registration form
        const staffRoles = fetchedRoles.filter(r => r.name !== 'DOCTOR' && r.name !== 'PATIENT');
        
        setRoles(staffRoles);
      } catch (error) {
        toast.error('Failed to load system roles');
      }
    };

    fetchRoles();
  }, []);

  const handelFormSubmit = async (data: StaffFormData) => {
    setIsLoading(true)

    const apiPayload = {
      ...data,
      gender: parseInt(data.gender),
      assignedRoleId: parseInt(data.assignedRoleId), 
      joinDate: new Date().toISOString(),
      status: 'ACTIVE'
    }

    try {
      await staffService.createStaff(apiPayload)

      toast.success(`Staff registered successfully!`, {
        hideProgressBar: false,
        className: 'custom-toast',
      })
      
      reset()
      router.replace(`/en/clinic/staff/list`)

    } catch (error: any) {
      console.error(error)
      // Enhanced Error Handling
      const errorMessage = error.response?.data?.message 
                           || error.response?.data?.defaultMessage 
                           || error.message 
                           || 'Registration failed';
      
      toast.error(errorMessage, {
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
                    {/* --- DYNAMIC ROLES MAPPING --- */}
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