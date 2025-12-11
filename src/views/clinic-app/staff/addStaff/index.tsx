'use client'

// React Imports
import type { ReactElement } from 'react'
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Typography from '@mui/material/Typography'

import CustomTabList from '@core/components/mui/TabList'

const AddStaff = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  const [activeTab, setActiveTab] = useState('account')

  const handleChange = (event: React.SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h3' className='mb-4'>
          Register New Staff
        </Typography>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
                <Tab value='account' label='Account Details' icon={<i className='tabler-user' />} iconPosition='start' />
                {/* Add more tabs later if needed (e.g. Permissions) */}
              </CustomTabList>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TabPanel value={activeTab} className='p-0'>
                {tabContentList[activeTab]}
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default AddStaff