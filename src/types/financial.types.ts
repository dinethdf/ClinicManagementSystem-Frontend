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