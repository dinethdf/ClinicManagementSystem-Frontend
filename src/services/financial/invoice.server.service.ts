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
}

export async function processRefund(payload: RefundPayload) {
  try {
    const response = await http.post('/api/payments/appointment/refund', payload);
    
    return { success: true, message: 'Refund processed successfully', data: response };
  } catch (err) {
    if (err instanceof ApiError) {
      return { 
        success: false, 
        message: err.message || 'Refund Failed', 
        details: err.details 
      };
    }
    
    console.error("Unexpected refund error:", err);
    return { success: false, message: "An unexpected error occurred during refund." };
  }
}