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
import type { DoctorSchedule, ScheduleSlot } from '@/libs/types/doctor.types'

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
    if (fields.length == 0) {
      append({ date: "", time: "", price: 0, maxPatientCount: 0 })
    }

  }, [])

  // UPDATED: Handler for Date change
  const handleDateChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return

    // const date = dateObj.toISOString().split('T')[0] // <-- BUG: This converts to UTC

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

  // UPDATED: Handler for Time change (This one was correct)
  const handleTimeChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return

    const time = dateObj.toTimeString().split(' ')[0].slice(0, 5) // 'HH:MM'

    // Use update to set only the time
    update(index, {
      ...(fields[index] as ScheduleSlot), // Cast field to your type
      time
    })
  }

  return (
    <Card>
      <CardHeader title='Schedule Variants' />
      <CardContent>
        <Grid container spacing={6}>
          {fields.map((item, index) => (
            <Grid key={item.id} container spacing={4} className='repeater-item mbe-4'>
              {/* 1. Date Component */}
              <Grid size={{ xs: 12, md: 2 }}>
                <Controller
                  name={`schedules.${index}.date`}
                  control={control}
                  rules={{ required: 'Select Date' }}
                  render={({ field }) => (
                    <AppReactDatepicker
                      id={`date-picker-${index}`}
                      dateFormat='MM/dd/yyyy'
                      // Parse the 'YYYY-MM-DD' string as a local date
                      // This part is correct: 'T00:00:00' makes it local midnight
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

              {/* 2. Time Component */}
              <Grid size={{ xs: 12, md: 2 }}>
                <Controller
                  name={`schedules.${index}.time`}
                  control={control}
                  rules={{ required: 'Select Time' }}
                  render={({ field }) => (
                    <AppReactDatepicker
                      showTimeSelect
                      showTimeSelectOnly
                      timeFormat='HH:mm'
                      timeIntervals={15}
                      id={`time-picker-${index}`}
                      dateFormat='h:mm aa'
                      // This part is also correct
                      selected={field.value ? new Date(`1970-01-01T${field.value}`) : null}
                      onChange={date => handleTimeChange(index, date)}
                      customInput={
                        <CustomTextField
                          label='Time'
                          fullWidth
                          placeholder='Select Time'
                          error={!!errors?.schedules?.[index]?.time}
                          helperText={errors?.schedules?.[index]?.time?.message}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              {/* Price */}
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
                      label='Price'
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

              {/* Max Patient Count */}
              <Grid size={{ xs: 10, md: 3 }}>
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

              {/* Remove Button */}
              <Grid size={{ xs: 2, md: 2 }} className='flex items-center'>
                <CustomIconButton onClick={() => remove(index)}>
                  <i className='tabler-x' />
                </CustomIconButton>
              </Grid>
            </Grid>
          ))}

          <Grid size={{ xs: 12 }}>
            <Button
              variant='contained'
              onClick={() => append({ date: "", time: "", price: 0, maxPatientCount: 0 })}
            >
              Add Another Option
            </Button>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className='flex flex-wrap max-sm:flex-col gap-4'>
              <Button variant='tonal' color='secondary' type='button'>
                Discard
              </Button>

              {/* 5. Set this button's type to 'submit' */}
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