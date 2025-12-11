'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { ClinicStaffResponseDTO } from '@/services/staff.server.service'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import EditStaffDetails from '@/components/dialogs/edit-staff' // See Section 5 below

const StaffDetailsSection = ({ staffData }: { staffData: ClinicStaffResponseDTO }) => {
  
  const buttonProps: ButtonProps = {
    variant: 'contained',
    fullWidth: true,
    children: 'Edit Details'
  }

  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex flex-col justify-self-center items-center gap-6'>
          <div className='flex flex-col items-center gap-4'>
            <CustomAvatar src={staffData.profileImg || '/images/avatars/common.png'} variant='rounded' size={120} />
            <div className='flex flex-col items-center text-center'>
              <Typography variant='h5'>{`${staffData.firstName} ${staffData.lastName}`}</Typography>
              <Typography variant='body2' color='text.secondary'>{staffData.designation || 'Staff Member'}</Typography>
            </div>
            <Chip 
                label={staffData.status} 
                color={staffData.status === 'ACTIVE' ? 'success' : 'error'} 
                size="small" 
                variant="tonal" 
            />
          </div>
        </div>
        
        <div className='flex flex-col gap-4'>
          <Typography variant='h5'>Details</Typography>
          <Divider />
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
              <Typography className='font-medium'>Email:</Typography>
              <Typography>{staffData.email}</Typography>
            </div>
            <div className='flex items-center gap-1'>
              <Typography className='font-medium'>Contact:</Typography>
              <Typography>{staffData.mobileNo}</Typography>
            </div>
            <div className='flex items-center gap-1'>
               <Typography className='font-medium'>NIC:</Typography>
               <Typography>{staffData.nic}</Typography>
            </div>
            <div className='flex items-center gap-1'>
               <Typography className='font-medium'>City:</Typography>
               <Typography>{staffData.city || 'N/A'}</Typography>
            </div>
          </div>
        </div>
        
        {/* Edit Button Dialog Trigger */}
        <OpenDialogOnElementClick 
            element={Button} 
            elementProps={buttonProps} 
            dialog={EditStaffDetails} 
            dialogProps={{ staffData: staffData }} 
        />
        
      </CardContent>
    </Card>
  )
}

export default StaffDetailsSection