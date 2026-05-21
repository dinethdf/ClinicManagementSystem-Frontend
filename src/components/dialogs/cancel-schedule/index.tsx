'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

// Type Imports
import { AppointmentCancelDTO } from '@/types/doctor.types'

// Service Imports
import { cancelScheduleCascade } from '@/services/doctor/doctor.shedule.server.service'
import { toast } from 'react-toastify'

interface CancelScheduleProps {
  open: boolean
  setOpen: (open: boolean) => void
  scheduleId: number
}

const CancelScheduleDialog = ({ open, setOpen, scheduleId }: CancelScheduleProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { control, handleSubmit, formState: { errors } } = useForm<AppointmentCancelDTO>({
    defaultValues: {
      reason: '',
      refundMethod: 'CASH'
    }
  })

  const handleClose = () => {
    setOpen(false)
    setError(null)
  }

  const onSubmit = async (data: AppointmentCancelDTO) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await cancelScheduleCascade(scheduleId, data)
      if (res.success) {
        toast.success(res.message)
        router.refresh()
        handleClose()
      } else {
        setError(res.message)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle className='sm:pbs-16 sm:pli-16 text-center'>
        <Typography variant='h4' component='span' className='mbe-2'>
          Cancel Schedule & Refund
        </Typography>
        <Typography variant='body2'>
          This will cancel all associated appointments and initiate refunds.
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='sm:pli-16 sm:pbe-16'>
          {error && <Alert severity='error' className='mbe-4'>{error}</Alert>}
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='reason'
                control={control}
                rules={{ required: 'Reason is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    rows={3}
                    multiline
                    label='Cancellation Reason'
                    placeholder='Enter the reason for cancelling this schedule...'
                    error={!!errors.reason}
                    helperText={errors.reason?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='refundMethod'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Refund Method'
                  >
                    <MenuItem value='CASH'>Cash</MenuItem>
                    <MenuItem value='CARD'>Card</MenuItem>
                    <MenuItem value='ORIGINAL_METHOD'>Original Payment Method</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center sm:pbe-16 sm:pli-16'>
          <Button variant='contained' color='error' type='submit' disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} color='inherit' /> : 'Confirm Cancellation'}
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CancelScheduleDialog
