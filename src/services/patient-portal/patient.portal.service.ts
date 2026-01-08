import { apiClient } from './../api.config'
import type { PatientAnalysisResponse } from '@/types/patient-portal/patient.portal.types'

class PatientPortalService {

  async getPatientProfileAnalysis(): Promise<PatientAnalysisResponse | null> {
    try {
      // Calls: @GetMapping("/all") inside "api/patient-portal/overall-analysis"
      const response = await apiClient.get<any>(
        '/api/patient-portal/overall-analysis/all'
      )
      console.log(response.data.data)
      // Assuming your ApiResponse wrapper has a 'data' field containing the Map
      return response.data.data 
    } catch (error) {
      console.error('Failed to fetch patient analysis:', error)
      throw error // Throw so Redux can catch it
    }
  }

}

export const patientPortalService = new PatientPortalService()