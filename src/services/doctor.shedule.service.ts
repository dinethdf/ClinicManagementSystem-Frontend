import type { DoctorScheduleDTO, ScheduleFilterParams, UpdateScheduleDTO } from '@/types/doctor.types';
import { apiClient } from './api.config'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface PageableResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}


class DoctorSheduleService {

async getDoctorSchedulesByDoctor(id: number): Promise<DoctorScheduleDTO[]> {
  try {
  
    const response = await apiClient.get<ApiResponse<DoctorScheduleDTO[]>>(`/api/schedules/by-doctor/${id}/upcoming`);
    
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.defaultMessage || 'Failed to fetch guardian data');
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

  // 2. Update Schedule
  async updateSchedule(id: number, payload: UpdateScheduleDTO): Promise<any> {
    try {
      const response = await apiClient.put<ApiResponse<any>>(
        `/api/schedules/${id}`,
        payload
      );
      
      return response.data;
    } catch (error: any) {
     
      throw new Error(error.response?.data?.defaultMessage || 'Failed to update schedule');
    }
  }

// NEW: Get Upcoming Schedules with Filters (Public/Clinic usage)
  async getUpcomingSchedules(params: ScheduleFilterParams): Promise<PageableResponse<DoctorScheduleDTO>> {
    try {
      // Construct query string
      const queryParams = new URLSearchParams()
      
      queryParams.append('page', params.page.toString())
      queryParams.append('size', params.size.toString())
      queryParams.append('sort', 'scheduleDate,asc') // Optional: enforce sort

      if (params.doctorName) queryParams.append('doctorName', params.doctorName)
      if (params.specialization) queryParams.append('specialization', params.specialization)
      if (params.date) queryParams.append('date', params.date)

      const response = await apiClient.get<ApiResponse<PageableResponse<DoctorScheduleDTO>>>(
        `/api/schedules/upcoming-public?${queryParams.toString()}`
      )
      
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.defaultMessage || 'Failed to fetch schedules')
    }
  }  
}

export const doctorSheduleService = new DoctorSheduleService()
