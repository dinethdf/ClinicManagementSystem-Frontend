import { apiClient } from './api.config'

// You might want to move these DTOs to '@/types/doctor.types' later
// but defining them here makes the service self-contained for now.

export interface DoctorCreateDTO {
  firstName: string
  lastName: string
  nameWithInitials: string
  gender: number
  nic: string
  dob: string | null
  address: string
  city: string
  district: string
  email: string
  mobileNo: string
  registrationDate: string
  profileImg?: string | null
  isApproved: boolean
  slmcNumber: string
  specialization: {
    id: string
  }
  qualification: string
  experienceYears: string
  availabilityStatus: string
}

// Standard Wrapper based on your code
interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

class DoctorService {
  /**
   * Registers a new doctor
   * Endpoint: POST /api/doctor/register
   */
  async createDoctor(payload: DoctorCreateDTO): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        '/api/doctor/register',
        payload
      )

      return response.data
    } catch (error: any) {
      // Matches your error handling style
      throw new Error(
        error.response?.data?.defaultMessage || 'Failed to register doctor'
      )
    }
  }

  /**
   * Fetches paginated list of doctors
   * Endpoint: GET /api/doctor/doctorlist
   */
  async getDoctorList({
    page,
    pageSize,
    search
  }: {
    page: number
    pageSize: number
    search?: string
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
        '/api/doctor/doctorlist',
        {
          params: {
            page: page - 1, // Adjust if backend is 0-indexed
            size: pageSize,
            search: search
          }
        }
      )

      // Based on your Redux slice, we return response.data 
      // because the slice expects the full wrapper to access 'success', 'message', etc.
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.defaultMessage || 'Failed to fetch doctor list'
      )
    }
  }
  
  /**
   * Get single doctor by ID
   * Endpoint: GET /api/doctor/{id}
   */
  async getDoctorById(id: string | number): Promise<any> {
      try {
        const response = await apiClient.get<ApiResponse<any>>(`/api/doctor/${id}`)
        return response.data.data
      } catch (error: any) {
        throw new Error(error.response?.data?.defaultMessage || 'Failed to fetch doctor details')
      }
  }
}

export const doctorService = new DoctorService()