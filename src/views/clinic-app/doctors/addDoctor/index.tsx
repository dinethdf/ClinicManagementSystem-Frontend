'use client'

// React Imports
// import { useState } from 'react'

// import type { SyntheticEvent, ReactElement } from 'react'
import type { ReactElement } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'

// import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
// import CustomTabList from '@core/components/mui/TabList'
import GoBack from '@/components/GoBack/GoBack'

const AccountSettings = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States
  // const [activeTab, setActiveTab] = useState('account')
  // const handleChange = (event: SyntheticEvent, value: string) => {
  //   setActiveTab(value)
  // }

  return (
    <TabContext value={'account'}>
      <GoBack title={'Add Patient'} description={' Register a new patient in your clinic.'} />
      <Grid container spacing={6}>
        {/* 
        // Commented For now After mure requrement Use this
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
            <Tab label='Account' icon={<i className='tabler-users' />} iconPosition='start' value='account' />
          </CustomTabList>
        </Grid> */}
        <Grid size={{ xs: 12 }}>
          <TabPanel value={'account'} className='p-0'>
            {tabContentList['account']}
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default AccountSettings
