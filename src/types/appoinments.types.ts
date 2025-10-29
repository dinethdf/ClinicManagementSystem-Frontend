import type { Doctor } from "./doctor.types"
import type { Patient } from "./patient.types"

export interface Appoinment {
  id?: number
  doctor: Doctor
  patient: Patient
  email: string
  mobileNo: number | string
  nic: string
  dob: string | null | undefined
  nameWithInitials: string
  slmcNumber: string
  specialization: string
  qualification: string
  experienceYears?: string
  profileImg?: string
}

