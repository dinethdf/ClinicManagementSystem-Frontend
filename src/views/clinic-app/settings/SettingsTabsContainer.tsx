'use client';

import { useState } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Grid from '@mui/material/Grid';

import CustomTabList from '@core/components/mui/TabList';
import type { ClinicDetailsDTO } from '@/services/settings.server.service';

import GeneralSettingsTab from './GeneralSettingsTab';
import SecretsTab from './SecretsTab';
import SubscriptionTab from './SubscriptionTab';
import BrandingSettingsTab from './BrandingSettingsTab';

const SettingsTabsContainer = ({ settingsData }: { settingsData: ClinicDetailsDTO }) => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={(_, val) => setActiveTab(val)} variant='scrollable' pill='true'>
            <Tab icon={<i className='tabler-settings' />} value='general' label='General Settings' iconPosition='start' />
            <Tab icon={<i className='tabler-photo' />} value='branding' label='Branding' iconPosition='start' />
            <Tab icon={<i className='tabler-key' />} value='secrets' label='API & Secrets' iconPosition='start' />
            <Tab icon={<i className='tabler-credit-card' />} value='subscription' label='Subscription' iconPosition='start' />
          </CustomTabList>
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <TabPanel value='general' className='p-0'>
            <GeneralSettingsTab initialData={settingsData} />
          </TabPanel>
          <TabPanel value='branding' className='p-0'>
            <BrandingSettingsTab initialData={settingsData} />
          </TabPanel>
          <TabPanel value='secrets' className='p-0'>
            <SecretsTab />
          </TabPanel>
          <TabPanel value='subscription' className='p-0'>
            <SubscriptionTab initialData={settingsData} />
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  );
};

export default SettingsTabsContainer;