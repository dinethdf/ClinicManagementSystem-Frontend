'use server';

import { http, ApiError } from '@/services/api.config.server';
import type { AppointmentFinancialDTO, FinancialScheduleItem } from '@/types/financial.types';


/**
 * Fetches the financial breakdown for a specific schedule.
 * * Note: Your API endpoint `/api/financials/schedule/${scheduleId}` returns a raw array 
 * (not wrapped in { data: ... }), but your http utility expects { data: ... } by default.
 * * If your API returns the array directly, we might need a small adjustment or use a generic fetch if 
 * the http wrapper is strictly for { success: true, data: ... } responses.
 * * Assuming your http utility extracts `json.data`, but this specific endpoint returns a raw list:
 */
export async function getFinancialSchedule(scheduleId: number) {
  try {
    const response = await http.get<FinancialScheduleItem[]>(`/api/financials/schedule/${scheduleId}`);
    
    return response;

  } catch (err) {
    if (err instanceof ApiError) {
      console.error(`Failed to fetch financial schedule (${err.status}):`, err.message);
      
return null;
    }

    console.error('Unexpected server error in getFinancialSchedule:', err);
    
return null;
  }
}

export interface PayoutBillResponse {
    payoutId: number;
    scheduleId: number;
    totalFee: number;
    totalDiscounts: number;
    finalPayable: number;
    status: string;
    message: string;
}

export async function generateScheduleBill(scheduleId: number) {
  try {

    console.log(scheduleId)
    const response = await http.post<PayoutBillResponse>(`/api/payouts/doctor/generate-bill/${scheduleId}`, {});
    
    return { success: true, data: response };

  } catch (err) {
    if (err instanceof ApiError) {
       // Return the specific error code/message from backend
       return { 
           success: false, 
           error: { 
               message: err.message, 
               code: err.details?.errorCode || 'UNKNOWN',
               status: err.status 
           } 
       };
    }

    
return { success: false, error: { message: 'Network error occurred.' } };
  }
}