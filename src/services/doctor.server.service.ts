'use server'; 
import { cookies } from 'next/headers'

import type { Doctor } from '@/types/doctor.types'

  
  export async function getDoctorById(id: string): Promise<Doctor | null> {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get('accessToken')?.value

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/doctor/get-details/staff/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        cache: 'no-store'
      })

      if (!res.ok) return null
     
      const json = await res.json()
      
      return json.data
    } catch (error) {
      console.error('Failed to fetch doctor:', error)
     
      return null
    }
  }
