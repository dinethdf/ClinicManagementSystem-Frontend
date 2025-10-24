import type { PatientDetails } from './../libs/types/patient.types'
import { apiClient } from './api.config'

class PatientService {
  //   private patients: Patient[] = [...MOCK_PATIENTS]

  //   async getAllPatients(): Promise<Patient[]> {
  //     await new Promise((resolve) => setTimeout(resolve, 500))
  //     return [...this.patients]
  //   }

  //   async searchPatients(query: string): Promise<Patient[]> {
  //     await new Promise((resolve) => setTimeout(resolve, 400))
  //     const lowerQuery = query.toLowerCase()
  //     return this.patients.filter(
  //       (p) => p.fullName.toLowerCase().includes(lowerQuery) || p.nic.includes(query) || p.phoneNumber.includes(query),
  //     )
  //   }

  //   async getPatientById(id: string): Promise<Patient | null> {
  //     await new Promise((resolve) => setTimeout(resolve, 300))
  //     return this.patients.find((p) => p.id === id) || null
  //   }

  //   async getPatientByNIC(nic: string): Promise<Patient | null> {
  //     await new Promise((resolve) => setTimeout(resolve, 300))
  //     return this.patients.find((p) => p.nic === nic) || null
  //   }

  async createPatientDetails(patientData: PatientDetails): Promise<any> {
    try {
      const response: any = await apiClient.post<PatientDetails>('/api/patient/details/staff', {
        ...patientData,
        // guardian: {
        //   id: patientData.guardianId || 1
        // },
        patientAuthId: 1,
        bloodGroup: 'ab-',
        registrationDate: '2025-09-30T10:30:00',
        profileImg: 'https://example.com/images/john.png',
        isActive: true,
        isApproved: false,
        insuranceId: null,
        createdDate: '2025-09-30T10:30:00',
        createdBy: 'admin',
        updatedDate: '2025-09-30T10:30:00',
        updatedBy: 'admin'
      })

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.defaultMessage || 'Failed to create patient')
    }
  }

  async getPatientById(id: string): Promise<PatientDetails | null> {
    console.log('run get pat')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      if (!res.ok) {
        return null
      }

      return res.json()
    } catch (error) {
      console.error('Failed to fetch patient:', error)

      return null
    }
  }

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

export const patientService = new PatientService()
