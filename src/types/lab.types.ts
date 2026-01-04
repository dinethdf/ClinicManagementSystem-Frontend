export interface LabTestTypeDTO {
  id: number;
  name: string;
  code: string;
  description: string;
  testFee: number;
  clinicFee: number;
  totalPrice: number;
  isActive: boolean;
  createdDate: string;
  createdBy: string;
}

export interface CreateLabTestRequest {
  name: string;
  code: string;
  description: string;
  testFee: number;
  clinicFee: number;
}

export interface LabRequestDTO {
  id: number;
  patientId: number;
  patientName: string;
  patientMobile: string;
  labTestTypeId: number;
  testName: string;
  testCode: string;
  appointmentId: number;
  prescribedBy: string;
  invoiceId: number | null;
  billedAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  status: 'PENDING' | 'SAMPLE_COLLECTED' | 'COMPLETED' | 'CANCELLED';
  technicianNotes: string | null;
  reportUrl: string | null;
  createdDate: string;
  createdBy: string;
  completedDate: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}