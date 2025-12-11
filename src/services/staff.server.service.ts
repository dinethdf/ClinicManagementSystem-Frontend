'use server';

import { http, ApiError } from '@/services/api.config.server';

import { revalidatePath } from 'next/cache';

// Define the response types matching your Java DTOs
export interface ClinicStaffResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  city: string | null;
  nic: string;
  dob: string;
  nameWithInitials: string;
  designation: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  profileImg: string | null;
}

// Helper interface for the Pagination structure from Java
interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// Helper for the outer API Response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getStaffList(page: number = 0, size: number = 10) {
  try {
    // Note: If you add search to backend later, append `?search=${search}` here
    const response = await http.get<ApiResponse<PageResponse<ClinicStaffResponseDTO>>>(
      `/api/staff/list?page=${page}&size=${size}`
    );

    return response; 


  } catch (err) {
    if (err instanceof ApiError) {
       console.error(`API Error fetching staff list (${err.status}):`, err.message);
    } else {
       console.error('Unexpected error fetching staff list:', err);
    }

    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      size,
      number: page
    };
  }
}

// Re-using the DTO type we defined earlier
export interface ClinicStaffResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  city: string | null;
  nic: string;
  dob: string;
  nameWithInitials: string;
  designation: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  profileImg: string | null;
  address?: string; // Add if your backend sends it
  district?: string; // Add if your backend sends it
  gender?: number; // Add if your backend sends it
}

export async function getStaffById(id: string) {
  try {
    const response = await http.get<{ data: ClinicStaffResponseDTO }>(`/api/staff/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching staff:", error);
    return null;
  }
}

export async function updateStaff(id: string, data: Partial<ClinicStaffResponseDTO>) {
  try {
    const response = await http.put(`/api/staff/update/${id}`, data);
    revalidatePath(`/clinic/staff/view/${id}`); // Refresh the page data
    return response;
  } catch (error) {
    throw error;
  }
}  