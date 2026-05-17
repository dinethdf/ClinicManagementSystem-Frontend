'use server';

import { http, ApiError } from '@/services/api.config.server';
import { revalidatePath } from 'next/cache';
import { encodeObject, decodeObject, transportDecrypt, transportEncrypt } from '@/utils/FEValueEncryption';

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
    const encryptedData = await http.get<string>('/api/clinic/info/secrets');
    
    if (!encryptedData) return null;

    // Decrypt from Backend (AES)
    const decryptedData = decodeObject<ClinicSecretsDTO>(encryptedData);
    if (!decryptedData) {
      console.error("Failed to decrypt secrets from backend");
      return null;
    }

    // Encrypt for Transport (XOR) to hide from Network Tab
    return transportEncrypt(JSON.stringify(decryptedData));
  } catch (error: any) {
    console.error("Error fetching clinic secrets:", error);
    return null;
  }
}

// 5. Save Secret Keys
export async function updateClinicSecrets(encryptedTransportData: string) {
  try {
    // 1. Decrypt from Transport (XOR)
    const decryptedJson = transportDecrypt(encryptedTransportData);
    if (!decryptedJson) {
        return { success: false, message: "Failed to secure the data for transmission." };
    }

    // 2. Parse and filter
    const data = JSON.parse(decryptedJson) as ClinicSecretsDTO;
    const payload = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ''));
    
    if (Object.keys(payload).length === 0) {
        return { success: false, message: "No secrets provided to update." };
    }

    // 3. Encrypt for Backend (AES)
    const encryptedData = encodeObject(payload);

    if (!encryptedData) {
      return { success: false, message: "Failed to secure the data before sending." };
    }

    await http.put('/api/clinic/info/secrets', { data: encryptedData });
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
