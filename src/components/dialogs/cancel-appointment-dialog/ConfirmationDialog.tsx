'use client'

import { Fragment, useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'

import classnames from 'classnames'
import { toast } from 'react-toastify'
import { sendCancelSms } from '@/services/appointment/appoinment.server.service'

export type ConfirmationType = 'delete-account' | 'unsubscribe' | 'suspend-account' | 'delete-order' | 'delete-customer' | 'cancel-appointment'

type ConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  type: ConfirmationType

  // 1. UPDATED: onConfirm now accepts refundMethod
  onConfirm?: (reason?: string, refundMethod?: string) => Promise<{ success: boolean; message: string }>
  paymentDetails?: { 
    invoiceStatus: string      
    invoiceFinalAmount: number  
    amountPaid: number          
    balanceRemaining?: number   
    doctorFee: number
    clinicFee: number
  } 
  appointmentId?: number
  patientMobile?: string
}

const ConfirmationDialog = ({ open, setOpen, type, onConfirm, paymentDetails, appointmentId, patientMobile }: ConfirmationDialogProps) => {
  const [secondDialog, setSecondDialog] = useState(false)
  const [userInput, setUserInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiMessage, setApiMessage] = useState<string>('')

  // SMS states
  const [smsLoading, setSmsLoading] = useState(false)
  const [smsSent, setSmsSent] = useState(false)
  const [smsConfirmOpen, setSmsConfirmOpen] = useState(false)

  // Reason & Refund States
  const [reasonSelect, setReasonSelect] = useState<string>('Patient Request')
  const [customReason, setCustomReason] = useState<string>('')
  const [refundMethod, setRefundMethod] = useState<string>('CASH')

  useEffect(() => {
    if (open) {
        setReasonSelect('Patient Request')
        setCustomReason('')
        setRefundMethod('CASH')
        setSmsSent(false)
        setSmsLoading(false)
        setSmsConfirmOpen(false)
    }
  }, [open])

  const Wrapper = type === 'suspend-account' ? 'div' : Fragment

  const handleSecondDialogClose = () => {
    setSecondDialog(false)
    setOpen(false)
  }

  const handleConfirmation = async (value: boolean) => {
    if (!value) {
      setUserInput(false)
      setOpen(false)
      
return
    }

    if (onConfirm) {
        setLoading(true)

        try {
            const finalReason = reasonSelect === 'Other' ? customReason : reasonSelect

            // 3. UPDATED: Pass refundMethod only if a payment was made
            const selectedRefundMethod = hasPaid ? refundMethod : undefined;
            const response = await onConfirm(finalReason, selectedRefundMethod)
            
            if (response.success) {
                setUserInput(true)
                setApiMessage(response.message || 'Action completed successfully.')
            } else {
                setUserInput(false)
                setApiMessage(response.message || 'Something went wrong.')
            }
        } catch (error) {
            setUserInput(false)
            setApiMessage('An unexpected error occurred.')
        } finally {
            setLoading(false)
            setSecondDialog(true)
            setOpen(false)
        }
    } else {
        setUserInput(true)
        setSecondDialog(true)
        setOpen(false)
    }
  }

  const handleSendSmsClick = () => {
      setSmsConfirmOpen(true);
  }

  const handleSendSmsConfirm = async () => {
    if (!appointmentId) return;
    
    setSmsConfirmOpen(false);
    setSmsLoading(true);
    const response = await sendCancelSms(appointmentId);
    
    if (response.success) {
        setSmsSent(true);
        toast.success(response.message);
    } else {
        toast.error(response.message);
    }
    setSmsLoading(false);
  }

  // --- FINANCIAL LOGIC ---
  const amountPaid = paymentDetails?.amountPaid || 0;
  const hasPaid = amountPaid > 0;
  const totalAppointmentValue = (paymentDetails?.doctorFee || 0) + (paymentDetails?.clinicFee || 0);

  const getStatusColor = (status: string | undefined) => {
      switch (status) {
          case 'PAID': return 'text-success';
          case 'PARTIAL': return 'text-info';
          case 'UNPAID': return 'text-warning';
          case 'CANCELLED': return 'text-error';
          default: return 'text-gray-500';
      }
  };

  return (
    <>
      <Dialog fullWidth maxWidth='xs' open={open} onClose={() => !loading && setOpen(false)} closeAfterTransition={false}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          
          <i className='tabler-alert-circle text-[88px] mbe-6 text-warning' />
          
          <Wrapper {...(type === 'suspend-account' && { className: 'flex flex-col items-center gap-2' })}>
            <Typography variant='h4' className='mb-4'>
              {type === 'cancel-appointment' ? 'Cancel Appointment?' : 'Are you sure?'}
            </Typography>

            {type === 'cancel-appointment' && (
                <div className='w-full text-left flex flex-col gap-4 mb-4'>
                    
                    {/* FINANCIAL INFO BOX */}
                    {paymentDetails && (
                        <Box className={`p-3 rounded border flex flex-col gap-2 ${hasPaid ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
                            <div className='flex justify-between items-center border-b border-dashed pb-2'>
                                <Typography variant='caption' className='font-bold uppercase text-gray-500'>Payment Status</Typography>
                                <Typography variant='subtitle2' className={`font-bold ${getStatusColor(paymentDetails.invoiceStatus)}`}>
                                    {paymentDetails.invoiceStatus}
                                </Typography>
                            </div>

                            <div className='flex justify-between items-center'>
                                <Typography variant='body2' className='text-gray-600'>Total Fee:</Typography>
                                <Typography variant='body2' className='font-medium text-gray-600'>LKR {totalAppointmentValue.toFixed(2)}</Typography>
                            </div>

                            <div className='flex justify-between items-center'>
                                <Typography variant='body2' className='text-gray-600'>Amount Paid:</Typography>
                                <Typography variant='body2' className='font-bold text-gray-800'>LKR {amountPaid.toFixed(2)}</Typography>
                            </div>
                            
                            <div className='flex justify-between items-center mt-1 bg-white p-2 rounded shadow-sm border border-gray-100'>
                                <Typography variant='subtitle2' className='font-bold text-gray-800'>
                                    {hasPaid ? "Refund Amount:" : "No Refund Due"}
                                </Typography>
                                <Typography variant='h6' className={`font-bold ${hasPaid ? 'text-red-600' : 'text-gray-400'}`}>
                                    LKR {amountPaid.toFixed(2)}
                                </Typography>
                            </div>

                            <Typography variant='caption' className='text-center mt-1 text-gray-400 italic'>
                                {hasPaid 
                                    ? "* This amount will be marked for refund." 
                                    : "* Patient has not paid yet."}
                            </Typography>
                        </Box>
                    )}

                  {/* REFUND METHOD SELECTOR */}
                    {hasPaid && (
                        <FormControl fullWidth size='small' className='mt-2'>
                            <InputLabel>Refund Method</InputLabel>
                            <Select
                                label='Refund Method'
                                value={refundMethod}
                                onChange={(e) => setRefundMethod(e.target.value)}
                            >
                                <MenuItem value='CASH'>Cash</MenuItem>
                                <MenuItem value='CARD'>Card</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    {/* REASON SELECTOR */}
                    <FormControl fullWidth size='small' className={hasPaid ? 'mt-2' : 'mt-4'}>
                        <InputLabel>Reason for Cancellation</InputLabel>
                        <Select
                            label='Reason for Cancellation'
                            value={reasonSelect}
                            onChange={(e) => setReasonSelect(e.target.value)}
                        >
                            <MenuItem value='Doctor Unavailable'>Doctor Unavailable</MenuItem>
                            <MenuItem value='Patient Request'>Patient Request</MenuItem>
                            <MenuItem value='Scheduling Conflict'>Scheduling Conflict</MenuItem>
                            <MenuItem value='Mistake Entry'>Mistake Entry</MenuItem>
                            <MenuItem value='Other'>Other</MenuItem>
                        </Select>
                    </FormControl>

                    {reasonSelect === 'Other' && (
                        <TextField 
                            fullWidth 
                            multiline 
                            rows={2} 
                            label="Type reason here..." 
                            variant="outlined" 
                            size='small'
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                        />
                    )}
                </div>
            )}
            
            {type !== 'cancel-appointment' && (
                <Typography color='text.primary'>
                    {type === 'delete-account' && 'You won\'t be able to revert user!'}
                </Typography>
            )}

          </Wrapper>
        </DialogContent>
        
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button 
            variant='contained' 
            color='error'
            disabled={loading || (type === 'cancel-appointment' && reasonSelect === 'Other' && !customReason.trim())}
            onClick={() => handleConfirmation(true)}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Cancel'}
          </Button>
          <Button variant='tonal' color='secondary' disabled={loading} onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* RESULT DIALOG */}
      <Dialog open={secondDialog} onClose={handleSecondDialogClose}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className={classnames('text-[88px] mbe-6', {
              'tabler-circle-check': userInput, 'text-success': userInput,
              'tabler-circle-x': !userInput, 'text-error': !userInput
            })}
          />
          <Typography variant='h4' className='mbe-2'>{userInput ? 'Success' : 'Failed'}</Typography>
          <Typography color='text.primary' className='whitespace-pre-line mbe-4'>
            {apiMessage || (userInput ? 'Operation completed.' : 'Cancelled.')}
          </Typography>

          {/* SMS Notification UI */}
          {userInput && type === 'cancel-appointment' && (
             <Box className='w-full bg-gray-50 p-4 rounded border flex flex-col gap-3 items-center mb-4 mt-2'>
                <div className='flex items-center gap-2'>
                    <i className='tabler-phone text-gray-500' />
                    <Typography variant='body1' className='font-bold'>{patientMobile || 'No Mobile Available'}</Typography>
                </div>
                {patientMobile ? (
                    <Button 
                        variant='contained' 
                        color='primary' 
                        startIcon={smsLoading ? <CircularProgress size={20} color="inherit" /> : <i className='tabler-message' />}
                        onClick={handleSendSmsClick}
                        disabled={smsLoading || smsSent}
                        fullWidth
                    >
                        {smsSent ? 'SMS Sent!' : 'Send Cancellation SMS'}
                    </Button>
                ) : (
                    <Typography variant='caption' color='error'>Patient does not have a mobile number.</Typography>
                )}
             </Box>
          )}
          
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant={userInput && type === 'cancel-appointment' ? 'tonal' : 'contained'} color={userInput && type === 'cancel-appointment' ? 'secondary' : (userInput ? 'success' : 'error')} onClick={handleSecondDialogClose}>
            {userInput && type === 'cancel-appointment' ? 'Close' : 'Ok'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SMS Confirmation Dialog */}
      <Dialog fullWidth maxWidth='xs' open={smsConfirmOpen} onClose={() => setSmsConfirmOpen(false)}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className='tabler-alert-circle text-[88px] mbe-6 text-warning' />
          <Typography variant='h4' className='mb-4'>Send SMS?</Typography>
          <Typography color='text.primary'>
            Are you sure you want to send a cancellation SMS to {patientMobile}?
          </Typography>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' color='primary' onClick={handleSendSmsConfirm}>
            Yes, Send SMS
          </Button>
          <Button variant='tonal' color='secondary' onClick={() => setSmsConfirmOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfirmationDialog