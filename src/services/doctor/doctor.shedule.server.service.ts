'use server';

import { http, ApiError } from '@/services/api.config.server';
import type { 
  DoctorScheduleResponseDTO, 
  DoctorScheduleDTO, 
  DoctorScheduleCreateDTO,
  DoctorScheduleUpdateDTO,
  DoctorReassignDTO,
  DelayNotificationDTO,
  CurrentTicketDTO,
  AppointmentCancelDTO,
  DoctorScheduleListDTO
} from '@/types/doctor.types';
import type { PublicBookingRequest } from '@/types/public-booking.types';

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// --- Part 1: Lifecycle & Management Operations ---

export async function closeBookingEarly(id: number) {
  try {
    const data = await http.post<DoctorScheduleResponseDTO>(`/api/schedules/${id}/close-booking`, {});

    
return { success: true, data, message: 'Booking closed successfully.' };
  } catch (error) {
    return handleApiError(error, 'Failed to close booking.');
  }
}

export async function completeSchedule(id: number) {
  try {
    const data = await http.post<DoctorScheduleResponseDTO>(`/api/schedules/${id}/complete`, {});

    
return { success: true, data, message: 'Schedule marked as completed.' };
  } catch (error) {
    return handleApiError(error, 'Failed to complete schedule.');
  }
}

export async function cancelScheduleCascade(id: number, payload: AppointmentCancelDTO) {
  try {
    const data = await http.post<DoctorScheduleResponseDTO>(`/api/schedules/${id}/cancel-cascade`, payload);

    
return { success: true, data, message: 'Schedule and appointments cancelled successfully.' };
  } catch (error) {
    return handleApiError(error, 'Failed to cancel schedule cascade.');
  }
}

export async function syncFirebaseQueue(id: number) {
  try {
    await http.post(`/api/schedules/${id}/sync-queue`, {});
    
return { success: true, message: 'Firebase Queue synced successfully.' };
  } catch (error) {
    return handleApiError(error, 'Failed to sync firebase queue.');
  }
}

// --- Part 2: Advanced Clinical operations & Queries ---

export async function checkScheduleOverlap(params: {
  doctorId: number;
  date: string;
  startTime: string;
  endTime: string;
  excludeScheduleId?: number;
}) {
  try {
    const query = new URLSearchParams({
      doctorId: params.doctorId.toString(),
      date: params.date,
      startTime: params.startTime,
      endTime: params.endTime,
    });

    if (params.excludeScheduleId) query.append('excludeScheduleId', params.excludeScheduleId.toString());

    const data = await http.get<boolean>(`/api/schedules/check-overlap?${query.toString()}`);

    
return { success: true, data };
  } catch (error) {
    return handleApiError(error, 'Failed to check overlap.');
  }
}

export async function reassignDoctor(id: number, payload: DoctorReassignDTO) {
  try {
    const data = await http.post<DoctorScheduleResponseDTO>(`/api/schedules/${id}/reassign`, payload);

    
return { success: true, data, message: 'Schedule reassigned successfully.' };
  } catch (error) {
    return handleApiError(error, 'Failed to reassign doctor.');
  }
}

export async function notifyDelay(id: number, payload: DelayNotificationDTO) {
  try {
    await http.post(`/api/schedules/${id}/notify-delay`, payload);
    
return { success: true, message: 'Delay notifications queued.' };
  } catch (error) {
    return handleApiError(error, 'Failed to send delay notification.');
  }
}

export async function getCurrentTicketStatus(id: number) {
  try {
    const data = await http.get<CurrentTicketDTO>(`/api/schedules/${id}/current-ticket`);

    
return { success: true, data };
  } catch (error) {
    return handleApiError(error, 'Failed to fetch current ticket status.');
  }
}

export async function getAllSchedules(includeInactive: boolean = false) {
  try {
    const data = await http.get<DoctorScheduleListDTO[]>(`/api/schedules/all?includeInactive=${includeInactive}`);

    
return { success: true, data };
  } catch (error) {
    return handleApiError(error, 'Failed to fetch all schedules.');
  }
}

// --- Part 3 & 4: CRUD Operations ---

export async function createSchedule(payload: DoctorScheduleCreateDTO) {
  try {
    const data = await http.post<DoctorScheduleResponseDTO>('/api/schedules', payload);

    
return { success: true, data, message: 'Schedule created successfully.' };
  } catch (error) {
    return handleApiError(error, 'Failed to create schedule.');
  }
}

export async function createBatchSchedules(payload: DoctorScheduleCreateDTO[]) {
  try {
    const data = await http.post<DoctorScheduleResponseDTO[]>('/api/schedules/batch', payload);

    
return { success: true, data, message: 'Batch schedules created successfully.' };
  } catch (error) {
    return handleApiError(error, 'Failed to create batch schedules.');
  }
}

export async function updateSchedule(id: number, payload: DoctorScheduleUpdateDTO) {
  try {
    const data = await http.put<DoctorScheduleResponseDTO>(`/api/schedules/${id}`, payload);

    
return { success: true, data, message: 'Schedule updated successfully.' };
  } catch (error) {
    return handleApiError(error, 'Failed to update schedule.');
  }
}

export async function deleteSchedule(id: number) {
  try {
    await http.delete(`/api/schedules/${id}`);
    
return { success: true, message: 'Schedule deactivated successfully.' };
  } catch (error) {
    return handleApiError(error, 'Failed to deactivate schedule.');
  }
}

export async function reactivateSchedule(id: number) {
  try {
    const data = await http.post<DoctorScheduleResponseDTO>(`/api/schedules/${id}/reactivate`, {});

    
return { success: true, data, message: 'Schedule reactivated successfully.' };
  } catch (error) {
    return handleApiError(error, 'Failed to reactivate schedule.');
  }
}

export async function hardDeleteSchedule(id: number) {
  try {
    await http.delete(`/api/schedules/${id}/force-delete`);
    
return { success: true, message: 'Schedule permanently deleted.' };
  } catch (error) {
    return handleApiError(error, 'Failed to hard delete schedule.');
  }
}

function handleApiError(error: any, defaultMessage: string) {
  if (error instanceof ApiError) {
    return { success: false, message: error.message, error: error.details };
  }

  console.error(defaultMessage, error);
  
return { success: false, message: defaultMessage };
}

// --- Existing methods with minor cleanup ---

export async function getSchedulesList() {
  try {
    const data = await http.get<PaginatedResponse<DoctorScheduleResponseDTO>>('/api/schedules?size=100');

    
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

    const data = await http.get<PaginatedResponse<DoctorScheduleResponseDTO>>(
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

    const data = await http.get<PaginatedResponse<DoctorScheduleResponseDTO>>(
      `/api/schedules/by-doctor/${doctorId}?${queryParams.toString()}`
    );

    return { 
      success: true, 
      message: 'Schedules fetched successfully', 
      data 
    };

  } catch (error) {
    return handleApiError(error, 'Failed to fetch doctor schedules');
  }
}

/**
 * Get single schedule by ID
 */
export async function getScheduleById(id: number): Promise<DoctorScheduleResponseDTO | null> {
  try {
    const data = await http.get<DoctorScheduleResponseDTO>(`/api/schedules/${id}`);

    
return data;
  } catch (error) {
    console.error('Failed to fetch schedule:', error);
    
return null;
  }
}

export async function getScheduleList(
  page: number, 
  pageSize: number, 
  doctorId?: number, 
  specializationId?: number, 
  startDate?: string,
  endDate?: string
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
    });

    if (doctorId) params.append('doctorId', doctorId.toString());
    if (specializationId) params.append('specializationId', specializationId.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const data = await http.get<PaginatedResponse<DoctorScheduleResponseDTO>>(
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


export async function bookPublicAppointment(payload: PublicBookingRequest) {
  try {
    const data = await http.post('/api/public/book-public', {
      ...payload,
      clinicId: process.env.NEXT_PUBLIC_CLINIC_ID
    }, true);
    
    return data;

  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message || 'Booking failed. Please try again.');
    }
    
    console.error('Public booking failed:', error);
    throw new Error('Booking failed. Please try again.');
  }
}

export async function checkPatientAvailability(query: string) {
  try {
    const clinicId = process.env.NEXT_PUBLIC_CLINIC_ID || 1; 
    
    const data = await http.get(`/api/public/check-patient?query=${query}&clinicId=${clinicId}`);

    console.log(data);
     
return { success: true, data: data, message: "Successfully checked patient availability" };

  } catch (error: any) {
    if (error.status === 404 || error.statusCode === 404) {
        return { success: true, data: [], message: "No patient found" };
    }

    console.error('Patient availability check failed:', error);
    
return { success: false, message: error.message || 'Network or Server Error', data: [] };
  }
}


export async function sendOtp(mobileNo: string, email: string) {
  try {
    const data = await http.post('/api/otp/send', {
      mobileNo,
      email,
      clinicId: process.env.NEXT_PUBLIC_CLINIC_ID
    }, true);
    
    console.log('OTP send response:');
    console.log(data);
    
    return data;

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

export async function verifyOtp(mobileNo: string, otp: string) {
  try {
    const data = await http.post('/api/otp/verify', {
      mobileNo,
      otp,
      clinicId: process.env.NEXT_PUBLIC_CLINIC_ID || 0
    }, true);

       console.log("Send OTP Response:", data);
    
return data;

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