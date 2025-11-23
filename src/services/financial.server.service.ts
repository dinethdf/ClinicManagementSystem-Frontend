'use server'; 
import { cookies } from 'next/headers';

import { http, ApiError } from '@/services/api.config.server';

export async function getFinancialSchedule(scheduleId: number) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/financials/schedule/${scheduleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      cache: 'no-store'
    })

    if (!res.ok) {
      console.error('Failed to fetch financial schedule:', res.status, res.statusText)
      return null
    }

    const json = await res.json()
    
    return json
  } catch (error) {
    console.error('Server-side get financial schedule failed:', error)
    return null
  }
}

