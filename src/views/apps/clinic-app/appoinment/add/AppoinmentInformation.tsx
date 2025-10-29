'use client'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import type { ButtonProps } from '@mui/material/Button'


// React Hook Form Imports
import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'

import { Button, InputAdornment, Typography } from '@mui/material'

import type { TextFieldProps } from '@mui/material/TextField'

// Components Imports
// import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import '@/libs/styles/tiptapEditor.css'


import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps'

import DoctorSheduleSelect from '@/components/dialogs/doctor-shedule-select'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import { Appoinment } from '@/libs/types/appoinments.types'
import CustomAvatar from '@/@core/components/mui/Avatar'
import classNames from 'classnames'
import PatientSelectDialogBox from '@/components/dialogs/patient-select'


const AppoinmentInformation = () => {

  const methods = useForm<any>({
     defaultValues: {
      doctor: null,
      schedules: null
     }
   })

  const { control, watch,  formState: { errors } } = methods
    
  const watchedDoctor = watch('doctor');

  const buttonProps: ButtonProps = {
      variant: 'contained',
      children: 'Show'
  }
    
  const onSubmit = async (data: any) => {
    
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
        <Grid container spacing={6} mb={4}>
          <Grid size={{ xs: 12 }}>          
            <Controller
              name='schedules'
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                const displayValue =
                  field.value && typeof field.value === 'object'
                  ? `${field.value.lastname} ${field.value.lastName}` : ''          

                    const textFieldProps: TextFieldProps = {
                      ...field,
                      fullWidth: true,
                      label: 'Schedules',
                      placeholder: 'Select Doctor Schedules',
                      value: displayValue,
                      InputProps: {
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position='start'>
                            <i className='tabler-user' />
                          </InputAdornment>
                        )
                      },
                      inputProps: {style: {cursor: 'pointer'}},
                      // ...(errors.schedules && { error: true, helperText: errors.schedules.message })
                    }
                return (
                  <OpenDialogOnElementClick
                    element={CustomTextField}
                    elementProps={textFieldProps}
                    dialog={DoctorSheduleSelect}
                    dialogProps={{
                      // onSelectGuardian: selectGuardian, // or just field.onChange
                      // triggerRef: triggerRef        // 5. Pass the ref to the dialog
                     }}
                  />
                )
              }}
            />                          
          </Grid>   
          <Grid size={{ xs: 12, md: 3, sm: 4 }}>
              <div className='flex items-center gap-3'>
                <CustomAvatar variant='rounded' skin='light' size={50} color='primary'>
                  <i className={classNames('text-[34px]', "tabler-calendar")} />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>Date</Typography>
                  <Typography color='text.primary' className='font-semibold'>
                    1 November 2025
                  </Typography>
                </div>
              </div>
          </Grid>   
          <Grid size={{ xs: 12, md: 3, sm: 4 }}>
              <div className='flex items-center gap-3'>
                <CustomAvatar variant='rounded' skin='light' size={50} color='primary'>
                  <i className={classNames('text-[34px]', "tabler-clock")} />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>Time</Typography>
                  {/* For a semi-bold weight */}
                  <Typography color='text.primary' className='font-semibold'>
                    00:00 AM - 00:00 PM
                  </Typography>
                </div>
              </div>
          </Grid>     
          <Grid size={{ xs: 12, md: 3, sm: 4 }}>
              <div className='flex items-center gap-3'>
                <CustomAvatar variant='rounded' skin='light' size={50} color='primary'>
                  <i className={classNames('text-[34px]', "tabler-accessible-filled")} />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>Available</Typography>
                  <Typography color='text.primary' className='font-semibold'>
                    10 Position
                  </Typography>
                </div>
              </div>
          </Grid>                                                                            
          <Grid size={{ xs: 12, md: 3, sm: 4 }}>
              <div className='flex items-center gap-3'>
                <CustomAvatar variant='rounded' skin='light' size={50} color='primary'>
                  <i className={classNames('text-[34px]', "tabler-cash")} />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>Payment</Typography>
                  <Typography color='text.primary' className='font-semibold'>
                    Rs. 1,500/=
                  </Typography>
                </div>
              </div>
          </Grid> 
          
                  {/* <div className='flex flex-wrap justify-between gap-4'>
        
            <div className='flex items-center gap-3'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className={classNames('text-[28px]', "item.icon")} />
              </CustomAvatar>
              <div>
                <Typography color='text.primary' className='font-medium'>
                 " item.title"
                </Typography>
                <Typography variant='body2'>"item.value"</Typography>
              </div>
            </div>
         
        </div>                               */}
          <Divider />
        </Grid>
   
        <Grid container spacing={6} className='mbe-6'>

          <Grid size={{ xs: 12 }}>          
            <Controller
              name='patient'
              control={control}
              rules={{ required: false }}
              render={({ field }) => {
                const displayValue =
                  field.value && typeof field.value === 'object'
                  ? `${field.value.lastname} ${field.value.lastName}` : ''          

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
                      inputProps: {style: {cursor: 'pointer'}},
                      // ...(errors.schedules && { error: true, helperText: errors.schedules.message })
                    }
                return (
                  <OpenDialogOnElementClick
                    element={CustomTextField}
                    elementProps={textFieldProps}
                    dialog={PatientSelectDialogBox}
                    dialogProps={{
                      // onSelectGuardian: selectGuardian, // or just field.onChange
                      // triggerRef: triggerRef        // 5. Pass the ref to the dialog
                     }}
                  />
                )
              }}
            />                          
          </Grid>           
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
           </form>
      </CardContent>
    </Card>
  )
}

export default AppoinmentInformation
