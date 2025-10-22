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

  // Get current date and time
  const now = new Date()
  const pad = (num: number) => num.toString().padStart(2, '0')
  const currentDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`

  // Use RHF's useFieldArray to manage dynamic variants
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'schedules'
  })

  // Initialize first variant if empty


  const handleDateTimeChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return

    const date = dateObj.toISOString().split('T')[0]
    const time = dateObj.toTimeString().split(' ')[0].slice(0, 5)

    // Use update to set both values at once
    update(index, {
      ...(fields[index] as ScheduleSlot), // Cast field to your type
      date,
      time
    })
  }

    useEffect(() => {
    if (fields.length == 0) {
      append({ date: currentDate, time: currentTime, price: 0, maxPatientCount: 0 })
    }
    console.log("first")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array ensures this runs only once on mount

  return (
    <Card>
      <CardHeader title='Schedule Variants' />
      <CardContent>
       <Grid container spacing={6}>
        {fields.map((item, index) => (
          <Grid key={item.id} container spacing={4} className='repeater-item mbe-4'>
            {/* Date & Time */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name={`schedules.${index}.date`}
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <AppReactDatepicker
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={15}
                    id={`date-time-picker-${index}`}
                    dateFormat='MM/dd/yyyy hh:mm aa'
                    // Re-combine date and time for the picker's 'selected' prop
                    selected={field.value && (fields[index] as ScheduleSlot).time
                        ? new Date(`${field.value}T${(fields[index] as ScheduleSlot).time}`)
                        : null
                    }
                    onChange={(date) => handleDateTimeChange(index, date)}
                    customInput={
                      <CustomTextField
                        label='Date & Time'
                        fullWidth
                        error={!!errors?.schedules?.[index]?.date}
                        helperText={errors?.schedules?.[index]?.date?.message}
                      />
                    }
                  />
                )}
              />

              {/* This hidden input correctly stores the 'time' value */}
              <Controller
                name={`schedules.${index}.time`}
                control={control}
                rules={{ required: 'Time is required' }}
                render={({ field }) => <input type='hidden' {...field} />}
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
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
            <Button variant='contained' 
             onClick={() => append({ date: currentDate, time: currentTime, price: 0, maxPatientCount: 0 })}>
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