// src/views/clinic-app/doctor-portal/account-settings/tabs/DoctorOverviewTab.tsx

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import type { Doctor } from '@/types/doctor.types'

const DoctorOverviewTab = ({ doctorData }: { doctorData: Doctor }) => {
  return (
    <Grid container spacing={6}>
      
      {/* Professional Information */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Professional Information' subheader='Qualifications and Specializations' />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>Full Name</Typography>
                    <Typography>{doctorData.firstName} {doctorData.lastName}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>Name with Initials</Typography>
                    <Typography>{doctorData.nameWithInitials}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>SLMC Registration</Typography>
                    <Typography>{doctorData.slmcNumber}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>Specialization</Typography>
                    <Typography>{doctorData.specialization?.name}</Typography>
                    <Typography variant='caption'>{doctorData.specialization?.note}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.secondary'>Qualifications</Typography>
                    <Typography>{doctorData.qualification}</Typography>
                </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Additional Info */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Personal Information' />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>Date of Birth</Typography>
                    <Typography>{doctorData.dob}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>NIC</Typography>
                    <Typography>{doctorData.nic}</Typography>
                </Grid>
                 <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>City</Typography>
                    <Typography>{doctorData.city || 'Not Provided'}</Typography>
                </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DoctorOverviewTab