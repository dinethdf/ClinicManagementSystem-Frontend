'use server'; 
import { cookies } from 'next/headers';

// import { http, ApiError } from '@/services/api.config.server';

export async function getSchedulesList() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/schedules?size=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      cache: 'no-store'
    })

    if (!res.ok) {
      console.error('Failed to fetch schedules:', res.status, res.statusText)
      
      return []
    }

    const json = await res.json()
   
    return json.content || []
    
  } catch (error) {
    console.error('Server-side get schedules failed:', error)
    
    return []
  }
}

