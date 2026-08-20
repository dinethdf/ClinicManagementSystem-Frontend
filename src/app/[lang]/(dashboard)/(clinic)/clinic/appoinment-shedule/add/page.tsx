import AuthGuard from '@/hocs/AuthGuard'
import { AccessControlConfig } from '@/configs/accessControlConfig'
import type { Locale } from '@/configs/i18n'

import DoctorAppointment from '@/views/clinic-app/appoinmentShedule/add'

interface PageProps {
  params: Promise<{ lang: Locale }>
}

const DoctorAppointmentSection = async (props: PageProps) => {
  const params = await props.params;
  return (
    <AuthGuard locale={params.lang} allowedRoles={AccessControlConfig.appointmentScheduleAdd}>
      <DoctorAppointment />
    </AuthGuard>
  )
}

export default DoctorAppointmentSection
