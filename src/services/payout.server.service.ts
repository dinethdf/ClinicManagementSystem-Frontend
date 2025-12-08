'use server';

import { http, ApiError } from '@/services/api.config.server';
import { AppointmentFinancialDTO } from '@/types/financial.types';
import type { PayoutBillDTO, BulkPaymentRequest, PaymentSuccessResponse, PayoutSearchResponse } from '@/types/payout.types';


export async function getPendingPayouts(doctorId?: string) {
  try {
    const url = doctorId 
      ? `/api/payouts/doctor/pending?doctorId=${doctorId}` 
      : `/api/payouts/doctor/pending`;

    
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


export async function processBulkPayment(payload: BulkPaymentRequest) {
  try {
    const response = await http.post<PaymentSuccessResponse>('/api/payouts/doctor/pay-bulk', payload);

    return { success: true, data: response };

  } catch (err) {
    if (err instanceof ApiError) {
  
      return { success: false, error: { message: err.message, details: err.details } };
    }

    console.error('Unexpected error in processBulkPayment:', err);
    return { success: false, error: { message: 'An unknown server error occurred.' } };
  }
}

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


export async function getDoctorSelfPayouts( page: number = 0) {
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      size: '50'
    });

    const data = await http.get<PayoutSearchResponse['data']>(
      `/api/payouts/doctor/my-payouts?${query.toString()}`
    );

    return { success: true, data };

  } catch (err) {
    console.error('Failed to fetch payouts:', err);

    return { success: false, data: { content: [], totalPages: 0, totalElements: 0 } };
  }
}

export async function getFinancialScheduleDetails(scheduleId: number) {
  try {
    const data = await http.get<AppointmentFinancialDTO[]>(
      `/api/financials/schedule/${scheduleId}/by-doctor`
    );

    return data;

  } catch (err) {
    if (err instanceof ApiError) {
       console.error(`API Error fetching details (${err.status}):`, err.message);
    } else {
       console.error('Unexpected error fetching details:', err);
    }
    return [];
  }
}