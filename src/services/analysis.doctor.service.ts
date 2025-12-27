import { apiClient } from './api.config'

// Type Imports
import type { DoctorScheduleApiResponse } from '@/types/analysis.types'

class DoctorAnalysisService {

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

export const doctorAnalysisService = new DoctorAnalysisService()