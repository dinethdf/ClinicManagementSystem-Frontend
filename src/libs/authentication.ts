import axios from 'axios'

interface LoginResponse {
  accessToken: string
  refreshToken: string
}

interface LoginResult {
  success: boolean
  message: string
  data?: any
}

export const setSiteCookie = (cookieName: string, value: string, days: number) => {
  const date = new Date()

  date.setTime(date.getTime() + days * 1000 * 60 * 60 * 24)

  // const expires = `expires=${date.toUTCString()}`;

  document.cookie = `${cookieName}=${value}; path=/; SameSite=Strict;`
}

const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const response = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/userSignIn`, {
      username: email,
      password: password,
      loginType: 'USER',
      clinicId: process.env.NEXT_PUBLIC_CLINIC_ID
    })

    return { success: true, message: 'Login successful', data: response.data }
  } catch (error: any) {
    return { success: false, message: error.response.data }
  }
}

const loginPatient = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const response = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/patientSignIn`, {
      username: email,
      password: password,
      loginType: 'PATIENT',
      clinicId: process.env.NEXT_PUBLIC_CLINIC_ID
    })

    return { success: true, message: 'Login successful', data: response.data }
  } catch (error: any) {
    return { success: false, message: error.response.data }
  }
}

export { loginPatient, loginUser}

export const setLoginCookie = (access: string, refresh: string) => {
  setSiteCookie('accessToken', access, 7)
  setSiteCookie('refreshToken', refresh, 7)
}

export function logoutAndRedirect() {
  document.cookie = 'accessToken=; Max-Age=0; path=/;'
  document.cookie = 'refreshToken=; Max-Age=0; path=/;'

  localStorage.clear()
  sessionStorage.clear()

  if ('caches' in window) {
    caches.keys().then(names => names.forEach(name => caches.delete(name)))
  }

  // window.location.replace('/en/login');
}

// Basic token validation (already existing)
// export async function validateToken(authToken: string) {
//   try {
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_BACK_END_API_URL}/validate-token`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     )

//     if (response.data.valid) {
//       return response.data
//     } else {
//       return { valid: false }
//     }
//   } catch (error) {
//     console.error('Token validation failed:')

//     return { valid: false }
//   }
// }

// src/utils/user-storage.ts


export interface ClinicDetails {
  id: number;
  name: string;
  subdomain: string;
  address: string;
  city: string;
  mobileNo: string;
  landNo: string;
  email: string;
  logoUrl: string;
}

export const getClinicDetails = async (token: string): Promise<ClinicDetails | null> => {
  try {
    // FIX 1: Ensure '/api' is included in the URL
    // FIX 2: Use the dynamic 'token' variable, not the hardcoded string
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/clinic/info/details`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });

    if (response.data && response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch clinic details:', error);
    return null;
  }
};


