'use server';
import { cookies } from 'next/headers';

import { http, ApiError } from '@/services/api.config.server';

import type { AppointmentApiResponse, AppointmentDetailDTO, AppointmentStatusDTO, CancelResponse, GetAppointmentListParams } from '@/types/appoinments.types';



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


export async function getAppointmentsListByShedule(sheduleId: number) {
   try {
      const cookieStore = await cookies()
      const token = cookieStore.get('accessToken')?.value

      const res = await http.get(`api/appointments/schedule/${sheduleId}`);

      // const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/appointments/schedule/${sheduleId}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     ...(token ? { Authorization: `Bearer ${token}` } : {})
      //   },
      //   cache: 'no-store'
      // })

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


export const getAppointmentList = async (
  page: number,
  pageSize: number,
  patientId?: number | null,
  doctorId?: number | null,   // Added doctorId
  scheduleId?: number | null, // Added scheduleId
  startDate?: string,
  endDate?: string
) => {
  try {
    // 1. Create URLSearchParams with mandatory pagination fields
    // Note: Spring Boot Pageable is 0-indexed, so we pass 'page' directly.
    const query = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString()
    })

    // 2. Conditionally append optional filters
    if (patientId) query.append('patientId', patientId.toString())
    if (doctorId) query.append('doctorId', doctorId.toString())
    if (scheduleId) query.append('scheduleId', scheduleId.toString())
    if (startDate) query.append('startDate', startDate)
    if (endDate) query.append('endDate', endDate)

    // 3. Make the API call
    const response = await http.get<AppointmentApiResponse>(`/api/appointments/list?${query.toString()}`)
    
    return response

  } catch (err) {
    console.error("Unexpected error fetching appointment list:", err)

    // Return null or empty structure so the table doesn't crash
    return { content: [], totalElements: 0 }
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

export async function checkAppointmentStatus(scheduleId: number, patientId: number) {
 
  try {
   
    const data = await http.get<AppointmentStatusDTO>(
      `/api/appointments/check-status?scheduleId=${scheduleId}&patientId=${patientId}`
    );

    return { success: true, data };

  } catch (err) {

    if (err instanceof ApiError) {

      return { success: false, error: { message: err.message } };
    }
    
    console.error('Unexpected error checking status:', err);

    return { success: false, error: { message: 'Failed to check appointment status.' } };
  }
}

export async function cancelAppointment(appointmentId: number, reason: string, refundMethod?: string) {
  try {
    // Include refundMethod in the payload if it exists
    const payload = refundMethod ? { reason, refundMethod } : { reason };
    
    const response = await http.post<any>(`/api/appointments/cancel/${appointmentId}`, payload, true);

    let displayMessage = response.message || 'Appointment Cancelled & Refund Recorded.';

    if (response.data?.refundAmount && response.data.refundAmount > 0) {
        displayMessage += ` (Refund: LKR ${response.data.refundAmount.toFixed(2)})`;
    }

    return { 
        success: true, 
        message: displayMessage 
    };

  } catch (err: any) {
    if (err.response && err.response.data) {
        return { 
            success: false, 
            message: err.response.data.message || 'Failed to cancel appointment.'
        };
    }
    
    console.error('Unexpected error in cancelAppointment:', err);
    
return { success: false, message: 'An unknown server error occurred.' };
  }
}