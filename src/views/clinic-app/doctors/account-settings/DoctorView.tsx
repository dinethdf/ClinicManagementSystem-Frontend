// src/views/clinic-app/doctor-portal/account-settings/DoctorView.tsx
'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

import type { Doctor } from '@/types/doctor.types'

import DoctorInfoCard from './DoctorInfoCard'
import DoctorOverviewTab from './tabs/DoctorOverviewTab'
import DoctorSecurityTab from './tabs/DoctorSecurityTab'

const DoctorView = ({ doctorData }: { doctorData: Doctor }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  return (
    <Grid container spacing={6}>
      {/* LEFT COLUMN: Vital Info Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <DoctorInfoCard doctorData={doctorData} />
      </Grid>

      {/* RIGHT COLUMN: Detailed Tabs */}
      <Grid size={{ xs: 12, md: 8 }}>
        <TabContext value={activeTab}>
          <TabList onChange={handleChange} variant='scrollable'>
            <Tab label='Overview' value='overview' icon={<i className='tabler-info-circle' />} iconPosition='start' />
            <Tab label='Security' value='security' icon={<i className='tabler-lock' />} iconPosition='start' />
          </TabList>
          
          <TabPanel value='overview'>
            <DoctorOverviewTab doctorData={doctorData} />
          </TabPanel>
          <TabPanel value='security'>
            <DoctorSecurityTab />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default DoctorView