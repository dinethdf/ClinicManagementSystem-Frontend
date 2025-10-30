'use client'
import { useEffect } from 'react'

// React Hook Form Imports
import { useFormContext, Controller, useFieldArray } from 'react-hook-form'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@core/components/mui/IconButton'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker' // Assuming this is your datepicker path

// Types Imports
import type { DoctorSchedule, ScheduleSlot } from '@/types/doctor.types'

const SheduleVariants = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext<DoctorSchedule>()

  // Use RHF's useFieldArray to manage dynamic variants
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'schedules'
  })

  // Initialize first variant if empty
  useEffect(() => {
    if (fields.length === 0) {
      // Updated to use startTime and endTime
      append({ date: '', startTime: '', endTime: '', price: 0, maxPatientCount: 0, registeredPatientCount: 0 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handler for Date change
  const handleDateChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return

    // FIX: Get local date components
    const pad = (num: number) => num.toString().padStart(2, '0') // Re-using pad helper
    const year = dateObj.getFullYear()
    const month = pad(dateObj.getMonth() + 1) // getMonth() is 0-indexed
    const day = pad(dateObj.getDate())
    const date = `${year}-${month}-${day}` // Creates 'YYYY-MM-DD' in local time

    // Use update to set only the date
    update(index, {
      ...(fields[index] as ScheduleSlot), // Cast field to your type
      date
    })
  }

  // --- NEW: Handler for Start Time change ---
  const handleStartTimeChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return

    const time = dateObj.toTimeString().split(' ')[0].slice(0, 5) // 'HH:MM'

    // Use update to set only the startTime
    update(index, {
      ...(fields[index] as ScheduleSlot), // Cast field to your type
      startTime: time
    })
  }

  // --- NEW: Handler for End Time change ---
  const handleEndTimeChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return

    const time = dateObj.toTimeString().split(' ')[0].slice(0, 5) // 'HH:MM'

    // Use update to set only the endTime
    update(index, {
      ...(fields[index] as ScheduleSlot), // Cast field to your type
      endTime: time
    })
  }

  return (
    <Card>
      <CardHeader title='Schedule Variants' />
      <CardContent>
        <Grid container spacing={6}>
          {fields.map((item, index) => (
            <Grid key={item.id} container spacing={4} className='repeater-item mbe-4'>
              {/* 1. Date Component (Unchanged) */}
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
                      
                      // Correctly handle local date string for 'selected'
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

              {/* 2. Start Time Component */}
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
                      dateFormat='h:mm aa'
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

              {/* 3. End Time Component */}
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
                      dateFormat='h:mm aa'
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

              {/* 4. Price (Unchanged) */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Controller
                  name={`schedules.${index}.price`}
                  control={control}
                  rules={{
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be > 0' }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      label='Payment'
                      type='number'
                      fullWidth
                      placeholder='Enter Price'
                      {...field}
                      value={field.value === 0 ? '' : field.value} // Show empty instead of 0
                      onChange={e => field.onChange(Number(e.target.value))}
                      error={!!errors?.schedules?.[index]?.price}
                      helperText={errors?.schedules?.[index]?.price?.message}
                    />
                  )}
                />
              </Grid>

              {/* 5. Max Patient Count (Unchanged) */}
              <Grid size={{ xs: 10, md: 2 }}>
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
                      value={field.value === 0 ? '' : field.value} // Show empty instead of 0
                      onChange={e => field.onChange(Number(e.target.value))}
                      error={!!errors?.schedules?.[index]?.maxPatientCount}
                      helperText={errors?.schedules?.[index]?.maxPatientCount?.message}
                    />
                  )}
                />
              </Grid>

              {/* 6. Remove Button (Unchanged) */}
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
              onClick={() => append({ date: '', startTime: '', endTime: '', price: 0, maxPatientCount: 0, registeredPatientCount:0 })}
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