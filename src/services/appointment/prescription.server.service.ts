'use server';

import { http, ApiError } from '@/services/api.config.server';

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  quantity: string;
  duration: string;
  instructions: string;
}

export interface PrescriptionDTO {
  id: number;
  appointmentId: number;
  doctorName: string | null;
  patientName: string;
  status: string;
  note: string;
  createdDate: string;
  createdBy:string
  items: PrescriptionItem[];
}

export async function getPrescriptionByAppointment(appointmentId: number) {
  try {
    // Uses your http wrapper which handles tokens automatically
    const data = await http.get<PrescriptionDTO>(`/api/prescriptions/appointment/${appointmentId}`);
    
    return { success: true, data };

  } catch (err) {
    if (err instanceof ApiError) {

      return { 
        success: false, 
        error: { 
          message: err.message, 
          status: err.status 
        } 
      };
    }
    
    console.error('Unexpected error in getPrescription:', err);
    return { success: false, error: { message: 'An unknown server error occurred.' } };
  }
}