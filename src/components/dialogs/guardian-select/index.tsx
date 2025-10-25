'use client'

// React Imports
import { useState } from 'react'

import type {RefObject } from 'react'


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

import { patientService } from '@/services/patient.service' // Assuming Guardian[] is returned

import DialogCloseButton from '../DialogCloseButton'

import type { Guardian } from '@/libs/types/patient.types'

type DialogBoxProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onSelectGuardian: (guardian: Guardian) => void
  triggerRef: RefObject<HTMLElement | null> // Accept the ref to return focus
}

type FormValues = {
  nicNo: string
  guardianName: string
}

const GuardianSelectDialogBox = ({ open, setOpen, onSelectGuardian, triggerRef }: DialogBoxProps) => {
  // States
  const [guardianList, setGuardianList] = useState<Guardian[]>([])
  const [searchedBoxMessage, setSearchedBoxMessage] = useState('Please enter NIC no or Guardian Name to search.') // <-- ADD THIS

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      nicNo: '',
      guardianName: ''
    }
  })

  // Close handler to return focus
  const handleCloseDialog = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  // Handler for form submission
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await patientService.getGuardianForChildPatient(data.nicNo, data.guardianName)

      setGuardianList(response) // Populate the list with API data
      console.log('✅ Guardians found:', response)
    } catch (error) {
      setGuardianList([]) // Clear list on error
      setSearchedBoxMessage('No guardians found matching your search.')
      console.log('No Data or error', error)
    }
  }

  // Handler for selecting a guardian from the list
  const handleSelect = (guardian: Guardian) => {
    onSelectGuardian(guardian) // Pass selected name back to parent
    handleCloseDialog() // Close dialog and return focus
  }

  // Handler for the reset button
  const handleReset = () => {
    reset() // Reset react-hook-form
    setSearchedBoxMessage('Please enter NIC no or Guardian Name to search.')
    setGuardianList([]) // Clear the guardian list
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
        Select Guardian
        <Typography component='span' className='flex flex-col text-center'>
          Search for a guardian by NIC or Name
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
                  validate: value => {
                    const guardianName = getValues('guardianName')
                    
                    if (!value && !guardianName) {
                      return 'NIC or Name is required.'
                    }
                    
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
                     
                      const guardianName = getValues('guardianName')
                      
                      field.onChange(e)
                      trigger('guardianName')
                     
                      if (value.length >= 3 || (guardianName && guardianName.length >= 3)) {
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
                name='guardianName'
                control={control}
                rules={{
                  validate: value => {

                    const nicNo = getValues('nicNo')
                    
                    if (!value && !nicNo) {
                      return 'NIC or Name is required.'
                    }

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
                      
                      const nicNo = getValues('nicNo')
                    
                      field.onChange(e)
                      trigger('nicNo')
                      
                      if (value.length >= 3 || (nicNo && nicNo.length >= 3)) {
                        handleSubmit(onSubmit)()
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
              <Button variant='tonal' color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
        <div className='flex flex-col gap-4'>
          <Typography variant='h5'>{`${guardianList.length} Members Found`}</Typography>

          {/* This is the scrollable Box container */}
          <Box
            className='flex flex-col gap-4'
            sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }} // <-- CHANGED: Replaced div with Box and added sx props
          >
            {guardianList.length === 0 ? (
              <Typography color='text.secondary' className='text-center'>
                {searchedBoxMessage}
              </Typography>
            ) : (
              guardianList.map(member => (
                <div key={member.id} className='flex items-center is-full gap-4'>
                  <Avatar src={`/images/avatars/common.png`} alt={member.firstName} />
                  <div className='flex justify-between items-center is-full overflow-hidden'>
                    <div className='flex flex-col items-start overflow-hidden'>
                      <Typography className='truncate is-full' color='text.primary'>
                        {member.firstName} - {member.nic}
                      </Typography>
                      <Typography variant='body2' className='truncate is-full'>
                        {member.email}
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

export default GuardianSelectDialogBox