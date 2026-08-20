import { apiClient } from '@/services/api.config' // Adjust the import path if needed

export interface AppointmentManagePayload {
  appointmentId: number
  patientId: number
}

export const appointmentManageService = {
  markAsBooked: async (data: AppointmentManagePayload) => {
    try {
      const response = await apiClient.post('/api/appointments/manage/booked', data)

      
return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.defaultMessage || 'Failed to mark as BOOKED')
    }
  },

  markAsOngoing: async (data: AppointmentManagePayload) => {
    try {
      const response = await apiClient.post('/api/appointments/manage/ongoing', data)

      
return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.defaultMessage || 'Failed to mark as ONGOING')
    }
  },

  markAsCompleted: async (data: AppointmentManagePayload) => {
    try {
      const response = await apiClient.post('/api/appointments/manage/completed', data)

      
return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.defaultMessage || 'Failed to mark as COMPLETED')
    }
  }
}