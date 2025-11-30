import { apiClient } from './api.config'

// Type Imports
import type { DoctorScheduleApiResponse } from '@/types/analysis.types'

class DoctorAnalysisService {

  // Fetch Schedules for a specific doctor
  async getDoctorSchedules(doctorId: number): Promise<DoctorScheduleApiResponse['data'] | null> {
    try {
      const response = await apiClient.get<DoctorScheduleApiResponse>(
        `/api/schedules/by-doctor/${doctorId}`
      )
      
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch doctor schedules:', error)
      return null
    }
  }

}

export const doctorAnalysisService = new DoctorAnalysisService()