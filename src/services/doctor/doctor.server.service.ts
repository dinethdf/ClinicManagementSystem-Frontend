'use server'; 
import { cookies } from 'next/headers'

import { http, ApiError } from '@/services/api.config.server'; 
import type { DoctorResponceDTO, Doctor} from '@/types/doctor.types';

  
  export async function getDoctorById(id: string): Promise<Doctor | null> {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get('accessToken')?.value

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/doctor/get-details/staff/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        cache: 'no-store'
      })

      if (!res.ok) return null
     
      const json = await res.json()
      
      return json.data
    } catch (error) {
      console.error('Failed to fetch doctor:', error)
     
      return null
    }
  }


const PASSWORD_API_BASE = '/api/auth/staff/password';

  export async function getDoctorDetailsByTocken() {
    try {
      const doctorData = await http.get<Doctor>('/api/doctor/get-my-details');

      
return doctorData;
    } catch (error) {
      console.error('Server-side get doctor details failed:', error);
      
return null;
    }
  }

  /**
   * 2. Request OTP for Password Change
   */
  export async function requestDoctorOtp() {
    try {
      const response = await http.post<{ message: string, data: string }>(`${PASSWORD_API_BASE}/request-otp`, {});

      
return { success: true, data: response };
    } catch (err) {
      if (err instanceof ApiError) {
        return { success: false, error: { message: err.message } };
      }

      console.error("Request OTP Error:", err);
      
return { success: false, error: { message: "Failed to send OTP." } };
    }
  }

  /**
   * 3. Change Password using OTP
   */
  export async function changeDoctorPassword(otp: string, newPassword: string, confirmPassword: string) {
    try {
      const payload = { otp, newPassword, confirmPassword };
      const response = await http.post<{ message: string, data: string }>(`${PASSWORD_API_BASE}/change`, payload);

      
return { success: true, data: response };
    } catch (err) {
      if (err instanceof ApiError) {
        return { success: false, error: { message: err.message } };
      }

      console.error("Change Password Error:", err);
      
return { success: false, error: { message: "Failed to update password." } };
    }
  }