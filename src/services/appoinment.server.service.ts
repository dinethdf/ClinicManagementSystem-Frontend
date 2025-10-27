'use server'

import { cookies } from 'next/headers'


export async function getAppointmentsPagable(page: number) {
   try {
      const cookieStore = await cookies()
      const token = cookieStore.get('accessToken')?.value

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/schedules/${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        cache: 'no-store'
      })

      console.log("API call in server " )

      if (!res.ok) {
        console.error('Failed to fetch patient:', res.status, res.statusText)

        return null
      }

      const json = await res.json()

      return json.data
    } catch (error) {
      console.error('Server-side get patient failed:', error)

      return null
    }
}

// export class PatientServerSideService {
//   static async getPatientById(
//     id: string
//   ): Promise<(Omit<Patient, 'id' | 'patientNo'> & { id: string; patientNo: string }) | null> {
//     try {
//       const cookieStore = await cookies()
//       const token = cookieStore.get('accessToken')?.value

//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/patient/details/staff/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token ? { Authorization: `Bearer ${token}` } : {})
//         },
//         cache: 'no-store'
//       })

//       if (!res.ok) {
//         console.error('Failed to fetch patient:', res.status, res.statusText)

//         return null
//       }

//       const json = await res.json()

//       return json.data
//     } catch (error) {
//       console.error('Server-side get patient failed:', error)

//       return null
//     }
//   }
// }
