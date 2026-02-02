'use server';

import { http, ApiError } from '@/services/api.config.server';
import type { DoctorScheduleDTO, UpdatedDoctorScheduleDTO } from '@/types/doctor.types';
import type { PublicBookingRequest } from '@/types/public-booking.types';

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export async function getSchedulesList() {
  try {
    const data = await http.get<PaginatedResponse<DoctorScheduleDTO>>('/api/schedules?size=100');
    return data.content || [];
  } catch (error) {
    console.error('Server-side get schedules failed:', error);
    return [];
  }
}

/**
 * Get public schedules with filters (no auth required)
 */
export async function getPublicSchedulesList({ 
  page, 
  size, 
  date, 
  specialization, 
  doctorName 
}: {
  page: number;
  size: number;
  date?: string;
  specialization?: string;
  doctorName?: string;
}) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      clinicId: `${process.env.NEXT_PUBLIC_CLINIC_ID}`,
    });
    
    if (date) params.append('date', date);
    if (specialization) params.append('specialization', specialization);
    if (doctorName) params.append('doctorName', doctorName);

    const data = await http.get<PaginatedResponse<DoctorScheduleDTO>>(
      `/api/schedules/upcoming-public?${params.toString()}`
    );
    
    return data;
  } catch (error) {
    console.error('Get public schedules failed:', error);
    throw error;
  }
}

/**
 * Get schedules by doctor ID with pagination
 */
export async function getSchedulesByDoctorId(
  doctorId: string, 
  page: number = 0, 
  size: number = 10
) {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: 'scheduleDate,desc'
    });

    const data = await http.get<PaginatedResponse<DoctorScheduleDTO>>(
      `/api/schedules/by-doctor/${doctorId}?${queryParams.toString()}`
    );

    return { 
      success: true, 
      message: 'Schedules fetched successfully', 
      data 
    };

  } catch (error) {
    if (error instanceof ApiError) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
    
    console.error('Server-side get doctor schedules failed:', error);
    return { 
      success: false, 
      message: 'Failed to fetch doctor schedules', 
      data: null 
    };
  }
}

/**
 * Get single schedule by ID
 */
export async function getScheduleById(id: number): Promise<DoctorScheduleDTO | null> {
  try {
    const data = await http.get<DoctorScheduleDTO>(`/api/schedules/${id}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch schedule:', error);
    return null;
  }
}

export async function getScheduleByIdUpdated(id: number): Promise<UpdatedDoctorScheduleDTO | null> {
  try {
    const data = await http.get<UpdatedDoctorScheduleDTO>(`/api/schedules/${id}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch schedule:', error);
    return null;
  }
}

/**
 * Get schedule list with filters (internal use, requires auth)
 */
export async function getScheduleList(
  page: number, 
  pageSize: number, 
  doctorName?: string, 
  specialization?: string, 
  date?: string
) {
  try {
    const params = new URLSearchParams({
      page: (page - 1).toString(),
      size: pageSize.toString(),
    });

    if (doctorName) params.append('doctorName', doctorName);
    if (specialization) params.append('specialization', specialization);
    if (date) params.append('date', date);

    const data = await http.get<PaginatedResponse<DoctorScheduleDTO>>(
      `/api/schedules?${params.toString()}`
    );
    
    return data;

  } catch (error) {
    console.error('Server-side get schedule list failed:', error);
    return null;
  }
}

/**
 * Validate if schedule belongs to doctor (ownership check)
 */
export async function validateScheduleOwnership(
  doctorId: number, 
  scheduleId: number
): Promise<boolean> {
  try {
    const data = await http.get<boolean>(
      `/api/schedules/validate-owner?doctorId=${doctorId}&scheduleId=${scheduleId}`
    );
    
    return data === true;

  } catch (error) {
    console.error('Server-side ownership validation failed:', error);
    return false;
  }
}

// ==================================================================================
// PUBLIC BOOKING
// ==================================================================================

/**
 * Book appointment for public users
 */
export async function bookPublicAppointment(payload: PublicBookingRequest) {
  try {
    const data = await http.post('/api/public/book-public', {
      ...payload,
      clinicId: process.env.NEXT_PUBLIC_CLINIC_ID
    });
    
    return { success: true, data };

  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message || 'Booking failed. Please try again.');
    }
    
    console.error('Public booking failed:', error);
    throw new Error('Booking failed. Please try again.');
  }
}

/**
 * Check if patient exists by NIC or mobile number
 */
export async function checkPatientAvailability(query: string) {
  try {
    const isNic = query.toLowerCase().includes('v') || query.length > 10;
    const param = isNic ? `nic=${query}` : `mobileNo=${query}`;
    const clinicId = `clinicId=${process.env.NEXT_PUBLIC_CLINIC_ID}`;

    const data = await http.get(`/api/public/check-patient?${param}&${clinicId}`);
    
    return data;

  } catch (error) {
    console.error('Patient availability check failed:', error);
    throw error;
  }
}

// ==================================================================================
// OTP VERIFICATION
// ==================================================================================

/**
 * Send OTP to mobile/email
 */
export async function sendOtp(mobileNo: string, email: string) {
  try {
    const data = await http.post('/api/otp/send', {
      mobileNo,
      email,
      clinicId: process.env.NEXT_PUBLIC_CLINIC_ID
    });
    
    return { success: true, data };

  } catch (error) {
    if (error instanceof ApiError) {
      return { 
        success: false, 
        error: error.message || 'Failed to send OTP' 
      };
    }
    
    console.error('Send OTP failed:', error);
    return { 
      success: false, 
      error: 'Failed to send OTP' 
    };
  }
}

/**
 * Verify OTP code
 */
export async function verifyOtp(mobileNo: string, otp: string) {
  try {
    const data = await http.post('/api/otp/verify', {
      mobileNo,
      otp,
      clinicId: process.env.NEXT_PUBLIC_CLINIC_ID
    });
    
    return { success: true, data };

  } catch (error) {
    if (error instanceof ApiError) {
      return { 
        success: false, 
        error: error.message || 'OTP Verification failed' 
      };
    }
    
    console.error('Verify OTP failed:', error);
    return { 
      success: false, 
      error: 'OTP Verification failed' 
    };
  }
}