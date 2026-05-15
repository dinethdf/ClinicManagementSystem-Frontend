'use server';

import { http, ApiError } from '@/services/api.config.server';
import { revalidatePath } from 'next/cache';

export interface ClinicSettingsDTO {
  currency: string;
  timezone: string;
  language: string;
  invoicePrefix: string;
  taxRate: number;
  otpSmsGateway: string | null;
  appointmentBookedSmsGateway: string | null;
  appointmentConfirmSmsGateway: string | null;
}

export interface ClinicDetailsDTO {
  id: number;
  name: string;
  subdomain: string;
  email: string;
  mobileNo1: string;
  mobileNo2?: string;
  landlineNo?: string;
  address: string;
  city?: string;
  district?: string;
  logoUrl?: string;
  planCode: string;
  status: string;
  settings: ClinicSettingsDTO;
}

export interface ClinicBasicInfoUpdateDTO {
  name: string;
  mobileNo1: string;
  mobileNo2?: string;
  landlineNo?: string;
  address: string;
  city?: string;
  district?: string;
  logoUrl?: string;
}

export interface ClinicSecretsDTO {
  [key: string]: string;
}

// 1. Fetch Current Details
export async function getClinicSettings() {
  try {
    const response = await http.get<ClinicDetailsDTO>('/api/clinic/info/details');
    return response;
  } catch (error) {
    console.error("Error fetching clinic settings:", error);
    return null;
  }
}

// 2. Update Basic Information
export async function updateClinicBasicInfo(data: ClinicBasicInfoUpdateDTO) {
  try {
    await http.put('/api/clinic/info/update', data);
    revalidatePath('/[lang]/clinic/settings', 'layout');
    return { success: true, message: "Basic information updated successfully" };
  } catch (err: any) {
    console.error("Error updating clinic basic info:", err);
    return { 
      success: false, 
      message: err instanceof ApiError ? err.message : (err.message || "Failed to update basic information. Please check your connection.") 
    };
  }
}

// 3. Save Business Settings
export async function updateBusinessSettings(data: Partial<ClinicSettingsDTO>) {
  try {
    await http.put('/api/clinic/info/settings', data);
    revalidatePath('/[lang]/clinic/settings', 'layout');
    return { success: true, message: "Business settings updated successfully" };
  } catch (err: any) {
    console.error("Error updating business settings:", err);
    return { 
      success: false, 
      message: err instanceof ApiError ? err.message : (err.message || "Failed to update business settings. Please check your connection.") 
    };
  }
}

// 4. Fetch Secrets
export async function getClinicSecrets() {
  try {
    const response = await http.get<ClinicSecretsDTO>('/api/clinic/info/secrets');
    return response;
  } catch (error: any) {
    console.error("Error fetching clinic secrets:", error);
    // Return null so the component can handle the empty state, 
    // but in a more complex app we might want to return an error object.
    return null;
  }
}

// 5. Save Secret Keys
export async function updateClinicSecrets(data: ClinicSecretsDTO) {
  try {
    const payload = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ''));
    
    if (Object.keys(payload).length === 0) {
        return { success: false, message: "No secrets provided to update." };
    }

    await http.put('/api/clinic/info/secrets', payload);
    return { success: true, message: "Secrets updated securely." };
  } catch (err: any) {
    console.error("Error updating clinic secrets:", err);
    return { 
      success: false, 
      message: err instanceof ApiError ? err.message : (err.message || "Failed to update secrets. Please try again.") 
    };
  }
}

// 6. Change Subscription Plan
export async function updateSubscriptionPlan(newPlanCode: string) {
  try {
    await http.put('/api/clinic/info/subscription', { newPlanCode });
    revalidatePath('/[lang]/clinic/settings', 'layout');
    return { success: true, message: "Subscription plan updated successfully" };
  } catch (err: any) {
    console.error("Error updating subscription plan:", err);
    return { 
      success: false, 
      message: err instanceof ApiError ? err.message : (err.message || "Failed to update subscription plan.") 
    };
  }
}

// 7. Test SMS Connection
export async function testSmsConnection(gatewayType: string) {
  try {
    const response = await http.post('/api/clinic/info/test-sms', { gatewayType });
    return { success: true, message: response.message || "Test SMS sent successfully!" };
  } catch (err: any) {
    console.error("Error testing SMS connection:", err);
    return { 
      success: false, 
      message: err instanceof ApiError ? err.message : (err.message || "Failed to send test SMS. Check your configuration and connection.") 
    };
  }
}
