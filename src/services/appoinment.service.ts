// import type { Patient, Guardian, PatientResponceDTO } from '../types/patient.types'
// import { apiClient } from './api.config'

class AppointmentService {






  //   async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient> {
  //     await new Promise((resolve) => setTimeout(resolve, 600))

  //     const index = this.patients.findIndex((p) => p.id === id)
  //     if (index === -1) {
  //       throw new Error("Patient not found")
  //     }

  //     this.patients[index] = {
  //       ...this.patients[index],
  //       ...patientData,
  //       updatedAt: new Date().toISOString(),
  //     }

  //     return this.patients[index]
  //   }

  //   async getPatientHistory(patientId: string): Promise<PatientHistory> {
  //     await new Promise((resolve) => setTimeout(resolve, 500))

  //     const prescriptions = MOCK_PRESCRIPTIONS.filter((p) => p.patientId === patientId)

  //     return {
  //       patientId,
  //       prescriptions,
  //       consultations: [],
  //     }
  //   }
}

export const patientService = new AppointmentService()
