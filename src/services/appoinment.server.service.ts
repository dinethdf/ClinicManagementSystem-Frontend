'use server';
import { cookies } from 'next/headers';

import { http, ApiError } from '@/services/api.config.server';

import type { AppointmentApiResponse, AppointmentDetailDTO } from '@/types/appoinments.types';



export async function createAppointment(
  doctorScheduleId: number,
  patientId: number,
  note: string | null
) {
      const appointmentData = {
        doctorScheduleId,
        patientId,
        note,
      };
    
      try {
    
      const newAppointment = await http.post('/api/appointments', appointmentData);
  
      return { success: true, data: newAppointment };

  } catch (err) {
   
    if (err instanceof ApiError) {
    
      return { success: false, error: { message: err.message, details: err.details } };
    }
    
    console.error('Unexpected error in createAppointment:', err);
   
    return { success: false, error: { message: 'An unknown server error occurred.' } };
  }
}


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


export async function getAppointmentInvoiceview(appintmentId: number) {
   try {
      const cookieStore = await cookies()
      const token = cookieStore.get('accessToken')?.value

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/appointments/invoices/${appintmentId}/view`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        cache: 'no-store'
      })
      
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

export async function processInvoicePayment(payload: any) {
  
  try {
    // This calls POST http://localhost:8080/api/payments/
    const response = await http.post('/api/payments/appointment/pay', payload);
    
    return { success: true, data: response };
  } catch (err) {
  
    if (err instanceof ApiError) {
  
      return { success: false, error: { message: err.message, details: err.details } };
    }
    
    console.error("Unexpected payment error:", err);
 
    return { success: false, error: { message: "An unexpected error occurred during payment." } };
  }
}


export async function getAppointmentList(page: number = 0, size: number = 10): Promise<AppointmentApiResponse | null> {
  try {
    const data = await http.get<AppointmentApiResponse>(`/api/appointments/list?page=${page}&size=${size}`);
    
    return data;

  } catch (err) {

    if (err instanceof ApiError) {
      console.error(`API Error fetching list (Status ${err.status}):`, err.message);
    } else {
      console.error('Unexpected error fetching appointment list:', err);
    }

    return null; 
  }
}

export async function getAppointmentDetails(appointmentId: string): Promise<AppointmentDetailDTO | null> {
  try {
    const data = await http.get<AppointmentDetailDTO>(`/api/appointments/${appointmentId}`);

    return data;

  } catch (err) {
    if (err instanceof ApiError) {
      console.error(`API Error fetching details (Status ${err.status}):`, err.message);
    } else {
      console.error('Unexpected error fetching appointment details:', err);
    }
    
    return null;
  }
}