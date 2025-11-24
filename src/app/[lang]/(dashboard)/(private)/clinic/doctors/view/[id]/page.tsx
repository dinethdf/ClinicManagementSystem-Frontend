// Next Imports
import { redirect } from 'next/navigation'

// Component Imports
import DoctorDetails from '@/views/apps/clinic-app/doctors/details'

// Service Imports
import { getDoctorById } from '@/services/doctor.server.service'

const DoctorDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  // Fetch Doctor Profile (Server Side)
  const doctor = await getDoctorById(params.id)

  // console.log("data", doctor)

  if (!doctor) {
    // If backend 404s or error, redirect or show not found
    // redirect('/clinic/doctor/list') 
    // For now, let's render null or redirect
    return <div>Doctor not found</div>
  }

  return <DoctorDetails doctorData={doctor} />
}

export default DoctorDetailsPage