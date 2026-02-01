import { redirect } from 'next/navigation'

// Component Imports
import SchedulePaymentDetails from '@/views/clinic-app/financial/doctorPayment/details/index'

// Service Imports
import { getFinancialSchedule } from '@/services/financial/financial.server.service'

// Utils
import { decodeHideValue } from '@/utils/encode'

const FinancialSchedulePage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  // Decode the hidden ID
  const encodedId = decodeHideValue(params.id)
  
  // Fetch data
  const result = await getFinancialSchedule(Number(encodedId))

  // Validate data (Ensure it is an array and not null)
  if (!result || !Array.isArray(result)) {
      redirect('/en/clinic/financial/list') 
  }

  return (
      <SchedulePaymentDetails data={result} scheduleId={encodedId} />
  )
}

export default FinancialSchedulePage
