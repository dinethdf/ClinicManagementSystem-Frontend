import PatientView from '@/views/clinic-app/patient-portal/account-settings/PatientView'


// Service Imports
import { getPatientDetails } from '@/services/patient-portal/patient.account.server.service'

const PatientDetailsPage = async () => {
  // 1. Use the hardcoded ID 51 as requested
  const patientId = 51

  // 2. Call the server action directly
  const patientData = await getPatientDetails(patientId)

  console.log(patientData)

  if (!patientData) {
    return <div>Error loading patient data (ID: {patientId})</div>
  }

  // 3. Pass data to the View
  return <PatientView patientData={patientData} />
}

export default PatientDetailsPage