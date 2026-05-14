'use server';

import { http, ApiError } from '@/services/api.config.server';
import { revalidatePath } from 'next/cache';

export interface ClinicSettingsDTO {
  currency: string;
  timezone: string;
  invoicePrefix: string;
  taxRate: number;
  multiCurrency: boolean;
  language: string;
  secondaryLanguage: string | null;
  appointmentBookedSmsGateway: 'SMS_GATEWAY' | 'SMS_APP' | 'NONE';
  appointmentConfirmSmsGateway: 'SMS_GATEWAY' | 'SMS_APP' | 'NONE';
  otpSmsGateway: 'SMS_GATEWAY' | 'SMS_APP' | 'NONE';
}

export interface ClinicSecretsDTO {
  smsAppApiKey: string;
  smsGatewayApiToken: string;
  smsGatewaySenderId: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// 1. Fetch Current Settings
export async function getClinicSettings() {
  try {
    const response = await http.get<ApiResponse<ClinicSettingsDTO>>('/api/clinic/info/details');
    return response.data;
  } catch (error) {
    console.error("Error fetching clinic settings:", error);
    return null; // Return null so the UI can handle the error state
  }
}

// 2. Save General Settings
export async function updateClinicSettings(data: Partial<ClinicSettingsDTO>) {
  try {
    const response = await http.put<ApiResponse<boolean>>('/api/clinic/info/settings', data);
    revalidatePath('/[lang]/clinic/settings', 'layout'); // Refresh the page data
    return { success: true, message: response.message };
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "Failed to update settings." };
  }
}

// 3. Save Secret Keys
export async function updateClinicSecrets(data: Partial<ClinicSecretsDTO>) {
  try {
    // Only send fields that are actually filled out
    const payload = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ''));
    
    if (Object.keys(payload).length === 0) {
        return { success: false, message: "No secrets provided to update." };
    }

    const response = await http.put<ApiResponse<boolean>>('/api/clinic/info/secrets', payload);
    return { success: true, message: "Secrets updated securely." };
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "Failed to update secrets." };
  }
}