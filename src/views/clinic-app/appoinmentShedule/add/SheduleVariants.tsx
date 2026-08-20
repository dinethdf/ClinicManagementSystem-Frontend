'use client'
import { useEffect } from 'react'

// React Hook Form Imports
import { useFormContext, Controller, useFieldArray } from 'react-hook-form'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@core/components/mui/IconButton'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Types Imports
import type { DoctorSchedule } from '@/types/doctor.types'

const initialScheduleState = { 
  date: '', 
  startTime: '', 
  endTime: '', 
  doctorFee: 0, 
  clinicFee: 0, 
  maxPatientCount: 0, 
  registeredPatientCount: 0 
}

const SheduleVariants = () => {
  const {
    control,
    setValue,
    reset, // <-- Import reset here
    formState: { errors, isSubmitting }
  } = useFormContext<DoctorSchedule>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules'
  })

  useEffect(() => {
    if (fields.length === 0) {
      append(initialScheduleState)
    }
  }, [])

  const handleDateChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return
    const pad = (num: number) => num.toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    const month = pad(dateObj.getMonth() + 1)
    const day = pad(dateObj.getDate())
    const date = `${year}-${month}-${day}`

    setValue(`schedules.${index}.date`, date, { shouldValidate: true })
  }

  const handleStartTimeChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return
    const time = dateObj.toTimeString().split(' ')[0].slice(0, 5)

    setValue(`schedules.${index}.startTime`, time, { shouldValidate: true })
  }

  const handleEndTimeChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return
    const time = dateObj.toTimeString().split(' ')[0].slice(0, 5)

    setValue(`schedules.${index}.endTime`, time, { shouldValidate: true })
  }

  // --- Discard Handler ---
  const handleDiscard = () => {
    // Reset the form state for schedules back to a single empty item
    reset({
      ...control._defaultValues, // Preserve any other form fields if they exist outside of schedules
      schedules: [initialScheduleState] 
    })
  }

  return (
    <Card>
      <CardHeader title='Schedule Variants' />
      <CardContent>
        <Grid container spacing={6}>
          {fields.map((item, index) => (
            <Grid key={item.id} container spacing={4} className='repeater-item mbe-4'>

              <Grid size={{ xs: 12, md: 3 }}>
                <Controller
                  name={`schedules.${index}.date`}
                  control={control}
                  rules={{ required: 'Select Date' }}
                  render={({ field }) => (
                    <AppReactDatepicker
                      id={`date-picker-${index}`}
                      dateFormat='MM/dd/yyyy'
                      autoComplete="off"
                      selected={field.value ? new Date(`${field.value}T00:00:00`) : null}
                      onChange={date => handleDateChange(index, date)}
                      customInput={
                        <CustomTextField
                          label='Date'
                          fullWidth
                          error={!!errors?.schedules?.[index]?.date}
                          helperText={errors?.schedules?.[index]?.date?.message}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 1.5 }}>
                <Controller
                  name={`schedules.${index}.startTime`}
                  control={control}
                  rules={{ required: 'Select Start Time' }}
                  render={({ field }) => (
                    <AppReactDatepicker
                      showTimeSelect
                      showTimeSelectOnly
                      timeFormat='HH:mm'
                      timeIntervals={15}
                      id={`start-time-picker-${index}`}
                      dateFormat='HH:mm'
                      autoComplete="off"
                      selected={field.value ? new Date(`1970-01-01T${field.value}`) : null}
                      onChange={date => handleStartTimeChange(index, date)}
                      customInput={
                        <CustomTextField
                          label='Start Time'
                          fullWidth
                          placeholder='Start Time'
                          error={!!errors?.schedules?.[index]?.startTime}
                          helperText={errors?.schedules?.[index]?.startTime?.message}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 1.5 }}>
                <Controller
                  name={`schedules.${index}.endTime`}
                  control={control}
                  rules={{ required: 'Select End Time' }}
                  render={({ field }) => (
                    <AppReactDatepicker
                      showTimeSelect
                      showTimeSelectOnly
                      timeFormat='HH:mm'
                      timeIntervals={15}
                      id={`end-time-picker-${index}`}
                      dateFormat='HH:mm'
                      autoComplete="off"
                      selected={field.value ? new Date(`1970-01-01T${field.value}`) : null}
                      onChange={date => handleEndTimeChange(index, date)}
                      customInput={
                        <CustomTextField
                          label='End Time'
                          fullWidth
                          placeholder='End Time'
                          error={!!errors?.schedules?.[index]?.endTime}
                          helperText={errors?.schedules?.[index]?.endTime?.message}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Controller
                  name={`schedules.${index}.doctorFee`}
                  control={control}
                  rules={{ required: 'Required', min: 1 }}
                  render={({ field }) => (
                    <CustomTextField
                      label='Doctor Fee'
                      type='number'
                      fullWidth
                      placeholder='Enter Price'
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={e => field.onChange(Number(e.target.value))}
                      error={!!errors?.schedules?.[index]?.doctorFee}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Controller
                  name={`schedules.${index}.clinicFee`}
                  control={control}
                  rules={{ required: 'Required', min: 1 }}
                  render={({ field }) => (
                    <CustomTextField
                      label='Clinic Fee'
                      type='number'
                      fullWidth
                      placeholder='Enter Price'
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={e => field.onChange(Number(e.target.value))}
                      error={!!errors?.schedules?.[index]?.clinicFee}
                      helperText={errors?.schedules?.[index]?.clinicFee?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 10, md: 1 }}>
                <Controller
                  name={`schedules.${index}.maxPatientCount`}
                  control={control}
                  rules={{ required: 'Required', min: 1 }}
                  render={({ field }) => (
                    <CustomTextField
                      label='Max Count'
                      type='number'
                      fullWidth
                      placeholder='Enter Count'
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={e => field.onChange(Number(e.target.value))}
                      error={!!errors?.schedules?.[index]?.maxPatientCount}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 2, md: 1 }} className='flex items-center'>
                <CustomIconButton onClick={() => remove(index)}>
                  <i className='tabler-x' />
                </CustomIconButton>
              </Grid>
            </Grid>
          ))}

          <Grid size={{ xs: 12 }}>
            <Button
              variant='contained'
              onClick={() => append(initialScheduleState)}
            >
              Add Another Option
            </Button>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <div className='flex flex-wrap max-sm:flex-col gap-4'>  
              <Button variant='tonal' color='secondary' type='button' disabled={isSubmitting} onClick={handleDiscard}>
                Discard
              </Button>
              <Button 
                variant='contained' 
                type='submit'
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SheduleVariants