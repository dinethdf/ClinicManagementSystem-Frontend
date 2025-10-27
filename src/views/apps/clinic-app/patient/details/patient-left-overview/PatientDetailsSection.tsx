// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { Patient } from '@/libs/types/patient.types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import EditUserInfo from '@/components/dialogs/unUsed/edit-user-info'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

const PatientDetailsSection = ({ patientData }: { patientData?: Patient }) => {
  // Vars
  const buttonProps: ButtonProps = {
    variant: 'contained',
    children: 'Edit Details'
  }

  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex flex-col justify-self-center items-center gap-6'>
          <div className='flex flex-col items-center gap-4'>
            <CustomAvatar src={'/images/avatars/1.png'} variant='rounded' alt='Customer Avatar' size={120} />
            <div className='flex flex-col items-center text-center'>
              <Typography variant='h5'>{patientData?.firstName + ' ' + patientData?.lastName}</Typography>
              <Typography>Customer ID #{patientData?.patientNo}</Typography>
            </div>
          </div>
          <div className='flex items-center justify-around gap-4 flex-wrap is-full'>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className='tabler-shopping-cart' />
              </CustomAvatar>
              <div>
                <Typography variant='h5'>{'10'}</Typography>
                <Typography>Orders</Typography>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className='tabler-currency-dollar' />
              </CustomAvatar>
              <div>
                <Typography variant='h5'>${'100'}</Typography>
                <Typography>Spent</Typography>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-around gap-4 flex-wrap is-full'>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className='tabler-shopping-cart' />
              </CustomAvatar>
              <div>
                <Typography variant='h5'>{'10'}</Typography>
                <Typography>Orders</Typography>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className='tabler-currency-dollar' />
              </CustomAvatar>
              <div>
                <Typography variant='h5'>${'100'}</Typography>
                <Typography>Spent</Typography>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <Typography variant='h5'>Details</Typography>
          <Divider />
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
              <Typography color='text.primary' className='font-medium'>
                Full Name:
              </Typography>
              <Typography>{patientData?.fullName}</Typography>
            </div>
            <div className='flex items-center gap-1'>
              <Typography color='text.primary' className='font-medium'>
                Nic Number:
              </Typography>
              <Typography>{patientData?.nic}</Typography>
            </div>
            <div className='flex items-center gap-1'>
              <Typography color='text.primary' className='font-medium'>
                Email:
              </Typography>
              <Typography>{patientData?.email}</Typography>
            </div>
            <div className='flex items-center gap-1'>
              <Typography color='text.primary' className='font-medium'>
                Status:
              </Typography>
              {patientData?.isActive ? (
                <Chip label='Active' variant='filled' color='success' size='small' />
              ) : (
                <Chip label='Not Active' variant='tonal' color='warning' size='small' />
              )}
            </div>
            <div className='flex items-center gap-1'>
              <Typography color='text.primary' className='font-medium'>
                Contact:
              </Typography>
              <Typography>{patientData?.mobileNo}</Typography>
            </div>
            <div className='flex items-center gap-1'>
              <Typography color='text.primary' className='font-medium'>
                Address:
              </Typography>
              <Typography>{patientData?.address + ' ' + patientData?.city}</Typography>
            </div>
          </div>
        </div>
        <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={EditUserInfo} />
      </CardContent>
    </Card>
  )
}

export default PatientDetailsSection
