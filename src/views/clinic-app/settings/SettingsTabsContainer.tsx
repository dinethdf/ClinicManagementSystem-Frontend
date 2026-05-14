'use client';

import { useState } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Grid from '@mui/material/Grid';

import CustomTabList from '@core/components/mui/TabList';
import type { ClinicSettingsDTO } from '@/services/clinic/settings.server.service';

import GeneralSettingsTab from './GeneralSettingsTab';
import SecretsTab from './SecretsTab';

const SettingsTabsContainer = ({ settingsData }: { settingsData: ClinicSettingsDTO }) => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={(_, val) => setActiveTab(val)} variant='scrollable' pill='true'>
            <Tab icon={<i className='tabler-settings' />} value='general' label='General Settings' iconPosition='start' />
            <Tab icon={<i className='tabler-key' />} value='secrets' label='API & Secrets' iconPosition='start' />
          </CustomTabList>
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <TabPanel value='general' className='p-0'>
            <GeneralSettingsTab initialData={settingsData} />
          </TabPanel>
          <TabPanel value='secrets' className='p-0'>
            <SecretsTab />
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  );
};

export default SettingsTabsContainer;