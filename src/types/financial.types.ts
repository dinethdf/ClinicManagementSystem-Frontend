export type FinancialScheduleItem = {
  appointmentId: number
  queueNo: number
  patientName: string
  patientMobile: string
  invoiceId: number

  // Status Details
  paymentStatus: string
  paymentStatusCode: 'PAID' | 'PARTIAL' | 'UNPAID' | 'CANCELLED' | string
  paymentStatusColor: string
  appointmentStatus: string
  appointmentStatusCode: 'BOOKED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | string
  appointmentStatusColor: string

  // Fee & Discount Breakdown
  baseDoctorFee: number
  baseClinicFee: number
  doctorDiscountAmount: number
  netDoctorPayout: number
  clinicDiscountAmount: number
  netClinicProfit: number
  
  // Totals & Balances
  subtotalAmount: number
  totalDiscount: number
  totalPaidByPatient: number
  amountPaid: number
  balanceRemaining: number

  // Payment Metadata
  paymentDueDate: string | null
  paymentPercentage: number
  lastPaymentMethod: string | null
  lastPaymentMethodCode: string | null
  lastPaymentLocation: string | null
  lastPaymentDate: string | null
  totalPayments: number
}

export interface AppointmentFinancialDTO {
  appointmentId: number;
  queueNo: number;
  patientName: string;
  paymentStatus: string;
  baseDoctorFee: number;
  doctorDiscountAmount: number;
  netDoctorPayout: number;
  totalPaidByPatient: number;
}

export interface DiscountItemDTO {
  discountType: string;
  amount: number;
  description?: string;
}

export interface InvoicePaymentDTO {
  invoiceId: number;
  amountPaid: number;
  paymentMethod: string;
  paymentLocation: string;
  transactionCode?: string;
  paymentGateway?: string;
  discounts?: DiscountItemDTO[];
}

export interface PaymentStatusDTO {
  code: string;
  displayName: string;
  colorCode: string;
}

export interface PaymentResponseDTO {
  id: number;
  invoiceId: number;
  amountPaid: number;
  remainingBalance: number;
  paymentMethod: string;
  transactionId?: string;
  paymentStatus: PaymentStatusDTO;
  createdDate: string;
  smsStatus?: string;
}

export interface RefundRequestDTO {
  invoiceId: number;
  amount: number;
  reason: string;
  authorizedBy: string;
  refundCategory: 'CLINIC' | 'DOCTOR';
  refundMethod: string;
}

export interface LateRefundOverrideDTO {
  invoiceId: number;
  refundAmount: number;
  refundMethod: string;
  approvalNote: string;
}

export interface InvoicePaymentDetailDTO {
  paymentId: number;
  paymentDate: string;
  amount: number;
  transactionRef?: string;
  receivedBy: string;
  method: string;
  location: string;
  status: PaymentStatusDTO;
}