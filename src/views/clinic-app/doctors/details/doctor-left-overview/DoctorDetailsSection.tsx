'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { Doctor } from '@/types/doctor.types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import EditDoctorDetails from '@/components/dialogs/edit-doctor' // Adjust path
import AddDoctorScheduleDialog from '@/components/dialogs/add-doctor-schedule'

const DoctorDetailsSection = ({ doctorData }: { doctorData?: Doctor }) => {
  
  // Vars for the button
  const buttonProps: ButtonProps = {
    variant: 'contained',
    fullWidth: true,
    children: 'Edit Details'
  }

  const addScheduleButtonProps: ButtonProps = {
    variant: 'tonal',
    color: 'success',
    fullWidth: true,
    children: 'Add Schedule'
  }

  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex flex-col justify-self-center items-center gap-6'>
          <div className='flex flex-col items-center gap-4'>
            <CustomAvatar src={'/images/avatars/common.png'} variant='rounded' size={120} />
            <div className='flex flex-col items-center text-center'>
              <Typography variant='h5'>{`${doctorData?.firstName} ${doctorData?.lastName}`}</Typography>
              <Typography variant='body2' color='text.secondary'>{doctorData?.specialization.name}</Typography>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <Typography variant='h5'>Details</Typography>
          <Divider />
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
              <Typography className='font-medium'>Email:</Typography>
              <Typography>{doctorData?.email}</Typography>
            </div>
            <div className='flex items-center gap-1'>
              <Typography className='font-medium'>Contact:</Typography>
              <Typography>{doctorData?.mobileNo}</Typography>
            </div>
            <div className='flex items-center gap-1'>
               <Typography className='font-medium'>Status:</Typography>
               <Typography color='primary'>{doctorData?.availabilityStatus || 'AVAILABLE'}</Typography>
            </div>
            <div className='flex items-center gap-1'>
               <Typography className='font-medium'>SLMC:</Typography>
               <Typography>{doctorData?.slmcNumber}</Typography>
            </div>
          </div>
        </div>
        
        <div className='flex flex-col gap-4 mt-4'>
          <OpenDialogOnElementClick 
              element={Button} 
              elementProps={buttonProps} 
              dialog={EditDoctorDetails} 
              dialogProps={{ doctorData: doctorData }} 
          />
          
          <OpenDialogOnElementClick 
              element={Button} 
              elementProps={addScheduleButtonProps} 
              dialog={AddDoctorScheduleDialog} 
              dialogProps={{ doctorData: doctorData }} 
          />
        </div>
        
      </CardContent>
    </Card>
  )
}

export default DoctorDetailsSection