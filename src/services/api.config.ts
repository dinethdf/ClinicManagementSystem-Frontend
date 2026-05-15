import axios from 'axios'

import { getCookie } from '@/utils/getCookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACK_END_API_URL || 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
})

// ✅ Request interceptor - attach token if available
apiClient.interceptors.request.use(
  config => {
    const token = getCookie('accessToken') // <-- read directly from document.cookie

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error)
)

// ✅ Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An unexpected error occurred. Please try again.";
    
    if (error.code === 'ECONNABORTED') {
      message = "The request timed out. Please check your internet connection and try again.";
    } else if (error.message === 'Network Error' || !error.response) {
      message = "Unable to connect to the server. Please check your internet connection.";
    } else if (error.response) {
      // Backend error with response
      const data = error.response.data;
      message = data?.defaultMessage || data?.message || error.message || message;
    }

    // Update error message for toast notifications
    error.message = message;

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Optional: handle logout or token refresh here
        // localStorage.removeItem("auth_token")
        // window.location.href = "/login"
      }
    }
    
    return Promise.reject(error)
  }
)
