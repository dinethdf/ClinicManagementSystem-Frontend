'use server';

import { http, ApiError } from '@/services/api.config.server';
import { AppointmentFinancialDTO } from '@/types/financial.types';
import type { PayoutBillDTO, BulkPaymentRequest, PaymentSuccessResponse, PayoutSearchResponse } from '@/types/payout.types';


// Define interface for parameters
interface GetPayoutsParams {
  page: number;
  size: number;
  status?: string;    // 'PENDING' | 'PAID'
  startDate?: string; // 'YYYY-MM-DD'
  endDate?: string;   // 'YYYY-MM-DD'
}

export async function getDoctorPayoutsList(params: GetPayoutsParams) {
  try {
   
    const query = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString()
    });

    if (params.status) query.append('status', params.status);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);

   
    const response = await http.get<any>(`/api/payouts/doctor/list?${query.toString()}`);
    return response; 

  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: { message: err.message, details: err.details } };
    }
    
    console.error('Unexpected error in getDoctorPayoutsList:', err);
    return { success: false, error: { message: 'An unknown server error occurred.' } };
  }
}


export async function getPendingPayouts(
    page: number = 0, 
    size: number = 10, 
    doctorId?: string
) {
  try {
    const queryParams = new URLSearchParams({
        page: (page - 1).toString(),
        size: size.toString()
    })

    if (doctorId) {
        queryParams.append('doctorId', doctorId)
    }

    const url = `/api/payouts/doctor/pending?${queryParams.toString()}`
    const response = await http.get<{ content: PayoutBillDTO[], totalElements: number }>(url)
    return { success: true, data: response }

  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: { message: err.message, details: err.details } }
    }
    
    console.error('Unexpected error in getPendingPayouts:', err)
    return { success: false, error: { message: 'An unknown server error occurred.' } }
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