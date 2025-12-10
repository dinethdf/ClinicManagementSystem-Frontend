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

// Type Imports
import type { DoctorScheduleDTO } from '@/types/doctor.types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import EditScheduleDialog from '@/components/dialogs/edit-schedule'

const ScheduleDetailsSection = ({ scheduleData }: { scheduleData?: DoctorScheduleDTO }) => {
  
  // Vars for the edit button
  const buttonProps: ButtonProps = {
    variant: 'contained',
    fullWidth: true,
    children: 'Edit Schedule'
  }

  // Calculate booking percentage
  const bookedCount = scheduleData?.registeredPatientCount || 0
  const maxCount = scheduleData?.maxPatientCount || 1
  const percent = Math.min((bookedCount / maxCount) * 100, 100)

  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        
        {/* Header: Date & Time */}
        <div className='flex flex-col justify-self-center items-center gap-6'>
          <div className='flex flex-col items-center gap-4'>
            <CustomAvatar skin='light' color='primary' variant='rounded' size={100}>
               <i className='tabler-calendar-time text-5xl' />
            </CustomAvatar>
            <div className='flex flex-col items-center text-center'>
              <Typography variant='h5'>{scheduleData?.scheduleDate}</Typography>
              <Typography variant='body1' color='text.secondary' className='font-medium'>
                {`${scheduleData?.startTime} - ${scheduleData?.endTime}`}
              </Typography>
              <Chip 
                label={
                  scheduleData?.status === 'ACTIVE' ? 'Active Session' : 
                  scheduleData?.status === 'COMPLETED' ? 'Completed' : 
                  scheduleData?.status === 'CANCELLED' ? 'Cancelled' : scheduleData?.status
                } 
                color={
                  scheduleData?.status === 'ACTIVE' ? 'success' : 
                  scheduleData?.status === 'COMPLETED' ? 'info' : 
                  scheduleData?.status === 'CANCELLED' ? 'error' : 'default'
                } 
                variant='tonal' 
                size="small" 
                className="mt-2" 
              />
            </div>
          </div>
        </div>

        {/* Doctor Info */}
        <div className='flex flex-col gap-4'>
            <Typography variant='h6'>Doctor Information</Typography>
            <Divider />
             <div className='flex items-center gap-3'>
                <CustomAvatar src='/images/avatars/doctor-common.png' size={40} />
                <div>
                    <Typography className='font-medium'>{scheduleData?.doctorName}</Typography>
                    <Typography variant='body2' color='text.secondary'>{scheduleData?.specialization}</Typography>
                </div>
            </div>
        </div>

        {/* Financial Info */}
        <div className='flex flex-col gap-4'>
          <Typography variant='h6'>Fees</Typography>
          <Divider />
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
              <Typography color='text.secondary'>Doctor Fee:</Typography>
              <Typography className='font-medium'>LKR {scheduleData?.doctorFee.toFixed(2)}</Typography>
            </div>
            <div className='flex justify-between items-center'>
              <Typography color='text.secondary'>Clinic Fee:</Typography>
              <Typography className='font-medium'>LKR {scheduleData?.clinicFee.toFixed(2)}</Typography>
            </div>
             <div className='flex justify-between items-center mt-1 pt-2 border-t border-dashed'>
              <Typography color='primary' className='font-bold'>Total:</Typography>
              <Typography color='primary' className='font-bold'>LKR {((scheduleData?.doctorFee || 0) + (scheduleData?.clinicFee || 0)).toFixed(2)}</Typography>
            </div>
          </div>
        </div>

        {/* Capacity Info */}
         <div className='flex flex-col gap-4'>
          <Typography variant='h6'>Availability</Typography>
          <Divider />
          <div className='flex flex-col gap-2'>
             <div className='flex justify-between mb-1'>
                 <Typography variant='body2'>{`${bookedCount} / ${maxCount} Booked`}</Typography>
                 <Typography variant='body2' className='font-bold'>{percent.toFixed(0)}%</Typography>
             </div>
             <LinearProgress 
                variant="determinate" 
                value={percent} 
                color={percent >= 100 ? 'error' : percent > 80 ? 'warning' : 'success'} 
                className='h-2 rounded'
             />
          </div>
        </div>
        
        {/* Edit Trigger */}
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