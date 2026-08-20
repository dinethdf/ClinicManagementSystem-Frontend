import { redirect } from 'next/navigation'

import { verifyToken } from '@/libs/verifyToken'
import { validateScheduleOwnership } from '@/services/doctor/doctor.shedule.server.service' // Check path
import ScheduleFinishView from '@/views/clinic-app/doctors/schedule/ScheduleFinishView'
import AuthGuard from '@/hocs/AuthGuard'
import { AccessControlConfig } from '@/configs/accessControlConfig'
import type { Locale } from '@/configs/i18n'

export default async function Page({ params }: { params: Promise<{ id: string, lang: Locale }> }) {
  const { id, lang } = await params

    const { valid, payload } = await verifyToken()
  
    if (!valid || !payload) {
      redirect('/login')
    }
  
    const userRole = payload.role || 'GUEST'
  
    const doctorId = payload.userDetailsId || 0 


  // 2. Security Check: Validate Ownership
  const isOwner = await validateScheduleOwnership(doctorId, Number(id))
  
  if (!isOwner) {
    return <div className="p-10 text-center text-red-500 font-bold">Access Denied: You do not own this schedule.</div>
  }

  // 3. Load the Client View
  return (
    <AuthGuard locale={lang} allowedRoles={AccessControlConfig.doctorScheduleFinish}>
      <ScheduleFinishView scheduleId={Number(id)} />
    </AuthGuard>
  )
}