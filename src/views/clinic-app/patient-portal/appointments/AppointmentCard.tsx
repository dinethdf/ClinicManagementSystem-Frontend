'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// MUI
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LoadingButton from '@mui/lab/LoadingButton'

import { cancelAppointment } from '@/services/patient-portal/patient.appointments.service'
import type { PatientAppointmentDTO } from '@/types/patient-portal/patient.appointments.types'

interface Props {
  appt: PatientAppointmentDTO
  isHistory?: boolean
  onRefresh: () => void
}

const AppointmentCard = ({ appt, isHistory, onRefresh }: Props) => {
  const router = useRouter()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Status Config
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'SCHEDULED': return { color: 'primary', label: 'Scheduled', icon: 'tabler-calendar' };
      case 'COMPLETED': return { color: 'success', label: 'Completed', icon: 'tabler-check' };
      case 'CANCELLED': return { color: 'error', label: 'Cancelled', icon: 'tabler-x' };
      case 'PENDING_PAYMENT': return { color: 'warning', label: 'Pay Now', icon: 'tabler-currency-dollar' };
      default: return { color: 'default', label: status, icon: 'tabler-help' };
    }
  }
  const statusConfig = getStatusConfig(appt.status);

  // Story 2.3: Cancel Logic
  const handleCancelConfirm = async () => {
    setLoading(true);
    await cancelAppointment(appt.id);
    setLoading(false);
    setCancelOpen(false);
    onRefresh(); 
  }

  // Story 2.2: Rebooking Logic
  const handleRebook = () => {
    router.push(`/patient/book?doctorId=${appt.scheduleId}`); 
  }

  return (
    <>
      <Card className='mb-4 border border-gray-100 shadow-sm hover:shadow-md transition-all'>
        <CardContent className='p-5'>
          <div className='flex flex-col sm:flex-row justify-between sm:items-start gap-4'>
            
            {/* Left: Doctor Info */}
            <div className='flex gap-4'>
              <Avatar className='w-14 h-14 bg-blue-50 text-blue-600 font-bold text-xl rounded-xl'>
                {appt.doctorName.charAt(4)}
              </Avatar>
              <div>
                <Typography variant='h6' fontWeight={700} className='leading-tight'>
                  {appt.doctorName}
                </Typography>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  {appt.specialization}
                </Typography>
                <div className='flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit'>
                  <i className='tabler-map-pin text-[14px]' /> {appt.clinicName} • {appt.location}
                </div>
              </div>
            </div>

            {/* Right: Date & Status */}
            <div className='text-left sm:text-right flex flex-col sm:items-end'>
               <Chip 
                  icon={<i className={statusConfig.icon} />} 
                  label={statusConfig.label} 
                  color={statusConfig.color as any} 
                  size='small' 
                  variant='tonal' 
                  className='font-bold mb-2 uppercase text-[10px]'
               />
               <Typography variant='h5' fontWeight={700}>
                  {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
               </Typography>
               <Typography variant='body2' className='text-primary font-medium'>
                  {appt.startTime}
               </Typography>
            </div>
          </div>

          <Divider className='my-4 border-dashed' />

          {/* Footer Actions */}
          <div className='flex justify-between items-center'>
             <div className='flex flex-col'>
                <Typography variant='caption' color='text.secondary' className='uppercase font-bold text-[10px]'>Queue No</Typography>
                <Typography variant='h4' fontWeight={800} color='text.primary'>#{appt.queueNo}</Typography>
             </div>

             <div className='flex gap-2'>
                {isHistory ? (
                   <Button variant='contained' size='small' startIcon={<i className='tabler-refresh' />} onClick={handleRebook}>
                      Book Again
                   </Button>
                ) : (
                   <>
                     {/* Allow cancel only if allowed (backend rule > 24h) */}
                     {appt.canCancel && appt.status === 'SCHEDULED' && (
                       <Button variant='outlined' color='error' size='small' onClick={() => setCancelOpen(true)}>
                          Cancel
                       </Button>
                     )}
                     <Button variant='tonal' size='small' startIcon={<i className='tabler-file-invoice' />}>
                        Details
                     </Button>
                   </>
                )}
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Modal */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)}>
        <DialogTitle className='text-error flex items-center gap-2'>
           <i className='tabler-alert-triangle' /> Cancel Appointment?
        </DialogTitle>
        <DialogContent>
           <Typography>
              Are you sure you want to cancel your appointment with <strong>{appt.doctorName}</strong> on {new Date(appt.date).toDateString()}?
           </Typography>
           <Typography variant='caption' color='text.secondary' className='mt-2 block bg-yellow-50 p-2 rounded text-yellow-800'>
              <i className='tabler-info-circle text-xs mr-1'/> 
              Since this is within the allowed timeframe, you will receive a full refund.
           </Typography>
        </DialogContent>
        <DialogActions className='p-3'>
           <Button onClick={() => setCancelOpen(false)} color='inherit'>Keep Appointment</Button>
           <LoadingButton onClick={handleCancelConfirm} loading={loading} color='error' variant='contained'>
              Yes, Cancel It
           </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AppointmentCard