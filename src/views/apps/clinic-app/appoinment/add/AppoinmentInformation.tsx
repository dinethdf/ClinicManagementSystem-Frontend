'use client'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'


// React Hook Form Imports
import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'

import { Button } from '@mui/material'

// Components Imports
// import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import '@/libs/styles/tiptapEditor.css'


import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps'

import type { DoctorSchedule } from '@/libs/types/doctor.types'


const AppoinmentInformation = () => {

  const methods = useForm<DoctorSchedule>({
     defaultValues: {
      doctor: null,
      schedules: []
     }
   })

  const { control, watch } = methods
    
  const watchedDoctor = watch('doctor');
    
  const onSubmit = async (data: DoctorSchedule) => {
    
    if (!data.doctor) {
        toast.error('Please select a doctor first.');
       
        return;
      }
    }
  
    return (
    <Card>
      <CardHeader title='Product Information' />
      <CardContent>

      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>


                <Grid container spacing={6} className='mbe-6'>
                  <Grid size={{ xs: 12 }}>
                    <CustomTextField 
                      fullWidth 
                      label='Select Doctor Shedule' 
                      placeholder='Select' 
                      slotProps={{
                        htmlInput: { readOnly: true }
                      }}
                          />
                  </Grid>                  
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name='doctor'
                      control={control}
                      rules={{ required: 'Please select a doctor' }}
                      render={({ field, fieldState: { error } }) => (
                        <AsyncAutocomplete
                          {...field}
                          label='Search Doctor'
                          fetchUrl='/api/doctor/search'
                          searchParamKey='q'
                          placeholder='Enter Name'
                          getOptionLabel={(doctor:any) => doctor.firstName + " " + doctor.lastName + " : " + doctor.specialization }
                          fetchInputLenth={2}
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid>
                  {true && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          fullWidth
                          label='Name with Initials'
                          value={(watchedDoctor?.nameWithInitials as string) || ''}
                          slotProps={{
                            htmlInput: { readOnly: true }
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                {/* <Typography className='mbe-1'>Description (Optional)</Typography> */}

          </Grid>
          <Divider />

        </Grid>
      </form>




        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 12 }}>
            <CustomTextField fullWidth label='Product Name' placeholder='iPhone 14' />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField fullWidth label='SKU' placeholder='FXSK123U' />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField fullWidth label='Barcode' placeholder='0123-4567' />
          </Grid>
        </Grid>
       
        <Card className='p-0  shadow-none'>
          <CardContent className='p-0'>
            <div className='flex flex-wrap sm:items-center justify-end max-sm:flex-col gap-6'>
              <div className='flex flex-wrap max-sm:flex-col gap-4'>
                <Button variant='tonal' color='secondary'>
                  Discard
                </Button>
                <Button variant='contained'>Publish Product</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default AppoinmentInformation
