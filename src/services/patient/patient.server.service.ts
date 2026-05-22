'use server'; // <--- ADD THIS LINE AT THE VERY TOP

import { http, ApiError } from '@/services/api.config.server'
import type { Patient, PatientDetailDTO, PatientDTO } from '@/types/patient.types'

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

export async function getPatientByIdConsutant(id: string) { // Same Function 2 different name becasue Type errors
  try {
    const data = await http.get<PatientDetailDTO>(`/api/patient/details/staff/${id}`)

    
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


// export async function createPatientLogin(patientId: string) {
//   try {
//     const response = await http.post<{ message: string, data: string }>(`/api/patient/create-login/${patientId}`, {})
//     return { success: true, message: response.data || response.message }
//   } catch (err: any) {
//     // Handle specific API errors
//     if (err instanceof ApiError) {
//       return { 
//         success: false, 
//         message: err.message, 
//         errorCode: err.details // Assuming your ApiError stores the 'errorCode' in details
//       }
//     }
    
//     // Handle unexpected errors (like 403 Forbidden)
//     console.error("Create Login Error:", err)
//     return { 
//       success: false, 
//       message: err.message || "Failed to create login. Please contact support.",
//       errorCode: 'UNKNOWN_ERROR'
//     }
//   }
// } // Duplicate entru for checking error handling, see PatientLoginCreator.tsx for usage


export interface PatientLoginStatus {
  hasLogin: boolean;
  emailOnFile: boolean;
  loginStatus?: 'ACTIVE' | 'DISABLED'; 
}

// Helper to extract error code safely from ApiError details
const getErrorCode = (details: any) => {
  if (typeof details === 'string') return details;
  
return details?.errorCode || 'UNKNOWN_ERROR';
}

// 1. Check current login status
export async function getPatientLoginStatus(patientId: string) {
  try {
    // Pass 'true' for isFullResponse to get the full { success, message, data } wrapper
    const response = await http.get<{ success: boolean, message: string, data: PatientLoginStatus }>(
      `/api/patient/${patientId}/login-status`, 
      true
    )

    
return { success: true, data: response.data, message: response.message }
  } catch (err: any) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message, errorCode: getErrorCode(err.details) }
    }

    
return { success: false, message: err.message || "Failed to load status." }
  }
}

// 2. Create Login
export async function createPatientLogin(patientId: string) {
  try {
    const response = await http.post<{ success: boolean, message: string, data: string }>(
      `/api/patient/create-login/${patientId}`, 
      {}, 
      true
    )

    
return { success: true, message: response.message }
  } catch (err: any) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message, errorCode: getErrorCode(err.details) }
    }

    console.error("Create Login Error:", err)
    
return { success: false, message: err.message || "Failed to create login. Please contact support.", errorCode: 'UNKNOWN_ERROR' }
  }
}

// 3. Trigger Password Reset Email
export async function triggerPasswordReset(patientId: string) {
  try {
    const response = await http.post<{ success: boolean, message: string, data: string }>(
      `/api/patient/${patientId}/password-reset`, 
      {}, 
      true
    )

    
return { success: true, message: response.message }
  } catch (err: any) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message, errorCode: getErrorCode(err.details) }
    }

    
return { success: false, message: err.message || "Failed to send reset link." }
  }
}

// 4. Disable/Enable Login Access
export async function togglePatientLoginStatus(patientId: string, action: 'enable' | 'disable') {
  try {
    // The query param action must be exactly 'enable' or 'disable'
    const response = await http.post<{ success: boolean, message: string, data: string }>(
      `/api/patient/${patientId}/toggle-login?action=${action}`, 
      {}, 
      true
    )

    
return { success: true, message: response.message }
  } catch (err: any) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message, errorCode: getErrorCode(err.details) }
    }

    
return { success: false, message: err.message || `Failed to ${action} login.` }
  }
}