import type { Doctor, DoctorScheduleDTO } from '@/types/doctor.types';
import { apiClient } from './api.config'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

class DoctorSheduleService {

async getDoctorSchedulesByDoctor(id: number): Promise<DoctorScheduleDTO[]> {
  try {
  
    const response : any = await apiClient.get<ApiResponse<DoctorScheduleDTO[]>>(`/api/schedules/by-doctor/${id}/upcoming`);
  
    // console.log(response.data)
    
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
}

export const doctorSheduleService = new DoctorSheduleService()
