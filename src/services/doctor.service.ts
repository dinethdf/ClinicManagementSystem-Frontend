import type { DoctorScheduleDTO } from '@/types/doctor.types'
import { apiClient } from './api.config'


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

  async createDoctor(payload: DoctorCreateDTO): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        '/api/doctor/register',
        payload
      )

      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.defaultMessage || 'Failed to register doctor'
      )
    }
  }

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
      const response = await apiClient.get<PaginatedResponse<any>>(
        '/api/doctor/list',
        {
          params: {
            page: page - 1, // Adjust if backend is 0-indexed
            size: pageSize,
            search: search
          }
        }
      )
      return response.data.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.defaultMessage || 'Failed to fetch doctor list'
      )
    }
  }
  
  async getDoctorById(id: string | number): Promise<any> {
      try {
        const response = await apiClient.get<ApiResponse<any>>(`/api/doctor/${id}`)
        
        return response.data.data
      
      } catch (error: any) {
        throw new Error(error.response?.data?.defaultMessage || 'Failed to fetch doctor details')
      }
  }

async createBatchSchedules(payload: DoctorScheduleDTO[]): Promise<DoctorScheduleDTO[]> {
  try {
    
    const response = await apiClient.post<ApiResponse<DoctorScheduleDTO[]>>(
      '/api/schedules/batch',
      payload
    )
    
    return response.data.data
  } catch (error: any) {
    // Throw an error with the message from backend's ApiResponse
    throw new Error(error.response?.data?.defaultMessage || 'Failed to create schedules')
  }  
}

async updateDoctor(id: string, doctorData: Partial<any>): Promise<any> {
    try {
      const response = await apiClient.put(`/api/doctor/update/${id}`, doctorData)
      
      return response.data
    } catch (error: any) {
      console.error('Update doctor failed:', error)
     
      throw new Error(error.response?.data?.defaultMessage || 'Failed to update doctor details')
    }
  }

}

export const doctorService = new DoctorService()