import { requireUser } from '@/libs/auth-guard';
import { ROLES } from '@/constants/roles'; // Ensure 'PATIENT' role exists in your constants
import PatientDashboard from '@/views/clinic-app/patient-portal/dashboard/PatientDashboard';

const PatientDashboardPage = async () => {
  // Allow only Patients to view this dashboard


//   await requireUser([ROLES.PATIENT]);

  return <PatientDashboard />
}

export default PatientDashboardPage