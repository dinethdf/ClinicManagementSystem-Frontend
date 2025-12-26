// src/types/prescription.types.ts

// 1. Dropdown Config (Categories, Units, Frequencies)
export interface PrescriptionConfigDTO {
  categories: string[];
  units: string[];
  frequencies: string[];
}

// 2. Medicine Search Result
export interface MedicineDTO {
  id: number;
  name: string;
  category: string;
  defaultUnit: string;
  genericName?: string;
}

// 3. Payload for Creating Prescription
export interface CreatePrescriptionRequestDTO {
  appointmentId: number;
  diagnosis: string;
  note: string;
  items: PrescriptionItemRequestDTO[];
}

export interface PrescriptionItemRequestDTO {
  medicineName: string;
  category: string;
  dosage: string; // "500 mg" combined
  frequency: string;
  duration: string;
  instruction?: string;
}