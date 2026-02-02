'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import type { ButtonProps } from '@mui/material/Button'
import Box from '@mui/material/Box'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import EditScheduleDialog from '@/components/dialogs/edit-schedule'
import { UpdatedDoctorScheduleDTO } from '@/types/doctor.types'

const ScheduleDetailsSection = ({ scheduleData }: { scheduleData?: UpdatedDoctorScheduleDTO }) => {
  
  if (!scheduleData) return null;

  // Vars for the edit button
  const buttonProps: ButtonProps = {
    variant: 'contained',
    fullWidth: true,
    children: 'Edit Schedule',
    startIcon: <i className='tabler-edit' />
  }

  // Calculate booking percentage
  const bookedCount = scheduleData.registeredPatientCount || 0
  const maxCount = scheduleData.maxPatientCount || 1
  const percent = Math.min((bookedCount / maxCount) * 100, 100)

  // Status Helpers
  const statusLabel = scheduleData.status?.displayName || scheduleData.status?.code;
  const statusColor = scheduleData.status?.colorCode || 'primary';

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
                {/* Status Chip overlaying bottom center */}
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
                {/* Payout Status Chip */}
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
        
        {/* --- 5. Edit Button --- */}
        <OpenDialogOnElementClick 
            element={Button} 
            elementProps={buttonProps} 
            dialog={EditScheduleDialog} 
            dialogProps={{ scheduleData: scheduleData }} 
        />
        
      </CardContent>
    </Card>
  )
}

export default ScheduleDetailsSection