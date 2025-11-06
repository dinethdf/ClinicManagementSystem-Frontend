'use client'

// React Imports
import { useState } from 'react'
import Image from "next/image"
import type { SyntheticEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { InvoiceType } from '@/types/apps/invoiceTypes'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

import EditActions from '@views/apps/clinic-app/payment/appointment/edit/EditActions'


const EditCard = ({ invoiceData, id, data }: { invoiceData?: InvoiceType; id: string; data?: InvoiceType[] }) => {
  // States
  const [selectData, setSelectData] = useState<InvoiceType | null>(data?.[0] || null)
  const [appointmentCount, setAppointmentCount] = useState(1) // New state for appointment repeater
  const [serviceCount, setServiceCount] = useState(1)
  const [discountCount, setDiscountCount] = useState(0)
  const [issueDate, setIssueDate] = useState(new Date(invoiceData?.issuedDate ?? ''))
  const [dueDate, setDueDate] = useState(new Date(invoiceData?.dueDate ?? ''))

  // Hooks
  const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  // Delete function for appointments
  const deleteAppointmentForm = (e: SyntheticEvent) => {
    e.preventDefault()
    // @ts-ignore
    e.target.closest('.repeater-item').remove()
  }

  const deleteServiceForm = (e: SyntheticEvent) => {
    e.preventDefault()
    // @ts-ignore
    e.target.closest('.repeater-item').remove()
  }

  const deleteDiscountForm = (e: SyntheticEvent) => {
    e.preventDefault()
    // @ts-ignore
    e.target.closest('.repeater-item').remove()
  }

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
                        <Typography color='text.primary'>@@@ Road,</Typography>
                        <Typography color='text.primary'>Main Streen, Pelmadulla, Rathnapura</Typography>
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
                          value={id}
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
                          id='issue-date'
                          customInput={<CustomTextField fullWidth />}
                        />
                      </div>
                      <div className='flex items-center'>
                        <Typography className='min-is-[95px] mie-4' color='text.primary'>
                          Date Paid:
                        </Typography>
                        <AppReactDatepicker
                          disabled
                          boxProps={{ className: 'is-full' }}
                          selected={dueDate}
                          id='payment-date'
                          customInput={<CustomTextField fullWidth />}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>

              {/* --- Bill To Section --- */}
              <Grid size={{ xs: 12 }}>
                <div className='flex justify-between flex-col gap-4 flex-wrap sm:flex-row'>
                  <div className='flex flex-col gap-4'>
                    <Typography className='font-medium' color='text.primary'>
                      Bill To:
                    </Typography>
                    <div>
                      <div className='flex items-center gap-4'>
                        <Typography className='min-is-[100px]'>Patient No:</Typography>
                        <Typography>P250045</Typography>
                      </div>
                      <div className='flex items-center gap-4'>
                        <Typography className='min-is-[100px]'>Patient Name:</Typography>
                        <Typography>John Doe</Typography>
                      </div>
                      <div className='flex items-center gap-4'>
                        <Typography className='min-is-[100px]'>Address:</Typography>
                        <Typography>123 Main St, Pelmadulla</Typography>
                      </div>
                      <div className='flex items-center gap-4'>
                        <Typography className='min-is-[100px]'>Date of Birth:</Typography>
                        <Typography>2025-12-18</Typography>
                      </div>
                      <div className='flex items-center gap-4'>
                        <Typography className='min-is-[100px]'>Contact No:</Typography>
                        <Typography>+94 77 123 4567</Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider className='border-dashed' />
              </Grid>

              {/* --- NEW APPOINTMENT REPEATER SECTION --- */}
          <Grid size={{ xs: 12 }}>
                {/* This is the itemized list of services */}
                {/* I've used your "count" state to render one item, you can map over your actual bill items here */}
                {Array.from(Array(serviceCount).keys()).map((item, index) => (
                  <div
                    key={index}
                    className={classnames('repeater-item flex relative mbe-4 border rounded', {
                      'mbs-8': !isBelowMdScreen,
                      '!mbs-14': index !== 0 && !isBelowMdScreen,
                      'gap-5': isBelowMdScreen
                    })}
                  >
                    <Grid container spacing={5} className='m-0 p-5'>
                      <Grid size={{ xs: 12, md: 5, lg: 6 }}>
                        <Typography className='font-medium md:absolute md:-top-8' color='text.primary'>
                          Service Description
                        </Typography>
                        <CustomTextField
                          fullWidth
                          disabled
                          defaultValue='Office Visit, Established Patient (99213)'
                          className='mbe-5'
                        />
                        <CustomTextField
                          rows={2}
                          fullWidth
                          multiline
                          disabled
                          defaultValue='Consultation with Dr. Kamal de Silva regarding follow-up.'
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3, lg: 2 }}>
                        <Typography className='font-medium md:absolute md:-top-8' color='text.primary'>
                          Unit Price
                        </Typography>
                        <CustomTextField
                          {...(isBelowMdScreen && { fullWidth: true })}
                          type='number'
                          placeholder='150.00'
                          defaultValue='150.00'
                          className='mbe-5'
                          disabled
                          slotProps={{
                            input: {
                              inputProps: { min: 0 }
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Typography className='font-medium md:absolute md:-top-8' color='text.primary'>
                          Quantity (Qty)
                        </Typography>
                        <CustomTextField
                          {...(isBelowMdScreen && { fullWidth: true })}
                          type='number'
                          placeholder='1'
                          defaultValue='1'
                          disabled
                          slotProps={{
                            input: {
                              inputProps: { min: 0 }
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Typography className='font-medium md:absolute md:-top-8' color='text.primary'>
                          Total Amount
                        </Typography>
                        <Typography className='mt-2'>$150.00</Typography>
                      </Grid>
                    </Grid>
                    {/* Removed the delete button */}
                  </div>
                ))}
                {/* Removed the "Add Item" button */}
              </Grid>
              {/* --- END OF APPOINTMENT REPEATER --- */}


              {/* --- Service Repeater Section --- */}
              {/* <Grid size={{ xs: 12 }}>
                {Array.from(Array(serviceCount).keys()).map((item, index) => (
                  <div
                    key={index}
                    className={classnames('repeater-item flex relative mbe-4 border rounded', {
                      'mbs-8': !isBelowMdScreen,
                      '!mbs-14': index !== 0 && !isBelowMdScreen,
                      'gap-5': isBelowMdScreen
                    })}
                  >
                    <Grid container spacing={5} className='m-0 p-5'>
                      <Grid size={{ xs: 12, md: 5, lg: 6 }}>
                        <Typography className='font-medium md:absolute md:-top-8' color='text.primary'>
                          Service
                        </Typography>
                        <CustomTextField select fullWidth defaultValue='App Design' className='mbe-5'>
                          <MenuItem value='App Design'>App Design</MenuItem>
                          <MenuItem value='App Customization'>App Customization</MenuItem>
                          <MenuItem value='ABC Template'>ABC Template</MenuItem>
                          <MenuItem value='App Development'>App Development</MenuItem>
                        </CustomTextField>
                        <CustomTextField rows={2} fullWidth multiline defaultValue='Customization & Bug Fixes' />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3, lg: 2 }}>
                        <Typography className='font-medium md:absolute md:-top-8' color='text.primary'>
                          Cost
                        </Typography>
                        <CustomTextField
                          {...(isBelowMdScreen && { fullWidth: true })}
                          type='number'
                          placeholder='24'
                          defaultValue='24'
                          className='mbe-5'
                          slotProps={{
                            input: {
                              inputProps: { min: 0 }
                            }
                          }}
                        />
                        <div className='flex flex-col'>
                          <Typography component='span' color='text.primary'>
                            Discount:
                          </Typography>
                          <div className='flex gap-2'>
                            <Typography component='span' color='text.primary'>
                              0%
                            </Typography>
                            <Tooltip title='Tax 1' placement='top'>
                              <Typography component='span' color='text.primary'>
                                0%
                              </Typography>
                            </Tooltip>
                            <Tooltip title='Tax 2' placement='top'>
                              <Typography component='span' color='text.primary'>
                                0%
                              </Typography>
                            </Tooltip>
                          </div>
                        </div>
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Typography className='font-medium md:absolute md:-top-8' color='text.primary'>
                          Hours
                        </Typography>
                        <CustomTextField
                          {...(isBelowMdScreen && { fullWidth: true })}
                          type='number'
                          placeholder='1'
                          defaultValue='1'
                          slotProps={{
                            input: {
                              inputProps: { min: 0 }
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Typography className='font-medium md:absolute md:-top-8' color='text.primary'>
                          Price
                        </Typography>
                        <Typography className='pt-2'>$24.00</Typography>
                      </Grid>
                    </Grid>
                    <div className='flex flex-col justify-start border-is'>
                      <IconButton size='small' onClick={deleteServiceForm}>
                        <i className='tabler-x text-2xl text-actionActive' />
                      </IconButton>
                    </div>
                  </div>
                ))}
                <Grid size={{ xs: 12 }}>
                  <Button
                    size='small'
                    variant='contained'
                    onClick={() => setServiceCount(serviceCount + 1)}
                    startIcon={<i className='tabler-plus' />}
                  >
                    Add Service
                  </Button>
                </Grid>
              </Grid> */}

              {/* <Grid size={{ xs: 12 }}>
                <Divider className='border-dashed' />
              </Grid> */}

              {/* --- Discount Repeater Section --- */}
              <Grid size={{ xs: 12 }}>
                {Array.from(Array(discountCount).keys()).map((item, index) => (
                  <div
                    key={index}
                    className={classnames('repeater-item flex relative mbe-4 border rounded', {
                      'mbs-8': !isBelowMdScreen,
                      '!mbs-14': index !== 0 && !isBelowMdScreen,
                      'gap-5': isBelowMdScreen
                    })}
                  >
                    <Grid container spacing={5} className='m-0 p-5'>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography className='font-medium md:absolute md:-top-8' color='text.primary'>
                          Discount Type
                        </Typography>
                        <CustomTextField select fullWidth defaultValue='DOCTOR_DISCOUNT'>
                          <MenuItem value='DOCTOR_DISCOUNT'>Doctor Discount</MenuItem>
                          <MenuItem value='PROMO_CODE'>Promo Code</MenuItem>
                          <MenuItem value='SELF_PAY'>Self-Pay Discount</MenuItem>
                          <MenuItem value='OTHER'>Other</MenuItem>
                        </CustomTextField>
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <Typography className='font-medium md:absolute md:-top-8' color='text.primary'>
                          Description
                        </Typography>
                        <CustomTextField
                          fullWidth
                          placeholder='e.g. Doctor 10% discount'
                          defaultValue={index === 0 ? "Doctor's 10% discount" : ''}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <Typography className='font-medium md:absolute md:-top-8' color='text.primary'>
                          Amount
                        </Typography>
                        <CustomTextField
                          fullWidth
                          type='number'
                          placeholder='10.00'
                          defaultValue={index === 0 ? 10.00 : 0}
                          slotProps={{
                            input: {
                              startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                              inputProps: { min: 0 }
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <div className='flex flex-col justify-start border-is'>
                      <IconButton size='small' onClick={deleteDiscountForm}>
                        <i className='tabler-x text-2xl text-actionActive' />
                      </IconButton>
                    </div>
                  </div>
                ))}
                <Grid size={{ xs: 12 }}>
                  <Button
                    size='small'
                    variant='contained'
                    onClick={() => setDiscountCount(discountCount + 1)}
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
                <div className='flex justify-between flex-col gap-4 sm:flex-row'>
                  <div className='flex flex-col gap-4 order-2 sm:order-[unset]'>
                    <Image
                      src="data:image/png;base64,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"
                      alt="QR Code"
                      width={110}
                      height={110}
                    />
                  </div>
                  <div className='min-is-[200px]'>
                    <div className='flex items-center justify-between'>
                      <Typography>Subtotal:</Typography>
                      <Typography className='font-medium' color='text.primary'>
                        $1800
                      </Typography>
                    </div>
                    <div className='flex items-center justify-between'>
                      <Typography>Total Discount:</Typography>
                      <Typography className='font-medium' color='text.primary'>
                        -$10.00
                      </Typography>
                    </div>
                    <div className='flex items-center justify-between'>
                      <Typography>Tax:</Typography>
                      <Typography className='font-medium' color='text.primary'>
                        21%
                      </Typography>
                    </div>
                    <Divider className='mlb-2' />
                    <div className='flex items-center justify-between'>
                      <Typography>Total:</Typography>
                      <Typography className='font-medium' color='text.primary'>
                        $1690
                      </Typography>
                    </div>
                  </div>
                </div>
              </Grid>

              {/* --- Note Section --- */}
              <Grid size={{ xs: 12 }}>
                <Divider className='border-dashed' />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <InputLabel htmlFor='invoice-note' className='inline-flex mbe-1 text-textPrimary'>
                  Note:
                </InputLabel>
                <CustomTextField
                  id='invoice-note'
                  rows={2}
                  fullWidth
                  multiline
                  className='border rounded'
                  defaultValue='Thank you for choosing CureGuard Clinic. Wishing you a speedy recovery and good health!'
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <EditActions id={"1"} />
      </Grid>    
    </>
  )
}

export default EditCard