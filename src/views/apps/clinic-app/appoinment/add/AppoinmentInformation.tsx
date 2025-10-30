'use client'

import { useRouter } from 'next/navigation'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'


// React Hook Form Imports
import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'

import { Button, InputAdornment, Typography } from '@mui/material'

import type { TextFieldProps } from '@mui/material/TextField'

import classNames from 'classnames'

// Components Imports
// import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import '@/libs/styles/tiptapEditor.css'

import DoctorSheduleSelect from '@/components/dialogs/doctor-shedule-select'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@/@core/components/mui/Avatar'
import PatientSelectDialogBox from '@/components/dialogs/patient-select'
import type { DoctorScheduleDTO } from '@/types/doctor.types'
import type { PatientResponceDTO } from '@/types/patient.types'

import { createAppointment } from '@/services/appoinment.server.service';


const AppoinmentInformation = () => {

  const router = useRouter()
  
  const methods = useForm<{
    schedules: DoctorScheduleDTO | null // Use the specific type here
    patient: PatientResponceDTO | null
    note: string
  }>({
    defaultValues: {
  
      schedules: null,
      patient: null,
      note: ""
    }
  })

  // Add 'watch' to destructuring
  const { control, watch, reset, formState: { errors } } = methods

  // Watch the 'schedules' field to update the UI dynamically
  const watchedSchedule = watch('schedules')


  const onSubmit = async (data:any) => {

  if (!data.schedules) {
    
    toast.error('Please select a doctor schedule first.');
   
    return;
  }
  
  if (!data.patient) {
    
    toast.error('Please select a patient first.');
  
    return;
  }

  const result = await createAppointment(
    data.schedules.id,
    data.patient.id,
    data.note
  );
  
  if (result.success) {

    console.log('✅ Appointment created successfully:', result);
    reset();
    router.replace(`view/${result?.data?.id ? result?.data?.id : 'error'}`)
    
    toast.success(`Appointment created: ${result.data.appointmentNumber}`, {
      hideProgressBar: false,
      className: 'custom-toast',
      progressStyle: {
        backgroundColor: 'var(--mui-palette-primary-main)'
      }
    });

  } else {
    // FAILURE (Handled by the Server Action)
    console.error('Failed to create appointment:', result.error);
    
    toast.error(`${result?.error?.message}`, {
      autoClose: false,
      hideProgressBar: false,
      className: 'custom-toast',
      progressStyle: {
        backgroundColor: 'var(--mui-palette-error-main)'
      }
    });
  }
  }

  // const selectShedule = (shedule:DoctorScheduleDTO | null) =>{ // This one do in that Inline fuction
  //  setValue("schedules", shedule)
  // }   

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
                        onSelectShedule: field.onChange
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
                rules={{ required: true }} // Make required if patient is mandatory
                render={({ field }) => {
                  // This displayValue logic might need adjusting based on your patient object
                  const displayValue =
                    field.value && typeof field.value === 'object'
                      ? `${field.value.firstName || ''} ${field.value.lastName || ''} : ${field.value.patientNo || ''} ${field.value.guardian?.id ? '( Child )' : ""}`.trim()
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
                    inputProps: { style: { cursor: 'pointer' } },
                    ...(errors.patient && { error: true, helperText: 'Patient is required' })
                  }

                  return (
                    <OpenDialogOnElementClick
                      element={CustomTextField}
                      elementProps={textFieldProps}
                      dialog={PatientSelectDialogBox}
                      dialogProps={{
                      onSelectPatient: field.onChange
                      }}
                    />
                  )
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='note'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Notes (optional)'
                    placeholder='Any additional notes...'
                    {...(errors.note && { error: true, helperText: "" })}
                  />
                )}
              />
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