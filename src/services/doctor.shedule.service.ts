import type { DoctorScheduleDTO, ScheduleAnalyticsDTO, ScheduleFilterParams, UpdateScheduleDTO } from '@/types/doctor.types';
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

async getScheduleAnalytics(scheduleId: number): Promise<ScheduleAnalyticsDTO> {
    try {
      const response = await apiClient.get<ApiResponse<ScheduleAnalyticsDTO>>(
        `/api/appointments/schedule/${scheduleId}/analytics`
      );
      
      return response.data.data;
    } catch (error: any) {
      // Consistent error handling
      throw new Error(error.response?.data?.defaultMessage || 'Failed to fetch analytics');
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
      queryParams.append('sort', 'scheduleDate,asc')
      queryParams.append('clinicId', `${process.env.NEXT_PUBLIC_CLINIC_ID}`)

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
  // Add this method inside your DoctorSheduleService class

  async startQueueSession( scheduleId: number): Promise<void> {
    try {
      const clinicId = 1;
      // Passing parameters as query strings to match @RequestParam in Spring Boot
      await apiClient.post(`/api/queue/start?clinicId=${clinicId}&scheduleId=${scheduleId}`, {});
    } catch (error: any) {
      console.error('Failed to start queue session:', error);
      // You might want to throw the error to handle it in the UI (e.g., show a toast)
      throw new Error(error.response?.data?.message || 'Failed to start session');
    }
  }
}

export const doctorSheduleService = new DoctorSheduleService()
