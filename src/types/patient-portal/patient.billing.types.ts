export interface PatientInvoiceDTO {
  id: number;
  invoiceNo: string;
  date: string; // ISO Date String
  serviceType: 'Consultation' | 'Lab Test' | 'Pharmacy' | 'Other';
  description: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'REFUNDED' | 'CANCELLED';
  paymentMethod?: 'CASH' | 'CARD' | 'ONLINE' | 'INSURANCE';
  downloadUrl?: string;
}

export interface PatientInsuranceDTO {
  providerName: string;
  policyNumber: string;
  holderName: string;
  expiryDate: string; // ISO Date String
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING_VERIFICATION';
}

export interface BillingSummaryDTO {
  totalPaid: number;
  totalPending: number;
  lastPaymentDate?: string;
}