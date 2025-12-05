'use client'

import type { ReactElement } from 'react'


import Grid from '@mui/material/Grid'

import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'


import GoBack from '@/components/GoBack/GoBack'

const AccountSettings = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {

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
