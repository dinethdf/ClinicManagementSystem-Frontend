'use client'

// React Imports
import { Fragment, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import classnames from 'classnames'

// Service Imports
import { patientService } from '@/services/patient/patient.service' 

type StateType = 'delete-account' | 'unsubscribe' | 'deactivate-account' | 'delete-order' | 'delete-customer'

type ConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  type: StateType
  data?: any
}

const StateChangeDialog = ({ open, setOpen, type, data }: ConfirmationDialogProps) => {
  // States
  const [secondDialog, setSecondDialog] = useState(false)
  const [userInput, setUserInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Add loading state
  
  const router = useRouter()

  const Wrapper = type === 'deactivate-account' ? 'div' : Fragment

  const handleSecondDialogClose = () => {
    setSecondDialog(false)
    setOpen(false)

    if (userInput) {
        router.refresh() 
    }
  }

const handleState = async (value: boolean) => {
    if (!value) {
      setUserInput(false)
      setOpen(false)
      
return
    }


    if (type === 'deactivate-account' && data?.patientId) {
        try {

            await patientService.togglePatientStatus(String(data.patientId))
            
            setUserInput(true) 
            setSecondDialog(true) 
            setOpen(false)
        } catch (error) {
            console.error("Error updating status", error)
        }
    } 
    else {
        setUserInput(value)
        setSecondDialog(true)
        setOpen(false)
    }
  }

  let titleText = 'Are you sure?'
  let subText = ''
  let confirmBtnText = 'Yes'

  if (type === 'deactivate-account') {
     const isCurrentlyActive = data?.isActive

     titleText = isCurrentlyActive ? 'Are you sure you want to deactivate this user?' : 'Are you sure you want to activate this user?'
     subText = isCurrentlyActive ? "User won't be able to access services!" : "User will regain access to services."
     confirmBtnText = isCurrentlyActive ? 'Yes, Deactivate!' : 'Yes, Activate!'
  }

  return (
    <>
      <Dialog fullWidth maxWidth='xs' open={open} onClose={() => setOpen(false)} closeAfterTransition={false}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className='tabler-alert-circle text-[88px] mbe-6 text-warning' />
          <Wrapper className='flex flex-col items-center gap-2'>
            <Typography variant='h4'>{titleText}</Typography>
            {subText && <Typography color='text.primary'>{subText}</Typography>}
          </Wrapper>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' onClick={() => handleState(true)} disabled={isLoading}>
             {isLoading ? <CircularProgress size={24} color="inherit" /> : confirmBtnText}
          </Button>
          <Button
            variant='tonal'
            color='secondary'
            onClick={() => handleState(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Status Dialog */}
      <Dialog open={secondDialog} onClose={handleSecondDialogClose} closeAfterTransition={false}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i
            className={classnames('text-[88px] mbe-6', {
              'tabler-circle-check': userInput,
              'text-success': userInput,
              'tabler-circle-x': !userInput,
              'text-error': !userInput
            })}
          />
          <Typography variant='h4' className='mbe-2'>
            {userInput ? 'Success!' : 'Cancelled'}
          </Typography>
          <Typography color='text.primary'>
            {userInput && type === 'deactivate-account' 
                ? 'User status has been updated successfully.' 
                : 'Action completed.'}
          </Typography>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default StateChangeDialog