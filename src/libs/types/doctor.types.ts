export interface Doctor {
  id?: number
  firstName: string
  lastName: string
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

export interface DoctorSchedule {
  doctor: Doctor | null 
  schedules: ScheduleSlot[]
}

export interface ScheduleSlot {
  id?: number
  date: string // Or Date, if you prefer to work with Date objects
  startTime: string
  endTime: string
  price: number | null
  maxPatientCount: number | null
}

export interface DoctorScheduleDTO {
  id?: number
  doctorId: number
  scheduleDate: string
  startTime: string
  endTime: string
  payment: number
  maxPatientCount: number
  isActive?: boolean
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

// export interface PatientHistory {
//   patientId: string
//   prescriptions: Prescription[]
//   consultations: Consultation[]
// }

// export interface Consultation {
//   id: string
//   patientId: string
//   doctorId: string
//   doctorName: string
//   date: string
//   notes: string
//   diagnosis?: string
// }

// export interface Prescription {
//   id: string
//   patientId: string
//   patientName: string
//   doctorId: string
//   doctorName: string
//   consultationId?: string
//   createdAt: string
//   status: 'pending' | 'partially_fulfilled' | 'fulfilled'
//   items: PrescriptionItem[]
//   notes?: string
// }

// export interface PrescriptionItem {
//   id: string
//   medicineName: string
//   dosage: string
//   quantity: number
//   duration: string
//   instructions?: string
//   fulfilled: boolean
// }
