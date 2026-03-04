'use client'

// React Imports
import { useState } from 'react'

// Next & Form Imports
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'

// Custom Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomDatePicker from '@/components/custome/DatePickerTextField'
import BackDropFullScreen from '@/components/BackDropFullScreen'
import { patientService } from '@/services/patient/patient.service'
import { tempPatientValidationSchema } from '@/schemas/tempPatientValidation'

type TempPatientDialogProps = {
  open: boolean
  onClose: () => void
}

type TempPatientForm = {
  firstName: string
  lastName: string
  mobileNo: string
  gender: string
  // Optional Fields
  dob: string | null
  nic: string
  address: string
}

const initialTempData: TempPatientForm = {
  firstName: '',
  lastName: '',
  mobileNo: '',
  gender: '',
  dob: null,
  nic: '',
  address: ''
}

const TempPatientDialog = ({ open, onClose }: TempPatientDialogProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<TempPatientForm>({
    resolver: valibotResolver(tempPatientValidationSchema) as any,
    defaultValues: initialTempData
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: TempPatientForm) => {
    setIsLoading(true)
    try {
      const payload = {
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
      }

      const response = await patientService.createTempPatientDetails(payload)
      
      toast.success(`Temp Patient Created - ${response?.data?.patientNo || 'Success'}`, {
        className: 'custom-toast'
      })
      
      handleClose()
      
      if (response?.data?.id) {
         router.push(`details/${response.data.id}`)
      }

    } catch (error: any) {
      toast.error(error.message || 'Failed to create temp patient')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
<DialogTitle className="flex items-center justify-between">
          {/* Added component="div" to prevent HTML nesting errors */}
          <Typography variant="h5" component="div">
            Quick Registration (Temp Patient)
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <i className="tabler-x" />
          </IconButton>
        </DialogTitle>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={4}>
              {/* --- REQUIRED FIELDS --- */}
              <Grid size={{ xs: 12 }}>
                 <Typography variant="subtitle2" color="primary">Required Information</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='firstName'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='First Name *'
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
                      label='Last Name *'
                      placeholder='Doe'
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
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
                      label='Mobile Number *'
                      placeholder='07XXXXXXXX'
                      error={!!errors.mobileNo}
                      helperText={errors.mobileNo?.message}
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
                      label='Gender *'
                      error={!!errors.gender}
                      helperText={errors.gender?.message}
                    >
                      <MenuItem value=''>Select Gender</MenuItem>
                      <MenuItem value='1'>Male</MenuItem>
                      <MenuItem value='2'>Female</MenuItem>
                      <MenuItem value='3'>Other</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>

              {/* --- OPTIONAL FIELDS --- */}
              <Grid size={{ xs: 12 }} className="mt-2">
                 <Typography variant="subtitle2" color="text.secondary">Optional Information</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='dob'
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={newValue => {
                        field.onChange(newValue ? newValue.format('YYYY-MM-DD') : null)
                      }}
                      label='Date Of Birth (Optional)'
                      openTo='year'
                      views={['year', 'month', 'day']}
                      yearsOrder='desc'
                      maxDate={dayjs()}
                      format='YYYY-MM-DD'
                      slotProps={{
                        textField: {
                          error: !!errors.dob,
                          helperText: errors.dob?.message,
                          fullWidth: true
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
                      label='NIC Number (Optional)'
                      placeholder='****V/****'
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <i className='tabler-id' />
                            </InputAdornment>
                          )
                        }
                      }}
                      error={!!errors.nic}
                      helperText={errors.nic?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name='address'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Address (Optional)'
                      placeholder='Enter Address'
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
              </Grid>

            </Grid>
          </DialogContent>
          <DialogActions className="p-4">
            <Button variant="tonal" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={isLoading}>
              Register Temp Patient
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      <BackDropFullScreen open={isLoading} />
    </>
  )
}

export default TempPatientDialog