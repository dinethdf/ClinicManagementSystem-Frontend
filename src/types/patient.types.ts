// import type { Dayjs } from 'dayjs';

export interface Patient {
  id?: string
  patientNo?: string
  firstName: string
  lastName: string
  fullName: string
  ethnicity: string
  gender: string
  maritalStatus: string | number
  nic: string
  dob: string | null | undefined
  guardian: Guardian | null
  bloodGroup:string | null
  relationshipToGuardian :string | null
  weight: number | null 
  height: number | null

  profileImg?:string

  address: string
  city: string
  district: string

  email: string
  mobileNo: number | string
  landNo: number | string

  emergencyContactName: string
  emergencyContactRelationship: string
  emergencyContactMobile: number | string
  emergencyContactEmail: string | null

  registrationDate?: string
  isActive?: boolean
  isApproved?: boolean
  isTemp?: boolean
}

export interface PatientResponceDTO {
  id?: number
  patientNo?: string
  firstName: string
  lastName: string
  fullName: string
  nic: string
  dob: string | null | undefined
  guardian: Guardian | null
  address: string
  city: string
  email: string
  mobileNo: number | string
  registrationDate?: string
  isActive?: boolean
}


export type PatientDetailDTO = {
  id: number
  firstName: string
  lastName: string
  fullName: string
  patientNo: string
  nic: string
  age: number
  gender: number // 1: Male, 2: Female
  bloodGroup: string
  mobileNo: string
  address: string
  city: string
  profileImg: string

}

export interface PatientDTO {
  id?: string
  patientNo?: string
  firstName: string
  lastName: string
  fullName: string
  nic: string
  dob: string | null | undefined
  guardian: Guardian | null
  address: string
  city: string
  email: string
  mobileNo: number | string
  registrationDate?: string
  isActive?: boolean
}

export interface Guardian {
  id: number
  patientNo: string
  firstName: string
  lastName: string
  nic: string
  address: string
  city: string
  district: string
  email: string
  mobileNo: string
  landNo: string | null
}

export interface PaginatedPatientResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: any
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: any
  numberOfElements: number
  first: boolean
  empty: boolean
}


export interface GetPatientsParams {
  page: number
  pageSize: number
    patientNo?: string
    nic?: string
    mobile?: string
    name?: string

  sort?: string
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

// src/types/health.types.ts

// --- DTOs ---
export interface AllergyDTO {
  id: number;
  allergyName: string;
  notes?: string;
}

export interface DiseaseDTO {
  id: number;
  diseaseName: string;
  notes?: string;
}

// --- Requests ---
export interface AddHealthRecordRequest {
  name: string; // mapped to allergyName or diseaseName
  notes?: string;
}

// --- API Responses ---
// (Assuming your http helper extracts 'data', but we define wrappers just in case)
export interface HealthApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}