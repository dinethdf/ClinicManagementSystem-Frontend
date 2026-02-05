// Next Imports
import { redirect } from 'next/navigation'
import { verifyToken } from '@/libs/verifyToken';

import ScheduleDetails from '@/views/clinic-app/appoinmentShedule/details'

import { getScheduleByIdUpdated } from '@/services/doctor/doctor.shedule.server.service'

const ScheduleDetailsPage = async (props: { params: Promise<{ id: string }> }) => {


  const { valid, payload } = await verifyToken();
 
  const role = valid ? payload?.role : null;

  const allowedRoles = ['ADMIN', 'USER'];


  if (role && allowedRoles.includes(role)) {
      const params = await props.params
      const scheduleId = Number(params.id)
      let scheduleData = null
      try {
        scheduleData = await getScheduleByIdUpdated(scheduleId)
      } catch (error) {
        console.error('Error fetching schedule details:', error)
      }

      if (!scheduleData) {
        redirect('/clinic/appoinmentShedule/list')
      }

      return <ScheduleDetails scheduleData={scheduleData} />
  }

  return (
    <div>
      <h1>Not Authorized</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );

}

export default ScheduleDetailsPage
