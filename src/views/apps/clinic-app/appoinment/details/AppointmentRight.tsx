'use client'

import { useState } from 'react'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import CustomTabList from '@core/components/mui/TabList'
import type { AppointmentDetailDTO } from '@/types/appoinments.types'

const AppointmentRight = ({ appointmentData }: { appointmentData: AppointmentDetailDTO }) => {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={(_, val) => setActiveTab(val)} variant='scrollable' pill='true'>
            <Tab icon={<i className='tabler-info-circle' />} value='overview' label='Overview' iconPosition='start' />
          </CustomTabList>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TabPanel value='overview' className='p-0'>
            
            {/* Appointment Specifics Card */}
            <Card className='mb-6'>
                <CardHeader title="Appointment Information" />
                <Divider />
                <CardContent>
                    <Grid container spacing={6}>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary'>Schedule Date</Typography>
                                <Typography className='font-medium'>{appointmentData.scheduleDate}</Typography>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary'>Time Slot</Typography>
                                <Typography className='font-medium'>{`${appointmentData.startTime} - ${appointmentData.endTime}`}</Typography>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary'>Queue Position</Typography>
                                <Typography className='font-medium text-primary'>No. {appointmentData.queuePosition}</Typography>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary'>Total Fee</Typography>
                                <Typography className='font-medium text-success'>LKR {(appointmentData.doctorFee + appointmentData.clinicFee).toFixed(2)}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Financial Breakdown */}
            <Card className='mb-6'>
                <CardHeader title="Financial Breakdown" />
                <Divider />
                 <CardContent>
                    <div className='flex justify-between mb-2'>
                        <Typography>Doctor Fee</Typography>
                        <Typography>LKR {appointmentData.doctorFee.toFixed(2)}</Typography>
                    </div>
                    <div className='flex justify-between mb-2'>
                        <Typography>Clinic Fee</Typography>
                        <Typography>LKR {appointmentData.clinicFee.toFixed(2)}</Typography>
                    </div>
                    <Divider className='my-2' />
                    <div className='flex justify-between'>
                        <Typography className='font-bold'>Total</Typography>
                        <Typography className='font-bold'>LKR {(appointmentData.doctorFee + appointmentData.clinicFee).toFixed(2)}</Typography>
                    </div>
                 </CardContent>
            </Card>

            {/* Audit Logs */}
            <Card>
                <CardHeader title="System Information" />
                <Divider />
                <CardContent>
                     <Grid container spacing={6}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant='caption' className='uppercase'>Created</Typography>
                            <Typography>{appointmentData.createdDate ? new Date(appointmentData.createdDate).toLocaleString() : 'N/A'}</Typography>
                            <Typography variant='caption'>by {appointmentData.createdBy}</Typography>
                        </Grid>
                        {appointmentData.updatedDate && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant='caption' className='uppercase'>Last Updated</Typography>
                                <Typography>{new Date(appointmentData.updatedDate).toLocaleString()}</Typography>
                                <Typography variant='caption'>by {appointmentData.updatedBy}</Typography>
                            </Grid>
                        )}
                     </Grid>
                </CardContent>
            </Card>

          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default AppointmentRight