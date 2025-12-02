'use server'; 
import { cookies } from 'next/headers';

import type { DoctorScheduleDTO } from '@/types/doctor.types';
import type { PublicBookingRequest } from '@/types/public-booking.types';


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
   
    return json.data.content || []
    
  } catch (error) {
    console.error('Server-side get schedules failed:', error)
    
    return []
  }
}

export const getPublicSchedulesList = async ({ page, size, date, specialization, doctorName }: any) => {

  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (date) params.append('date', date);
  if (specialization) params.append('specialization', specialization);
  if (doctorName) params.append('doctorName', doctorName);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/schedules/upcoming-public?${params.toString()}`, {
     cache: 'no-store' 
  });
  
  if (!res.ok) throw new Error('Failed to fetch');
  
  const data = await res.json();

  return data.data; 
}

export async function getSchedulesByDoctorId(doctorId: string): Promise<DoctorScheduleDTO[]> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/schedules/by-doctor/${doctorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      cache: 'no-store'
    })

    if (!res.ok) {
      
      console.error('Failed to fetch doctor schedules:', res.status, res.statusText)
      
      return []
    }

    const json = await res.json()

    return json.data || []

  } catch (error) {
    
    console.error('Server-side get doctor schedules failed:', error)
    
    return []
  }
}


export async function getScheduleById(id: number): Promise<DoctorScheduleDTO | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/schedules/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      cache: 'no-store'
    })

    if (!res.ok) {
      
      console.error('Failed to fetch doctor schedules:', res.status, res.statusText)
      
      return null
    }

    const json = await res.json()
    
    return json.data || null

  } catch (error) {
    
    console.error('Server-side get doctor schedules failed:', error)
    
    return null
  }
}  

export const bookPublicAppointment = async (payload: PublicBookingRequest) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/public/book-public`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        
        if (!res.ok) {
            // Throw the specific error message from backend (e.g. "SCHEDULE_FULL")
            throw new Error(data.message || 'Booking failed');
        }

        return data; // Returns { code: 200, data: <appointmentId>, message: "..." }
    } catch (error) {
        throw error;
    }
}

export const checkPatientAvailability = async (query: string) => {

    const isNic = query.toLowerCase().includes('v') || query.length > 10;
    const param = isNic ? `nic=${query}` : `mobileNo=${query}`;
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/public/check-patient?${param}`, { cache: 'no-store' });
    
    return res.json();
}

export async function getScheduleList(
  page: number, 
  size: number, 
  doctorId?: string, 
  specialization?: string, 
  date?: string
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    // Construct Query Parameters
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (doctorId) params.append('doctorId', doctorId);
    if (specialization) params.append('specialization', specialization);
    if (date) params.append('date', date);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/schedules?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      cache: 'no-store'
    })

    if (!res.ok) {
      
      console.error('Failed to fetch schedule list:', res.status, res.statusText)
      
      return null
    }

    const json = await res.json()

    return json.data 

  } catch (error) {
    console.error('Server-side get schedule list failed:', error)
   
    return null
  }
}

export const sendOtp = async (mobileNo: string, email: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/otp/send`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mobileNo,
                email
            })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Failed to send OTP');
        }
        return data;
    } catch (error) {
        throw error;
    }
};


export const verifyOtp = async (mobileNo: string, otp: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/otp/verify`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mobileNo,
                otp
            })
        });

        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.message || 'OTP Verification failed');
        }

        return data; 
    } catch (error) {
        throw error;
    }
};
