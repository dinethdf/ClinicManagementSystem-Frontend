'use server';
import { cookies } from 'next/headers';
import { http } from '@/services/api.config.server';

export async function getInvoiceDetails(invoiceId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

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