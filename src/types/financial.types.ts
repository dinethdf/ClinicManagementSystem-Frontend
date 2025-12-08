export type FinancialScheduleItem = {
  appointmentId: number
  queueNo: number
  patientName: string
  patientMobile: string
  invoiceId: number
  paymentStatus: string // "PAID", etc.
  baseDoctorFee: number
  baseClinicFee: number
  doctorDiscountAmount: number
  netDoctorPayout: number
  clinicDiscountAmount: number
  netClinicProfit: number
  totalPaidByPatient: number
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