// Next Imports
import { redirect } from 'next/navigation'

// Type Imports

// Component Imports
import CustomerDetails from '@/views/clinic-app/patient/details'

// Data Imports

import { PatientServerSideService } from '@/services/patient.server.service'


const CustomerDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  // Vars
  // const data = await getEcommerceData()

  const patient = await PatientServerSideService.getPatientById(params.id)

  if (!patient) {
    redirect('/clinic/patient/list')
    console.log('Error')
  }

  // else{
  //   // console.log("patient",patient);
  // }
  // const filteredData = data?.customerData.filter((item: Customer) =>item.customerId === "879861")[0]

  if (!patient) {
    redirect('/not-found')
  }

  return patient ? <CustomerDetails patientData={patient} /> : null
}

export default CustomerDetailsPage
