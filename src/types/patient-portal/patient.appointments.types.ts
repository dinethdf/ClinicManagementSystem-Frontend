export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'PENDING_PAYMENT';

export interface PatientAppointmentDTO {
  id: number;
  appointmentId: number; // For compatibility
  doctorName: string;
  specialization: string;
  doctorImage?: string; // Optional URL
  scheduleId: number;
  scheduleDate: string; // ISO string or formatted
  date?: string; // Kept for backward compatibility
  startTime: string;
  endTime: string;
  queuePosition: number;
  queueNo?: number; // Kept for backward compatibility
  status: AppointmentStatus;
  clinicName: string;
  location: string;
  ticketPrice: number;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  canCancel: boolean; // Backend calculates this (e.g., if > 24h remaining)
}

export interface LiveQueueDTO {
  appointmentId: number;
  scheduleId: number;
  yourToken: number;
  currentToken: number;
  estimatedTime: string; // e.g. "10:45 AM"
  status: 'ON_TIME' | 'DELAYED';
}

export interface RebookRequestDTO {
  previousDoctorId: number;
  patientId: number;
}

export interface AppointmentDetailsDTO {
  id: number
  status: string
  queuePosition: number
  note: string
  createdDate: string
  
  // Doctor
  doctorId: number
  doctorName: string
  specialization: string
  
  // Schedule
  scheduleId: number
  scheduleDate: string
  startTime: string
  endTime: string
  
  // Patient
  patientId: number
  patientName: string
  patientNo: string
  patientMobile: string
  patientNic: string
  
  // Financials
  doctorFee: number
  clinicFee: number
  invoiceFinalAmount: number
  invoiceTotalDiscount: number
  invoiceStatus: string
}


export interface PrescriptionDTO {
  id: number;
  appointmentId: number;
  doctorName: string | null;
  patientName: string;
  status: string;
  note: string;
  createdDate: string;
  createdBy:string
  items: PrescriptionItem[];
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  quantity: string;
  duration: string;
  instructions: string;
}