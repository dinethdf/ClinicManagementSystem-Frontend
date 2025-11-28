import ScheduleList from '@/views/apps/clinic-app/financial/doctorPayment/list'

import { getSchedulesList } from '@/services/doctor.shedule.server.service'

const ScheduleListPage = async () => {

  const data = await getSchedulesList()

  return <ScheduleList scheduleData={data} />
}

export default ScheduleListPage