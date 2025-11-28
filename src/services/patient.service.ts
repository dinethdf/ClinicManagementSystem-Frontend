import type { Patient, Guardian, PatientResponceDTO, GetPatientsParams, PaginatedPatientResponse } from '../types/patient.types'
import { apiClient } from './api.config'

class PatientService {

async getPatients({ page, pageSize, search }: GetPatientsParams): Promise<PaginatedPatientResponse<PatientResponceDTO>> {
   try {
     const response = await apiClient.get<PaginatedPatientResponse<PatientResponceDTO>>('/api/patient/list', {
       params: {
         page: page - 1,
         size: pageSize, 
         search: search 
       }
     })
     
     console.log("api call patienet pagination")
     
     return response.data
   } catch (error: any) {
    
    throw new Error(error.response?.data?.defaultMessage || 'Failed to fetch patient list')
   }
}

async createPatientDetails(patientData: Patient): Promise<any> {
    try {
      const response: any = await apiClient.post<Patient>('/api/patient/details/staff', {
        ...patientData,
        guardian: patientData.guardian,
        patientAuthId: 1,
        bloodGroup: 'ab-',
        registrationDate: '2025-09-30T10:30:00',
        profileImg: 'https://example.com/images/john.png',
        isActive: true,
        isApproved: false,
        insuranceId: null,
        createdDate: '2025-09-30T10:30:00',
        createdBy: 'admin',
        updatedDate: '2025-09-30T10:30:00',
        updatedBy: 'admin'
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


async getPatientBySearch(patientNo: string, nicNo: string, patientName: string, mobileNo: string): Promise<PatientResponceDTO[]> {
  try {
    const response = await apiClient.get<PatientResponceDTO[]>('/api/patient/search-patient', {
      params: {
        patientNo: patientNo,
        nic: nicNo,
        fullName: patientName,
        mobileNo: mobileNo 
      }
    });
    
    return response.data;
 
  } catch (error: any) {
 
    throw new Error(error.response?.data?.defaultMessage || 'Failed to fetch guardian data');
  }
}

async getPatientById(id: string): Promise<Patient | null> {
    console.log('run get pat')

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
}

export const patientService = new PatientService()
