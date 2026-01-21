import { apiClient } from '@/services/api.config' 
import type { PatientAppointmentDTO, AppointmentDetailsDTO, PrescriptionDTO } from '@/types/patient-portal/patient.appointments.types'

// Generic API Response Wrapper
type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

// Return type for UI logic
type CreateResponse = {
    success: boolean
    data?: number // The created Appointment ID
    error?: { message: string }
}

class PatientPortalAppointmentService {

  /**
   * Fetch Upcoming or History appointments
   */
  async getPatientAppointments(type: 'UPCOMING' | 'HISTORY'): Promise<PatientAppointmentDTO[]> {
    try {
      const response = await apiClient.get<ApiResponse<PatientAppointmentDTO[]>>(
        '/api/patient-portal/appointments/my-history', 
        {
            params: { type } 
        }
      )
      return response.data.data
    } catch (error) {
      console.error(`Failed to fetch ${type} appointments:`, error)
      return []
    }
  }

  /**
   * Get Details of a specific appointment
   */
  async getAppointmentDetails(id: number): Promise<AppointmentDetailsDTO> {
     const response = await apiClient.get<ApiResponse<AppointmentDetailsDTO>>(`/api/patient-portal/appointments/details/${id}`)
     return response.data.data
  }

  /**
   * Create a new Appointment
   * Endpoint: POST /api/patient-portal/appointments/book
   */
  async createAppointment(scheduleId: number, note: string = "Quick Appointment"): Promise<CreateResponse> {
    try {
        const payload = {
            scheduleId,
            note
        }

        // Response data is the appointment ID (number)
        const response = await apiClient.post<ApiResponse<number>>(
            '/api/patient-portal/appointments/book', 
            payload
        )

        return { success: true, data: response.data.data }

    } catch (error: any) {
        console.error('Create appointment failed:', error)
        
        // Extract 'defaultMessage' from your backend error structure
        const errorMessage = error.response?.data?.defaultMessage || 'Failed to book appointment'
        
        return { 
            success: false, 
            error: { message: errorMessage } 
        }
    }
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId: number): Promise<boolean> {
    try {
      const response = await apiClient.put<ApiResponse<null>>(
        `/api/patient-portal/appointments/${appointmentId}/cancel`
      )
      return response.data.success
    } catch (error: any) {
      console.error('Failed to cancel appointment:', error)
      throw error.response?.data?.message || 'Failed to cancel appointment'
    }
  }

  async getPrescription(appointmentId: number): Promise<PrescriptionDTO | null> {
    try {
      const response = await apiClient.get<ApiResponse<PrescriptionDTO>>(
        `/api/patient-portal/appointments/${appointmentId}/prescription`
      )
      return response.data.data
    } catch (error: any) {
      // If 404 (Not Found) or 403 (Unauthorized), just return null (No prescription to show)
      if (error.response && (error.response.status === 404 || error.response.status === 403)) {
        return null
      }
      console.error('Failed to fetch prescription:', error)
      return null
    }
  }
}

export const patientAppointmentService = new PatientPortalAppointmentService()