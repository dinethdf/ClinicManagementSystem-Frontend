import { redirect } from 'next/navigation'

import AuthGuard from '@/hocs/AuthGuard'
import { Roles } from '@/configs/roleConfig'
import type { Locale } from '@/configs/i18n'

// Component Imports
import SchedulePaymentDetails from '@/views/clinic-app/financial/doctorPayment/details/index'

// Service Imports
import { getFinancialSchedule } from '@/services/financial/financial.server.service'

// Utils
import { decodeHideValue } from '@/utils/encode'

const FinancialSchedulePage = async (props: { params: Promise<{ id: string, lang: Locale }> }) => {
  const params = await props.params

  // Decode the hidden ID
  const encodedId = decodeHideValue(params.id)
  
  // Fetch data
  const result = await getFinancialSchedule(Number(encodedId))

  console.log(result)


  // Validate data (Ensure it is an array and not null)
  if (!result || !Array.isArray(result)) {
      redirect(`/${params.lang}/clinic/financial/list`) 
  }

  return (
    <AuthGuard locale={params.lang} allowedRoles={[Roles.ADMIN]}>
        <SchedulePaymentDetails data={result} scheduleId={encodedId} />
    </AuthGuard>
  )        
}

export default FinancialSchedulePage
