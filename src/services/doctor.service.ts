import { Doctor, DoctorScheduleDTO } from '@/libs/types/doctor.types';
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
    console.log("hello")
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

  // async getPatientById(id: string): Promise<PatientDetails | null> {
  //   console.log('run get pat')

  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       cache: 'no-store'
  //     })

  //     if (!res.ok) {
  //       return null
  //     }

  //     return res.json()
  //   } catch (error) {
  //     console.error('Failed to fetch patient:', error)

  //     return null
  //   }
  // }

}

export const doctorService = new DoctorService()
