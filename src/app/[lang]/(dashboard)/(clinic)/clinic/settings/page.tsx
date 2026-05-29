import { redirect } from 'next/navigation';

import Alert from '@mui/material/Alert';


import Grid from '@mui/material/Grid';

import { getClinicSettings } from '@/services/settings.server.service';
import SettingsTabsContainer from '@/views/clinic-app/settings/SettingsTabsContainer';

import AuthGuard from '@/hocs/AuthGuard';
import { AccessControlConfig } from '@/configs/accessControlConfig';
import type { Locale } from '@/configs/i18n';

interface PageProps {
  params: Promise<{ lang: Locale }>
}

const SettingsPage = async (props: PageProps) => {
  const params = await props.params;
  // 2. Fetch Data
  const settingsData = await getClinicSettings();

  if (!settingsData) {
      return (
          <Grid container justifyContent="center" className="mt-10">
              <Alert severity="error">Failed to load clinic settings.</Alert>
          </Grid>
      );
  }

  return (
      <AuthGuard locale={params.lang} allowedRoles={AccessControlConfig.clinicSettings}>
          <SettingsTabsContainer settingsData={settingsData} />
      </AuthGuard>
  );
};

export default SettingsPage;