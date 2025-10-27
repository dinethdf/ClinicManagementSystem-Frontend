import type { Doctor, DoctorScheduleDTO } from '@/libs/types/doctor.types';
import { apiClient } from './api.config'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

class DoctorService {

async getDoctorSearch(url: string): Promise<Doctor[]> {
  try {
  
    // 👇 Use the 'params' config object to pass your variables
    const response = await apiClient.get<Doctor[]>('/api/patient/search-guardian');
  
    console.log("hello", url)
    console.log(response.data)
    
    return response.data;
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

export const doctorService = new DoctorService()
