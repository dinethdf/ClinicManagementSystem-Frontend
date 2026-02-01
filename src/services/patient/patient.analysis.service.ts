import { apiClient } from '../api.config'
import type { PatientAnalysisResponse } from '@/types/analysis.types'

class PatientAnalysisService {

  async getPatientAnalysis(patientId: number | string): Promise<PatientAnalysisResponse['data'] | null> {

    try {
      const response = await apiClient.get<PatientAnalysisResponse>(
        `/api/patient-analysis/${patientId}`
      )
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch patient analysis:', error)
      return null
    }
  }
}

export const patientAnalysisService = new PatientAnalysisService()