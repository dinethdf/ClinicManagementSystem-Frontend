'use client'
import { useState } from 'react'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid2'
import CustomTabList from '@core/components/mui/TabList'

// Imports dynamically to avoid circular dependencies if needed, or direct import
import DoctorOverview from './overview'

const DoctorRight = ({ doctorId }: { doctorId: string }) => {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={(_, val) => setActiveTab(val)} variant='scrollable' pill='true'>
            <Tab icon={<i className='tabler-calendar-time' />} value='overview' label='Schedule & Overview' iconPosition='start' />
            {/* Add more tabs like 'Patients', 'Performance' here later */}
          </CustomTabList>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TabPanel value='overview' className='p-0'>
            <DoctorOverview doctorId={doctorId} />
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default DoctorRight