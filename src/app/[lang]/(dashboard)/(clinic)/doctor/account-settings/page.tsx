// src/views/clinic-app/doctor-portal/account-settings/DoctorDetailsPage.tsx

import DoctorView from '@/views/clinic-app/doctors/account-settings/DoctorView'
import { getDoctorDetailsByTocken } from '@/services/doctor.server.service'

const DoctorDetailsPage = async () => {
  const doctorData = await getDoctorDetailsByTocken()

  if (!doctorData) {
    return <div>Error loading doctor profile. Please try again later.</div>
  }

  return <DoctorView doctorData={doctorData} />
}

export default DoctorDetailsPage