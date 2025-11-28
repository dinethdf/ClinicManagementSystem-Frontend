import type { DoctorScheduleDTO, UpdateScheduleDTO } from '@/types/doctor.types';
import { apiClient } from './api.config'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
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
}

export const doctorSheduleService = new DoctorSheduleService()
