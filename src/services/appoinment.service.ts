import { apiClient } from './api.config' // Assuming this is where your axios instance lives
import type { PatientAppointmentDTO, ApiResponse } from '@/types/appoinments.types'

class AppointmentService {

  /**
   * Fetch all appointments for a specific patient
   * Endpoint: GET /api/appointments/patient/{patientId}
   */
  async getAppointmentsByPatientId(patientId: string): Promise<PatientAppointmentDTO[]> {
    try {
      // We expect ApiResponse<PatientAppointmentDTO[]> from the backend
      const response = await apiClient.get<ApiResponse<PatientAppointmentDTO[]>>(
        `/api/appointments/patient/${patientId}`
      )
      
      console.log(`API call: Fetch appointments for patient ${patientId}`)
      
      // The controller wraps the list in a 'data' field inside ApiResponse
      return response.data.data 
    } catch (error: any) {
      // Standard error handling matching your PatientService
      throw new Error(error.response?.data?.defaultMessage || 'Failed to fetch patient appointments')
    }
  }

  // You can add other methods here later (e.g., cancelAppointment)
}

// Export a singleton instance
export const appointmentService = new AppointmentService()