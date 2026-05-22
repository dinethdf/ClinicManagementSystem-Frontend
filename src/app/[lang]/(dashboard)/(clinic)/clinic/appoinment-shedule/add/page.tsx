import AuthGuard from '@/hocs/AuthGuard'
import { Roles } from '@/configs/roleConfig'
import type { Locale } from '@/configs/i18n'

import DoctorAppointment from '@/views/clinic-app/appoinmentShedule/add'

interface PageProps {
  params: { lang: Locale }
}

const doctorAppointmentSection = async ({ params }: PageProps) => {
  return (
    <AuthGuard locale={params.lang} allowedRoles={[Roles.ADMIN, Roles.DOCTOR]}>
      <DoctorAppointment />
    </AuthGuard>
  )
}

export default doctorAppointmentSection
