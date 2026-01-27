'use client'

// React Imports
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import { toast } from 'react-toastify'

// Type Import
import type { CustomInputHorizontalData } from '@core/components/custom-inputs/types'

// Components Imports
import CustomInputHorizontal from '@core/components/custom-inputs/Horizontal'
import CustomTextField from '@core/components/mui/TextField'

import DialogCloseButton from '../DialogCloseButton'

import { processInvoicePayment } from '@/services/appoinment.server.service';

// Add this import at the top
import { getInvoiceDetails } from '@/services/invoice.server.service';
import { appointmentPrintInvoice } from '@/components/printable/billPrint/AppointmentPrintInvoice';


// Define the shape of the payment data
type AddEditPaymentData = {
  requiredPayment: number
  payAmount: number | null
  transactionId: string
  notes: string
}

// 1. NEW: Define Discount Type (if not already shared)
type Discount = {
  discountType: string;
  description: string;
  amount: number;
};

// 2. UPDATED: Props to accept discounts
type AddEditPaymentProps = {
  open: boolean
  setOpen: (open: boolean) => void
  finalTotal: number
  invoiceId: string
  discounts: Discount[]
  patientMobileNo: string
}


const initialPaymentData: AddEditPaymentData = {
  requiredPayment: 0,
  payAmount: null,
  transactionId: '',
  notes: ''
}

const paymentMethodes: CustomInputHorizontalData[] = [
  {
    title: 'Cash',
    value: 'Cash', // Matched to your DB ENUM case
    isSelected: true
  },
  {
    title: 'Card',
    value: 'Card' // Matched to your DB ENUM case
  },
  {
    title: 'Bank Transfer', // You might need to add 'Bank Transfer' to your DB ENUM if you use it
    value: 'Bank Transfer'
  }
]

const PaymentFinalizer = ({ open, setOpen, finalTotal, invoiceId, discounts, patientMobileNo }: AddEditPaymentProps) => {

  const router = useRouter()
  const params = useParams()

  const initialSelected: string = paymentMethodes.find(item => item.isSelected)?.value || 'Cash'

  // States
  const [selectedMethod, setSelectedMethod] = useState<string>(initialSelected)
  const [paymentDetails, setPaymentDetails] = useState<AddEditPaymentData>(initialPaymentData)

  // Initialize state when dialog opens
  useEffect(() => {
    if (open) {
      setPaymentDetails({
        ...initialPaymentData,
        requiredPayment: finalTotal // Initialize with the passed total
      })
      setSelectedMethod(initialSelected)
    }
  }, [open, finalTotal, initialSelected])

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setPaymentDetails(prev => ({
      ...prev,
      [name]: name === 'payAmount' ? (value === '' ? null : parseFloat(value)) : value
    }))
  }

  const handleMethodChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    
    const value = typeof prop === 'string' ? prop : (prop.target as HTMLInputElement).value
    
    setSelectedMethod(value)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // --- CALCULATIONS ---
  const payAmount = paymentDetails.payAmount ?? 0;
  const required = paymentDetails.requiredPayment;
  const balance = payAmount - required;


const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  if (selectedMethod === 'Cash' && payAmount < required) {
    alert("Insufficient cash amount.");
    return;
  }

  if (selectedMethod !== 'Cash' && !paymentDetails.transactionId) {
    alert("Transaction ID is required for non-cash payments.");
    return;
  }

  const paymentPayload = {
    invoiceId: parseInt(invoiceId), 
    paymentMethod: selectedMethod,
    transactionCode: selectedMethod === 'Cash' ? null : paymentDetails.transactionId,
    discounts: discounts,
    patientMobileNo: patientMobileNo
  };

  const result = await processInvoicePayment(paymentPayload);

  if (result.success) {
    toast.success("Payment successful!");
    
    // Fetch invoice details and print
    const invoiceDetails = await getInvoiceDetails(parseInt(invoiceId));

    if (invoiceDetails) {

      appointmentPrintInvoice(invoiceDetails);
    }
    
    handleClose();
    router.replace(`/${params.lang}/clinic/appoinment/list`);
  } else {
    toast.error(result?.error?.message || "Payment failed");
    console.error("Payment Error:", result.error);
  }
};
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
        Process Payment
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
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
                selected={selectedMethod}
                name='payment-method'
                handleChange={handleMethodChange}
                gridProps={{ size: { xs: 12, sm: 4 } }}
              />
            ))}

            {/* --- CASH PAYMENT UI --- */}
            {selectedMethod === 'Cash' && (
              <>
                {/* Required Payment Display */}
                <Grid size={{ xs: 12 }}>
                  <Box className='flex flex-col items-center p-4 rounded border border-divider bg-action-hover'>
                    <Typography variant='body1' color='text.secondary'>
                      Required Payment
                    </Typography>
                    <Typography variant='h3' color='primary.main' className='font-medium'>
                      {required.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
                    </Typography>
                  </Box>
                </Grid>

                {/* Amount Received Input (BIG) */}
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    label='Cash Received'
                    name='payAmount'
                    type='number'
                    variant='outlined'
                    placeholder='0.00'
                    value={paymentDetails.payAmount ?? ''}
                    onChange={handleFormChange}
                    autoFocus
                    inputProps={{ style: { fontSize: '2rem', height: '3rem', textAlign: 'center' }, min: 0 }}
                    InputLabelProps={{ style: { fontSize: '1.25rem' } }}
                  />
                </Grid>

                {/* Balance / Change Display */}
                <Grid size={{ xs: 12 }} className='flex flex-col items-center gap-2'>
                    {balance >= 0 ? (
                         <>
                            <Typography variant='h6' className='font-medium text-success'>
                                Change to Return:
                            </Typography>
                            <Typography variant='h2' className='font-bold text-success'>
                                {balance.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
                            </Typography>
                         </>
                    ) : (
                         <>
                            <Typography variant='h6' className='font-medium text-error'>
                                Balance Due:
                            </Typography>
                            <Typography variant='h3' className='font-bold text-error'>
                                {Math.abs(balance).toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
                            </Typography>
                        </>
                    )}
                </Grid>
              </>
            )}

            {/* --- CARD / OTHER PAYMENT UI --- */}
            {selectedMethod !== 'Cash' && (
              <>
                <Grid size={{ xs: 12 }} className='flex flex-col items-center p-4 rounded border border-divider bg-action-hover'>
                   <Typography variant='h6' color='text.secondary'>
                    Total To Charge:
                   </Typography>
                   <Typography variant='h3' color='primary.main' className='font-medium'>
                    {required.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
                   </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    label='Transaction Reference / ID'
                    name='transactionId'
                    variant='outlined'
                    placeholder='e.g., TRX-12345678'
                    value={paymentDetails.transactionId}
                    onChange={handleFormChange}
                    autoFocus
                    required // HTML5 validation
                    inputProps={{ style: { fontSize: '1.25rem', padding: '1rem' } }}
                    InputLabelProps={{ style: { fontSize: '1.1rem' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    label='Notes (Optional)'
                    name='notes'
                    variant='outlined'
                    multiline
                    rows={3}
                    placeholder='Add any payment notes here...'
                    value={paymentDetails.notes}
                    onChange={handleFormChange}
                  />
                </Grid>
              </>
            )}

          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button 
            variant='contained' 
            size="large"
            type='submit'
            color={balance >= 0 || selectedMethod !== 'Cash' ? 'primary' : 'secondary'}
            disabled={selectedMethod === 'Cash' && balance < 0} // Disable if cash is insufficient
          >
            Confirm Payment
          </Button>
          <Button variant='tonal' color='secondary' size="large" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PaymentFinalizer
