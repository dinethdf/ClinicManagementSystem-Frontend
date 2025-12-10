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

export interface PatientAppointmentDTO {
  appointmentId: number;
  queuePosition: number;
  status: string; // 'PENDING_PAYMENT', 'Booked', etc.
  
  // Schedule
  scheduleDate: string;
  startTime: string;
  
  // Doctor
  doctorFirstName: string;
  doctorLastName: string;
  doctorFullName: string;
  specialization: string;
  
  // Fees
  doctorFee: number;
  clinicFee: number;
  totalFee: number;
}

// Wrapper for the standard backend response
export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

// src/types/appointment.types.ts

// For the List View
export type AppointmentListDTO = {
  id: number
  startTime: string
  status: string // 'Booked' | 'COMPLETED' | etc.
  note: string | null
  queuePosition: number
  patientMobile: string
  scheduleDate: string
  patientId: number
  patientNo: string
  patientName: string
  doctorName: string
  appointmentNumber: string | null
}


export type AppointmentDetailDTO = {
  id: number
  startTime: string
  endTime: string
  status: string
  note: string | null
  specialization: string
  queuePosition: number
  patientMobile: string
  scheduleDate: string
  patientId: number
  patientNo: string
  patientName: string
  patientNic: string
  doctorName: string
  doctorFee: number
  clinicFee: number
  scheduleId: number
  
  invoiceTotalDiscount: number
  invoiceFinalAmount: number
  invoiceStatus: string

  createdDate: string
  createdBy: string
  updatedDate: string | null
  updatedBy: string | null
  approvedDate: string | null
  approvedBy: string | null
}


export type AppointmentApiResponse = {
  content: AppointmentListDTO[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export type ScheduleAppointmentDTO = {
  id: number
  startTime: string
  status: string
  note: string | null
  patientId: number
  scheduleDate: string
  patientMobile: string
  patientNo: string
  patientName: string
  queuePosition: number
  appointmentNumber: string | null
}

export type ScheduleAppointmentResponse = {
  content: ScheduleAppointmentDTO[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export type AppointmentStatusDTO = {
  id: number
  appointmentId: number
  fullName: string
  patientNo: string
  nic: string
  queueNo: number
  status: string
  createdDate: string
}

export interface GetAppointmentListParams {
  page: number
  size: number
  patientId?: number
  scheduleId?: number
  startDate?: string
  endDate?: string
}