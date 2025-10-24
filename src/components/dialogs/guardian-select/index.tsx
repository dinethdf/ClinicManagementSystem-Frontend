'use client'

// React Imports
import { useState } from 'react'
import type { MouseEvent } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Config Imports
import themeConfig from '@configs/themeConfig'
import Grid from '@mui/material/Grid2'

import { useForm, Controller } from 'react-hook-form'
import { patientService } from '@/services/patient.service'

type DialogBoxProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onSelectGuardian: (text:string) => void
}

type OptionsType = {
  avatar: string
  name: string
}

type DataType = {
  avatar: string
  value: string
  name: string
  email: string
}

const data: DataType[] = [
  {
    avatar: '1.png',
    value: 'Can Edit',
    name: 'Lester Palmer',
    email: 'lester.palmer@gmail.com'
  },
  {
    avatar: '2.png',
    value: 'Owner',
    name: 'Mittie Blair',
    email: 'mittie.blair@gmail.com'
  },
  {
    avatar: '3.png',
    value: 'Can Comment',
    name: 'Marvin Wheeler',
    email: 'marvin.wheeler@gmail.com'
  }
]

type FormValues = {
  nicNo: string
  guardianName: string
}

const GuardianSelectDialogBox = ({ open, setOpen, onSelectGuardian }: DialogBoxProps) => {
  // States
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  

    // Hooks
    const {
      control,
      reset,
      handleSubmit,
      getValues, trigger,
      formState: { errors }
    } = useForm<FormValues>({
      defaultValues: {
        nicNo: '',
        guardianName: ''
      }
    })
    const onSubmit = async (data:FormValues) => {
      console.log("Submit Data", data)

          try {
            const response = await patientService.getGuardianForChildPatient(data.nicNo, data.guardianName)
      
            console.log('✅ Patient created successfully:', response)

          } catch (error) {
            console.log("No Data")
            console.log(error)
          }

    }

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      scroll='body'
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Select Guardian
        <Typography component='span' className='flex flex-col text-center'>
          Share project with the team members
        </Typography>
      </DialogTitle>
      <DialogContent className='flex flex-col gap-6 pbs-0 sm:pli-16 sm:pbe-16'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='nicNo'
                control={control}
                rules={{
                  validate: (value) => { // 'value' is the current firstName
                    const guardianName = getValues('guardianName'); // Get the other field's value

                    if (!value && !guardianName) {
                      return 'First or Last Name is required.';
                    }

                    // Check length *only if* this field has a value
                    if (value && value.length < 3) {
                      return 'Must be at least 3 characters.';
                    }

                    return true; 
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}

                    // Override onChange to trigger validation
                    onChange={(e) => {
                      const value = e.target.value; 
                      const guardianName = getValues('guardianName');
                      field.onChange(e); // Run the default onChange
                      trigger('guardianName'); // Trigger validation

                      if (value.length >= 3 || guardianName.length >= 3)  {
                        handleSubmit(onSubmit)(); // 5. Call submit
                      }
                    }}
                    fullWidth
                    label='NIC No'
                    placeholder='####'
                    {...(errors.nicNo && { error: true, helperText: errors.nicNo.message })}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='guardianName'
                control={control}
                rules={{
                 
                  validate: (value) => { // 'value' is the current lastName
                    const nicNo = getValues('nicNo'); // Get the other field's value

                    if (!value && !nicNo) {
                      return 'NIC or Name is required.';
                    }

                    // Check length *only if* this field has a value
                    if (value && value.length < 3) {
                      return 'Must be at least 3 characters.';
                    }

                    return true; 
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    // Override onChange to trigger validation on the other field
                    onChange={(e) => {
                     const value = e.target.value;
                     const nicNo = getValues('nicNo');
                      field.onChange(e);
                      trigger('nicNo'); // Trigger validation
                      if (value.length >= 3 || nicNo.length >= 3) {
                        handleSubmit(onSubmit)(); // 5. Call submit
                      }
                    }}
                    fullWidth
                    label='Guardian Name'
                    placeholder='Doe'
                    {...(errors.guardianName && { error: true, helperText: errors.guardianName.message })}
                  />
                )}
              />
            </Grid>           
   

            <Grid size={{ xs: 12 }} className='flex gap-4'>
              {/* <Button variant='contained' type='submit'>
                Submit
              </Button> */}
              <Button variant='tonal' color='secondary' type='reset' onClick={() => reset()}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>       
        <div className='flex flex-col gap-4'>
          <Typography variant='h5'>{`${data.length} Members`}</Typography>
          <div className='flex flex-col flex-wrap gap-4'>
            {/* 👇 CHECK IF DATA IS EMPTY */}
            {data.length === 0 ? (
              
              // 👇 IF EMPTY, SHOW THIS MESSAGE
              <Typography color='text.secondary' className='text-center'>
                Please enter NIC no or Guardian Name
              </Typography>

            ) : (
              
              // 👇 OTHERWISE, SHOW YOUR LIST
              data.map((member, index) => (
                <div key={index} className='flex items-center is-full gap-4'>
                  <Avatar src={`/images/avatars/common.png`} alt={member.name} />
                  <div className='flex justify-between items-center is-full overflow-hidden'>
                    <div className='flex flex-col items-start overflow-hidden'>
                      <Typography className='truncate is-full' color='text.primary'>
                        {member.name} - 2999912912853
                      </Typography>
                      <Typography variant='body2' className='truncate is-full'>
                        {member.email}
                      </Typography>
                      <Typography variant='body2' className='truncate is-full'>
                        {member.email}
                      </Typography>
                    </div>

                    <IconButton className='sm:hidden' onClick={handleClick}>
                      <i className='tabler-chevron-down text-base' />
                    </IconButton>

                    <Button
                      variant='contained'
                      className='flex'
                      startIcon={<i className='tabler-link text-base' />}
                      onClick={handleClick}
                      // endIcon={<i className='tabler-chevron-down text-base' />}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          {/* <div className='flex items-center flex-grow gap-2'>
            <i className='tabler-users text-xl' />
            <Typography
              color='text.primary'
              className='font-medium'
            >{`Public to ${themeConfig.templateName} - Pixinvent`}</Typography>
          </div>
          <Button variant='contained' className='flex' startIcon={<i className='tabler-link text-base' />}>
            Copy Project Link
          </Button> */}
                <Button
                    color='secondary'
                    className='hidden sm:flex'
                    onClick={() => {onSelectGuardian("Hello")}}
                  >
                    DIneth
                  </Button>          
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GuardianSelectDialogBox
