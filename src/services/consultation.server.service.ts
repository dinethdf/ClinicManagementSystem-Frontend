'use server'

import { http, ApiError } from '@/services/api.config.server'
import type { PatientDetailDTO, CreatePrescriptionDTO } from '@/types/consultation.types'

export async function getConsultationPatientDetails(patientId: number) {
  try {
   
    const patientData = await http.get<PatientDetailDTO>(
      `/api/patient/details/staff/${patientId}`
    )
    
    if (!patientData) {
     
      return { success: false, data: null }
    }

   
    return { success: true, data: patientData }

  } catch (error) {

    console.error('Fetch patient failed:', error)
   
    return { success: false, data: null }
  }
}

export async function getPatientByBarcode(barcode: string) {
  try {
    const data = await http.get<any>(`/api/patient/by-barcode/${barcode}`);
    
    return { success: true, data };

  } catch (err) {
    if (err instanceof ApiError) {
      return { 
        success: false, 
        error: { message: err.message || "Invalid barcode", status: err.status } 
      };
    }
    console.error('Barcode service error:', err);
    return { success: false, error: { message: 'System error processing barcode.' } };
  }
}

// 2. Create Prescription
export async function createPrescription(payload: CreatePrescriptionDTO) {
  try {

    const res = await http.post('/api/prescriptions', payload)
  
    return { success: true, data: res }
  } catch (error: any) {

    const message = error instanceof ApiError ? error.message : 'Failed to save prescription'

    return { success: false, error: message }
  }
}