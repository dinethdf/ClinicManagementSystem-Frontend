import { requireUser } from '@/libs/auth-guard';

import { ROLES } from '@/constants/roles';

import DoctorListTable from '@/views/clinic-app/doctors/list/DoctorsListTable'



const CustomerListTablePage = async () => {

await requireUser([ROLES.ADMIN, ROLES.STAFF]);

  return <DoctorListTable />
}

export default CustomerListTablePage
