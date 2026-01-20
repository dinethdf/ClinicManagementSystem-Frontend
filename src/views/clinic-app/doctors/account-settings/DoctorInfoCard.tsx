// src/views/clinic-app/doctor-portal/account-settings/DoctorInfoCard.tsx

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CustomAvatar from '@core/components/mui/Avatar'
import type { Doctor } from '@/types/doctor.types'

const DoctorInfoCard = ({ doctorData }: { doctorData: Doctor }) => {
  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        
        {/* Header */}
        <div className='flex flex-col items-center gap-4'>
          <CustomAvatar 
            src={doctorData.profileImg || ''} 
            variant='rounded' 
            alt={doctorData.firstName} 
            size={120} 
            skin='light'
            color='primary'
          >
            {doctorData.firstName.charAt(0)}
          </CustomAvatar>
          
          <div className='flex flex-col items-center text-center'>
            <Typography variant='h5'>{doctorData.nameWithInitials}</Typography>
            <Typography color='text.secondary'>SLMC: {doctorData.slmcNumber}</Typography>
            <Chip 
                label={doctorData.specialization?.name || 'General'} 
                color='primary' 
                size='small' 
                className='mt-2' 
                variant='tonal'
            />
          </div>
        </div>

        {/* Vital Stats */}
        <div className='flex items-center justify-around gap-4 flex-wrap'>
          <div className='flex items-center gap-3'>
            <CustomAvatar variant='rounded' skin='light' color='info'>
              <i className='tabler-certificate' />
            </CustomAvatar>
            <div>
              <Typography variant='h5'>{doctorData.experienceYears}+</Typography>
              <Typography variant='caption'>Years Exp</Typography>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <CustomAvatar variant='rounded' skin='light' color='success'>
              <i className='tabler-stethoscope' />
            </CustomAvatar>
            <div>
              <Typography variant='h5'>Active</Typography>
              <Typography variant='caption'>Status</Typography>
            </div>
          </div>
        </div>

        <Divider />

        {/* Contact Details List */}
        <div className='flex flex-col gap-4'>
          <Typography variant='h6'>Details</Typography>
          
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <Typography className='font-medium'>Email:</Typography>
              <Typography>{doctorData.email}</Typography>
            </div>
            <div className='flex justify-between'>
               <Typography className='font-medium'>Mobile:</Typography>
               <Typography>{doctorData.mobileNo}</Typography>
            </div>
            <div className='flex justify-between'>
               <Typography className='font-medium'>NIC:</Typography>
               <Typography>{doctorData.nic}</Typography>
            </div>
            <div className='flex justify-between'>
               <Typography className='font-medium'>DOB:</Typography>
               <Typography>{doctorData.dob}</Typography>
            </div>
             <div className='flex justify-between'>
               <Typography className='font-medium'>City:</Typography>
               <Typography>{doctorData.city || 'N/A'}</Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DoctorInfoCard