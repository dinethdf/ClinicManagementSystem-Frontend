import { apiClient } from '@/services/api.config' // Adjust path if needed
import type { PatientAppointmentDTO } from '@/types/patient-portal/patient.appointments.types'

// Define the generic response wrapper if you haven't globally
type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

class PatientPortalAppointmentService {

  /**
   * Fetch Upcoming or History appointments
   */
  async getPatientAppointments(type: 'UPCOMING' | 'HISTORY'): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<PatientAppointmentDTO[]>>(
        '/api/patient-portal/appointments/my-history', 
        {}
      )
      console.log(response)
      return response.data.data
    } catch (error) {
      console.error(`Failed to fetch ${type} appointments:`, error)
      return []
    }
  }

  /**
   * Cancel an appointment
   * Returns true if successful, throws error if failed
   */
  async cancelAppointment(appointmentId: number): Promise<boolean> {
    try {
      // Assuming PUT for status update, or DELETE if hard delete
      const response = await apiClient.put<ApiResponse<null>>(
        `/api/patient-portal/appointments/${appointmentId}/cancel`
      )

      return response.data.success
    } catch (error: any) {
      console.error('Failed to cancel appointment:', error)
      // Throwing error allows the UI component to show a specific alert/toast
      throw error.response?.data?.message || 'Failed to cancel appointment'
    }
  }
}

export const patientAppointmentService = new PatientPortalAppointmentService()