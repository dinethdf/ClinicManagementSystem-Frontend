import type { Patient, PatientHistory, Prescription } from "@/libs/types/patient.types"

// Mock data for development
const MOCK_PATIENTS: Patient[] = [
  {
    id: "PAT-001",
    nic: "199012345678",
    fullName: "Kasun Bandara",
    phoneNumber: "+94771234567",
    dateOfBirth: "1990-05-15",
    gender: "male",
    height: 175,
    weight: 72,
    existingConditions: ["Hypertension"],
    allergies: ["Penicillin"],
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
  }
]

const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: "RX-001",
    patientId: "PAT-001",
    patientName: "Kasun Bandara",
    doctorId: "2",
    doctorName: "Dr. Kumari Silva",
    createdAt: "2025-03-25T10:30:00Z",
    status: "fulfilled",
    items: [
      {
        id: "RXI-001",
        medicineName: "Amlodipine 5mg",
        dosage: "5mg",
        quantity: 30,
        duration: "30 days",
        instructions: "Once daily, morning",
        fulfilled: true,
      },
    ],
    notes: "Monitor blood pressure weekly",
  },
]

class PatientService {
  private patients: Patient[] = [...MOCK_PATIENTS]

  async getAllPatients(): Promise<Patient[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...this.patients]
  }

  async searchPatients(query: string): Promise<Patient[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const lowerQuery = query.toLowerCase()
    return this.patients.filter(
      (p) => p.fullName.toLowerCase().includes(lowerQuery) || p.nic.includes(query) || p.phoneNumber.includes(query),
    )
  }

  async getPatientById(id: string): Promise<Patient | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return this.patients.find((p) => p.id === id) || null
  }

  async getPatientByNIC(nic: string): Promise<Patient | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return this.patients.find((p) => p.nic === nic) || null
  }

  async createPatient(patientData: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const newPatient: Patient = {
      ...patientData,
      id: `PAT-${String(this.patients.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.patients.unshift(newPatient)
    return newPatient
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const index = this.patients.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("Patient not found")
    }

    this.patients[index] = {
      ...this.patients[index],
      ...patientData,
      updatedAt: new Date().toISOString(),
    }

    return this.patients[index]
  }

  async getPatientHistory(patientId: string): Promise<PatientHistory> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const prescriptions = MOCK_PRESCRIPTIONS.filter((p) => p.patientId === patientId)

    return {
      patientId,
      prescriptions,
      consultations: [],
    }
  }
}

export const patientService = new PatientService()
