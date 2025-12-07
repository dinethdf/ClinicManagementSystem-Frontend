// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { Patient } from '@/types/patient.types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import EditPatientDetails from '@/components/dialogs/patient/EditPatientDetails'
import StateChangeDialog from '@/components/dialogs/patient/StateChange'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'


// Helper to format dates
const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const PatientDetailsSection = ({ patientData }: { patientData?: Patient }) => {


  const buttonProps: ButtonProps = {
    variant: 'contained',
    fullWidth: true,
    children: 'Edit Details'
  }

  const isPatientActive = patientData?.isActive;

  const statusButtonProps: ButtonProps = {
    variant: 'outlined',
    color: isPatientActive ? 'error' : 'success',
    fullWidth: true,
    className: 'mt-2',
    children: isPatientActive ? 'Deactivate User' : 'Activate User'
  }  

  const genderMap: Record<string, string> = { "1": "Male", "2": "Female" };
  const maritalMap: Record<number, string> = { 1: "Single", 2: "Married" };

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        
        {/* --- HEADER SECTION --- */}
        <div className='flex flex-col items-center justify-center gap-4'>
            <div className='relative'>
                <CustomAvatar 
                    src={'/images/avatars/common.png'}  // Hear Change that Image After File Upload System
                    variant='rounded' 
                    alt={patientData?.fullName} 
                    size={120} 
                    sx={{ borderRadius: '12px' }}
                />
            </div>
            
            <div className='flex flex-col items-center text-center gap-1'>
                <Typography variant='h5' className='font-bold'>{patientData?.fullName}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">ID: #{patientData?.patientNo}</Typography>
                    {patientData?.isActive ? (
                        <Chip label='Active' color='success' size='small' variant="tonal" sx={{ height: 20, fontSize: '0.75rem' }} />
                    ) : (
                        <Chip label='Inactive' color='error' size='small' variant="tonal" sx={{ height: 20, fontSize: '0.75rem' }} />
                    )}
                </Stack>
            </div>

            {/* --- QUICK STATS --- */}
            <div className='flex items-center justify-center gap-3 w-full'>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1.5, bgcolor: 'action.hover', borderRadius: 1, minWidth: 70 }}>
                    <Typography variant='caption' color='text.secondary'>Blood</Typography>
                    <Typography variant='h6' color='error.main'>{patientData?.bloodGroup || 'N/A'}</Typography>
                </Box>
                {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1.5, bgcolor: 'action.hover', borderRadius: 1, minWidth: 70 }}>
                    <Typography variant='caption' color='text.secondary'>Age</Typography>
                    <Typography variant='h6'>{patientData?.age || 'N/A'}</Typography>
                </Box> */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1.5, bgcolor: 'action.hover', borderRadius: 1, minWidth: 70 }}>
                    <Typography variant='caption' color='text.secondary'>Gender</Typography>
                    <Typography variant='h6'>{genderMap[String(patientData?.gender)] || 'Other'}</Typography>
                </Box>
            </div>
        </div>

        <Divider />

        {/* --- CONTACT INFORMATION --- */}
        <div className='flex flex-col gap-4'>
          <Typography variant='subtitle1' className='uppercase opacity-70 font-bold text-xs'>Contact Information</Typography>
          
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CustomAvatar skin='light' color='primary' variant='rounded' size={38}>
                    <i className='tabler-phone text-xl' />
                </CustomAvatar>
                <div>
                    <Typography variant='body2' color='text.secondary'>Mobile</Typography>
                    <Typography variant='body1' fontWeight={500}>{patientData?.mobileNo}</Typography>
                </div>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CustomAvatar skin='light' color='info' variant='rounded' size={38}>
                    <i className='tabler-mail text-xl' />
                </CustomAvatar>
                <div>
                    <Typography variant='body2' color='text.secondary'>Email</Typography>
                    <Typography variant='body1' fontWeight={500}>{patientData?.email}</Typography>
                </div>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CustomAvatar skin='light' color='success' variant='rounded' size={38}>
                    <i className='tabler-map-pin text-xl' />
                </CustomAvatar>
                <div>
                    <Typography variant='body2' color='text.secondary'>Address</Typography>
                    <Typography variant='body1' fontWeight={500}>{patientData?.address}, {patientData?.city}</Typography>
                </div>
            </Box>
          </Stack>
        </div>

        <Divider />

        {/* --- PERSONAL DETAILS --- */}
        <div className='flex flex-col gap-4'>
            <Typography variant='subtitle1' className='uppercase opacity-70 font-bold text-xs'>Personal Details</Typography>
            <ul className='flex flex-col gap-3 p-0 list-none'>
                <li className='flex items-center gap-2'>
                    <i className='tabler-id text-secondary text-xl' />
                    <Typography className='font-medium' color='text.primary'>NIC:</Typography>
                    <Typography color='text.secondary'>{patientData?.nic}</Typography>
                </li>
                <li className='flex items-center gap-2'>
                    <i className='tabler-cake text-secondary text-xl' />
                    <Typography className='font-medium' color='text.primary'>DOB:</Typography>
                    <Typography color='text.secondary'>{formatDate(patientData?.dob)}</Typography>
                </li>
                <li className='flex items-center gap-2'>
                    <i className='tabler-users text-secondary text-xl' />
                    <Typography variant='body2' className='font-medium' color='text.primary'>Marital Status:</Typography>
                    <Typography color='text.secondary'>{maritalMap[patientData?.maritalStatus as number] || 'N/A'}</Typography>
                </li>
            </ul>
        </div>

        {/* --- EMERGENCY CONTACT --- */}
        {patientData?.emergencyContactName && (
            <Box sx={{ bgcolor: 'error.lighter', p: 2, borderRadius: 1, border: '1px dashed', borderColor: 'error.main', mt: 1 }}>
                 <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <i className='tabler-alert-circle text-error' />
                    <Typography variant='subtitle2' color="error.main">Emergency Contact</Typography>
                 </Stack>
                 <Typography variant='body2' fontWeight={600}>
                    {patientData?.emergencyContactName} <span className='opacity-70 font-normal'>({patientData?.emergencyContactRelationship})</span>
                 </Typography>
                 <Typography variant='body2'>{patientData?.emergencyContactMobile}</Typography>
            </Box>
        )}

        {/* --- EDIT BUTTON --- */}
        <OpenDialogOnElementClick 
            element={Button} 
            elementProps={buttonProps} 
            dialogProps={{patientData}} 
            dialog={EditPatientDetails} 
        />
        <OpenDialogOnElementClick
            element={Button}
            elementProps={statusButtonProps}
            dialog={StateChangeDialog}
            dialogProps={{ 
                type: 'deactivate-account',
                data: { 
                    patientId: patientData?.id,
                    isActive: patientData?.isActive 
                } 
            }}
        />        
      </CardContent>
    </Card>
  )
}

export default PatientDetailsSection