// src/types/public-booking.types.ts

export type PublicScheduleDTO = {
  id: number; // scheduleId
  doctorName: string;
  specialization: string;
  doctorProfileImg?: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  doctorFee: number;
  clinicFee: number;
  maxPatientCount: number;
  registeredPatientCount: number;
}

export type PatientRegistrationDTO = {
  firstName: string;
  lastName: string;
  nic: string;
  gender: number; // 1: Male, 2: Female
  dob: string;
  mobileNo: string;
  address: string;
  city: string;
  email?: string;
  emergencyContactName: string;
  emergencyContactMobile: string;
}

export type SpecializationDTO = {
    id: number;
    name: string;
}

export type SimpleDoctorDTO = {
    id: number;
    name: string;
}

// NEW: Request Payload for Booking
export interface PublicBookingRequest {
    scheduleId: number;
    existingPatientId: number | null; // null if new
    note?: string;
    
    // New Patient Fields (Optional if existingPatientId is set)
    firstName?: string;
    lastName?: string;
    nic?: string;
    dob?: string;   // YYYY-MM-DD
    gender?: number; // 1 = Male, 2 = Female (Adjust based on your Enum)
    mobileNo?: string;
    email?: string;
}