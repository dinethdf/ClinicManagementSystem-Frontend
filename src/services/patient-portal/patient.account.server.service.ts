// src/services/patient.server.service.ts

import { http } from '@/services/api.config.server'; // Adjust path if needed
import type { PatientType } from '@/types/patient-portal/patientTypes';

export async function getPatientDetails() {
  try {
    // 1. http.get returns the parsed data directly.
    // Since your API response doesn't have a "data" wrapper, 'res' IS the patient object.
    const patientData = await http.get(`/api/patient-portal/account-settings/fill-details`);

    // 2. Return it directly (Casting to your type helps TypeScript)
    return patientData as PatientType;

  } catch (error) {
    console.error('Server-side get patient details failed:', error);
    return null;
  }
}