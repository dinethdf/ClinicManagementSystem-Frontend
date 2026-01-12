import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import type { PatientType } from '@/types/patient-portal/patientTypes'

const PatientOverviewTab = ({ patientData }: { patientData: PatientType }) => {
  return (
    <Grid container spacing={6}>
      
      {/* Address Information */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Address Information' subheader='Residential details' />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>Address</Typography>
                    <Typography>{patientData.address}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>City</Typography>
                    <Typography>{patientData.city}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>District</Typography>
                    <Typography>{patientData.district}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>Landline</Typography>
                    <Typography>{patientData.landNo || 'N/A'}</Typography>
                </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Emergency Contact */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Emergency Contact' subheader='In case of medical emergency' />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>Name</Typography>
                    <Typography>{patientData.emergencyContactName}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>Relationship</Typography>
                    <Typography>{patientData.emergencyContactRelationship}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>Mobile</Typography>
                    <Typography>{patientData.emergencyContactMobile}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography className='font-medium' color='text.secondary'>Email</Typography>
                    <Typography>{patientData.emergencyContactEmail || 'N/A'}</Typography>
                </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Additional & System Info */}
      <Grid size={{ xs: 12 }}>
        <Card>
           <CardHeader title='Additional Information' />
           <Divider />
           <CardContent>
             <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography className='font-medium' color='text.secondary'>Ethnicity ID</Typography>
                    <Typography>{patientData.ethnicity}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography className='font-medium' color='text.secondary'>Marital Status ID</Typography>
                    <Typography>{patientData.maritalStatus}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography className='font-medium' color='text.secondary'>Guardian</Typography>
                    <Typography>{patientData.guardian || 'None'}</Typography>
                </Grid>
                
                <Grid size={{ xs: 12 }} className='mt-4'>
                    <Typography variant='h6' className='mb-2'>System Meta</Typography>
                    <div className='flex gap-6 flex-wrap'>
                        <div>
                            <Typography variant='caption'>Registration Date</Typography>
                            <Typography variant='body2'>{new Date(patientData.registrationDate).toLocaleDateString()}</Typography>
                        </div>
                        <div>
                            <Typography variant='caption'>Created Date</Typography>
                            <Typography variant='body2'>{new Date(patientData.createdDate).toLocaleDateString()}</Typography>
                        </div>
                        <div>
                            <Typography variant='caption'>Last Updated</Typography>
                            <Typography variant='body2'>{new Date(patientData.updatedDate).toLocaleDateString()}</Typography>
                        </div>
                    </div>
                </Grid>
             </Grid>
           </CardContent>
        </Card>
      </Grid>

    </Grid>
  )
}

export default PatientOverviewTab