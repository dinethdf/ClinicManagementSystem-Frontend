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
  status?:string
  isBookingOpen?: boolean
}

// --- Updated Interface based on your JSON ---
export interface UpdatedDoctorScheduleDTO {
  id: number
  doctorId: number
  doctorName: string
  specialization: string
  scheduleDate: string
  startTime: string
  endTime: string
  doctorFee: number
  clinicFee: number
  maxPatientCount: number
  registeredPatientCount: number
  isBookingOpen: boolean
  // Status is an object
  status: {
    code: string
    displayName: string
    colorCode: string
  }
  // Payout Status is an object
  payoutStatus?: {
    code: string
    displayName: string
    colorCode: string
  }
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
  number: number
}

export interface ScheduleFilterParams {
  page: number
  size: number
  doctorName?: string
  specialization?: string
  date?: string // ISO Date string YYYY-MM-DD
}


export interface ScheduleAnalyticsDTO {
  total: number;
  completed: number;
  booked: number;
  pendingPayment: number;
  cancelled: number;
}

export interface GetDoctorsParams {
  page: number
  pageSize: number
    name?: string
    mobile?: string
    slmc?: string
    specialization?: string
  sort?: string
}

export interface DoctorCreateDTO {
  firstName: string
  lastName: string
  nameWithInitials: string
  gender: number
  nic: string
  dob: string | null
  address: string
  city: string
  district: string
  email: string
  mobileNo: string
  registrationDate: string
  profileImg?: string | null
  isApproved: boolean
  slmcNumber: string
  specialization: {
    id: string
  }
  qualification: string
  experienceYears: string
  availabilityStatus: string
}

interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}




export interface ScheduleDTO {
  id: number
  doctorName: string
  specialization: string
  scheduleDate: string
  startTime: string
  endTime: string
  isActive: 'ACTIVE' | 'NOT ACTIVE'
  status:string
  maxPatientCount: number
  registeredPatientCount: number
  doctorFee: number
  clinicFee: number
  isBookingOpen: boolean
  payoutStatus?: {
    code: string
    displayName: string
    colorCode: string
  }
}


export interface DoctorScheduleApiResponse {
  success: boolean
  message: string
  data: {
    content: ScheduleDTO[]
    totalElements: number
    totalPages: number
    size: number
    number: number 
  }
}