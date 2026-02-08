import type { DoctorCreateDTO, DoctorScheduleApiResponse, DoctorScheduleDTO, GetDoctorsParams, PaginatedDoctorResponse } from '@/types/doctor.types'
import { apiClient } from '../api.config'
import { ApiResponse } from '@/types/common.type'


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

async getDoctorList({ page, pageSize, sort, ...filters}: GetDoctorsParams): Promise<PaginatedDoctorResponse> {

    try {
      const response = await apiClient.get<any>('/api/doctor/list', {
        params: {
          // Pagination (Spring Boot is 0-based)
          page: page - 1, 
          size: pageSize,

          // Specific Filters (Map keys to @RequestParam names)
          name: filters?.name || undefined,
          mobile: filters?.mobile || undefined,
          slmc: filters?.slmc || undefined,
          specialization: filters?.specialization || undefined,

          // Sorting (e.g., "id,desc")
          sort: sort
        }
      })

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

  async getDoctorSchedules(doctorId: number, page: number = 0, size: number = 10): Promise<DoctorScheduleApiResponse['data'] | null> {
    try {
      const response = await apiClient.get<DoctorScheduleApiResponse>(
        `/api/schedules/by-doctor/${doctorId}?includeInactive=true&page=${page}&size=${size}`
      )
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch doctor schedules:', error)
      return null
    }
  }  

}

export const doctorService = new DoctorService()