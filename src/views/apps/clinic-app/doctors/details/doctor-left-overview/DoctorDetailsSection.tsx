// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Type Imports
import type { Doctor } from '@/types/doctor.types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const DoctorDetailsSection = ({ doctorData }: { doctorData?: Doctor }) => {
  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex flex-col justify-self-center items-center gap-6'>
          <div className='flex flex-col items-center gap-4'>
            <CustomAvatar src={'/images/avatars/common.png'} variant='rounded' size={120} />
            <div className='flex flex-col items-center text-center'>
              <Typography variant='h5'>{`${doctorData?.firstName} ${doctorData?.lastName}`}</Typography>
              {/* <Chip label={doctorData?.specialization} color='primary' variant='tonal' size="small" className="mt-2" /> */}
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
               {/* <Chip label={doctorData?.status || 'Active'} color='success' size='small' variant='filled'/> */}
            </div>
          </div>
        </div>
        <Button variant='contained' fullWidth>Edit Details</Button>
      </CardContent>
    </Card>
  )
}

export default DoctorDetailsSection