export interface Doctor {
  id?: number
  firstName: string
  lastName: string
  email: string
  gender: string
  address?:string
  city?:string
  mobileNo: number | string
  nic: string
  dob: string | null | undefined
  nameWithInitials: string
  slmcNumber: string
  specialization: DoctorSpecialization
  qualification: string
  experienceYears?: string
  availabilityStatus?: string
  profileImg?: string
}


export interface DoctorSpecialization {
  id?: number 
  name: string
  note?: string
}

export interface DoctorSchedule {
  doctor: Doctor | null 
  schedules: ScheduleSlot[]
}

export interface ScheduleSlot {
  id?: number
  date: string // Or Date, if you prefer to work with Date objects
  startTime: string
  endTime: string
  doctorFee: number | null
  clinicFee: number | null
  maxPatientCount: number | null
  registeredPatientCount: number | null
}

export interface DoctorScheduleDTO {
  id?: number
  doctorId: number
  scheduleDate: string
  doctorName?:string
  specialization?:string
  startTime: string
  endTime: string
  doctorFee: number
  clinicFee: number  
  registeredPatientCount: number
  maxPatientCount: number
  isActive?: boolean
}

// Payload for updating
export type UpdateScheduleDTO = {
  startTime: string
  endTime: string
  doctorFee: number
  clinicFee: number
  maxPatientCount: number
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

export type ScheduleListTypes = {
  id: number
  doctorName: string
  specialization: string
  scheduleDate: string
  timeRange: string
  registeredPatientCount: number
  maxPatientCount: number
  isActive: boolean
}

export interface DoctorResponceDTO {
  id?: number

  firstName: string
  lastName: string

  nic: string
  dob: string | null | undefined

  address: string
  city: string
  email: string
  mobileNo: number | string
  isActive?: boolean
}


export interface DoctorResponseDTO {
  id: number
  firstName: string
  lastName: string
  email: string
  mobileNo: string
  city: string | null
  nic: string
  dob: string
  nameWithInitials: string
  slmcNumber: string
  specialization: DoctorSpecialization
  qualification: string
  experienceYears: number
  profileImg: string | null
  availabilityStatus?: string
  isApproved: boolean
  registrationDate: string
}

// The structure of the paginated data object inside the API response
export interface PaginatedDoctorResponse {
  content: DoctorResponseDTO[]
  totalElements: number
  totalPages: number
  size: number
  number: number // Current page index (0-based)
}
