export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'PENDING_PAYMENT';

export interface PatientAppointmentDTO {
  id: number;
  doctorName: string;
  specialization: string;
  doctorImage?: string; // Optional URL
  scheduleId: number;
  date: string; // ISO string e.g. "2026-01-05T10:30:00"
  startTime: string;
  endTime: string;
  queueNo: number;
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