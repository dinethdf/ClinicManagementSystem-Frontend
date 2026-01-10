import { requireUser } from '@/libs/auth-guard';
import { ROLES } from '@/constants/roles';
import LabRequestListTable from '@/views/clinic-app/labTest/testTypes/LabTestListTable';

const LabRequestListPage = async () => {
  // Allow Admin, Doctor, and Staff to view the lab request list
  await requireUser([ROLES.ADMIN, ROLES.DOCTOR, ROLES.STAFF]);

  return <LabRequestListTable />
}

export default LabRequestListPage