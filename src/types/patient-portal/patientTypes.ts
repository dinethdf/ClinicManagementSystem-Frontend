export interface PatientType {
  id: number
  firstName: string
  lastName: string
  fullName: string
  gender: number // 1 = Male, 2 = Female usually
  nic: string
  dob: string
  age: number
  email: string
  mobileNo: string
  landNo: string | null
  address: string
  city: string
  district: string
  profileImg: string | null
  clinicId: number
  patientNo: string
  ethnicity: number
  maritalStatus: number
  bloodGroup: string
  emergencyContactName: string
  emergencyContactRelationship: string
  emergencyContactMobile: string
  emergencyContactEmail: string
  guardian: string | null
  relationshipToGuardian: string | null
  registrationDate: string
  isActive: boolean
  createdDate: string
  updatedDate: string
  isApproved: boolean
}

export interface PatientApiResponse {
  success: boolean
  message: string
  data: PatientType
}