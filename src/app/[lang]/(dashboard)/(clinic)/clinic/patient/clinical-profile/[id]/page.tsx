// Next Imports
import { redirect } from 'next/navigation'

// Component Imports
import CustomerDetails from '@/views/clinic-app/patient/details'

// Service Imports (Updated)
import { getPatientById } from '@/services/patient.server.service'

const CustomerDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  // 1. Call the new function
  const res = await getPatientById(params.id)

  console.log(res.data)
  // 2. Check success flag instead of checking if object is null
  if (!res.success || !res.data) {
    console.error("Patient not found or API error:", res.error)
    redirect('/clinic/patient/list') // Redirect on failure
  }

  const patient = res.data

  return <CustomerDetails patientData={patient} />
}

export default CustomerDetailsPage