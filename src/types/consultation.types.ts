// src/types/consultation.types.ts

export type ConsultationPatient = {
  id: number
  patientNo: string
  fullName: string
  age: number
  gender: 'Male' | 'Female'
  bloodGroup: string
  mobileNo: string
  profileImg?: string
  allergies: { id: number; allergyName: string; notes: string }[]
  chronicDiseases: { id: number; diseaseName: string; notes: string }[]
}

export type PrescriptionItem = {
  id: number
  medicineName: string
  dosage: string
  quantity: string
  duration: string
  instructions: string
}

export type PatientDetailDTO = {
  id: number
  firstName: string
  lastName: string
  fullName: string
  patientNo: string
  nic: string
  age: number
  gender: number // 1: Male, 2: Female
  bloodGroup: string
  mobileNo: string
  address: string
  city: string
  profileImg: string

}


export type PrescriptionItemDTO = {
  medicineName: string
  dosage: string
  quantity: string
  duration: string
  instructions: string
}

export type CreatePrescriptionDTO = {
  appointmentId: number
  note: string
  items: PrescriptionItemDTO[]
}