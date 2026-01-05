export interface PortalStats {
  upcomingAppointments: number;
  pendingLabReports: number;
  completedVisits: number;
  totalSpent: number;
}

export interface PortalAppointmentDTO {
  id: number;
  doctorName: string;
  specialization: string;
  doctorImage?: string;
  date: string; // ISO String
  time: string;
  queueNo: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'PENDING_PAYMENT';
  clinicName: string;
  location: string;
  ticketPrice: number;
}

export interface PortalLabReportDTO {
  id: number;
  testName: string;
  date: string;
  status: 'PENDING' | 'READY';
  downloadUrl?: string;
}