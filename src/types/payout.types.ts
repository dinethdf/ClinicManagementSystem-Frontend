export type PayoutBillDTO = {
  payoutId: number
  scheduleId: number
  scheduleDate: string
  doctorName: string
  totalFee: number
  totalDoctorDiscounts: number
  finalPayableAmount: number
  status: 'PENDING' | 'PAID'
}

export type BulkPaymentRequest = {
  paymentIds: number[]
  paymentMethod: 'BANK_TRANSFER' | 'CASH' | 'CHEQUE'
  transactionReference: string
  totalAmountToPay: number
}

export type PaymentSuccessResponse = {
  successCount: number
  totalProcessedAmount: number
  message: string
}