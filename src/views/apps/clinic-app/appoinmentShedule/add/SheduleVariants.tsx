'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'


// Third-party Imports
import { subDays, addDays } from 'date-fns'


const SheduleVariants = () => {
  // States
  const [count, setCount] = useState(1)

  const deleteForm = (e: SyntheticEvent) => {
    e.preventDefault()

    // @ts-ignore
    e.target.closest('.repeater-item').remove()
  }

  return (
    <Card>
      <CardHeader title='Shedule Variants' />
      <CardContent>
        <Grid container spacing={6}>
          {Array.from(Array(count).keys()).map((item, index) => (
            <Grid key={index} size={{ xs: 12 }} className='repeater-item'>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <AppReactDatepicker
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={15}
                    selected={new Date()}
                    id='date-time-picker'
                    dateFormat='MM/dd/yyyy h:mm aa'
                    onChange={(date: Date | null) => console.log(date)}
                    customInput={<CustomTextField label='Date & Time' fullWidth />}
                  />
                  </Grid>
                <Grid size={{ xs: 12, sm: 4 }} alignSelf='end'>
                  <div className='flex items-center gap-6'>
                    <CustomTextField label="Payment" fullWidth placeholder='Enter  Value' />
                   
                  </div>
                </Grid>
              
                <Grid size={{ xs: 12, sm: 4 }} alignSelf='end'>
                  <div className='flex items-center gap-6'>
                    <CustomTextField label="Max Patient Count" fullWidth placeholder='Enter Variant Value' />
                    <CustomIconButton onClick={deleteForm} className='min-is-fit'>
                      <i className='tabler-x' />
                    </CustomIconButton>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid size={{ xs: 12 }}>
            <Button variant='contained' onClick={() => setCount(count + 1)} startIcon={<i className='tabler-plus' />}>
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
