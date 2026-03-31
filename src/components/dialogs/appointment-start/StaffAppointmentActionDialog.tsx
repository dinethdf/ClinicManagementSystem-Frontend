'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'

// Service & Types
import { appointmentManageService } from '@/services/appointment/appointmentManage.service'
import type { AppointmentStatusDTO } from '@/types/appoinments.types'

interface StaffAppointmentActionDialogProps {
  open: boolean
  onClose: () => void
  appointmentInfo: AppointmentStatusDTO | null
  onSuccessAction: () => void // Callback to reset scanner after success
}

const StaffAppointmentActionDialog = ({ open, onClose, appointmentInfo, onSuccessAction }: StaffAppointmentActionDialogProps) => {
  const [loadingAction, setLoadingAction] = useState<'booked' | 'ongoing' | 'completed' | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleClose = () => {
    setErrorMsg(null)
    onClose()
  }

  const handleStatusChange = async (action: 'booked' | 'ongoing' | 'completed') => {
    if (!appointmentInfo?.appointmentId || !appointmentInfo?.patientId) {
      setErrorMsg("Missing appointment or patient ID.")
      return
    }

    setLoadingAction(action)
    setErrorMsg(null)

    const payload = {
      appointmentId: appointmentInfo.appointmentId,
      patientId: appointmentInfo.patientId
    }

    try {
      let res;
      if (action === 'booked') {
        res = await appointmentManageService.markAsBooked(payload)
      } else if (action === 'ongoing') {
        res = await appointmentManageService.markAsOngoing(payload)
      } else if (action === 'completed') {
        res = await appointmentManageService.markAsCompleted(payload)
      }

      toast.success(res?.message || `Appointment marked as ${action.toUpperCase()}`, { className: 'custom-toast' })
      onSuccessAction()
      handleClose()
    } catch (error: any) {
      // This catches the 'defaultMessage' we mapped in the service
      setErrorMsg(error.message)
    } finally {
      setLoadingAction(null)
    }
  }

  if (!appointmentInfo) return null

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle component="div">
        <Typography variant="h4">Appointment Details</Typography>
      </DialogTitle>
      
      <DialogContent dividers className="flex flex-col gap-4">
        {errorMsg && (
          <Alert severity="error" onClose={() => setErrorMsg(null)}>
            {errorMsg}
          </Alert>
        )}

        <Grid container spacing={4} className="mb-2">
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary">Queue Number</Typography>
            <Typography variant="h3" color="primary" className="font-bold">
              {appointmentInfo.queuePosition || 'N/A'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }} className="text-right">
            <Typography variant="caption" color="text.secondary">Current Status</Typography>
            <div className="mt-1">
              <Chip label={appointmentInfo.statusCode || 'UNKNOWN'} color={
                appointmentInfo.statusCode === 'ONGOING' ? 'warning' :
                appointmentInfo.statusCode === 'COMPLETED' ? 'success' : 'default'
              } />
            </div>
          </Grid>
        </Grid>

        <Divider />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary">Patient Name</Typography>
            <Typography variant="body1" className="font-bold text-lg">
              {appointmentInfo.patientName || 'Unknown Patient'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary">Appointment ID</Typography>
            <Typography variant="body2">#{appointmentInfo.appointmentId}</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary">Patient ID</Typography>
            <Typography variant="body2">#{appointmentInfo.patientId}</Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions className="justify-center p-4 flex-wrap gap-2">
        <Button 
          variant="outlined" 
          color="info"
          disabled={loadingAction !== null}
          onClick={() => handleStatusChange('booked')}
          startIcon={loadingAction === 'booked' ? <CircularProgress size={20} color="inherit"/> : <i className='tabler-calendar-check' />}
        >
          Booked
        </Button>

        <Button 
          variant="outlined" 
          color="warning"
          disabled={loadingAction !== null}
          onClick={() => handleStatusChange('ongoing')}
          startIcon={loadingAction === 'ongoing' ? <CircularProgress size={20} color="inherit"/> : <i className='tabler-activity' />}
        >
          Ongoing
        </Button>

        <Button 
          variant="contained" 
          color="success"
          disabled={loadingAction !== null}
          onClick={() => handleStatusChange('completed')}
          startIcon={loadingAction === 'completed' ? <CircularProgress size={20} color="inherit"/> : <i className='tabler-check' />}
        >
          Completed
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StaffAppointmentActionDialog