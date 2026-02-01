'use client'

import { useState, useEffect } from 'react'

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

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

// Service
import { processRefund, type RefundPayload } from '@/services/invoice.server.service'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  invoiceId: number
  onSuccess?: () => void
}

// --- PREDEFINED REASONS ---
const DOCTOR_REASONS = [
    "Doctor decided to waive fee",
    "Service not satisfactory (Doctor issue)",
    "Doctor unavailable / Left early"
]

const CLINIC_REASONS = [
    "Administrative / Billing Error",
    "Appointment cancelled by Clinic",
    "Equipment failure / Technical issue"
]

const RefundDialog = ({ open, setOpen, invoiceId, onSuccess }: Props) => {
  // States
  const [amount, setAmount] = useState<string>('')
  const [category, setCategory] = useState<'DOCTOR' | 'CLINIC'>('DOCTOR')
  const [reason, setReason] = useState('')
  const [authorizedBy, setAuthorizedBy] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setAmount('')
    setCategory('DOCTOR')
    setReason('')
    setAuthorizedBy('')
    setError(null)
  }

  const handleSubmit = async () => {
    // Basic Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }
    if (!reason) {
      setError("Please provide a reason")
      return
    }
    if (!authorizedBy) {
        setError("Authorized By field is required")
        return
      }

    setLoading(true)
    setError(null)

    const payload: RefundPayload = {
      invoiceId: invoiceId,
      amount: parseFloat(amount),
      refundCategory: category,
      reason: reason,
      authorizedBy: authorizedBy
    }

    const result = await processRefund(payload)

    setLoading(false)

    if (result.success) {
      handleClose()
      if (onSuccess) onSuccess()
    } else {
      setError(result.message || "Refund failed")
    }
  }

  // Determine which list to show based on category
  const currentReasonOptions = category === 'DOCTOR' ? DOCTOR_REASONS : CLINIC_REASONS

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
        Process Refund
      </DialogTitle>

      <DialogContent className='pbs-0 sm:pli-16'>
        {error && (
            <Alert severity='error' className='mb-4'>{error}</Alert>
        )}

        <Grid container spacing={5}>
          
          {/* 1. Category Selection */}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              select
              fullWidth
              label='Refund Category'
              value={category}
              onChange={e => {
                  setCategory(e.target.value as 'DOCTOR' | 'CLINIC')
                  setReason('') // Clear reason when category changes to avoid confusion
              }}
            >
              <MenuItem value='DOCTOR'>Doctor Fee Refund</MenuItem>
              <MenuItem value='CLINIC'>Clinic/Hospital Fee Refund</MenuItem>
            </CustomTextField>
          </Grid>

          {/* 2. Amount */}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              label='Refund Amount'
              type='number'
              value={amount}
              onChange={e => setAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position='start'>LKR</InputAdornment> 
              }}
            />
          </Grid>

          {/* 3. Authorized By */}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              label='Authorized By'
              placeholder='e.g. Dr. Smith / Admin Name'
              value={authorizedBy}
              onChange={e => setAuthorizedBy(e.target.value)}
            />
          </Grid>

          {/* 4. Quick Reason Select (New) */}
          <Grid size={{ xs: 12 }}>
             <CustomTextField
              select
              fullWidth
              label='Quick Select Reason (Optional)'
              defaultValue=''
              value={currentReasonOptions.includes(reason) ? reason : ''} // Only match if exact string matches
              onChange={e => setReason(e.target.value)} // Sets the main reason state
             >
                <MenuItem value="" disabled>Select a reason...</MenuItem>
                {currentReasonOptions.map((opt, index) => (
                    <MenuItem key={index} value={opt}>{opt}</MenuItem>
                ))}
             </CustomTextField>
          </Grid>

          {/* 5. Detailed Reason (Multiline) */}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              multiline
              rows={3}
              label='Reason / Notes'
              placeholder='Select a reason above or type here...'
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='contained' onClick={handleSubmit} disabled={loading}>
          {loading ? 'Processing...' : 'Confirm Refund'}
        </Button>
        <Button variant='tonal' color='secondary' onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RefundDialog