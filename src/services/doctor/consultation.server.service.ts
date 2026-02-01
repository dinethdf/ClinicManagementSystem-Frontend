'use server'

import { http, ApiError } from '@/services/api.config.server'
import type { CreatePrescriptionDTO } from '@/types/consultation.types'
import type { AllergyDTO, DiseaseDTO, AddHealthRecordRequest } from '@/types/patient.types';


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

export async function getAllergies(patientId: number) {
  try {
    // The http helper automatically extracts response.data based on your config
    const data = await http.get<AllergyDTO[]>(`/api/patient/health/${patientId}/allergies`);
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Fetch allergies failed:', error);
    return { success: false, data: [] };
  }
}

export async function addAllergy(patientId: number, req: AddHealthRecordRequest) {
  try {
    const payload = {
      allergyName: req.name,
      notes: req.notes
    };
    const data = await http.post<AllergyDTO>(`/api/patient/health/${patientId}/allergies`, payload);
    
    // Optional: Revalidate if you are using server components for the main page
    // revalidatePath(`/clinic/patient/${patientId}`); 
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add allergy' };
  }
}

export async function deleteAllergy(id: number) {
  try {
    await http.delete(`/api/patient/health/allergies/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete allergy' };
  }
}

// --- CHRONIC DISEASES ---

export async function getDiseases(patientId: number) {
  try {
    const data = await http.get<DiseaseDTO[]>(`/api/patient/health/${patientId}/diseases`);
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Fetch diseases failed:', error);
    return { success: false, data: [] };
  }
}

export async function addDisease(patientId: number, req: AddHealthRecordRequest) {
  try {
    const payload = {
      diseaseName: req.name,
      notes: req.notes
    };
    const data = await http.post<DiseaseDTO>(`/api/patient/health/${patientId}/diseases`, payload);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add disease' };
  }
}

export async function deleteDisease(id: number) {
  try {
    await http.delete(`/api/patient/health/diseases/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete disease' };
  }
}