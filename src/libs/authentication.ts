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



export interface UserStorageData {
  userName: string;
  userEmail: string;
  userImg: string;
  userRole: string;
}

const USER_STORAGE_KEY = 'userData';

export const saveUserDetails = (data: { 
  userName: string | null; 
  userEmail: string | null; 
  userImg: string | null; 
  userRole: string | null; 
}) => {
  // 1. Check if exists and remove
  if (localStorage.getItem(USER_STORAGE_KEY)) {
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  const safeData: UserStorageData = {
    userName: data.userName || '',
    userEmail: data.userEmail || '',
    userImg: data.userImg || '',
    userRole: data.userRole || ''
  };

  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeData));
  } catch (error) {
    console.error('Error saving user details to localStorage', error);
  }
};


export const getUserDetails = (): UserStorageData | null => {
  if (typeof window === 'undefined') return null; 

  const data = localStorage.getItem(USER_STORAGE_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data) as UserStorageData;
  } catch (error) {
    console.error('Error parsing user details', error);
    return null;
  }
};

export const clearUserDetails = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};
