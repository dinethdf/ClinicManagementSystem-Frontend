'use client'

import { useState } from 'react'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import CustomTabList from '@core/components/mui/TabList'

const StaffRight = () => {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={(_, val) => setActiveTab(val)} variant='scrollable' pill='true'>
            <Tab icon={<i className='tabler-info-circle' />} value='overview' label='Overview' iconPosition='start' />
            <Tab icon={<i className='tabler-lock' />} value='security' label='Security' iconPosition='start' />
          </CustomTabList>
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          {/* TAB 1: OVERVIEW */}
          <TabPanel value='overview' className='p-0'>
             <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" className="mb-4">Account Information</Typography>
                            <Typography color="text.secondary">
                                This staff member has full access to the administrative panel based on their role permissions.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Alert severity="info" variant='filled' icon={<i className='tabler-clock' />}>
                        <AlertTitle>Last Login</AlertTitle>
                        There is no recent login activity recorded for this user in the current session.
                    </Alert>
                </Grid>
             </Grid>
          </TabPanel>

          {/* TAB 2: SECURITY (Placeholder) */}
          <TabPanel value='security' className='p-0'>
             <Card>
                <CardContent>
                    <Typography variant="h6">Security Settings</Typography>
                    <Typography variant="body2" className="mt-2">
                        Password reset and role management options will appear here.
                    </Typography>
                </CardContent>
             </Card>
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default StaffRight