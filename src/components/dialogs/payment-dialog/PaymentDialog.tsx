'use client'

import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

// Service & Validation
import { payInvoice } from '@/services/financial/payment.service'
import { invoicePaymentSchema } from '@/schemas/paymentSchemas'
import { safeParse } from 'valibot'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  invoiceId: number
  balanceRemaining: number
  onSuccess?: () => void
}

const PaymentDialog = ({ open, setOpen, invoiceId, balanceRemaining, onSuccess }: Props) => {
  // States
  const [amountPaid, setAmountPaid] = useState<string>(balanceRemaining.toString())
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH')
  const [paymentLocation, setPaymentLocation] = useState<string>('CLINIC_COUNTER')
  const [transactionCode, setTransactionCode] = useState<string>('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setAmountPaid(balanceRemaining.toString())
    setPaymentMethod('CASH')
    setPaymentLocation('CLINIC_COUNTER')
    setTransactionCode('')
    setError(null)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const payload = {
      invoiceId: invoiceId,
      amountPaid: parseFloat(amountPaid || '0'),
      paymentMethod: paymentMethod,
      paymentLocation: paymentLocation,
      transactionCode: transactionCode || undefined
    }

    const validation = safeParse(invoicePaymentSchema, payload)
    if (!validation.success) {
      setError(validation.issues[0].message)
      setLoading(false)
      return
    }

    if (payload.amountPaid > balanceRemaining) {
       setError("Amount paid cannot exceed the remaining balance.")
       setLoading(false)
       return
    }

    const result = await payInvoice(payload)
    setLoading(false)

    if (result.success) {
      handleClose()
      if (onSuccess) onSuccess()
    } else {
      setError(result.message || "Payment failed")
    }
  }

  return (
    <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth='sm' 
        fullWidth
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Process Payment
      </DialogTitle>

      <DialogContent className='pbs-0 sm:pli-16'>
        {error && (
            <Alert severity='error' className='mb-4'>{error}</Alert>
        )}

        <Alert severity='info' className='mb-4'>
            Remaining Balance: LKR {balanceRemaining.toFixed(2)}
        </Alert>

        <Grid container spacing={5}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Amount Paid'
              type='number'
              value={amountPaid}
              onChange={e => setAmountPaid(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position='start'>LKR</InputAdornment> 
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              select
              fullWidth
              label='Payment Method'
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
            >
              <MenuItem value='CASH'>Cash</MenuItem>
              <MenuItem value='CARD'>Card</MenuItem>
              <MenuItem value='ONLINE'>Online</MenuItem>
            </CustomTextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              select
              fullWidth
              label='Payment Location'
              value={paymentLocation}
              onChange={e => setPaymentLocation(e.target.value)}
            >
              <MenuItem value='CLINIC_COUNTER'>Clinic Counter</MenuItem>
              <MenuItem value='ONLINE'>Online Portal</MenuItem>
            </CustomTextField>
          </Grid>

          {(paymentMethod === 'CARD' || paymentMethod === 'ONLINE') && (
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Transaction Code (Optional)'
                placeholder='e.g. TXN-12345'
                value={transactionCode}
                onChange={e => setTransactionCode(e.target.value)}
              />
            </Grid>
          )}

        </Grid>
      </DialogContent>

      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='contained' onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
          {loading ? 'Processing...' : 'Confirm Payment'}
        </Button>
        <Button variant='tonal' color='secondary' onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PaymentDialog
