'use client'

// React Imports
import { useState } from 'react'

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
  
  // const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const [issueDate, setIssueDate] = useState<Date | null | undefined>(
      appointmentInvDetails?.dateIssued ? new Date(appointmentInvDetails.dateIssued) : new Date()
  )

  const { control, watch } = useForm<InvoiceFormData>({
    defaultValues: {
      discounts: [],
      note: 'Thank you for choosing CureGuard Clinic. Wishing you a speedy recovery and good health!'
    }
  });

  const { fields: discountFields, append: appendDiscount, remove: removeDiscount } = useFieldArray({
    control,
    name: 'discounts'
  });

  const buttonProps: ButtonProps = {
     variant: 'contained',
     color:"success",
     className:"capitalize",
     children: 'Make Payment',
     disabled: appointmentInvDetails.status != "UNPAID"
  }  

  // --- CALCULATIONS ---
  const initialSubtotal = appointmentInvDetails?.items?.reduce((sum: number, item: InvoiceItem) => sum + (item.totalAmount || 0), 0) || 0;
  const watchedDiscounts = watch('discounts');
  const totalDiscount = watchedDiscounts?.reduce((sum, discount) => sum + (Number(discount.amount) || 0), 0) || 0;
  const finalTotal = Math.max(0, initialSubtotal - totalDiscount);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 2 }).format(amount);
  };

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
                      {appointmentInvDetails?.status !== "UNPAID" && (
                        <Chip 
                          label={appointmentInvDetails.status} 
                          color={'primary'}
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
                             {appointmentInvDetails.appointmentNumber && (
                                <div className='flex gap-2'>
                                    <Typography color='text.secondary' className='min-is-[100px]'>Appt No:</Typography>
                                    <Typography color='text.primary' className='font-medium'>{appointmentInvDetails.appointmentNumber}</Typography>
                                </div>
                            )}
                        </div>
                    </Grid>
                  )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              {/* --- INVOICE ITEMS SECTION (Improved UI with Table) --- */}
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
                        {appointmentInvDetails?.items?.map((item: InvoiceItem, index: number) => (
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
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
              </Grid>

              {/* --- DISCOUNT SECTION (Improved UI) --- */}

              { appointmentInvDetails.status == "UNPAID" &&
              <Grid size={{ xs: 12 }}>
                 <div className='flex items-center justify-between mbe-1'>
                    <Typography variant='h6'>
                        Discounts
                    </Typography>
                     <Button
                        size='medium'
                        variant='outlined'
                        color='primary'
                        onClick={() => appendDiscount({ discountType: 'DOCTOR_DISCOUNT', description: '', amount: 0 })}
                        startIcon={<i className='tabler-plus' />}
                    >
                        Add Discount
                    </Button>
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
                                                <CustomTextField select fullWidth label="Type" size="small" {...field}>
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
                                                <CustomTextField fullWidth label="Description" size="small" placeholder='e.g. 10% Off' {...field} />
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
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                <IconButton size='small' color="error" onClick={() => removeDiscount(index)} className='mt-1'>
                                    <i className='tabler-trash' />
                                </IconButton>
                            </div>
                         ))}
                    </div>
                ) : (
                    <Typography variant="body2" color="text.secondary" className='italic'>
                        No discounts applied.
                    </Typography>
                )}
              </Grid>
              }
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
                        {formatCurrency(initialSubtotal)}
                      </Typography>
                    </div>
                    <div className='flex items-center justify-between mbe-2'>
                      <Typography color='text.secondary'>Total Discount:</Typography>
                      <Typography className='font-medium' color='error.main'>
                        - {formatCurrency(totalDiscount)}
                      </Typography>
                    </div>
                    <Divider className='my-3' />
                    <div className='flex items-center justify-between'>
                      <Typography variant="h6">Total Amount:</Typography>
                      <Typography variant="h6" color='primary.main'>
                        {formatCurrency(finalTotal)}
                      </Typography>
                    </div>
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
                        />
                    )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent className='flex flex-col gap-4'>
            <OpenDialogOnElementClick 
                element={Button} 
                elementProps={buttonProps} 
                dialog={PaymentFinalizer} 
                dialogProps={{ 
                    finalTotal: finalTotal, 
                    invoiceId: appointmentInvDetails?.invoiceId || id,
                    discounts: watchedDiscounts,
                    patientMobileNo: appointmentInvDetails?.patientContactNo
                }} 
            />
          </CardContent>
        </Card>
      </Grid>    
    </>
  )
}

export default AppointmentPayment
