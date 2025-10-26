import { verifyToken } from '@/libs/verifyToken';

import DoctorAppointment from '@/views/apps/clinic-app/appoinmentShedule/add'

const doctorAppointmentSection = async () => {

  const { valid, payload } = await verifyToken();
 
  const role = valid ? payload?.role : null;

  const allowedRoles = ['ADMIN', 'STAFF', 'USER', 'ABCD'];


  if (role && allowedRoles.includes(role)) {

    return <DoctorAppointment role={role} />;
  }

  // If NO (role is 'PATIEN', null, or anything else), show an error
  return (
    <div>
      <h1>Not Authorized</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );
};

export default doctorAppointmentSection
