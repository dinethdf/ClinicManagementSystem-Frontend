// services/appoinment.server.service.ts

'use server'; // <-- THIS IS THE FIX

import { http, ApiError } from '@/services/api.config.server'; // Your API client
import { revalidatePath } from 'next/cache'; // Optional: if you want to refresh data

/**
 * This is now a Server Action.
 * It can be imported and called directly from any Client Component.
 */
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
    console.log("call API")
  try {
    const newAppointment = await http.post('/api/appointments', appointmentData);
    return { success: true, data: newAppointment };

  } catch (err) {
    // We catch the error here so the client gets a clean response
    if (err instanceof ApiError) {
      return { success: false, error: { message: err.message, details: err.details } };
    }
    
    // Log the unexpected error on the server
    console.error('Unexpected error in createAppointment:', err);
    return { success: false, error: { message: 'An unknown server error occurred.' } };
  }
}