'use server'; // <--- ADD THIS LINE AT THE VERY TOP

import { http, ApiError } from '@/services/api.config.server'
import type { Patient } from '@/types/patient.types'

type PatientResponse = (Omit<Patient, 'id' | 'patientNo'> & { id: string; patientNo: string }) | null

/**
 * Server-side service to fetch patient details
 */
export async function getPatientById(id: string) {
  try {
    const data = await http.get<PatientResponse>(`/api/patient/details/staff/${id}`)
    return { success: true, data }
  } catch (err) {
    if (err instanceof ApiError) {
      console.error(`API Error fetching patient ${id}:`, err.message)
      return { success: false, error: { message: err.message, status: err.status } }
    }
    console.error('Unexpected error in getPatientById:', err)
    return { success: false, error: { message: 'Failed to fetch patient details.' } }
  }
}

/**
 * Fetch the barcode string for a patient
 */
export async function getPatientBarcode(patientId: number | string) {
  try {
    const data = await http.get<string>(`/api/patient/barcode/${patientId}`)
    return { success: true, data }
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: { message: err.message } }
    }
    console.error("Barcode API Error:", err)
    return { success: false, error: { message: "Failed to generate barcode." } }
  }
}

const BASE_URL = '/api/auth/patient/password'

export async function requestOtp() {
  console.log("run func")
  try {
    // API returns { success: true, message: "...", data: "..." }
    const response = await http.post<{ message: string, data: string }>(`${BASE_URL}/request-otp`, {})

    console.log(response)
    return { success: true, data: response }
  } catch (err) {
    if (err instanceof ApiError) {
      
      return { success: false, error: { message: err.message } }
    }
    console.error("Request OTP Error:", err)
    return { success: false, error: { message: "Failed to send OTP." } }
  }
}

export async function changePassword(otp: string, newPassword: string, confirmPassword: string) {
  try {
    const payload = { otp, newPassword, confirmPassword }
    const response = await http.post<{ message: string, data: string }>(`${BASE_URL}/change`, payload)
    return { success: true, data: response }
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: { message: err.message } }
    }
    console.error("Change Password Error:", err)
    return { success: false, error: { message: "Failed to update password." } }
  }
}