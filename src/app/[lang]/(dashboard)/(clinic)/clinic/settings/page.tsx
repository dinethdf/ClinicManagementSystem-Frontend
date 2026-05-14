import { redirect } from 'next/navigation';
import { verifyToken } from '@/libs/verifyToken';
import { getClinicSettings } from '@/services/settings.server.service';
import SettingsTabsContainer from '@/views/clinic-app/settings/SettingsTabsContainer';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

const SettingsPage = async () => {
  // 1. Auth & Admin Check
  const { valid, payload } = await verifyToken();
  if (!valid || !payload) redirect('/login');
  if (payload.role !== 'ADMIN' && payload.role !== 'CO-ADMIN') {
      return (
          <Grid container justifyContent="center" className="mt-10">
              <Alert severity="error">Access Denied. Admin privileges required.</Alert>
          </Grid>
      );
  }

  // 2. Fetch Data
  const settingsData = await getClinicSettings();

  if (!settingsData) {
      return (
          <Grid container justifyContent="center" className="mt-10">
              <Alert severity="error">Failed to load clinic settings. Please try again later.</Alert>
          </Grid>
      );
  }

  return <SettingsTabsContainer settingsData={settingsData} />;
};

export default SettingsPage;