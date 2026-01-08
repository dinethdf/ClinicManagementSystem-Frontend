'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid' // Using Grid v2
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'

// Component Imports
import RealtimeLiveQueueCard from './RealtimeLiveQueueCard'

// Service
import { patientAppointmentService } from '@/services/patient-portal/patient.appointments.service'
import { AppointmentDetailsDTO } from '@/types/patient-portal/patient.appointments.types'


interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  appointmentId: number 
}

const AppointmentDetailsDialog = ({ open, setOpen, appointmentId }: Props) => {
  const [details, setDetails] = useState<AppointmentDetailsDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && appointmentId) {
      loadDetails()
    }
  }, [open, appointmentId])

  const loadDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      // Ensure your service returns the full object structure defined above
      const data = await patientAppointmentService.getAppointmentDetails(appointmentId)
      setDetails(data as any) 
    } catch (err) {
      console.error(err)
      setError('Failed to load appointment details.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => setOpen(false)

  // Status Color Logic
  const getStatusColor = (status: string) => {
    const map: any = { 
        BOOKED: 'primary', 
        SCHEDULED: 'primary', 
        COMPLETED: 'success', 
        CANCELLED: 'error', 
        PENDING: 'warning' 
    }
    return map[status] || 'default'
  }

  // Invoice Status Color
  const getInvoiceColor = (status: string) => {
      return status === 'PAID' ? 'success' : 'error'
  }

  // Check if appointment is active for Live Queue
  const isActive = details && ['BOOKED', 'SCHEDULED', 'PENDING'].includes(details.status)

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle className='flex justify-between items-center bg-gray-50 px-6 py-4 border-b'>
        <div className='flex items-center gap-3'>
             <Typography variant='h5' component='span'>
                Appointment #{details?.id}
             </Typography>
             {details && (
                 <Chip 
                    label={details.status} 
                    color={getStatusColor(details.status)} 
                    size='small' 
                    variant='tonal' 
                    className='uppercase font-bold'
                 />
             )}
        </div>
        <IconButton onClick={handleClose} size='small'><i className='tabler-x' /></IconButton>
      </DialogTitle>
      
      <DialogContent className='p-6'>
        {loading ? (
            <div className='flex flex-col gap-4 mt-4'>
                <Skeleton variant="rectangular" height={120} />
                <Skeleton variant="text" />
                <Skeleton variant="rectangular" height={80} />
            </div>
        ) : error ? (
            <Alert severity="error" className='mt-4'>{error}</Alert>
        ) : details ? (
            <Grid container spacing={4} className='mt-2'>
                
                {/* --- LEFT COLUMN: DETAILS --- */}
                <Grid size={{ xs: 12, md: isActive ? 7 : 12 }}>
                    <div className='flex flex-col gap-5'>
                        
                        {/* 1. DOCTOR & SCHEDULE CARD */}
                        <div className='flex flex-col gap-3 p-4 border rounded-xl bg-primary/5 border-primary/20'>
                             <div className='flex gap-4 items-start'>
                                <Avatar className='bg-white text-primary h-12 w-12 shadow-sm'>
                                    <i className='tabler-stethoscope text-2xl' />
                                </Avatar>
                                <div>
                                    <Typography variant='caption' color='text.secondary'>Doctor</Typography>
                                    <Typography variant='h6' fontWeight={600}>{details.doctorName}</Typography>
                                    <Typography variant='body2' className='text-primary font-medium'>{details.specialization}</Typography>
                                </div>
                             </div>
                             
                             <Divider className='border-dashed' />

                             <div className='grid grid-cols-2 gap-4'>
                                 <div>
                                     <Typography variant='caption' color='text.secondary'>Date</Typography>
                                     <div className='flex items-center gap-2'>
                                         <i className='tabler-calendar text-gray-500 text-lg' />
                                         <Typography fontWeight={600}>{details.scheduleDate}</Typography>
                                     </div>
                                 </div>
                                 <div>
                                     <Typography variant='caption' color='text.secondary'>Time</Typography>
                                     <div className='flex items-center gap-2'>
                                         <i className='tabler-clock text-gray-500 text-lg' />
                                         <Typography fontWeight={600}>{details.startTime} - {details.endTime}</Typography>
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {/* 2. PATIENT INFO */}
                        <div>
                             <Typography variant='subtitle2' className='mb-2 font-bold uppercase text-xs text-gray-500'>Patient Details</Typography>
                             <div className='grid grid-cols-2 gap-y-2 text-sm'>
                                 <Typography color='text.secondary'>Name:</Typography>
                                 <Typography fontWeight={500}>{details.patientName}</Typography>
                                 
                                 <Typography color='text.secondary'>File No:</Typography>
                                 <Typography fontWeight={500}>{details.patientNo}</Typography>

                                 <Typography color='text.secondary'>NIC:</Typography>
                                 <Typography fontWeight={500}>{details.patientNic}</Typography>

                                 <Typography color='text.secondary'>Mobile:</Typography>
                                 <Typography fontWeight={500}>{details.patientMobile}</Typography>
                             </div>
                        </div>
                        
                        <Divider />

                        {/* 3. FINANCIALS */}
                        <div>
                            <div className='flex justify-between items-center mb-2'>
                                <Typography variant='subtitle2' className='font-bold uppercase text-xs text-gray-500'>Payment Details</Typography>
                                <Chip 
                                    label={details.invoiceStatus} 
                                    size='small' 
                                    color={getInvoiceColor(details.invoiceStatus)} 
                                    variant='outlined' 
                                    className='font-bold'
                                />
                            </div>
                            <div className='bg-gray-50 rounded-lg p-3 space-y-2'>
                                <div className='flex justify-between text-sm'>
                                    <span className='text-gray-600'>Doctor Fee</span>
                                    <span className='font-medium'>LKR {details.doctorFee.toLocaleString()}</span>
                                </div>
                                <div className='flex justify-between text-sm'>
                                    <span className='text-gray-600'>Clinic/Hospital Fee</span>
                                    <span className='font-medium'>LKR {details.clinicFee.toLocaleString()}</span>
                                </div>
                                {details.invoiceTotalDiscount > 0 && (
                                    <div className='flex justify-between text-sm text-green-600'>
                                        <span>Discount</span>
                                        <span>- LKR {details.invoiceTotalDiscount.toLocaleString()}</span>
                                    </div>
                                )}
                                <Divider className='border-dashed my-1' />
                                <div className='flex justify-between font-bold text-primary'>
                                    <span>Total Amount</span>
                                    <span>LKR {details.invoiceFinalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* 4. NOTES */}
                        {details.note && (
                            <div className='bg-yellow-50 p-3 rounded border border-yellow-200'>
                                <Typography variant='caption' className='text-yellow-800 font-bold'>Note:</Typography>
                                <Typography variant='body2' className='text-yellow-900'>{details.note}</Typography>
                            </div>
                        )}

                        <Typography variant='caption' color='text.disabled' className='text-center mt-2'>
                            Created on: {new Date(details.createdDate).toLocaleString()}
                        </Typography>

                    </div>
                </Grid>

                {/* --- RIGHT COLUMN: LIVE QUEUE & TOKEN --- */}
                {isActive && (
                    <Grid size={{ xs: 12, md: 5 }}>
                        <div className='sticky top-4 flex flex-col gap-4 h-full'>
                            
                            {/* TOKEN NUMBER */}
                            <div className='bg-primary text-white p-6 rounded-xl text-center shadow-lg relative overflow-hidden'>
                                <div className='absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full'></div>
                                <Typography variant='body2' className='opacity-90 uppercase tracking-wider font-semibold'>Your Token</Typography>
                                <Typography variant='h1' fontWeight={800} className='my-2 text-6xl'>
                                    {details.queuePosition}
                                </Typography>
                                <Typography variant='caption' className='bg-black/20 px-2 py-1 rounded'>
                                    Queue Position
                                </Typography>
                            </div>

                            {/* LIVE QUEUE STATUS */}
                            <Box className="flex-1 min-h-[300px]">
                                <Typography variant='h6' className='mb-3 flex items-center gap-2'>
                                    <span className='relative flex h-3 w-3'>
                                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
                                      <span className='relative inline-flex rounded-full h-3 w-3 bg-red-500'></span>
                                    </span>
                                    Live Queue Status
                                </Typography>
                                
                                <RealtimeLiveQueueCard 
                                    clinicId={2} // Still hardcoded as per instruction
                                    scheduleId={102} 
                                    yourToken={details.queuePosition} 
                                />
                            </Box>
                        </div>
                    </Grid>
                )}
            </Grid>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export default AppointmentDetailsDialog