'use server';

import { http, ApiError } from '@/services/api.config.server';
import { revalidatePath } from 'next/cache';

// --- DTOs matching your Java Backend ---
export interface SystemAccountStatusDTO {
  hasAccount: boolean;
  username: string | null;
  twoFactorEnabled: boolean;
  isSuspended: boolean;
}

// Helper for standard API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// --- 1. GET ACCOUNT STATUS ---
export async function getAccountStatus(staffId: number) {
  try {
    const response = await http.get<ApiResponse<SystemAccountStatusDTO>>(
      `/api/staff/${staffId}/security/status`
    );
    return response;
  } catch (err) {
    if (err instanceof ApiError) {
      console.error(`API Error fetching security status (${err.status}):`, err.message);
    } else {
      console.error('Unexpected error fetching security status:', err);
    }
    return null;
  }
}

// --- 2. MANUAL PASSWORD RESET ---
export async function manualPasswordReset(staffId: number, password: string) {
  try {
    const response = await http.post<ApiResponse<boolean>>(
      `/api/staff/${staffId}/security/manual-reset`,
      { password }
    );
    return response;
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message, data: false };
    }
    return { success: false, message: "Failed to reset password.", data: false };
  }
}

// --- 3. TOGGLE ACCOUNT SUSPENSION ---
export async function toggleSuspension(staffId: number, isSuspended: boolean) {
  try {
    const response = await http.post<ApiResponse<boolean>>(
      `/api/staff/${staffId}/security/toggle-suspension`,
      { isSuspended }
    );
    // Refresh the staff page data cache
    revalidatePath(`/[lang]/clinic/staff/view/${staffId}`, 'page');
    return response;
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message, data: false };
    }
    return { success: false, message: "Failed to change account status.", data: false };
  }
}

// --- 4. DISABLE 2FA ---
export async function disableTwoFactor(staffId: number) {
  try {
    const response = await http.post<ApiResponse<boolean>>(
      `/api/staff/${staffId}/security/disable-2fa`,
      {}
    );
    // Refresh the staff page data cache
    revalidatePath(`/[lang]/clinic/staff/view/${staffId}`, 'page');
    return response;
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message, data: false };
    }
    return { success: false, message: "Failed to disable 2FA.", data: false };
  }
}

// --- 5. SEND RESET LINK ---
export async function sendResetLink(staffId: number) {
  try {
    const response = await http.post<ApiResponse<boolean>>(
      `/api/staff/${staffId}/security/send-reset-link`,
      {}
    );
    return response;
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message, data: false };
    }
    return { success: false, message: "Failed to send reset link.", data: false };
  }
}