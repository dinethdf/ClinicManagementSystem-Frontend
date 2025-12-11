import { requireUser } from '@/libs/auth-guard';
import { ROLES } from '@/constants/roles';
import StaffListTable from '@/views/clinic-app/staff/list/staffListTable';

const StaffListTablePage = async () => {
  // Allow Admin, Staff, and User (if needed) to view the list
  await requireUser([ROLES.ADMIN]);

  return <StaffListTable />
}

export default StaffListTablePage