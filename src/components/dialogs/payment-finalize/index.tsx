'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box' // Import Box

// Third-party Imports
import classnames from 'classnames'

// Type Import
import { CustomInputHorizontalData } from '@core/components/custom-inputs/types'

// Components Imports
import CustomInputHorizontal from '@core/components/custom-inputs/Horizontal'
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

type AddEditPaymentData = {
  requiredPayment?: number
  payAmount?: number | null
  balances?: number
  transactionId?: string
  notes?: string
}

type AddEditPaymentProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: { requiredPayment: number }
}

const initialPaymentData: AddEditPaymentData = {
  requiredPayment: 0,
  payAmount: null,
  balances: 0,
  transactionId: '',
  notes: ''
}

const paymentMethodes: CustomInputHorizontalData[] = [
  {
    title: 'Cash',
    value: 'cash',
    isSelected: true
  },
  {
    title: 'Card',
    value: 'card'
  },
  {
    title: 'Bank Transfer',
    value: 'bankTransfer'
  }
]

const AddEditPayment = ({ open, setOpen, data }: AddEditPaymentProps) => {
  const initialSelected: string = paymentMethodes.find(item => item.isSelected)?.value || 'cash'

  // States
  const [selected, setSelected] = useState<string>(initialSelected)
  const [paymentDetails, setPaymentDetails] = useState(initialPaymentData)

  useEffect(() => {
    if (open) {
      setPaymentDetails({
        ...initialPaymentData,
        requiredPayment: data?.requiredPayment ?? 0
      })
      setSelected(initialSelected)
    }
  }, [open, data, initialSelected])

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setPaymentDetails(prev => ({
      ...prev,
      [name]: name === 'payAmount' ? (value === '' ? null : parseFloat(value)) : value
    }))
  }

  const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    const value = typeof prop === 'string' ? prop : (prop.target as HTMLInputElement).value
    setSelected(value)
  }

    const payAmount = paymentDetails.payAmount ? parseFloat(String(paymentDetails.payAmount)) : 0
  const requiredPayment = 1500.00 ?? 0
  const balance = payAmount - requiredPayment




  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      maxWidth='md'
      scroll='body'
      onClose={handleClose}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Payment
      </DialogTitle>
      <form onSubmit={e => e.preventDefault()}>
        <DialogContent className='pbs-0 sm:pli-16'>
          <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
          <Grid container spacing={6}>
            {/* Payment Method Selection */}
            {paymentMethodes.map((item, index) => (
              <CustomInputHorizontal
                type='radio'
                key={index}
                data={item}
                selected={selected}
                name='custom-radios-basic'
                handleChange={handleChange}
                gridProps={{ size: { xs: 12, sm: 4 } }}
              />
            ))}

            {/* --- START: Conditional UI --- */}

            {/* === CASH PAYMENT === */}
            {selected === 'cash' && (
              <>
                {/* 1. NEW "Required Payment" display */}
                <Grid size={{ xs: 12 }}>
                  <Box className='flex flex-col items-center p-4 rounded border border-divider bg-action-hover'>
                    <Typography variant='body1' color='text.secondary'>
                      Required Payment
                    </Typography>
                    <Typography variant='h4' color='text.primary' className='font-medium'>
                      {requiredPayment.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>

                {/* 2. BIGGER "Amount Received" input */}
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    label='Amount Received'
                    name='payAmount'
                    type='number'
                    variant='outlined'
                    placeholder='Enter amount paid'
                    value={paymentDetails.payAmount ?? ''}
                    onChange={handleFormChange}
                    autoFocus
                    inputProps={{ style: { fontSize: '1.5rem', height: '2rem' } }}
                    InputLabelProps={{ style: { fontSize: '1.25rem' } }}
                  />
                </Grid>

                {/* 3. BIGGER "Balance" display */}
                <Grid size={{ xs: 12 }} className='flex flex-col items-center gap-1'>
                  <Typography variant='h6' className='font-medium'>
                    Balance (Change to return):
                  </Typography>
                  <Typography
                    variant='h4' // <-- Made bigger
                    className={classnames('font-medium', {
                      'text-success': balance >= 0,
                      'text-error': balance < 0
                    })}
                  >
                    {balance.toLocaleString()}
                  </Typography>
                  {balance < 0 && payAmount > 0 && (
                    <Typography variant='caption' color='error'>
                      Payment is short by {Math.abs(balance).toLocaleString()}
                    </Typography>
                  )}
                </Grid>
              </>
            )}

            {/* === CARD / BANK TRANSFER === */}
            {(selected === 'card' || selected === 'bankTransfer') && (
              <>
                {/* 4. BIGGER "Required Payment" display */}
                <Grid size={{ xs: 12 }} className='flex flex-col items-center'>
                   <Typography variant='h6' color='text.secondary'>
                    Required Payment:
                   </Typography>
                   <Typography variant='h4' color='text.primary' className='font-medium mb-4'>
                    {requiredPayment.toLocaleString()}
                   </Typography>
                </Grid>

                {/* 5. BIGGER "Transaction" input */}
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    label='Transaction ID / Reference'
                    name='transactionId'
                    variant='outlined'
                    placeholder='Enter transaction reference'
                    value={paymentDetails.transactionId}
                    onChange={handleFormChange}
                    autoFocus
                    inputProps={{ style: { fontSize: '1.25rem' } }}
                    InputLabelProps={{ style: { fontSize: '1.25rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    label='Notes'
                    name='notes'
                    variant='outlined'
                    multiline
                    rows={3}
                    placeholder='Add any payment notes here...'
                    value={paymentDetails.notes}
                    onChange={handleFormChange}
                    inputProps={{ style: { fontSize: '1rem' } }}
                    InputLabelProps={{ style: { fontSize: '1.25rem' } }}
                  />
                </Grid>
              </>
            )}
            {/* --- END: Conditional UI --- */}
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' onClick={handleClose} type='submit'>
            Submit Payment
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose} type='reset'>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddEditPayment