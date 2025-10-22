'use client'

import { useState, useEffect, SyntheticEvent } from 'react'
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// Custom Components
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Types
import type { ScheduleSlot } from '@/libs/types/doctor.types'

const SheduleVariants = () => {
  const { control, setValue, formState: { errors } } = useFormContext();

// Get current date and time
const now = new Date();
const pad = (num: number) => num.toString().padStart(2, '0');

const currentDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`; // yyyy-mm-dd
const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`; // HH:mm


// Initialize state
const [variants, setVariants] = useState<ScheduleSlot[]>([
  { date: currentDate, time: currentTime, price: 0, maxPatientCount: 0 }
])

  // Sync local state with react-hook-form
  useEffect(() => {
    // Update the form value "schedules" whenever variants change
    setValue('schedules', variants)
    console.log("varient Update", variants)
  }, [variants, setValue])

  const deleteForm = (e: SyntheticEvent, index: number) => {
    e.preventDefault()
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    setVariants(prev => [...prev, {  date: currentDate, time: currentTime, price: 0, maxPatientCount: 0 }])
  }

  const handleChange = (index: number, field: keyof ScheduleSlot, value: any) => {
    setVariants(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleDateTimeChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return
    const date = dateObj.toISOString().split('T')[0]
    const time = dateObj.toTimeString().split(' ')[0].slice(0, 5)
    setVariants(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], date, time }
      return updated
    })
  }

  return (
    <Card>
      <CardHeader title='Schedule Variants' />
      <CardContent>
        <Grid container spacing={6}>
          {variants.map((item, index) => (
            <Grid key={index} size={{ xs: 12 }} className='repeater-item'>
              <Grid container spacing={2}>
                {/* Date & Time Picker */}
                <Grid size={{ xs: 12, lg: 4 }}>
                  <AppReactDatepicker
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={15}
                    selected={item.date && item.time ? new Date(`${item.date}T${item.time}`) : null}
                    id={`date-time-picker-${index}`}
                    dateFormat='MM/dd/yyyy h:mm aa'
                    onChange={date => handleDateTimeChange(index, date)}
                    customInput={<CustomTextField label='Date & Time' fullWidth />}
                  />
                </Grid>

                {/* Price */}
                <Grid size={{ xs: 12, sm: 4 }} alignSelf='end'>
                  <CustomTextField
                    label='Price'
                    fullWidth
                    type='number'
                    placeholder='Enter Price'
                    value={item.price === 0 ? '' : item.price}
                    onChange={e => handleChange(index, 'price', Number(e.target.value))}
                  />
                </Grid>

                {/* Max Patient Count */}
                <Grid size={{ xs: 12, sm: 4 }} alignSelf='end'>
                  <div className='flex items-center gap-6'>
                    <CustomTextField
                      label='Max Patient Count'
                      fullWidth
                      type='number'
                      placeholder='Enter Count'
                      value={item.maxPatientCount === 0 ? '' : item.maxPatientCount}
                      onChange={e => handleChange(index, 'maxPatientCount', Number(e.target.value))}
                    />
                    <CustomIconButton onClick={e => deleteForm(e, index)}>
                      <i className='tabler-x' />
                    </CustomIconButton>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          ))}

          <Grid size={{ xs: 12 }}>
            <Button variant='contained' onClick={addVariant}>
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
