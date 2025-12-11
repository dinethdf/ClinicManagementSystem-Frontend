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

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@core/components/mui/IconButton'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Types Imports
import type { DoctorSchedule } from '@/types/doctor.types'

const SheduleVariants = () => {
  const {
    control,
    setValue, // 1. Get setValue here
    formState: { errors }
  } = useFormContext<DoctorSchedule>()

  const { fields, append, remove } = useFieldArray({ // 2. Removed 'update' as it is not needed here
    control,
    name: 'schedules'
  })

  useEffect(() => {
    if (fields.length === 0) {
      append({ date: '', startTime: '', endTime: '', doctorFee: 0, clinicFee: 0, maxPatientCount: 0, registeredPatientCount: 0 })
    }
  }, [])

  // 3. Updated Handler: Uses setValue to target specific field ONLY
  const handleDateChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return

    const pad = (num: number) => num.toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    const month = pad(dateObj.getMonth() + 1)
    const day = pad(dateObj.getDate())
    const date = `${year}-${month}-${day}`

    // This updates strictly the date, leaving doctorFee/clinicFee intact
    setValue(`schedules.${index}.date`, date, { shouldValidate: true })
  }

  // 4. Updated Handler
  const handleStartTimeChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return

    const time = dateObj.toTimeString().split(' ')[0].slice(0, 5)

    setValue(`schedules.${index}.startTime`, time, { shouldValidate: true })
  }

  // 5. Updated Handler
  const handleEndTimeChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return

    const time = dateObj.toTimeString().split(' ')[0].slice(0, 5)

    setValue(`schedules.${index}.endTime`, time, { shouldValidate: true })
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
                      // Safely parse string to date
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
                  rules={{
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be > 0' }
                  }}
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
                      helperText={errors?.schedules?.[index]?.doctorFee?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Controller
                  name={`schedules.${index}.clinicFee`}
                  control={control}
                  rules={{
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be > 0' }
                  }}
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
                  rules={{
                    required: 'Max patient count is required',
                    min: { value: 1, message: 'Must be at least 1' }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      label='Max Patient Count'
                      type='number'
                      fullWidth
                      placeholder='Enter Count'
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={e => field.onChange(Number(e.target.value))}
                      error={!!errors?.schedules?.[index]?.maxPatientCount}
                      helperText={errors?.schedules?.[index]?.maxPatientCount?.message}
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
              onClick={() => append({ date: '', startTime: '', endTime: '', doctorFee: 0, clinicFee: 0, maxPatientCount: 0, registeredPatientCount: 0 })}
            >
              Add Another Option
            </Button>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className='flex flex-wrap max-sm:flex-col gap-4'>
              <Button variant='tonal' color='secondary' type='button'>
                Discard
              </Button>
              <Button variant='contained' type='submit'>
                Publish
              </Button>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SheduleVariants