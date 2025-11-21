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