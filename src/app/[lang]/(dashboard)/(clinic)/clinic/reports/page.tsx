import { requireUser } from '@/libs/auth-guard';
import { ROLES } from '@/constants/roles';
import ReportsDashboard from '@/views/clinic-app/reports/ReportsDashboard';

const ReportsPage = async () => {
  // Allow Admin and Doctors to access reports
  // You can adjust ROLES based on your requirements (e.g., adding STAFF)
  await requireUser([ROLES.ADMIN]);

  return <ReportsDashboard />
}

export default ReportsPage