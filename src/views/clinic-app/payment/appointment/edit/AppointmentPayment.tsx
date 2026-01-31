'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Chip } from '@mui/material'

// Third-party Imports
import { useForm, useFieldArray, Controller } from 'react-hook-form'

// Type Imports
import type { ButtonProps } from '@mui/material/Button'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import PaymentFinalizer from '@/components/dialogs/payment-finalize'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Define types
interface InvoiceItem {
  description: string;
  typeName: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
}

interface InvoiceFormData {
  discounts: {
    discountType: string;
    description: string;
    amount: number;
  }[];
  note: string;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const AppointmentPayment = ({ id, appointmentInvDetails }: { id: string; appointmentInvDetails?: any }) => {
  
  // Parse date safely
  const [issueDate, setIssueDate] = useState<Date | null | undefined>(
     appointmentInvDetails?.dateIssued ? new Date(appointmentInvDetails.dateIssued) : new Date()
  )

  // --- 1. SEPARATE ITEMS VS DISCOUNTS ---
  const { billableItems, existingDiscounts } = useMemo(() => {
    const rawItems: InvoiceItem[] = appointmentInvDetails?.items || [];
    
    // Filter out discounts from the main table
    const billable = rawItems.filter(item => !item.typeName.includes('DISCOUNT') && item.totalAmount >= 0);
    
    // Extract discounts for form initialization (if editing is needed or for display logic)
    const discounts = rawItems
        .filter(item => item.typeName.includes('DISCOUNT'))
        .map(d => ({
            discountType: d.typeName,
            description: d.description,
            amount: Math.abs(d.totalAmount) // Ensure positive for UI inputs
        }));

    return { billableItems: billable, existingDiscounts: discounts };
  }, [appointmentInvDetails]);

  // --- 2. STATUS & PAYMENT LOGIC ---
  const statusCode = appointmentInvDetails?.status?.code;
  // It is payable if UNPAID or PARTIAL
  const isPayable = statusCode === "UNPAID" || statusCode === "PARTIAL";
  const isFullyPaid = statusCode === "PAID";

  const { control, watch } = useForm<InvoiceFormData>({
    defaultValues: {
      // If UNPAID, we might start empty. If PARTIAL/PAID, we load existing discounts to show them.
      discounts: isPayable && statusCode === "UNPAID" ? [] : existingDiscounts,
      note: appointmentInvDetails?.appointmentNote || 'Thank you for choosing CureGuard Clinic.'
    }
  });

  const { fields: discountFields, append: appendDiscount, remove: removeDiscount } = useFieldArray({
    control,
    name: 'discounts'
  });

  // --- 3. CALCULATIONS ---
  const watchedDiscounts = watch('discounts');

  // A. Subtotal
  // Use API subtotal if available, else calc from billable items
  const displaySubtotal = appointmentInvDetails?.subtotal || billableItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

  // B. Discounts
  // For calculation: Use form values if editable, otherwise use API totalDiscount
  const formDiscountTotal = watchedDiscounts?.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) || 0;
  const displayTotalDiscount = (statusCode === "UNPAID") ? formDiscountTotal : (appointmentInvDetails?.totalDiscount || formDiscountTotal);

  // C. Totals
  const finalTotalAmount = Math.max(0, displaySubtotal - displayTotalDiscount);
  const amountPaidSoFar = appointmentInvDetails?.amountPaid || 0;
  
  // D. Balance Due (Important for Partial)
  const balanceDue = Math.max(0, finalTotalAmount - amountPaidSoFar);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 2 }).format(amount);
  };

  // Button Props for "Full Payment"
  const fullPaymentBtnProps: ButtonProps = {
      variant: 'contained',
      color: "success",
      className: "capitalize w-full",
      children: 'Full Settle',
      startIcon: <i className='tabler-check' />
  }  

  // Button Props for "Partial Payment"
  const partialPaymentBtnProps: ButtonProps = {
      variant: 'outlined',
      color: "primary",
      className: "capitalize w-full",
      children: 'Partial Payment',
      startIcon: <i className='tabler-adjustments-dollar' />
  }

  return (
    <>
      <Grid size={{ xs: 12, md: 9 }}>
        <Card>
          <CardContent className='sm:p-12!'>
            <Grid container spacing={6}>
              {/* --- Header Section --- */}
              <Grid size={{ xs: 12 }}>
                <div className='p-6 rounded bg-actionHover'>
                  <div className='flex justify-between gap-4 flex-col sm:flex-row'>
                    <div className='flex flex-col gap-6'>
                      <div className='flex items-center gap-2.5'>
                        <Logo />
                      </div>
                      <div>
                        <Typography color='text.primary' className='font-medium'>CureGuard Clinic</Typography>
                        <Typography color='text.secondary'>Main Street, Pelmadulla, Rathnapura</Typography>
                        <Typography color='text.secondary'>+94 (45) 2277222</Typography>
                      </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center gap-4'>
                        <Typography variant='h5' className='min-is-[95px]'>
                          Invoice
                        </Typography>
                        <CustomTextField
                          fullWidth
                          value={appointmentInvDetails?.invoiceId || id}
                          slotProps={{
                            input: {
                              disabled: true,
                              startAdornment: <InputAdornment position='start'>#</InputAdornment>
                            }
                          }}
                        />
                      </div>
                      <div className='flex items-center'>
                        <Typography className='min-is-[95px] mie-4' color='text.primary'>
                          Date Issued:
                        </Typography>
                        <AppReactDatepicker
                          disabled
                          boxProps={{ className: 'is-full' }}
                          selected={issueDate}
                          onChange={(date: Date | null) => setIssueDate(date)}
                          customInput={<CustomTextField fullWidth />}
                        />
                      </div>
                      
                      {/* Status Chip */}
                      {appointmentInvDetails?.status && (
                        <Chip 
                          label={appointmentInvDetails.status.displayName || appointmentInvDetails.status.code} 
                          sx={{ 
                              backgroundColor: appointmentInvDetails.status.colorCode || '#primary', 
                              color: '#fff' 
                          }}
                          size='medium'
                          variant='filled'
                          className='mt-1 w-max uppercase font-bold text-[10px]' 
                        />
                      )}                      
                    </div>
                  </div>
                </div>
              </Grid>

              {/* --- Bill To & Appointment Details --- */}
              <Grid size={{ xs: 12 }} container spacing={6}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography className='font-medium mbe-2' color='text.primary'>
                        Bill To:
                    </Typography>
                    <div className='flex flex-col gap-1'>
                        <Typography color='text.primary' className='font-medium'>{appointmentInvDetails?.patientName}</Typography>
                        <Typography color='text.secondary'>{appointmentInvDetails?.patientAddress}</Typography>
                        <Typography color='text.secondary'>{appointmentInvDetails?.patientContactNo}</Typography>
                        <Typography color='text.secondary' className='text-sm mt-1'>ID: {appointmentInvDetails?.patientNo}</Typography>
                    </div>
                  </Grid>
                  {appointmentInvDetails?.appointmentId && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography className='font-medium mbe-2' color='text.primary'>
                            Appointment Details:
                        </Typography>
                        <div className='flex flex-col gap-1'>
                            <div className='flex gap-2'>
                                <Typography color='text.secondary' className='min-is-[100px]'>Doctor:</Typography>
                                <Typography color='text.primary' className='font-medium'>{appointmentInvDetails.doctorName}</Typography>
                            </div>
                            <div className='flex gap-2'>
                                <Typography color='text.secondary' className='min-is-[100px]'>Specialty:</Typography>
                                <Typography color='text.primary'>{appointmentInvDetails.doctorSpecialization}</Typography>
                            </div>
                             {appointmentInvDetails.appointmentDate && (
                                <div className='flex gap-2'>
                                    <Typography color='text.secondary' className='min-is-[100px]'>Date:</Typography>
                                    <Typography color='text.primary' className='font-medium'>{appointmentInvDetails.appointmentDate} @ {appointmentInvDetails.appointmentTime}</Typography>
                                </div>
                            )}
                        </div>
                    </Grid>
                  )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              {/* --- INVOICE ITEMS SECTION --- */}
              <Grid size={{ xs: 12 }}>
                <Typography variant='h6' className='mbe-4'>
                   Services & Items
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                    <Table sx={{ minWidth: 650 }} aria-label="invoice items table">
                        <TableHead sx={{ backgroundColor: 'var(--mui-palette-action-hover)' }}>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Qty</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {billableItems.length > 0 ? (
                            billableItems.map((item, index) => (
                                <StyledTableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        <div className='flex flex-col'>
                                            <Typography color='text.primary' className='font-medium'>
                                                {item.description}
                                            </Typography>
                                            <Typography variant='caption' color='text.secondary'>
                                                {item.typeName}
                                            </Typography>
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'medium' }}>{formatCurrency(item.totalAmount)}</TableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No billable items found</TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </TableContainer>
              </Grid>

              {/* --- DISCOUNT SECTION --- */}
              <Grid size={{ xs: 12 }}>
                 <div className='flex items-center justify-between mbe-1'>
                    <Typography variant='h6'>
                        Discounts
                    </Typography>
                    {/* Allow Adding Discounts only if UNPAID. If Partial, logic gets complex, usually locked. */}
                    {statusCode === "UNPAID" && (
                        <Button
                            size='medium'
                            variant='outlined'
                            color='primary'
                            onClick={() => appendDiscount({ discountType: 'DOCTOR_DISCOUNT', description: '', amount: 0 })}
                            startIcon={<i className='tabler-plus' />}
                        >
                            Add Discount
                        </Button>
                    )}
                 </div>
                 
                {discountFields.length > 0 ? (
                    <div className='flex flex-col gap-4 border rounded p-4'>
                         {discountFields.map((item, index) => (
                            <div key={item.id} className='flex items-start gap-4 flex-col md:flex-row md:items-center'>
                                <Grid container spacing={4} className='w-full'>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name={`discounts.${index}.discountType`}
                                            control={control}
                                            render={({ field }) => (
                                                <CustomTextField 
                                                    select 
                                                    fullWidth 
                                                    label="Type" 
                                                    size="small" 
                                                    {...field}
                                                    disabled={statusCode !== "UNPAID"}
                                                >
                                                    <MenuItem value='DOCTOR_DISCOUNT'>Doctor Discount</MenuItem>
                                                    <MenuItem value='CLINIC_DISCOUNT'>Clinic Discount</MenuItem>
                                                    <MenuItem value='OTHER_DISCOUNT'>Other</MenuItem>
                                                </CustomTextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 5 }}>
                                             <Controller
                                                name={`discounts.${index}.description`}
                                                control={control}
                                                render={({ field }) => (
                                                    <CustomTextField 
                                                        fullWidth 
                                                        label="Description" 
                                                        size="small" 
                                                        placeholder='e.g. 10% Off' 
                                                        {...field} 
                                                        disabled={statusCode !== "UNPAID"}
                                                    />
                                                )}
                                            />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Controller
                                            name={`discounts.${index}.amount`}
                                            control={control}
                                             render={({ field }) => (
                                                <CustomTextField
                                                    fullWidth
                                                    type='number'
                                                    label="Amount"
                                                    size="small"
                                                    placeholder='0.00'
                                                    slotProps={{ input: { startAdornment: <InputAdornment position='start'>LKR</InputAdornment>, inputProps: { min: 0 } } }}
                                                    {...field}
                                                    value={field.value === 0 ? '' : field.value ?? ''}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                                                    disabled={statusCode !== "UNPAID"}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                {statusCode === "UNPAID" && (
                                    <IconButton size='small' color="error" onClick={() => removeDiscount(index)} className='mt-1'>
                                        <i className='tabler-trash' />
                                    </IconButton>
                                )}
                            </div>
                         ))}
                    </div>
                ) : (
                    <Typography variant="body2" color="text.secondary" className='italic'>
                        No discounts applied.
                    </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              {/* --- Summary Section --- */}
              <Grid size={{ xs: 12 }}>
                <div className='flex justify-end'>
                  <div className='min-is-[300px]'>
                    
                    <div className='flex items-center justify-between mbe-2'>
                      <Typography color='text.secondary'>Subtotal:</Typography>
                      <Typography className='font-medium' color='text.primary'>
                        {formatCurrency(displaySubtotal)}
                      </Typography>
                    </div>
                    
                    <div className='flex items-center justify-between mbe-2'>
                      <Typography color='text.secondary'>Total Discount:</Typography>
                      <Typography className='font-medium' color='error.main'>
                        - {formatCurrency(displayTotalDiscount)}
                      </Typography>
                    </div>
                    
                    <Divider className='my-3' />
                    
                    <div className='flex items-center justify-between mbe-2'>
                      <Typography variant="h6">Total Amount:</Typography>
                      <Typography variant="h6" color='primary.main'>
                        {formatCurrency(finalTotalAmount)}
                      </Typography>
                    </div>

                    {/* NEW: Paid & Balance Rows for Partial/Paid States */}
                    {(amountPaidSoFar > 0 || isPayable) && (
                        <>
                            <div className='flex items-center justify-between mbe-2'>
                                <Typography color='text.secondary'>Paid Amount:</Typography>
                                <Typography className='font-medium' color='success.main'>
                                    {formatCurrency(amountPaidSoFar)}
                                </Typography>
                            </div>
                            
                            <div className='bg-red-50 p-2 rounded border border-red-100 flex items-center justify-between'>
                                <Typography color='error.main' className="font-bold">Balance Due:</Typography>
                                <Typography color='error.main' className="font-bold">
                                    {formatCurrency(balanceDue)}
                                </Typography>
                            </div>
                        </>
                    )}

                  </div>
                </div>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider className='border-dashed' />
              </Grid>

              {/* --- Note Section --- */}
              <Grid size={{ xs: 12 }}>
                <InputLabel htmlFor='invoice-note' className='inline-flex mbe-2 text-textPrimary font-medium'>
                  Note to Patient:
                </InputLabel>
                <Controller
                    name="note"
                    control={control}
                    render={({ field }) => (
                        <CustomTextField
                            {...field}
                            id='invoice-note'
                            rows={2}
                            fullWidth
                            multiline
                            placeholder="Add a note..."
                            disabled={!isPayable}
                        />
                    )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* --- ACTION CARD (Right Side) --- */}
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent className='flex flex-col gap-4'>
             
             {isPayable ? (
                <>
                    {/* BUTTON 1: Full Payment */}
                    <OpenDialogOnElementClick 
                        element={Button} 
                        elementProps={fullPaymentBtnProps} 
                        dialog={PaymentFinalizer} 
                        dialogProps={{ 
                            finalTotal: balanceDue, // Pass remaining balance
                            invoiceId: appointmentInvDetails?.invoiceId || id,
                            discounts: watchedDiscounts,
                            patientMobileNo: appointmentInvDetails?.patientContactNo,
                            mode: 'FULL' // Optional hint for dialog
                        }} 
                    />

                    {/* BUTTON 2: Partial Payment */}
                    <OpenDialogOnElementClick 
                        element={Button} 
                        elementProps={partialPaymentBtnProps} 
                        dialog={PaymentFinalizer} 
                        dialogProps={{ 
                            finalTotal: balanceDue, // Pass balance (dialog handles input)
                            invoiceId: appointmentInvDetails?.invoiceId || id,
                            discounts: watchedDiscounts,
                            patientMobileNo: appointmentInvDetails?.patientContactNo,
                            mode: 'PARTIAL' // Optional hint for dialog
                        }} 
                    />
                </>
             ) : (
                 <Button 
                    variant='contained' 
                    color="inherit" 
                    disabled 
                    fullWidth
                    className="bg-gray-200 text-gray-500"
                 >
                    Paid In Full
                 </Button>
             )}

          </CardContent>
        </Card>
      </Grid>    
    </>
  )
}

export default AppointmentPayment