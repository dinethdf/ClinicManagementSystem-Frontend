import type { Metadata } from 'next'

// Component Imports
import PublicBookingWizard from '@/views/apps/clinic-app/public/booking'



export const metadata: Metadata = {
  title: 'Book an Appointment | Your Clinic Name',
  description: 'Find a doctor, view schedules, and book your appointment online easily.'
}

const BookAppointmentPage = () => {
  return <PublicBookingWizard />
}

export default BookAppointmentPage