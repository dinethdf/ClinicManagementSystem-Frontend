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

// Services
import { processInvoicePayment } from '@/services/appointment/appoinment.server.service';
import { getInvoiceDetails } from '@/services/financial/invoice.server.service';
import { appointmentPrintInvoice } from '@/components/printable/billPrint/AppointmentPrintInvoice';

// --- TYPES ---
type Discount = {
  discountType: string;
  description: string;
  amount: number;
};

type AddEditPaymentData = {
  requiredPayment: number 
  payAmount: number | null 
  transactionId: string
  notes: string
}

type AddEditPaymentProps = {
  open: boolean
  setOpen: (open: boolean) => void
  appointmentId: number
  finalTotal: number 
  invoiceId: string
  discounts: Discount[]
  patientMobileNo: string
  mode?: 'FULL' | 'PARTIAL' 
}

const initialPaymentData: AddEditPaymentData = {
  requiredPayment: 0,
  payAmount: null,
  transactionId: '',
  notes: ''
}

const paymentMethodes: CustomInputHorizontalData[] = [
  { title: 'Cash', value: 'Cash', isSelected: true },
  { title: 'Card', value: 'Card' },
  { title: 'Bank', value: 'Bank Transfer' } 
]

const PaymentFinalizer = ({ 
    open, 
    setOpen, 
    appointmentId,
    finalTotal, 
    invoiceId, 
    discounts, 
    patientMobileNo,
    mode = 'FULL' 
}: AddEditPaymentProps) => {

  const router = useRouter()
  const params = useParams()
  const initialSelected: string = paymentMethodes.find(item => item.isSelected)?.value || 'Cash'

  const [selectedMethod, setSelectedMethod] = useState<string>(initialSelected)
  const [paymentDetails, setPaymentDetails] = useState<AddEditPaymentData>(initialPaymentData)

  // Initialize State
  useEffect(() => {
    if (open) {
      const defaultAmount = (mode === 'FULL' && initialSelected !== 'Cash') ? finalTotal : null;

      setPaymentDetails({
        ...initialPaymentData,
        requiredPayment: finalTotal,
        payAmount: defaultAmount
      })
      setSelectedMethod(initialSelected)
    }
  }, [open, finalTotal, initialSelected, mode])

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
    
    if (mode === 'FULL' && value !== 'Cash') {
        setPaymentDetails(prev => ({ ...prev, payAmount: finalTotal }))
    } else {
        setPaymentDetails(prev => ({ ...prev, payAmount: null }))
    }
  }

  const handleClose = () => setOpen(false)

  // --- LOGIC ---
  const enteredAmount = paymentDetails.payAmount ?? 0;
  const targetAmount = paymentDetails.requiredPayment; 

  let isValid = false;
  let balanceOrChange = 0;

  if (mode === 'FULL') {
      balanceOrChange = enteredAmount - targetAmount; 
      isValid = enteredAmount >= targetAmount;
  } else {
      balanceOrChange = targetAmount - enteredAmount; 
      isValid = enteredAmount > 0 && enteredAmount <= targetAmount;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;

    if (selectedMethod !== 'Cash' && !paymentDetails.transactionId) {
      alert("Transaction ID is required for non-cash payments.");
      
return;
    }
    
    const finalPayableAmount = (mode === 'PARTIAL') ? enteredAmount : targetAmount;

    // --- UPDATED PAYLOAD TO MATCH API REQUIREMENT ---
    const paymentPayload = {
      invoiceId: parseInt(invoiceId), 
      amountPaid: finalPayableAmount, // Match JSON: "amountPaid"
      paymentMethod: selectedMethod,  // e.g. "Cash"
      paymentLocation: "CLINIC_COUNTER", // Match JSON: "CLINIC_COUNTER"
      transactionCode: selectedMethod === 'Cash' ? null : paymentDetails.transactionId,
      receivedByStaffId: 1, // Match JSON: Hardcoded ID (Ideally get from Auth Context)
      discounts: discounts, // Matches JSON structure
      // Note: 'patientMobileNo' removed from payload as it was not in your JSON example
    };

    const result = await processInvoicePayment(paymentPayload);

    if (result.success) {
      toast.success("Payment successful!");
      
      const invoiceDetails = await getInvoiceDetails(parseInt(invoiceId));

      if (invoiceDetails) {
        appointmentPrintInvoice(invoiceDetails);
      }
      
      handleClose();
      router.replace(`/${params.lang}/clinic/appoinment/details/${appointmentId}`);
    } else {
      toast.error(result?.error?.message || "Payment failed");
    }
  };

  // Label Logic
  let inputLabel = 'Payment Amount';

  if (mode === 'FULL') {
      inputLabel = selectedMethod === 'Cash' ? 'Cash Received' : 'Charge Amount';
  }

  const isInputDisabled = mode === 'FULL' && selectedMethod !== 'Cash';

  return (
    <Dialog
      open={open}
      maxWidth='sm'
      fullWidth
      scroll='body'
      onClose={handleClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible', margin: '16px' } }}
    >
      <DialogTitle variant='h5' className='flex gap-1 flex-col text-center p-4 sm:pb-2'>
        {mode === 'FULL' ? 'Full Settlement' : 'Partial Payment'}
        <Typography variant="caption" component="span" className="text-gray-500"> 
            {mode === 'FULL' ? 'Settle remaining balance.' : 'Record installment.'}
        </Typography>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent className='p-4 sm:px-8'>
          <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
          
          <Grid container spacing={3}>
            
            {/* Payment Method */}
            {paymentMethodes.map((item, index) => (
              <CustomInputHorizontal
                type='radio'
                key={index}
                data={item}
                selected={selectedMethod}
                name='payment-method'
                handleChange={handleMethodChange}
                gridProps={{ size: { xs: 4, sm: 4 } }}
              />
            ))}

            {/* --- DISPLAY INFO --- */}
            <Grid size={{ xs: 12 }}>
              <Box className='flex flex-row justify-between items-center px-4 py-2 rounded border border-divider bg-action-hover'>
                <Typography variant='body1' color='text.secondary' className="font-medium">
                  Balance Due:
                </Typography>
                <Typography variant='h4' color='primary.main' className='font-bold'>
                  {targetAmount.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
                </Typography>
              </Box>
            </Grid>

            {/* --- AMOUNT INPUT --- */}
            <Grid size={{ xs: 12 }}>
                <CustomTextField
                    fullWidth
                    label={inputLabel}
                    name='payAmount'
                    type='number'
                    variant='outlined'
                    placeholder='0.00'
                    value={paymentDetails.payAmount ?? ''}
                    onChange={handleFormChange}
                    autoFocus={!isInputDisabled} 
                    disabled={isInputDisabled}
                    inputProps={{ style: { fontSize: '1.75rem', height: '2.5rem', textAlign: 'center', fontWeight: 'bold' }, min: 0 }}
                    helperText={mode === 'PARTIAL' && `Max allowed: ${targetAmount}`}
                />
            </Grid>

            {/* --- DYNAMIC FEEDBACK --- */}
            <Grid size={{ xs: 12 }} className='flex flex-row justify-between items-center px-2'>
                {mode === 'FULL' ? (
                    selectedMethod === 'Cash' && (
                        <>
                            <Typography variant='body1' className={`font-medium ${balanceOrChange >= 0 ? 'text-success' : 'text-error'}`}>
                                {balanceOrChange >= 0 ? 'Change:' : 'Missing:'}
                            </Typography>
                            <Typography variant='h4' className={`font-bold ${balanceOrChange >= 0 ? 'text-success' : 'text-error'}`}>
                                {Math.abs(balanceOrChange).toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
                            </Typography>
                        </>
                    )
                ) : (
                    <>
                        <Typography variant='body1' className='font-medium text-warning'>
                            Remaining:
                        </Typography>
                        <Typography variant='h4' className='font-bold text-warning'>
                            {Math.max(0, balanceOrChange).toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
                        </Typography>
                    </>
                )}
            </Grid>

            {/* --- TRANSACTION ID --- */}
            {selectedMethod !== 'Cash' && (
              <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label='Transaction Ref / ID'
                    name='transactionId'
                    placeholder='e.g., TRX-12345678'
                    value={paymentDetails.transactionId}
                    onChange={handleFormChange}
                    required
                  />
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
                <CustomTextField
                fullWidth
                size="small"
                label='Notes'
                name='notes'
                placeholder='Add note...'
                value={paymentDetails.notes}
                onChange={handleFormChange}
                />
            </Grid>

          </Grid>
        </DialogContent>
        
        <DialogActions className='justify-center p-4 pt-2'>
          <Button 
            variant='contained' 
            type='submit'
            color={isValid ? 'primary' : 'secondary'}
            disabled={!isValid}
            className="w-full sm:w-auto"
          >
            Confirm Payment
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose} className="w-full sm:w-auto">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PaymentFinalizer