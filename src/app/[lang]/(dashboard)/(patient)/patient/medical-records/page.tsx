'use client'

import { useState } from 'react'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import MedicationsTab from '@/views/clinic-app/patient-portal/medical-records/MedicationsTab'
import LabReportsTab from '@/views/clinic-app/patient-portal/medical-records/LabReportsTab'
import HealthProfileTab from '@/views/clinic-app/patient-portal/medical-records/HealthProfileTab'

const MedicalRecordsPage = () => {
  const [tabValue, setTabValue] = useState('1')

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  return (
    <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
            <Typography variant='h4' fontWeight={700} color='primary'>My Health Records</Typography>
            <Typography variant='body2' color='text.secondary'>View your prescriptions, test results, and medical history.</Typography>
        </div>

        <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, bgcolor: 'white', borderRadius: 1 }}>
                <TabList onChange={handleChange} variant="scrollable" scrollButtons="auto">
                    <Tab label="Medications" value="1" icon={<i className='tabler-pill' />} iconPosition="start" />
                    <Tab label="Lab Reports" value="2" icon={<i className='tabler-flask' />} iconPosition="start" />
                    <Tab label="Health Profile" value="3" icon={<i className='tabler-user-heart' />} iconPosition="start" />
                </TabList>
            </Box>

            <TabPanel value="1" className='p-0'><MedicationsTab /></TabPanel>
            <TabPanel value="2" className='p-0'><LabReportsTab /></TabPanel>
            <TabPanel value="3" className='p-0'><HealthProfileTab /></TabPanel>
        </TabContext>
    </div>
  )
}

export default MedicalRecordsPage