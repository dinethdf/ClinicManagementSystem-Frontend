
import ConsultationView from '@/views/clinic-app/doctors/consultation'


import { verifyToken } from '@/libs/verifyToken'
import { redirect } from 'next/navigation'

import { validateScheduleOwnership } from '@/services/doctor/doctor.shedule.server.service' // Check path
import UnauthorizedRedirect from '@/components/auth/UnauthorizedRedirect'

const ConsultationPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params
  const scheduleId = Number(params.id)


  const { valid, payload } = await verifyToken()
  
  if (!valid || !payload) {
    redirect('/login')
  }


  const userRole = payload.role || 'GUEST'
  const doctorId = Number(payload.userDetailsId) || 0 

  if (userRole === 'DOCTOR') {
     const isOwner = await validateScheduleOwnership(doctorId, scheduleId)

     if (!isOwner) {
       console.warn(`Security Alert: Doctor ${doctorId} tried to access Schedule ${scheduleId} without ownership.`)

       return (
            <UnauthorizedRedirect
              title="Schedule Not Found"
              message="This schedule may have been deleted or canceled."
              redirectPath="/doctor"
              variant="warning"
            />
          )
     }
  }

  return <ConsultationView scheduleId={params.id} />
}

export default ConsultationPage