// Component Imports
import ScheduleList from '@/views/apps/clinic-app/financial/doctorPayment/list'

// Service Imports
import { getSchedulesList } from '@/services/doctor.shedule.server.service'

const ScheduleListPage = async () => {
  // Fetch data from your API
  const data = await getSchedulesList()

  return <ScheduleList scheduleData={data} />
}

export default ScheduleListPage