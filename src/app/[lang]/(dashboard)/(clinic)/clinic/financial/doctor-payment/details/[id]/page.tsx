import { redirect } from 'next/navigation'

import AuthGuard from '@/hocs/AuthGuard'
import { AccessControlConfig } from '@/configs/accessControlConfig'
import type { Locale } from '@/configs/i18n'

// Component Imports
import SchedulePaymentDetails from '@/views/clinic-app/financial/doctorPayment/details/index'

// Service Imports
import { getFinancialSchedule } from '@/services/financial/financial.server.service'

// Utils
import { decodeHideValue } from '@/utils/encode'

const DoctorPaymentDetailsPage = async (props: { params: Promise<{ id: string; lang: Locale }> }) => {
  const params = await props.params

  // Decode the hidden schedule ID from the URL
  const encodedId = decodeHideValue(params.id)

  // Fetch financial data for this schedule
  const result = await getFinancialSchedule(Number(encodedId))

  // Validate data — redirect to list if not found
  if (!result || !Array.isArray(result)) {
    redirect(`/${params.lang}/clinic/payouts/doctor/list`)
  }

  return (
    <AuthGuard locale={params.lang} allowedRoles={AccessControlConfig.financialScheduleSummary}>
      <SchedulePaymentDetails data={result} scheduleId={encodedId} />
    </AuthGuard>
  )
}

export default DoctorPaymentDetailsPage
