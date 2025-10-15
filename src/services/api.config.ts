import axios from "axios"

import { getCookie } from "@/utils/getCookie"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACK_END_API_URL || "http://localhost:8080"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
   withCredentials: false, 
})

// ✅ Request interceptor - attach token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken") // <-- read directly from document.cookie
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Response interceptor - handle errors globally
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("auth_token")
//         window.location.href = "/login"
//       }
//     }
//     return Promise.reject(error)
//   }
// )
