import { apiClient } from '../api.config'

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

// Helper type for Pagination Response
interface PaginatedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export interface RoleDTO {
  id: number;
  name: string;
}

class StaffService {

  // --- 1. CREATE STAFF ---
  async createStaff(data: any): Promise<ClinicStaffResponseDTO | null> {
    try {
      const response = await apiClient.post<{ success: boolean; data: ClinicStaffResponseDTO }>(
        '/api/staff/register',
        data
      )
      
      return response.data.data
    } catch (error) {
      console.error('Failed to register staff:', error)
      throw error 
    }
  }

  // --- 2. GET STAFF LIST (PAGINATED) ---
  async getAllStaff(page: number = 0, size: number = 10, search: string = ''): Promise<PaginatedResponse<ClinicStaffResponseDTO> | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: PaginatedResponse<ClinicStaffResponseDTO> }>(
        '/api/staff/list', 
        {
          params: { page, size, search }
        }
      )

      return response.data.data
    } catch (error) {
      console.error('Failed to fetch staff list:', error)
      
return null
    }
  }

  // --- 3. GET STAFF BY ID ---
  async getStaffById(id: string): Promise<ClinicStaffResponseDTO | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: ClinicStaffResponseDTO }>(
        `/api/staff/${id}`
      )

      return response.data.data
    } catch (error) {
      console.error(`Failed to fetch staff details for ID ${id}:`, error)
      
return null
    }
  }

  // --- 4. UPDATE STAFF ---
  async updateStaff(id: string, data: any): Promise<ClinicStaffResponseDTO | null> {
    try {
      const response = await apiClient.put<{ success: boolean; data: ClinicStaffResponseDTO }>(
        `/api/staff/update/${id}`,
        data
      )

      return response.data.data
    } catch (error) {
      console.error(`Failed to update staff ID ${id}:`, error)
      throw error // Re-throw to handle error alerts in the UI
    }
  }

  async getStandardRoles(): Promise<RoleDTO[]> {
    try {
      // Assuming your endpoint returns the raw array. If it's wrapped in { data: ... }, adjust accordingly.
      const response = await apiClient.get<RoleDTO[]>('/api/roles/standard')

      
return response.data
    } catch (error) {
      console.error('Failed to fetch standard roles:', error)
      
return [] // Return empty array on failure so the UI doesn't crash
    }
  }
}

export const staffService = new StaffService()