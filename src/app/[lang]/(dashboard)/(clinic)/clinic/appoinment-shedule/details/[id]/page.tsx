import { redirect } from 'next/navigation'

import AuthGuard from '@/hocs/AuthGuard'
import { AccessControlConfig } from '@/configs/accessControlConfig'
import type { Locale } from '@/configs/i18n'

import ScheduleDetails from '@/views/clinic-app/appoinmentShedule/details'

import { getScheduleById } from '@/services/doctor/doctor.shedule.server.service'

const ScheduleDetailsPage = async (props: { params: Promise<{ id: string, lang: Locale }> }) => {
  const params = await props.params
  const scheduleId = Number(params.id)
  let scheduleData = null

  try {
    scheduleData = await getScheduleById(scheduleId)
  } catch (error) {
    console.error('Error fetching schedule details:', error)
  }

  if (!scheduleData) {
    redirect('/clinic/appoinmentShedule/list')
  }

  return (
    <AuthGuard locale={params.lang} allowedRoles={AccessControlConfig.appointmentScheduleDetails}>
       <ScheduleDetails scheduleData={scheduleData} />
    </AuthGuard>
  )
}

export default ScheduleDetailsPage
