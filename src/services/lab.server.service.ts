'use server';

import { http, ApiError } from '@/services/api.config.server';
import type { 
  LabTestTypeDTO, 
  CreateLabTestRequest, 
  LabRequestDTO, 
  ApiResponse, 
  PageResponse 
} from '@/types/lab.types';
import { revalidatePath } from 'next/cache';

const BASE_URL = '/api/lab/types';
const REQUEST_URL = '/api/lab/requests';

// --- LAB TEST MANAGEMENT ---

export async function getLabTestList(page: number = 0, size: number = 10, search: string = '') {
  try {
    const response = await http.get<PageResponse<LabTestTypeDTO>>(
      `${BASE_URL}?page=${page}&size=${size}${search ? `&search=${search}` : ''}`
    );
    return response;
  } catch (err) {
    console.error('Fetch lab tests failed:', err);
    return { content: [], totalElements: 0, totalPages: 0, size, number: page };
  }
}

export async function createLabTest(data: CreateLabTestRequest) {
  try {
    const response = await http.post<ApiResponse<LabTestTypeDTO>>(BASE_URL, data);
    revalidatePath('/clinic/lab/list');
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error instanceof ApiError) return { success: false, error: error.message };
    return { success: false, error: 'Failed to create lab test' };
  }
}

export async function updateLabTest(id: number, data: CreateLabTestRequest & { isActive: boolean }) {
  try {
    const response = await http.put<ApiResponse<LabTestTypeDTO>>(`${BASE_URL}/${id}`, data);
    revalidatePath('/clinic/lab/list');
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error instanceof ApiError) return { success: false, error: error.message };
    return { success: false, error: 'Failed to update lab test' };
  }
}

export async function toggleLabTestStatus(id: number) {
  try {
    await http.patch(`${BASE_URL}/${id}/toggle-status`);
    revalidatePath('/clinic/lab/list');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Toggle failed' };
  }
}

// --- LAB REQUESTS (FOR CONSULTATION) ---

export async function searchActiveLabTests(search: string = '') {
  try {
    // Only fetch active tests for dropdowns
    const response = await http.get<PageResponse<LabTestTypeDTO>>(
      `${REQUEST_URL}/types/active?search=${search}&page=0&size=50`
    );
    return response;
    
  } catch (err) {
    console.error('Search active tests failed:', err);
    return { content: [], totalElements: 0 };
  }
}

export async function createLabRequest(patientId: number, labTestTypeId: number, appointmentId: number) {
  try {
    const payload = { patientId, labTestTypeId, appointmentId };
    const response = await http.post<ApiResponse<LabRequestDTO>>(REQUEST_URL, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error instanceof ApiError) return { success: false, error: error.message };
    return { success: false, error: 'Failed to add lab request' };
  }
}

export async function getPatientLabRequests(patientId: number) {
  try {
    const response = await http.get<PageResponse<LabRequestDTO>>(
      `${REQUEST_URL}/patient/${patientId}?page=0&size=10&sort=createdDate,desc`
    );
    return response;
  } catch (err) {
    console.error('Fetch patient lab requests failed:', err);
    return { content: [], totalElements: 0 };
  }
}

export async function deleteLabRequest(requestId: number) {
  try {
    const response = await http.delete<ApiResponse<null>>(`/api/lab/requests/${requestId}`);
    return { success: true, message: "Deleted" };
  } catch (error: any) {
    if (error instanceof ApiError) {
       return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to delete lab request' };
  }
}