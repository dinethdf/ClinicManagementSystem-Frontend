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

export type ConfirmationType = 'delete-account' | 'unsubscribe' | 'suspend-account' | 'delete-order' | 'delete-customer' | 'cancel-appointment'

// Updated Props Interface
type ConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  type: ConfirmationType
  onConfirm?: (reason?: string) => Promise<any>
  paymentDetails?: { 
    invoiceStatus: string       // 'UNPAID','PAID','PARTIAL','CANCELLED'
    invoiceFinalAmount: number  // What the patient actually paid (or owes)
    doctorFee: number
    clinicFee: number
  } 
}

const ConfirmationDialog = ({ open, setOpen, type, onConfirm, paymentDetails }: ConfirmationDialogProps) => {
  const [secondDialog, setSecondDialog] = useState(false)
  const [userInput, setUserInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiMessage, setApiMessage] = useState<string>('')

  // Reason States
  const [reasonSelect, setReasonSelect] = useState<string>('Patient Request')
  const [customReason, setCustomReason] = useState<string>('')

  useEffect(() => {
    if (open) {
        setReasonSelect('Patient Request')
        setCustomReason('')
    }
  }, [open])

  const Wrapper = type === 'suspend-account' ? 'div' : Fragment

  const handleSecondDialogClose = () => {
    setSecondDialog(false)
    setOpen(false)
    setApiMessage('')
  }

  const handleConfirmation = async (value: boolean) => {
    if (!value) {
      setUserInput(false)
      setSecondDialog(true)
      setOpen(false)
      return
    }

    if (onConfirm) {
        setLoading(true)
        try {
            const finalReason = reasonSelect === 'Other' ? customReason : reasonSelect
            const response = await onConfirm(finalReason)
            
            if (response.success) {
                setUserInput(true)
                setApiMessage(response.message || 'Action completed successfully.')
            } else {
                setUserInput(false)
                setApiMessage(response.message || response.defaultMessage || 'Something went wrong.')
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

  // --- HELPER: Logic to determine if money needs to be returned ---
  const isPaid = paymentDetails?.invoiceStatus === 'PAID' || paymentDetails?.invoiceStatus === 'PARTIAL';
  const totalAppointmentValue = (paymentDetails?.doctorFee || 0) + (paymentDetails?.clinicFee || 0);
  const refundAmount = isPaid ? paymentDetails?.invoiceFinalAmount : 0;

  return (
    <>
      <Dialog fullWidth maxWidth='xs' open={open} onClose={() => !loading && setOpen(false)} closeAfterTransition={false}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          
          <i className='tabler-alert-circle text-[88px] mbe-6 text-warning' />
          
          <Wrapper {...(type === 'suspend-account' && { className: 'flex flex-col items-center gap-2' })}>
            <Typography variant='h4' className='mb-4'>
              {type === 'cancel-appointment' ? 'Cancel Appointment?' : 'Are you sure?'}
            </Typography>

            {/* --- REASON SELECTION & PAYMENT INFO (Only for Cancel) --- */}
            {type === 'cancel-appointment' && (
                <div className='w-full text-left flex flex-col gap-4 mb-4'>
                    
                    {/* FINANCIAL INFO BOX */}
                    {paymentDetails && (
                        <Box className={`p-3 rounded border flex flex-col gap-1 ${isPaid ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
                            
                            {/* Row 1: Status */}
                            <div className='flex justify-between items-center border-b border-dashed pb-2 mb-1'>
                                <Typography variant='caption' className='font-bold uppercase text-gray-500'>Payment Status</Typography>
                                <Typography variant='subtitle2' className={`font-bold ${isPaid ? 'text-success' : 'text-warning'}`}>
                                    {paymentDetails.invoiceStatus}
                                </Typography>
                            </div>

                            {/* Row 2: Values */}
                            <div className='flex justify-between items-center'>
                                <Typography variant='body2' className='text-gray-600'>Total Appt. Value:</Typography>
                                <Typography variant='body2' className='font-medium'>LKR {totalAppointmentValue.toFixed(2)}</Typography>
                            </div>
                            
                            {/* Row 3: Refund Highlight */}
                            <div className='flex justify-between items-center mt-1 bg-white p-2 rounded shadow-sm'>
                                <Typography variant='subtitle2' className='font-bold text-gray-800'>
                                    {isPaid ? "Refund Amount:" : "Refund Due:"}
                                </Typography>
                                <Typography variant='h6' className={`font-bold ${isPaid ? 'text-red-600' : 'text-gray-400'}`}>
                                    {isPaid ? `LKR ${paymentDetails.invoiceFinalAmount.toFixed(2)}` : 'LKR 0.00'}
                                </Typography>
                            </div>

                            <Typography variant='caption' className='text-center mt-1 text-gray-400'>
                                {isPaid 
                                    ? "* Verify patient identity before processing refund." 
                                    : "* Patient has not paid yet. No refund required."}
                            </Typography>
                        </Box>
                    )}

                    <FormControl fullWidth size='small' className='mt-2'>
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
                    {/* ... other types ... */}
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

      {/* Result Dialog */}
      <Dialog open={secondDialog} onClose={handleSecondDialogClose}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className={classnames('text-[88px] mbe-6', {
              'tabler-circle-check': userInput, 'text-success': userInput,
              'tabler-circle-x': !userInput, 'text-error': !userInput
            })}
          />
          <Typography variant='h4' className='mbe-2'>{userInput ? 'Success' : 'Failed'}</Typography>
          <Typography color='text.primary'>{apiMessage || (userInput ? 'Operation completed.' : 'Cancelled.')}</Typography>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' color={userInput ? 'success' : 'error'} onClick={handleSecondDialogClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfirmationDialog