// Next Imports
// import { redirect } from 'next/navigation'

// Component Imports
import AppointmentDetails from '@/views/clinic-app/appoinment/details'

// Service Imports
import { getAppointmentDetails } from '@/services/appointment/appoinment.server.service'

const AppointmentDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params
  const appointment = await getAppointmentDetails(params.id)

  if (!appointment) {
    return <div>Appointment not found</div>
  }

  return <AppointmentDetails appointmentData={appointment} />
}

export default AppointmentDetailsPage
