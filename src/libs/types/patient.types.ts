// import type { Dayjs } from 'dayjs';

export interface PatientDetails {
  id?: string
  patientNo?: string
  firstName: string
  lastName: string
  fullName: string
  ethnicity: string
  gender: string
  maritalStatus: string
  nic: string
  dob: string | null | undefined
  guardianId: number | null

  address: string
  city: string
  district: string

  email: string
  mobileNo: number | string
  landNumber: number | string

  emergencyContactName: string
  emergencyContactRelationship: string
  emergencyContactMobile: number | string
  emergencyContactEmail: string | null

  registrationDate?: string
  isActive?: boolean
}

export interface PatientHistory {
  patientId: string
  prescriptions: Prescription[]
  consultations: Consultation[]
}

export interface Consultation {
  id: string
  patientId: string
  doctorId: string
  doctorName: string
  date: string
  notes: string
  diagnosis?: string
}

export interface Prescription {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  consultationId?: string
  createdAt: string
  status: 'pending' | 'partially_fulfilled' | 'fulfilled'
  items: PrescriptionItem[]
  notes?: string
}

export interface PrescriptionItem {
  id: string
  medicineName: string
  dosage: string
  quantity: number
  duration: string
  instructions?: string
  fulfilled: boolean
}
