'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid' // Ensure you use Grid2 for 'size' prop support, or standard Grid if your version supports it
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

// Type Imports
import type { PatientType } from '@/types/patient-portal/patientTypes'

// Component Imports
import PatientInfoCard from './PatientInfoCard'
import PatientOverviewTab from './tabs/PatientOverviewTab'
import PatientSecurityTab from './tabs/PatientSecurityTab'

const PatientView = ({ patientData }: { patientData: PatientType }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  return (
    <Grid container spacing={6}>
      {/* LEFT COLUMN: Vital Info Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <PatientInfoCard patientData={patientData} />
      </Grid>

      {/* RIGHT COLUMN: Detailed Tabs */}
      <Grid size={{ xs: 12, md: 8 }}>
        <TabContext value={activeTab}>
          <TabList onChange={handleChange} variant='scrollable'>
            <Tab label='Overview' value='overview' icon={<i className='tabler-info-circle' />} iconPosition='start' />
            <Tab label='Security' value='security' icon={<i className='tabler-lock' />} iconPosition='start' />
          </TabList>
          
          <TabPanel value='overview'>
            <PatientOverviewTab patientData={patientData} />
          </TabPanel>
          <TabPanel value='security'>
            <PatientSecurityTab />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default PatientView