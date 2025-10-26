'use client'
import { useEffect } from 'react'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// React Hook Form Imports
import { useForm, FormProvider, Controller } from 'react-hook-form'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps'

import SheduleVariants from './SheduleVariants'

import type { DoctorSchedule } from '@/libs/types/doctor.types'

const SheduleInformation = (props:any) => {
  console.log(props);
  // Initialize React Hook Form
  const methods = useForm<DoctorSchedule>({
    defaultValues: {
      doctor: null,
      doctorName: '',
      schedules: []
    }
  })

  const { control, watch, setValue } = methods

  const watchedDoctor: any = watch('doctor')

  // 5. This function will receive all form data
  const onSubmit = (data: any) => {
    console.log('Form Data:', data)

    // data will now contain { doctor: {...}, doctorName: '...' }
  }

  // 6. (Optional but recommended)
  // When the selected doctor changes, automatically update the 'doctorName' field
  useEffect(() => {
    if (watchedDoctor) {
      setValue('doctorName', watchedDoctor?.doctorName || '')
    } else {
      setValue('doctorName', '')
    }
  }, [watchedDoctor, setValue])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader title='Doctor Information' />
              <CardContent>
                <Grid container spacing={6} className='mbe-6'>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name='doctor'
                      control={control}
                      rules={{ required: 'Please select a doctor' }}
                      render={({ field, fieldState: { error } }) => (
                        <AsyncAutocomplete
                          {...field}
                          label='Search Doctor'
                          fetchUrl='/api/search-doctors'
                          searchQueryParam='name'
                          placeholder='Enter Name'
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid>
                  {watchedDoctor && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          fullWidth
                          label='Read Only'
                          value={(watchedDoctor?.fullName as string) || ''}
                          slotProps={{
                            htmlInput: { readOnly: true }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          fullWidth
                          label='Read Only'
                          value={(watchedDoctor?.company as string) || ''}
                          slotProps={{
                            htmlInput: { readOnly: true }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          fullWidth
                          label='Read Only'
                          value={(watchedDoctor?.country as string) || ''}
                          slotProps={{
                            htmlInput: { readOnly: true }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          fullWidth
                          label='Read Only'
                          defaultValue={(watchedDoctor?.contact as string) || ''}
                          slotProps={{
                            htmlInput: { readOnly: true }
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                {/* <Typography className='mbe-1'>Description (Optional)</Typography> */}
              </CardContent>
            </Card>
          </Grid>
          <Divider />
          <Grid size={{ xs: 12 }}>
            <SheduleVariants />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default SheduleInformation
