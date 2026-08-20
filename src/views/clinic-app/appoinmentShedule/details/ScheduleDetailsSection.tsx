'use client'
import { useState } from 'react'

import { useRouter, useParams } from 'next/navigation' // Added useParams

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import type { ButtonProps } from '@mui/material/Button'

// Component Imports
import { toast } from 'react-toastify'

import CustomAvatar from '@core/components/mui/Avatar'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import EditScheduleDialog from '@/components/dialogs/edit-schedule'
import CancelScheduleDialog from '@/components/dialogs/cancel-schedule'
import type { DoctorScheduleResponseDTO } from '@/types/doctor.types'
import { encodeHideValue } from '@/utils/encode'
import { getLocalizedUrl } from '@/utils/i18n' // Helper for localized URLs
import type { Locale } from '@/configs/i18n' // Type for Locale

// Service Imports
import { closeBookingEarly, completeSchedule, syncFirebaseQueue } from '@/services/doctor/doctor.shedule.server.service'
import { useAuth } from '@/contexts/ClientAuthContextProvider'

const ScheduleDetailsSection = ({ scheduleData }: { scheduleData?: DoctorScheduleResponseDTO }) => {
  
  const router = useRouter()
  const { user } = useAuth()
  const role = user?.role || 'GUEST'
  const { lang: locale } = useParams() // Get current locale
  const [isCancelOpen, setIsCancelOpen] = useState(false)

  if (!scheduleData) return null;

  // --- Handlers ---
  const handleCloseBooking = async () => {
    if (!window.confirm('Are you sure you want to close booking early? Patients will no longer be able to book for this session.')) return;
    const res = await closeBookingEarly(scheduleData.id);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
  }

  const handleCompleteSession = async () => {
    if (!window.confirm('Mark this session as completed? This will finalize all ongoing activities.')) return;
    const res = await completeSchedule(scheduleData.id);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
  }

  const handleSyncQueue = async () => {
    const res = await syncFirebaseQueue(scheduleData.id);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  // Vars for the edit button
  const buttonProps: ButtonProps = {
    variant: 'outlined',
    fullWidth: true,
    children: 'Edit Settings',
    startIcon: <i className='tabler-settings' />
  }

  // Calculate booking percentage
  const bookedCount = scheduleData.registeredPatientCount || 0
  const maxCount = scheduleData.maxPatientCount || 1
  const percent = Math.min((bookedCount / maxCount) * 100, 100)

  // Status Helpers
  const statusLabel = scheduleData.status?.displayName || scheduleData.status?.code;
  const statusColor = scheduleData.status?.colorCode || 'primary';
  const statusCode = scheduleData.status?.code;

  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        
        {/* --- 1. Header: Date, Time & Status --- */}
        <div className='flex flex-col justify-self-center items-center gap-6'>
          <div className='flex flex-col items-center gap-4'>
            <div className="relative">
                <CustomAvatar skin='light' color='primary' variant='rounded' size={100} sx={{ width: 100, height: 100 }}>
                    <i className='tabler-calendar-time text-[48px]' />
                </CustomAvatar>
                <Chip 
                    label={statusLabel} 
                    sx={{ 
                        backgroundColor: statusColor, 
                        color: '#fff',
                        position: 'absolute',
                        bottom: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        boxShadow: 3,
                        fontWeight: 'bold',
                        height: 24
                    }} 
                    size="small" 
                />
            </div>

            <div className='flex flex-col items-center text-center mt-2'>
              <Typography variant='h5' className="font-bold">{scheduleData.scheduleDate}</Typography>
              <Typography variant='h6' color='text.secondary'>
                {`${scheduleData.startTime} - ${scheduleData.endTime}`}
              </Typography>
            </div>
          </div>
        </div>

        <Divider />

        {/* --- 2. Doctor Info --- */}
        <div className='flex flex-col gap-2'>
            <Typography variant='caption' className='uppercase text-gray-400 font-bold'>Doctor</Typography>
            <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100'>
                <CustomAvatar src='/images/avatars/doctor-common.png' size={40} />
                <div>
                    <Typography className='font-semibold text-gray-800'>{scheduleData.doctorName}</Typography>
                    <Typography variant='caption' color='text.secondary'>{scheduleData.specialization}</Typography>
                </div>
            </div>
        </div>

        {/* --- 3. Capacity / Availability --- */}
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
                <Typography variant='caption' className='uppercase text-gray-400 font-bold'>Capacity</Typography>
                <Typography variant='caption' className={`font-bold ${percent >= 100 ? 'text-error' : 'text-success'}`}>
                    {bookedCount} / {maxCount} Patients
                </Typography>
            </div>
            <LinearProgress 
                variant="determinate" 
                value={percent} 
                color={percent >= 100 ? 'error' : percent > 80 ? 'warning' : 'success'} 
                className='h-2.5 rounded-full bg-gray-200'
            />
        </div>

        {/* --- 4. Financial Info --- */}
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
                <Typography variant='caption' className='uppercase text-gray-400 font-bold'>Fees & Payout</Typography>
                {scheduleData.payoutStatus && (
                    <Chip 
                        label={scheduleData.payoutStatus.displayName} 
                        size='small' 
                        sx={{ 
                            backgroundColor: scheduleData.payoutStatus.colorCode, 
                            color: '#fff', 
                            fontSize: '0.65rem', 
                            height: 20 
                        }} 
                    />
                )}
            </div>
            
            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <div className='flex justify-between items-center mb-1'>
                    <Typography color='text.secondary' variant="body2">Doctor Fee</Typography>
                    <Typography className='font-medium'>LKR {scheduleData.doctorFee.toFixed(2)}</Typography>
                </div>
                <div className='flex justify-between items-center mb-1'>
                    <Typography color='text.secondary' variant="body2">Clinic Fee</Typography>
                    <Typography className='font-medium'>LKR {scheduleData.clinicFee.toFixed(2)}</Typography>
                </div>
                <Divider className="my-2 border-dashed border-gray-300" />
                <div className='flex justify-between items-center'>
                    <Typography color='primary' className='font-bold'>Total Fee</Typography>
                    <Typography color='primary' className='font-bold text-lg'>
                        LKR {(scheduleData.doctorFee + scheduleData.clinicFee).toFixed(2)}
                    </Typography>
                </div>
            </div>
        </div>

        {/* --- 5. Actions --- */}
        <div className='flex flex-col gap-3'>
            
            {/* NEW: Queue Scanner Button (Accessible to Everyone) */}
            <Button 
                variant='contained' 
                color='info' 
                fullWidth 
                disabled={statusCode === 'COMPLETED' || statusCode === 'CANCELLED'}
                onClick={() => router.push(getLocalizedUrl(`/clinic/appoinment-shedule/manage/${scheduleData.id}`, locale as Locale))} 
                startIcon={<i className='tabler-scan' />}
            >
                Queue Scanner
            </Button>

            {/* Admin/Staff Lifecycle Actions */}
            {(role === 'ADMIN' || role === 'STAFF') && (
            <>
                <Divider><Chip label="Lifecycle Actions" size='small' variant='tonal'/></Divider>
                
                <div className='grid grid-cols-2 gap-2'>
                    <Button 
                        variant='contained' 
                        color='success' 
                        fullWidth 
                        disabled={statusCode === 'COMPLETED' || statusCode === 'CANCELLED'}
                        onClick={handleCompleteSession}
                        startIcon={<i className='tabler-check' />}
                    >
                        Complete
                    </Button>
                    <Button 
                        variant='tonal' 
                        color='warning' 
                        fullWidth 
                        disabled={!scheduleData.isBookingOpen || statusCode === 'COMPLETED' || statusCode === 'CANCELLED'}
                        onClick={handleCloseBooking}
                        startIcon={<i className='tabler-lock-off' />}
                    >
                        Close Booking
                    </Button>
                </div>

                <Button 
                    variant='outlined' 
                    color='error' 
                    fullWidth 
                    disabled={statusCode === 'CANCELLED' || statusCode === 'COMPLETED'}
                    onClick={() => setIsCancelOpen(true)}
                    startIcon={<i className='tabler-ban' />}
                >
                    Cancel & Refund
                </Button>

                <Button 
                    variant='text' 
                    color='secondary' 
                    fullWidth 
                    size='small'
                    onClick={handleSyncQueue}
                    startIcon={<i className='tabler-refresh' />}
                >
                    Force Sync Queue
                </Button>
            </>
            )}

            {/* Admin Only System Actions */}
            {role === 'ADMIN' && (
            <>
                <Divider><Chip label="System" size='small' variant='tonal'/></Divider>
                <OpenDialogOnElementClick 
                    element={Button} 
                    elementProps={buttonProps} 
                    dialog={EditScheduleDialog} 
                    dialogProps={{ scheduleData: scheduleData }} 
                />

                <Button 
                    variant='tonal' 
                    color='secondary' 
                    fullWidth 
                    onClick={() => router.push(getLocalizedUrl(`/clinic/appoinment-shedule/details/financial/schedule-summary/${encodeHideValue(scheduleData.id)}`, locale as Locale))} 
                    startIcon={<i className='tabler-chart-pie' />}
                >
                    Financial Overview
                </Button>
            </>
            )}
        </div>

      </CardContent>

      <CancelScheduleDialog 
        open={isCancelOpen}
        setOpen={setIsCancelOpen}
        scheduleId={scheduleData.id}
      />
    </Card>
  )
}

export default ScheduleDetailsSection
