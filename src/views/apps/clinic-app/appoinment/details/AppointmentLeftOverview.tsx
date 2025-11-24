// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// Type Imports
import type { AppointmentDetailDTO } from '@/types/appoinments.types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const AppointmentLeftOverview = ({ appointmentData }: { appointmentData: AppointmentDetailDTO }) => {
  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex flex-col justify-self-center items-center gap-6'>
          <div className='flex flex-col items-center gap-4'>
            <CustomAvatar src='/images/avatars/common.png' variant='rounded' size={100} />
            <div className='flex flex-col items-center text-center'>
              <Typography variant='h5'>{appointmentData.patientName}</Typography>
              <Typography variant='body2' color='text.disabled'>{appointmentData.patientNo}</Typography>
              <Chip 
                label={appointmentData.status} 
                color={appointmentData.status === 'COMPLETED' ? 'success' : 'primary'} 
                variant='tonal' 
                size='small' 
                className='mt-2' 
              />
            </div>
          </div>
        </div>
        
        <Divider />
        
        <div className='flex flex-col gap-4'>
          <Typography variant='h6'>Patient Details</Typography>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <i className='tabler-phone text-xl text-textSecondary' />
              <Typography>{appointmentData.patientMobile}</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <i className='tabler-id text-xl text-textSecondary' />
              <Typography>{appointmentData.patientNic}</Typography>
            </div>
          </div>
        </div>

        <Divider />

        <div className='flex flex-col gap-4'>
            <Typography variant='h6'>Doctor Details</Typography>
            <div className='flex flex-col gap-1'>
                <Typography className='font-medium'>{appointmentData.doctorName}</Typography>
                <Typography variant='body2'>{appointmentData.specialization}</Typography>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AppointmentLeftOverview