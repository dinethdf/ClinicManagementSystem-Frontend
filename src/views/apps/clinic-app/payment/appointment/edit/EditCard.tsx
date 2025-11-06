'use client'

// React Imports
import { useState, useEffect, type SyntheticEvent } from 'react'
import Image from "next/image"

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'
import { useForm, useFieldArray, Controller } from 'react-hook-form'

// Type Imports
import type { InvoiceType } from '@/types/apps/invoiceTypes'
import type { ButtonProps } from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

import Logo from '@components/layout/shared/Logo'
import PaymentFinalizer from '@/components/dialogs/payment-finalize'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import EditActions from '@views/apps/clinic-app/payment/appointment/edit/EditActions'

// Define types for your specific data structure if they aren't already imported
interface InvoiceItem {
  description: string;
  typeName: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
}

// Interface for the form data
interface InvoiceFormData {
  discounts: {
    discountType: string;
    description: string;
    amount: number;
  }[];
  note: string;
}



const EditCard = ({ invoiceData, id, data, appointmentInvDetails }: { invoiceData?: InvoiceType; id: string; data?: InvoiceType[], appointmentInvDetails?: any }) => {
  
  // Hooks
  const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  // State for dates (initialized from invoice details or defaults)
  const [issueDate, setIssueDate] = useState<Date | null | undefined>(
      appointmentInvDetails?.dateIssued ? new Date(appointmentInvDetails.dateIssued) : new Date()
  )
  // Assuming due date might be same day for immediate payment, or you can set a default
  const [dueDate, setDueDate] = useState<Date | null | undefined>(new Date()) 

  // React Hook Form for managing discounts and notes
  const { control, handleSubmit, watch, setValue } = useForm<InvoiceFormData>({
    defaultValues: {
      discounts: [], // Start with no discounts
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
     children: 'Make Payment'
  }  

  // --- CALCULATIONS ---
  // 1. Calculate Subtotal from initial items (Appointments, etc.)
  const initialSubtotal = appointmentInvDetails?.items?.reduce((sum: number, item: InvoiceItem) => sum + (item.totalAmount || 0), 0) || 0;

  // 2. Watch discount fields to re-calculate total discount dynamically
  const watchedDiscounts = watch('discounts');
  const totalDiscount = watchedDiscounts?.reduce((sum, discount) => sum + (Number(discount.amount) || 0), 0) || 0;

  // 3. Calculate Final Total
  const finalTotal = Math.max(0, initialSubtotal - totalDiscount);

  // Currency formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount);
  };

  return (
    <>
      <Grid size={{ xs: 12, md: 9 }}>
        <Card>
          <CardContent className='sm:!p-12'>
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
                        <Typography color='text.primary'>CureGuard Clinic</Typography>
                        <Typography color='text.primary'>Main Street, Pelmadulla, Rathnapura</Typography>
                        <Typography color='text.primary'>+94 (45) 2277222</Typography>
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
                      {/* You might want Date Paid only if status is PAID */}
                      {/* <div className='flex items-center'>
                        <Typography className='min-is-[95px] mie-4' color='text.primary'>
                          Date Due:
                        </Typography>
                        <AppReactDatepicker
                          boxProps={{ className: 'is-full' }}
                          selected={dueDate}
                          onChange={(date: Date | null) => setDueDate(date)}
                          customInput={<CustomTextField fullWidth />}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
              </Grid>

              {/* --- Bill To (Patient) Section --- */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Bill To:
                  </Typography>
                  <div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Patient No:</Typography>
                      <Typography className='font-medium'>{appointmentInvDetails?.patientNo}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Patient Name:</Typography>
                      <Typography className='font-medium'>{appointmentInvDetails?.patientName}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Address:</Typography>
                      <Typography>{appointmentInvDetails?.patientAddress}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Date of Birth:</Typography>
                      <Typography>{appointmentInvDetails?.patientDob}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Contact No:</Typography>
                      <Typography>{appointmentInvDetails?.patientContactNo}</Typography>
                    </div>
                  </div>
                </div>
              </Grid>

              {/* --- Appointment Details Section (If available) --- */}
              {appointmentInvDetails?.appointmentId && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <div className='flex flex-col gap-4'>
                    <Typography className='font-medium' color='text.primary'>
                      Appointment Details:
                    </Typography>
                    <div>
                      <div className='flex items-center gap-4'>
                        <Typography className='min-is-[100px]'>Doctor:</Typography>
                        <Typography className='font-medium'>{appointmentInvDetails.doctorName}</Typography>
                      </div>
                      <div className='flex items-center gap-4'>
                        <Typography className='min-is-[100px]'>Specialization:</Typography>
                        <Typography>{appointmentInvDetails.doctorSpecialization}</Typography>
                      </div>
                      {appointmentInvDetails.appointmentNumber && (
                          <div className='flex items-center gap-4'>
                              <Typography className='min-is-[100px]'>Appt No:</Typography>
                              <Typography>{appointmentInvDetails.appointmentNumber}</Typography>
                          </div>
                      )}
                       <div className='flex items-start gap-4 mt-2'>
                        <Typography className='min-is-[100px]'>Note:</Typography>
                        <Typography className='italic text-sm'>{appointmentInvDetails.appointmentNote}</Typography>
                      </div>
                    </div>
                  </div>
                </Grid>
              )}


              <Grid size={{ xs: 12 }}>
                <Divider className='border-dashed' />
              </Grid>

              {/* --- INVOICE ITEMS SECTION (Read-Only) --- */}
              <Grid size={{ xs: 12 }}>
                <Typography className='font-medium mbe-4' color='text.primary'>
                   Services & Items
                </Typography>
                {appointmentInvDetails?.items?.map((item: InvoiceItem, index: number) => (
                  <div
                    key={`item-${index}`}
                    className={classnames('repeater-item flex relative mbe-4 border rounded p-5', {
                      'gap-5': isBelowMdScreen
                    })}
                  >
                    <Grid container spacing={5} className='w-full'>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography className='font-medium text-sm' color='text.secondary'>
                          Description
                        </Typography>
                        <Typography color='text.primary' className='font-medium'>
                            {item.description}
                        </Typography>
                         <Typography variant="caption" color='text.secondary'>
                            {item.typeName}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 2 }}>
                        <Typography className='font-medium text-sm' color='text.secondary'>
                          Unit Price
                        </Typography>
                        <Typography className='mt-1'>
                          {formatCurrency(item.unitPrice)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 2 }}>
                        <Typography className='font-medium text-sm' color='text.secondary'>
                          Qty
                        </Typography>
                         <Typography className='mt-1'>
                          {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                         <Typography className='font-medium text-sm text-right' color='text.secondary'>
                          Total
                        </Typography>
                        <Typography className='mt-1 text-right font-medium'>
                          {formatCurrency(item.totalAmount)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </Grid>

              {/* --- DISCOUNT SECTION (Editable) --- */}
              <Grid size={{ xs: 12 }}>
                 <Typography className='font-medium mbe-4' color='text.primary'>
                   Discounts
                </Typography>
                {discountFields.map((item, index) => (
                  <div
                    key={item.id}
                    className={classnames('repeater-item flex relative mbe-4 border rounded', {
                      'gap-5': isBelowMdScreen
                    })}
                  >
                    <Grid container spacing={5} className='m-0 p-5 w-full'>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography className='font-medium text-sm mbe-2' color='text.secondary'>
                          Discount Type
                        </Typography>
                        <Controller
                            name={`discounts.${index}.discountType`}
                            control={control}
                            render={({ field }) => (
                                <CustomTextField select fullWidth {...field}>
                                    <MenuItem value='DOCTOR_DISCOUNT'>Doctor Discount</MenuItem>
                                    <MenuItem value='CLINIC_DISCOUNT'>Clinic Discount</MenuItem>
                                    <MenuItem value='OTHER_DISCOUNT'>Other</MenuItem>
                                </CustomTextField>
                            )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Typography className='font-medium text-sm mbe-2' color='text.secondary'>
                          Description
                        </Typography>
                        <Controller
                            name={`discounts.${index}.description`}
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    fullWidth
                                    placeholder='e.g. Doctor 10% off'
                                    {...field}
                                />
                            )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <Typography className='font-medium text-sm mbe-2' color='text.secondary'>
                          Amount
                        </Typography>
                        <Controller
                            name={`discounts.${index}.amount`}
                            control={control}
                             render={({ field }) => (
                                <CustomTextField
                                    fullWidth
                                    type='number'
                                    placeholder='0.00'
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position='start'>LKR</InputAdornment>,
                                            inputProps: { min: 0 }
                                        }
                                    }}
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            )}
                        />
                      </Grid>
                    </Grid>
                    <div className='flex flex-col justify-center border-is px-2'>
                      <IconButton size='small' color="error" onClick={() => removeDiscount(index)}>
                        <i className='tabler-trash text-[22px]' />
                      </IconButton>
                    </div>
                  </div>
                ))}
                <Grid size={{ xs: 12 }}>
                  <Button
                    size='small'
                    variant='contained'
                    onClick={() => appendDiscount({ discountType: 'DOCTOR_DISCOUNT', description: '', amount: 0 })}
                    startIcon={<i className='tabler-plus' />}
                  >
                    Add Discount
                  </Button>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider className='border-dashed' />
              </Grid>

              {/* --- Summary Section --- */}
              <Grid size={{ xs: 12 }}>
                <div className='flex justify-end flex-col gap-4 sm:flex-row'>
                  <div className='min-is-[250px]'>
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
                    {/* Tax can be added similarly if needed later */}
                    <Divider className='mlb-2' />
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
                <InputLabel htmlFor='invoice-note' className='inline-flex mbe-1 text-textPrimary font-medium'>
                  Note:
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
                            className='border rounded'
                        />
                    )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Pass necessary data and form control methods to EditActions */}
      <Grid size={{ xs: 12, md: 3 }}>

              <Card>
                <CardContent className='flex flex-col gap-4'>
                  <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialogProps = {{finalTotal:8888}} dialog={PaymentFinalizer} />
                </CardContent>
              </Card>
              {/* <AddPaymentDrawer open={paymentDrawerOpen} handleClose={() => setPaymentDrawerOpen(false)} /> */}
        

      </Grid>    
    </>
  )
}

export default EditCard