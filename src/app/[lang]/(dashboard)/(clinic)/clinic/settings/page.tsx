import { redirect } from 'next/navigation';
import { getClinicSettings } from '@/services/settings.server.service';
import SettingsTabsContainer from '@/views/clinic-app/settings/SettingsTabsContainer';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import AuthGuard from '@/hocs/AuthGuard';
import { Roles } from '@/configs/roleConfig';
import type { Locale } from '@/configs/i18n';

interface PageProps {
  params: { lang: Locale }
}

const SettingsPage = async ({ params }: PageProps) => {
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
      <AuthGuard locale={params.lang} allowedRoles={[Roles.ADMIN]}>
          <SettingsTabsContainer settingsData={settingsData} />
      </AuthGuard>
  );
};

export default SettingsPage;