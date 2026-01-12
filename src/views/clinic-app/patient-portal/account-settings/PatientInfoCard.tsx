// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button' // Import ButtonProps

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import EditPatientDetails from '@/components/dialogs/patient/EditPatientDetails'

// Types
import type { PatientType } from '@/types/patient-portal/patientTypes' // Check your path matches

// Helper to map gender ID to text
const getGender = (id: number) => (id === 1 ? 'Male' : id === 2 ? 'Female' : 'Other')

const PatientInfoCard = ({ patientData }: { patientData: PatientType }) => {
  
  // Define properties for the button
  const buttonProps: ButtonProps = {
    variant: 'contained',
    fullWidth: true,
    children: 'Edit Details'
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        
        {/* Header: Avatar & Name */}
        <div className='flex flex-col items-center gap-4'>
          <CustomAvatar 
            src={patientData.profileImg || ''} 
            variant='rounded' 
            alt={patientData.fullName} 
            size={120} 
            skin='light'
            color='primary'
          >
            {patientData.firstName.charAt(0)}
          </CustomAvatar>
          
          <div className='flex flex-col items-center text-center'>
            <Typography variant='h5'>{patientData.fullName}</Typography>
            <Typography color='text.secondary'>Patient ID: #{patientData.patientNo}</Typography>
            <Chip 
                label={patientData.isActive ? 'Active' : 'Inactive'} 
                color={patientData.isActive ? 'success' : 'error'} 
                size='small' 
                className='mt-2' 
                variant='tonal'
            />
          </div>
        </div>

        {/* Vital Stats Row */}
        <div className='flex items-center justify-around gap-4 flex-wrap'>
          <div className='flex items-center gap-3'>
            <CustomAvatar variant='rounded' skin='light' color='error'>
              <i className='tabler-heart-rate-monitor' />
            </CustomAvatar>
            <div>
              <Typography variant='h5'>{patientData.bloodGroup || 'N/A'}</Typography>
              <Typography variant='caption'>Blood Group</Typography>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <CustomAvatar variant='rounded' skin='light' color='info'>
              <i className='tabler-calendar' />
            </CustomAvatar>
            <div>
              <Typography variant='h5'>{patientData.age}</Typography>
              <Typography variant='caption'>Age</Typography>
            </div>
          </div>
        </div>

        <Divider />

        {/* Contact Details List */}
        <div className='flex flex-col gap-4'>
          <Typography variant='h6'>Details</Typography>
          
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <Typography className='font-medium'>Username/Email:</Typography>
              <Typography>{patientData.email}</Typography>
            </div>
            <div className='flex justify-between'>
               <Typography className='font-medium'>Mobile:</Typography>
               <Typography>{patientData.mobileNo}</Typography>
            </div>
            <div className='flex justify-between'>
               <Typography className='font-medium'>Gender:</Typography>
               <Typography>{getGender(patientData.gender)}</Typography>
            </div>
            <div className='flex justify-between'>
               <Typography className='font-medium'>NIC:</Typography>
               <Typography>{patientData.nic}</Typography>
            </div>
            <div className='flex justify-between'>
               <Typography className='font-medium'>DOB:</Typography>
               <Typography>{patientData.dob}</Typography>
            </div>
          </div>
        </div>

        {/* Edit Button with Dialog Trigger */}
        <OpenDialogOnElementClick 
            element={Button} 
            elementProps={buttonProps} 
            dialogProps={{ patientData, bySelf: true }}
            dialog={EditPatientDetails} 
        />

      </CardContent>
    </Card>
  )
}

export default PatientInfoCard