'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

import CustomTextField from '@core/components/mui/TextField'

// UPDATE: Import specific function instead of class instance
import { processBulkPayment } from '@/services/financial/payout.server.service'
import type { BulkPaymentRequest } from '@/types/payout.types'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  selectedIds: number[]
  totalAmount: number
  onSuccess: () => void
}

const PaymentConfirmationDialog = ({ open, setOpen, selectedIds, totalAmount, onSuccess }: Props) => {
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    paymentMethod: 'BANK_TRANSFER',
    reference: ''
  })

  const handleClose = () => {
    setOpen(false)
    setError(null)
    setFormData({ paymentMethod: 'BANK_TRANSFER', reference: '' })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const payload: BulkPaymentRequest = {
        paymentIds: selectedIds,
        paymentMethod: formData.paymentMethod as any,
        transactionReference: formData.reference,
        totalAmountToPay: totalAmount
    }

    // UPDATE: New Service Pattern handling
    const res = await processBulkPayment(payload)

    if (res.success) {
        onSuccess() // Refresh table
        handleClose()
    } else {
        // Handle error returned from service
        setError(res.error?.message || "Payment processing failed")
    }
    
    setLoading(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle variant='h4'>Confirm Payout</DialogTitle>
      <DialogContent>
        <div className='flex flex-col gap-4 pt-2'>
            
            {error && <Alert severity='error'>{error}</Alert>}

            <Alert severity='info' icon={false} className='font-medium text-lg'>
                Paying <span className='font-bold'>{selectedIds.length}</span> bills.
                <br/>
                Total: <span className='text-primary'>LKR {totalAmount.toFixed(2)}</span>
            </Alert>

            <CustomTextField
                select
                fullWidth
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
            >
                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                <MenuItem value="CHEQUE">Cheque</MenuItem>
                <MenuItem value="CASH">Cash</MenuItem>
            </CustomTextField>

            <CustomTextField
                fullWidth
                label="Transaction Reference / Cheque No"
                placeholder="e.g. REF-889900"
                value={formData.reference}
                onChange={e => setFormData({...formData, reference: e.target.value})}
            />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="tonal" disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="success" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Confirm Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PaymentConfirmationDialog