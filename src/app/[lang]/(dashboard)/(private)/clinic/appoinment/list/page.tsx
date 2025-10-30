// Component Imports
import AppoinmentList from '@views/apps/clinic-app/appoinment/list'

// Data Imports
import { getEcommerceData } from '@/app/server/actions'
import { getAppointmentsPagable } from '@/services/appoinment.server.service'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/ecommerce` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

/* const getEcommerceData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/ecommerce`)

  if (!res.ok) {
    throw new Error('Failed to fetch ecommerce data')
  }

  return res.json()
} */

const AppoinmentListPage = async () => {
  // Vars
  const data = await getEcommerceData()


  //  Use thios methode for Fetch data Serever component define and call in client comonents

  // 
  // 
  // 
  
    const appointmentsPagable = await getAppointmentsPagable(1) // Default page

    console.log("API CALL page component", appointmentsPagable)

  return <AppoinmentList orderData={data?.orderData} initialData={appointmentsPagable}/>
}

export default AppoinmentListPage
