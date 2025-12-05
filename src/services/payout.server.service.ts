'use server';

import { http, ApiError } from '@/services/api.config.server';
import type { PayoutBillDTO, BulkPaymentRequest, PaymentSuccessResponse } from '@/types/payout.types';

/**
 * Fetch list of pending payouts.
 * Optional: Filter by doctorId
 */
export async function getPendingPayouts(doctorId?: string) {
  try {
    const url = doctorId 
      ? `/api/payouts/doctor/pending?doctorId=${doctorId}` 
      : `/api/payouts/doctor/pending`;

    // http.get automatically unwraps response.data based on your config
    const data = await http.get<PayoutBillDTO[]>(url);

    return { success: true, data };

  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: { message: err.message, details: err.details } };
    }
    
    console.error('Unexpected error in getPendingPayouts:', err);
    return { success: false, error: { message: 'An unknown server error occurred.' } };
  }
}

/**
 * Process bulk payments for selected bills.
 */
export async function processBulkPayment(payload: BulkPaymentRequest) {
  try {
    const response = await http.post<PaymentSuccessResponse>('/api/payouts/doctor/pay-bulk', payload);

    return { success: true, data: response };

  } catch (err) {
    if (err instanceof ApiError) {
      // This handles the 409 Conflict messages like "Schedule #3 is already paid"
      return { success: false, error: { message: err.message, details: err.details } };
    }

    console.error('Unexpected error in processBulkPayment:', err);
    return { success: false, error: { message: 'An unknown server error occurred.' } };
  }
}

/**
 * Manually generate a bill for a specific schedule.
 */
export async function generateBill(scheduleId: number) {
  try {
    const response = await http.post<any>(`/api/payouts/doctor/generate-bill/${scheduleId}`, {});

    return { success: true, data: response };

  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: { message: err.message, details: err.details } };
    }

    console.error('Unexpected error in generateBill:', err);
    return { success: false, error: { message: 'An unknown server error occurred.' } };
  }
}