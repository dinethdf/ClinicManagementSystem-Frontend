'use client'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import type { ButtonProps } from '@mui/material/Button'

// React Hook Form Imports
import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'

import { Button, InputAdornment, Typography } from '@mui/material'

import type { TextFieldProps } from '@mui/material/TextField'

// Components Imports
// import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import '@/libs/styles/tiptapEditor.css'

import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps'

import DoctorSheduleSelect from '@/components/dialogs/doctor-shedule-select'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import { Appoinment } from '@/types/appoinments.types' // Assuming Schedule type might be in here
import CustomAvatar from '@/@core/components/mui/Avatar'
import classNames from 'classnames'
import PatientSelectDialogBox from '@/components/dialogs/patient-select'
import { DoctorScheduleDTO } from '@/types/doctor.types'

// Define a type for your schedule based on your description
type DoctorSchedule = {
  id?: number
  doctorId: number
  scheduleDate: string
  startTime: string
  endTime: string
  payment: number
  maxPatientCount: number
  isActive?: boolean
}

const AppoinmentInformation = () => {
  const methods = useForm<{
    doctor: any
    schedules: DoctorScheduleDTO | null // Use the specific type here
    patient: any
  }>({
    defaultValues: {
      doctor: null,
      schedules: null,
      patient: null
    }
  })

  // Add 'watch' to destructuring
  const { control, watch, setValue, formState: { errors } } = methods

  // Watch the 'schedules' field to update the UI dynamically
  const watchedSchedule = watch('schedules')
  const watchedDoctor = watch('doctor')

  const buttonProps: ButtonProps = {
    variant: 'contained',
    children: 'Show'
  }

  const onSubmit = async (data: any) => {
    if (!data.doctor) {
      toast.error('Please select a doctor first.')
      return
    }
    // Add logic to handle schedule submission
    console.log(data)
  }

    const selectShedule = (shedule:DoctorScheduleDTO | null) =>{
      console.log("first")
        console.log(shedule)
            setValue("schedules", shedule)
                      
    }   

  return (
    <Card>
      <CardHeader title='Appointment Information' /> {/* Renamed for clarity */}
      <CardContent>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid container spacing={6} mb={4}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='schedules'
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  // **MODIFIED:** Display formatted schedule info
                  const displayValue =
                    field.value && field.value.doctorName
                      ? `Dr. ${field.value?.doctorName} : ${field.value.specialization}`
                      : ''

                  const textFieldProps: TextFieldProps = {
                    ...field,
                    fullWidth: true,
                    label: 'Schedules',
                    placeholder: 'Select Doctor Schedules',
                    value: displayValue, // Use the new displayValue
                    InputProps: {
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-user' />
                        </InputAdornment>
                      )
                    },
                    inputProps: { style: { cursor: 'pointer' } },
                    ...(errors.schedules && { error: true, helperText: 'Schedule is required' })
                  }
                  return (
                    <OpenDialogOnElementClick
                      element={CustomTextField}
                      elementProps={textFieldProps}
                      dialog={DoctorSheduleSelect}
                      dialogProps={{
                        onSelectShedule: selectShedule
                      }}
                    />
                  )
                }}
              />
            </Grid>

            {/* --- Dynamic Schedule Info Cards --- */}
            <Grid size={{ xs: 12, md: 3, sm: 4 }}>
              <div className='flex items-center gap-3'>
                <CustomAvatar variant='rounded' skin='light' size={50} color='primary'>
                  <i className={classNames('text-[34px]', 'tabler-calendar')} />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>Date</Typography>
                  <Typography color='text.primary' className='font-semibold'>
                    {/* **MODIFIED:** Show selected schedule date */}
                    {watchedSchedule ? watchedSchedule.scheduleDate : 'N/A'}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 3, sm: 4 }}>
              <div className='flex items-center gap-3'>
                <CustomAvatar variant='rounded' skin='light' size={50} color='primary'>
                  <i className={classNames('text-[34px]', 'tabler-clock')} />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>Time</Typography>
                  <Typography color='text.primary' className='font-semibold'>
                    {/* **MODIFIED:** Show selected schedule time */}
                    {watchedSchedule
                      ? `${watchedSchedule.startTime} - ${watchedSchedule.endTime}`
                      : 'N/A'}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 3, sm: 4 }}>
              <div className='flex items-center gap-3'>
                <CustomAvatar variant='rounded' skin='light' size={50} color='primary'>
                  <i className={classNames('text-[34px]', 'tabler-accessible-filled')} />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>Appointment no</Typography>
                  <Typography color='text.primary' className='font-semibold'>
                    {/* **MODIFIED:** Show selected schedule availability */}
                    {watchedSchedule ? `:  ${watchedSchedule.registeredPatientCount + 1}` : 'N/A'}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 3, sm: 4 }}>
              <div className='flex items-center gap-3'>
                <CustomAvatar variant='rounded' skin='light' size={50} color='primary'>
                  <i className={classNames('text-[34px]', 'tabler-cash')} />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>Payment</Typography>
                  <Typography color='text.primary' className='font-semibold'>
                    {/* **MODIFIED:** Show selected schedule payment */}
                    {watchedSchedule ? `Rs. ${watchedSchedule.payment.toFixed(2)}` : 'N/A'}
                  </Typography>
                </div>
              </div>
            </Grid>
            {/* --- End Dynamic Info Cards --- */}

            <Divider />
          </Grid>

          <Grid container spacing={6} className='mbe-6'>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='patient'
                control={control}
                rules={{ required: false }} // Make required if patient is mandatory
                render={({ field }) => {
                  // This displayValue logic might need adjusting based on your patient object
                  const displayValue =
                    field.value && typeof field.value === 'object'
                      ? `${field.value.firstName || ''} ${field.value.lastName || ''}`.trim()
                      : ''

                  const textFieldProps: TextFieldProps = {
                    ...field,
                    fullWidth: true,
                    label: 'Patient',
                    placeholder: 'Select Patient',
                    value: displayValue,
                    InputProps: {
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-user' />
                        </InputAdornment>
                      )
                    },
                    inputProps: { style: { cursor: 'pointer' } }
                    // ...(errors.patient && { error: true, helperText: errors.patient.message })
                  }
                  return (
                    <OpenDialogOnElementClick
                      element={CustomTextField}
                      elementProps={textFieldProps}
                      dialog={PatientSelectDialogBox}
                      dialogProps={{
                        // **NOTE:** You'll need to do the same here,
                        // e.g., onSelectPatient: field.onChange
                      }}
                    />
                  )
                }}
              />
            </Grid>
            
            {/* Other fields - I've removed the product-specific ones */}
            <Grid size={{ xs: 12 }}>
              <CustomTextField fullWidth label='Notes' placeholder='Any additional notes...' />
            </Grid>
          </Grid>

          <Card className='p-0 shadow-none'>
            <CardContent className='p-0'>
              <div className='flex flex-wrap sm:items-center justify-end max-sm:flex-col gap-6'>
                <div className='flex flex-wrap max-sm:flex-col gap-4'>
                  <Button variant='tonal' color='secondary' onClick={() => methods.reset()}>
                    Discard
                  </Button>
                  {/* Changed button text */}
                  <Button variant='contained' type='submit'>
                    Create Appointment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </CardContent>
    </Card>
  )
}

export default AppoinmentInformation