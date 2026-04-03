'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'

// Service & Types
import { appointmentManageService } from '@/services/appointment/appointmentManage.service'
import type { AppointmentStatusDTO } from '@/types/appoinments.types'

interface StaffAppointmentActionDialogProps {
  open: boolean
  onClose: () => void
  appointmentInfo: AppointmentStatusDTO | null
  onSuccessAction: () => void
  userRole: string // 4. RECEIVE ROLE HERE
}

const StaffAppointmentActionDialog = ({ open, onClose, appointmentInfo, onSuccessAction, userRole }: StaffAppointmentActionDialogProps) => {
  const [loadingAction, setLoadingAction] = useState<'booked' | 'ongoing' | 'completed' | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showConfirmComplete, setShowConfirmComplete] = useState(false)

  useEffect(() => {
    if (open) {
      setShowConfirmComplete(false)
      setErrorMsg(null)
    }
  }, [open])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (errorMsg) {
      timer = setTimeout(() => setErrorMsg(null), 5000)
    }
    return () => clearTimeout(timer)
  }, [errorMsg])

  const handleClose = () => {
    setErrorMsg(null)
    setShowConfirmComplete(false)
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
      setErrorMsg(error.message)
    } finally {
      setLoadingAction(null)
      setShowConfirmComplete(false)
    }
  }

  if (!appointmentInfo) return null

  // UI Helpers
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name ? name.substring(0, 2).toUpperCase() : 'PT'
  }

  const isCompleted = appointmentInfo.statusCode === 'COMPLETED';
  const isDoctor = userRole === 'DOCTOR'; // 5. CHECK IF DOCTOR

return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden' }
      }}
    >
      {/* Header/Close Button */}
      <Box className="absolute top-2 right-2 z-10">
        <IconButton onClick={handleClose} size="small" disabled={loadingAction !== null}>
          <i className="tabler-x text-gray-500" />
        </IconButton>
      </Box>

      <DialogContent className="p-0 sm:p-0">
        <div className="flex flex-col">
          
          {/* Top Section: Queue Number & Status (Ticket Style) */}
          <div className="bg-primary/5 p-6 flex flex-col items-center justify-center border-b border-primary/10">
            <Typography variant="overline" className="text-primary font-bold tracking-widest mb-1">
              Queue Number
            </Typography>
            <Typography variant="h1" className="text-primary font-black text-6xl leading-none mb-4">
              {appointmentInfo.queuePosition || '--'}
            </Typography>
            <Chip 
                label={appointmentInfo.statusCode || 'UNKNOWN'} 
                color={
                  appointmentInfo.statusCode === 'ONGOING' ? 'warning' :
                  appointmentInfo.statusCode === 'COMPLETED' ? 'success' : 'info'
                } 
                variant="filled"
                size="small"
                className="font-bold tracking-wider px-2"
            />
          </div>

          {/* Error Message */}
          <Collapse in={!!errorMsg}>
            <div className="px-6 pt-4">
                <Alert severity="error" onClose={() => setErrorMsg(null)}>
                {errorMsg}
                </Alert>
            </div>
          </Collapse>

          {/* Middle Section: Patient Info */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <Avatar className="bg-primary/10 text-primary font-bold h-14 w-14 text-xl">
                {getInitials(appointmentInfo.patientName || '')}
              </Avatar>
              <div className="flex-1">
                 <Typography variant="h5" className="font-bold text-gray-800">
                   {appointmentInfo.patientName || 'Unknown Patient'}
                 </Typography>
                 <div className="flex gap-4 mt-1">
                    <Typography variant="body2" color="text.secondary">
                        <span className="font-semibold text-gray-500">Appt ID:</span> #{appointmentInfo.appointmentId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <span className="font-semibold text-gray-500">Patient ID:</span> #{appointmentInfo.patientId}
                    </Typography>
                 </div>
              </div>
            </div>

            {/* Bottom Section: Actions */}
            <Typography variant="subtitle2" className="font-bold text-gray-600 mb-3 uppercase tracking-wider text-center">
                Update Status
            </Typography>

            {/* Inline Confirmation for Completed */}
            <Collapse in={showConfirmComplete}>
                <Box className="bg-error/5 border border-error/20 p-4 rounded-xl flex flex-col items-center text-center mb-4">
                    <Typography variant="subtitle1" color="error" className="font-bold mb-1">
                    Mark as Completed?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-3">
                    This will remove the patient from the active queue.
                    </Typography>
                    <div className="flex gap-3 w-full">
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        color="secondary" 
                        onClick={() => setShowConfirmComplete(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        fullWidth
                        variant="contained" 
                        color="error"
                        disabled={loadingAction !== null}
                        onClick={() => handleStatusChange('completed')}
                    >
                        {loadingAction === 'completed' ? <CircularProgress size={20} color="inherit"/> : 'Confirm'}
                    </Button>
                    </div>
                </Box>
            </Collapse>

            {/* Standard Action Buttons */}
            {!showConfirmComplete && (
                <div className="flex flex-col sm:flex-row gap-3">
                
                {/* Conditionally render Booked and Ongoing buttons only if user is NOT a doctor */}
                {!isDoctor && (
                  <>
                    <Button 
                        variant={appointmentInfo.statusCode === 'BOOKED' ? "contained" : "tonal"} 
                        color="info"
                        className="flex-1 py-2.5"
                        disabled={loadingAction !== null || isCompleted}
                        onClick={() => handleStatusChange('booked')}
                        startIcon={loadingAction === 'booked' ? <CircularProgress size={20} color="inherit"/> : <i className='tabler-calendar-check' />}
                    >
                        Booked
                    </Button>

                    <Button 
                        variant={appointmentInfo.statusCode === 'ONGOING' ? "contained" : "tonal"} 
                        color="warning"
                        className="flex-1 py-2.5"
                        disabled={loadingAction !== null || isCompleted}
                        onClick={() => handleStatusChange('ongoing')}
                        startIcon={loadingAction === 'ongoing' ? <CircularProgress size={20} color="inherit"/> : <i className='tabler-activity' />}
                    >
                        Ongoing
                    </Button>
                  </>
                )}

                {/* Complete button is visible to everyone */}
                <Button 
                    variant={isCompleted ? "contained" : "tonal"} 
                    color="success"
                    className="flex-1 py-2.5"
                    disabled={loadingAction !== null || isCompleted}
                    onClick={() => setShowConfirmComplete(true)}
                    startIcon={<i className='tabler-check' />}
                >
                    {isCompleted ? 'Completed' : 'Complete'}
                </Button>
                </div>
            )}
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StaffAppointmentActionDialog