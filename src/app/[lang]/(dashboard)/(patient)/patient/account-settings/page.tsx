import PatientView from '@/views/clinic-app/patient-portal/account-settings/PatientView'


// Service Imports
import { getPatientDetails } from '@/services/patient-portal/patient.account.server.service'

const PatientDetailsPage = async () => {

  const patientData = await getPatientDetails()

  if (!patientData) {
    return <div>Error loading patient data)</div>
  }

  // 3. Pass data to the View
  return <PatientView patientData={patientData} />
}

export default PatientDetailsPage