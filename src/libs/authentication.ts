import axios from 'axios'

// --- Interfaces ---
interface LoginResponse {
  accessToken: string
  refreshToken: string
}

interface LoginResult {
  success: boolean
  message: string
  data?: any
}

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

// --- Cookie Helpers ---
export const setSiteCookie = (cookieName: string, value: string, days: number) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${cookieName}=${value}; path=/; SameSite=Strict;`
}

export const setLoginCookie = (access: string, refresh: string) => {
  setSiteCookie('accessToken', access, 7)
  setSiteCookie('refreshToken', refresh, 7)
}

// ==========================================
// 1. NEW LOGIN FUNCTIONS (Dynamic Clinic Code)
// ==========================================

const loginUser = async (email: string, password: string, clinicCode: string): Promise<LoginResult> => {
  try {
    const response = await axios.post<LoginResult>(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/userSignIn`, {
      username: email,
      password: password,
      loginType: 'USER',
      subdomain: clinicCode, // <--- Uses Dynamic Code
      clinicId: null // <--- Uses Dynamic Code
    })
    return { success: true, message: 'Login successful', data: response.data }
  } catch (error: any) {
    return { success: false, message: error.response?.data || 'Login failed' }
  }
}

const loginPatient = async (email: string, password: string, clinicCode: string): Promise<LoginResult> => {
  try {
    const response = await axios.post<LoginResult>(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/patientSignIn`, {
      username: email,
      password: password,
      loginType: 'PATIENT',
      clinicCode: clinicCode,
      clinicId: null // <--- Uses Dynamic Code
    })
    return { success: true, message: 'Login successful', data: response.data }
  } catch (error: any) {
    return { success: false, message: error.response?.data || 'Login failed' }
  }
}

// ==========================================
// 2. PREVIOUS LOGIN FUNCTIONS (Env Variable)
// Renamed to 'Default'
// ==========================================

const loginUserDefault = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const response = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/userSignIn`, {
      username: email,
      password: password,
      loginType: 'USER',
      clinicId: process.env.NEXT_PUBLIC_CLINIC_ID // <--- Uses Env Variable
    })

    return { success: true, message: 'Login successful', data: response.data }
  } catch (error: any) {
    return { success: false, message: error.response?.data || 'Login failed' }
  }
}

const loginPatientDefault = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const response = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/patientSignIn`, {
      username: email,
      password: password,
      loginType: 'PATIENT',
      clinicId: process.env.NEXT_PUBLIC_CLINIC_ID // <--- Uses Env Variable
    })

    return { success: true, message: 'Login successful', data: response.data }
  } catch (error: any) {
    return { success: false, message: error.response?.data || 'Login failed' }
  }
}


export function logoutAndRedirect() {
  document.cookie = 'accessToken=; Max-Age=0; path=/;'
  document.cookie = 'refreshToken=; Max-Age=0; path=/;'
  localStorage.clear()
  sessionStorage.clear()
  if ('caches' in window) {
    caches.keys().then(names => names.forEach(name => caches.delete(name)))
  }
}

export const getClinicDetails = async (token: string): Promise<ClinicDetails | null> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/clinic/info/details`, {
      headers: { Authorization: `Bearer ${token}` }
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

export { 
  loginUser, 
  loginPatient, 
  loginUserDefault, 
  loginPatientDefault 
}