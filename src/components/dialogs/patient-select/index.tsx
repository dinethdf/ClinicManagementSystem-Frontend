'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box' // <-- CHANGED: Added Box import

import { useForm, Controller } from 'react-hook-form'

import CustomTextField from '@core/components/mui/TextField'

import DialogCloseButton from '../DialogCloseButton'

import type { PatientResponceDTO } from '@/types/patient.types'
import { patientService } from '@/services/patient.service'

type DialogBoxProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onSelectPatient: (patient: PatientResponceDTO) => void
}

type FormValues = {
  patientNo: string
  nicNo: string
  mobileNo: string
  patientName: string
}

const PatientSelectDialogBox = ({ open, setOpen, onSelectPatient }: DialogBoxProps) => {
  // States
  const [patientList, setPatientList] = useState<PatientResponceDTO[]>([])
  const [searchedBoxMessage, setSearchedBoxMessage] = useState('Please enter NIC no or Gsuardian Name to search.') // <-- ADD THIS
    const [formValues, setFormValues] = useState<FormValues | null>()

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      patientNo: '',
      nicNo: '',
      mobileNo: '',
      patientName: ''
    }
  })

  // Close handler to return focus
  const handleCloseDialog = () => {
    setOpen(false)
  }

  useEffect(() => {
    console.log("run effect")
   
    const timer = setTimeout(async () => {
      try {
        console.log('✅ patient found:', "Run search")
        console.log(formValues)
       
        if(formValues){
          
          const response = await patientService.getPatientBySearch(formValues?.patientNo, formValues?.nicNo, formValues?.patientName, formValues?.mobileNo)
          
          setPatientList(response)
        }else{
          
          setPatientList([]) // Clear list on error
          
          setSearchedBoxMessage('System Error Cant get form Value.')
        }
      
        } catch (err) {
      
        setPatientList([]) // Clear list on error
        setSearchedBoxMessage('No Patient found matching your search.')
       }
      }, 500)
    
        return () => clearTimeout(timer)
    }, [formValues])
  

  // Handler for form submission
  const onSubmit = async (data: FormValues) => {

    
    try {
      setFormValues(data)
    } catch (error) {
     
      console.log('No Data or error', error)
    }
  }

  // Handler for selecting a patient from the list
  const handleSelect = (patient: PatientResponceDTO) => {
    onSelectPatient(patient) // Pass selected name back to parent
    handleCloseDialog() // Close dialog and return focus
  }

  // Handler for the reset button
  const handleReset = () => {
    reset() // Reset react-hook-form
    setSearchedBoxMessage('Please enter NIC no or Patient Name to search.')
    setPatientList([])
  }

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      scroll='body'
      open={open}
      onClose={handleCloseDialog} // Use the custom close handler
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleCloseDialog} disableRipple>
        {' '}
        {/* Use custom handler */}
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Select Patient

      </DialogTitle>
      <DialogContent className='flex flex-col gap-6 pbs-0 sm:pli-16 sm:pbe-16'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='patientNo'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    inputRef={field.ref}
                    autoFocus
                    onFocus={(e) => {
                      setTimeout(() => {e.target.select();}, 5);
                    }}
                    onChange={e => {
                     
                      const value = e.target.value
                     
                      field.onChange(e)
                     
                      if (value.length >= 4) {
                      
                        handleSubmit(onSubmit)()
                      }
                    }}
                    fullWidth
                    label='Patient No'
                    placeholder='P2******'
                    {...(errors.patientNo && { error: true, helperText: errors.patientNo.message })}
                  />
                )}
              />
            </Grid>            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='nicNo'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    onChange={e => {
                     
                      const value = e.target.value
                    
                      field.onChange(e)
                    
                      if (value.length >= 3) {
                       
                        handleSubmit(onSubmit)()
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
                name='patientName'
                control={control}
                rules={{
                  validate: value => {
                  
                    if (value && value.length < 3) {
                      
                      return 'Must be at least 3 characters.'
                    }
                  
                    return true
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    onChange={e => {
                      
                      field.onChange(e)
                      
                      if (e.target.value.length >= 3) {
                        handleSubmit(onSubmit)()
                      }
                    }}
                    fullWidth
                    label='Patient Name'
                    placeholder='Doe'
                    {...(errors.patientName && { error: true, helperText: errors.patientName.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='mobileNo'
                control={control}
                rules={{
                  validate: value => {
                    
                    if (value && value.length < 3) {
                      return 'Must be at least 3 characters.'
                    }

                    return true
                  }
                }}

                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    onChange={e => {
                      
                      const value = e.target.value
                     
                      field.onChange(e)
                     
                      trigger('nicNo')
                     
                      if (value.length >= 3) {
                     
                        handleSubmit(onSubmit)()
                      }
                    }}
                    fullWidth
                    label='Mobile Number'
                    placeholder='Doe'
                    {...(errors.mobileNo && { error: true, helperText: errors.mobileNo.message })}
                  />
                )}
              />
            </Grid>                        
            <Grid size={{ xs: 12 }} className='flex gap-4'>
              <Button variant='tonal' color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
        <div className='flex flex-col gap-4'>
          <Typography variant='h5'>{`${patientList.length} Patient Found`}</Typography>

          {/* This is the scrollable Box container */}
          <Box
            className='flex flex-col gap-4'
            sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }} // <-- CHANGED: Replaced div with Box and added sx props
          >
            {patientList.length === 0 ? (
              <Typography color='text.secondary' className='text-center'>
                {searchedBoxMessage}
              </Typography>
            ) : (
              patientList.map(member => (
                <div key={member.id} className='flex items-center is-full gap-4'>
                  <Avatar src={`/images/avatars/common.png`} alt={member.firstName} />
                  <div className='flex justify-between items-center is-full overflow-hidden'>
                    <div className='flex flex-col items-start overflow-hidden'>
                      <Typography className='truncate is-full' color='text.primary'>
                        {member.firstName} {member.lastName} - {member.patientNo}
                      </Typography>
                      <Typography variant='body2' className='truncate is-full'>
                        {member.address} :  {member.mobileNo}
                      </Typography>
                    </div>
                    <Button
                      variant='contained'
                      className='flex'
                      startIcon={<i className='tabler-link text-base' />}
                      onClick={() => handleSelect(member)} // Use select handler
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))
            )}
          </Box>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PatientSelectDialogBox