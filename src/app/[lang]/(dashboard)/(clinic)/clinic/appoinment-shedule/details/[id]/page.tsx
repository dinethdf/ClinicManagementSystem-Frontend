// Next Imports
import { redirect } from 'next/navigation'

import ScheduleDetails from '@/views/clinic-app/appoinmentShedule/details'

import { getScheduleById } from '@/services/doctor/doctor.shedule.server.service'

const ScheduleDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
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

  return <ScheduleDetails scheduleData={scheduleData} />
}

export default ScheduleDetailsPage
