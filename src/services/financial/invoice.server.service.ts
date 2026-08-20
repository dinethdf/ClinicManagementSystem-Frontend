'use server';

import { http, ApiError } from '@/services/api.config.server';

export async function getInvoiceDetails(invoiceId: number) {
  try {


    const response = await http.get(`/api/appointments/invoices/${invoiceId}/view`);
    
    // Response is already an array, return first item
    if (Array.isArray(response) && response.length > 0) {
      return response[0];
    }

    console.error('No invoice data found');
    
return null;
  } catch (error) {
    console.error('Server-side get invoice failed:', error);
    
return null;
  }
}



export type RefundPayload = {
  invoiceId: number;
  amount: number;
  refundCategory: 'DOCTOR' | 'CLINIC';
  reason: string;
  authorizedBy: string;
  refundMethod: string;
}

export async function processRefund(payload: RefundPayload) {
  try {
    const response = await http.post<{ success: boolean, message: string, data: any }>(
      `/api/payments/appointment/refund`, 
      payload, 
      true
    )

    console.log("Refunc xcall", response)
    
return { success: true, message: response.message }
  } catch (err: any) {

    console.log("Refunc erro coll", err)

    if (err instanceof ApiError) {
      return { success: false, message: err.message, errorCode: err.details?.errorCode || err.details }
    }

    
return { success: false, message: err.message || "Failed to process refund." }
  }
}

export async function getInvoicePaymentHistory(invoiceId: number) {
  try {
    // UPDATED ENDPOINT
    const response = await http.get(`/api/payments/history/${invoiceId}`);
   
    return { success: true, data: Array.isArray(response) ? response : response };
  } catch (error: any) {
    console.error("Fetch History Error:", error);
    
return { 
        success: false, 
        message: error.message || "Failed to load payment history" 
    };
  }
}