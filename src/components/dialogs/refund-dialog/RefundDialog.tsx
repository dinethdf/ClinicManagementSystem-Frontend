'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

// Service & Validation
import { processRefund, processAdminOverrideRefund } from '@/services/financial/payment.service'
import { standardRefundSchema, adminOverrideRefundSchema } from '@/schemas/paymentSchemas'
import { safeParse } from 'valibot'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  invoiceId: number
  onSuccess?: () => void
}

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
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  // States
  const [tabIndex, setTabIndex] = useState(0)
  const [amount, setAmount] = useState<string>('')
  const [category, setCategory] = useState<'DOCTOR' | 'CLINIC'>('DOCTOR')
  const [refundMethod, setRefundMethod] = useState<string>('CASH')
  const [reason, setReason] = useState('')
  const [authorizedBy, setAuthorizedBy] = useState('')
  const [approvalNote, setApprovalNote] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setAmount('')
    setCategory('DOCTOR')
    setRefundMethod('CASH')
    setReason('')
    setAuthorizedBy('')
    setApprovalNote('')
    setError(null)
    setTabIndex(0)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
    setError(null)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    if (tabIndex === 0) {
      // Standard Refund
      const payload = {
        invoiceId: invoiceId,
        amount: parseFloat(amount || '0'),
        refundCategory: category,
        refundMethod: refundMethod,
        reason: reason,
        authorizedBy: authorizedBy
      }

      const validation = safeParse(standardRefundSchema, payload)
      if (!validation.success) {
        setError(validation.issues[0].message)
        setLoading(false)
        return
      }

      const result = await processRefund(payload)
      setLoading(false)

      if (result.success) {
        handleClose()
        if (onSuccess) onSuccess()
      } else {
        setError(result.message || "Refund failed")
      }
    } else {
      // Admin Override
      const payload = {
        invoiceId: invoiceId,
        refundAmount: parseFloat(amount || '0'),
        refundMethod: refundMethod,
        approvalNote: approvalNote
      }

      const validation = safeParse(adminOverrideRefundSchema, payload)
      if (!validation.success) {
        setError(validation.issues[0].message)
        setLoading(false)
        return
      }

      const result = await processAdminOverrideRefund(payload)
      setLoading(false)

      if (result.success) {
        handleClose()
        if (onSuccess) onSuccess()
      } else {
        setError(result.message || "Admin override refund failed")
      }
    }
  }

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
        {isAdmin && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="refund tabs">
              <Tab label="Standard Refund" />
              <Tab label="Admin Override" sx={{ color: 'error.main' }} />
            </Tabs>
          </Box>
        )}

        {error && (
            <Alert severity='error' className='mb-4'>{error}</Alert>
        )}

        {tabIndex === 0 && (
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Refund Category'
                value={category}
                onChange={e => {
                    setCategory(e.target.value as 'DOCTOR' | 'CLINIC')
                    setReason('') 
                }}
              >
                <MenuItem value='DOCTOR'>Doctor Fee</MenuItem>
                <MenuItem value='CLINIC'>Clinic Fee</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Refund Method'
                value={refundMethod}
                onChange={e => setRefundMethod(e.target.value)}
              >
                <MenuItem value='CASH'>Cash</MenuItem>
                <MenuItem value='CARD'>Card</MenuItem>
                <MenuItem value='ORIGINAL_METHOD'>Original Method</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12}>
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

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Authorized By'
                placeholder='e.g. Dr. Smith / Admin Name'
                value={authorizedBy}
                onChange={e => setAuthorizedBy(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
               <CustomTextField
                select
                fullWidth
                label='Quick Select Reason (Optional)'
                defaultValue=''
                value={currentReasonOptions.includes(reason) ? reason : ''} 
                onChange={e => setReason(e.target.value)} 
               >
                  <MenuItem value="" disabled>Select a reason...</MenuItem>
                  {currentReasonOptions.map((opt, index) => (
                      <MenuItem key={index} value={opt}>{opt}</MenuItem>
                  ))}
               </CustomTextField>
            </Grid>

            <Grid item xs={12}>
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
        )}

        {tabIndex === 1 && isAdmin && (
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Alert severity="warning" className="mb-4">
                Warning: You are using the Admin Override. This will force a refund even if payout locks are in place, potentially causing a financial discrepancy for the clinic.
              </Alert>
            </Grid>

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Refund Method'
                value={refundMethod}
                onChange={e => setRefundMethod(e.target.value)}
              >
                <MenuItem value='CASH'>Cash</MenuItem>
                <MenuItem value='CARD'>Card</MenuItem>
                <MenuItem value='ORIGINAL_METHOD'>Original Method</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={4}
                label='Approval Note (Required)'
                placeholder='Provide a detailed reason for overriding standard refund rules...'
                value={approvalNote}
                onChange={e => setApprovalNote(e.target.value)}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='contained' onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
          {loading ? 'Processing...' : (tabIndex === 1 ? 'Force Refund' : 'Confirm Refund')}
        </Button>
        <Button variant='tonal' color='secondary' onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RefundDialog