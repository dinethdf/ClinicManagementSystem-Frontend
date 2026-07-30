import { apiClient } from '../api.config'
import type { 
  InvoicePaymentDTO, 
  PaymentResponseDTO, 
  RefundRequestDTO, 
  LateRefundOverrideDTO, 
  InvoicePaymentDetailDTO, 
  ApiResponse 
} from '@/types/financial.types'

export const payInvoice = async (data: InvoicePaymentDTO): Promise<ApiResponse<PaymentResponseDTO>> => {
  try {
    const response = await apiClient.post<ApiResponse<PaymentResponseDTO>>('/api/payments/appointment/pay', data)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Payment failed',
      data: null
    }
  }
}

export const processRefund = async (data: RefundRequestDTO): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.post<ApiResponse<null>>('/api/payments/appointment/refund', data)
    return response.data
  } catch (error: any) {
    // Specifically handle the PAYOUT_LOCKED case if backend responds with 409
    const isPayoutLocked = error.response?.status === 409;
    
    return {
      success: false,
      message: isPayoutLocked ? 'Cannot process refund. The doctor payout has already been generated.' : (error.message || 'Refund failed'),
      data: null
    }
  }
}

export const processAdminOverrideRefund = async (data: LateRefundOverrideDTO): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.post<ApiResponse<null>>('/api/payments/refund/admin-override', data)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Admin override refund failed',
      data: null
    }
  }
}

export const getPaymentHistory = async (invoiceId: number): Promise<ApiResponse<InvoicePaymentDetailDTO[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<InvoicePaymentDetailDTO[]>>(`/api/payments/history/${invoiceId}`)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch payment history',
      data: null
    }
  }
}
