import type { Patient, Guardian, PatientResponceDTO, GetPatientsParams, PaginatedPatientResponse } from '../types/patient.types'
import { apiClient } from './api.config'

class PatientService {

async getPatients({ page, pageSize, search }: GetPatientsParams): Promise<PaginatedPatientResponse<PatientResponceDTO>> {
  console.log("params" ) 
  console.log(page ) 
  console.log(pageSize ) 
  console.log(search ) 

  try {
       const response = await apiClient.get<any>('/api/patient/list', { // Change generic to any or Wrapper Type
         params: {
           page: page - 1 , //  CommonTable  send 1-based
           size: pageSize, 
           search: search 
         }
       })

       console.log(response.data.data)
       return response.data.data 

     } catch (error: any) {
       throw new Error(error.response?.data?.defaultMessage || 'Failed to fetch patient list')
     }
  }

async createPatientDetails(patientData: Patient): Promise<any> {
    try {
      const response: any = await apiClient.post<Patient>('/api/patient/details/staff', {
        ...patientData,
        guardian: patientData.guardian,
        patientAuthId: null,
        // bloodGroup: 'ab-',
        profileImg: 'https://example.com/images/john.png',
        insuranceId: null
      })

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.defaultMessage || 'Failed to create patient')
    }
}

  async getGuardianForChildPatient(nicNo: string, guardianName: string): Promise<Guardian[]> {
    try {
      const response = await apiClient.get<Guardian[]>('/api/patient/search-guardian', {
        params: {
          nic: nicNo,
          fullName: guardianName 
        }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.defaultMessage || 'Failed to fetch guardian data');
    }
}


async getPatientBySearch(
    patientNo?: string, 
    nicNo?: string, 
    patientName?: string, 
    mobileNo?: string
  ): Promise<PatientResponceDTO[]> {
    try {
     
      const params: any = {};
     
      if (patientNo) params.patientNo = patientNo;
      if (nicNo) params.nic = nicNo;
      if (patientName) params.fullName = patientName;
      if (mobileNo) params.mobileNo = mobileNo;

      const response = await apiClient.get<PatientResponceDTO[]>('/api/patient/search-patient', {
        params: params
      });
      
      return response.data;
   
    } catch (error: any) {

      if (error.response && error.response.status === 404) {
         return []; 
      }

      // const errorMessage = error.response?.data?.message || error.response?.data?.defaultMessage || 'System Error: Failed to fetch patient data.';
      // throw new Error(errorMessage);
      
      return []; 
    }
  }

async getPatientById(id: string): Promise<Patient | null> {

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      if (!res.ok) {
        return null
      }

      return res.json()
    } catch (error) {
      console.error('Failed to fetch patient:', error)

      return null
    }
}



async updatePatient(id: string, patientData: Partial<Patient>): Promise<any> {
  try {
    const response = await apiClient.put(`/api/patient/details/staff/${id}`, patientData)
    
    return response.data
  } catch (error: any) {
    console.error('Update failed:', error)
   
    throw new Error(error.response?.data?.defaultMessage || 'Failed to update patient')
  }
}

async updatePatientBySelf(id: string, patientData: Partial<Patient>): Promise<any> {
  try {
    const response = await apiClient.put(`/api/patient-portal/account-settings/details/self/${id}`, patientData)
    
    return response.data
  } catch (error: any) {
    console.error('Update failed:', error)
   
    throw new Error(error.response?.data?.defaultMessage || 'Failed to update patient')
  }
}

async togglePatientStatus(id: string): Promise<any> {
  try {
    // ⚠️ Add the empty object {} as the second argument
    const response = await apiClient.patch(`/api/patient/status/${id}`, {})
    
    return response.data
  } catch (error: any) {
    console.error('Toggle status failed:', error)
    throw new Error(error.response?.data?.defaultMessage || 'Failed to toggle status')
  }
}

}

export const patientService = new PatientService()
