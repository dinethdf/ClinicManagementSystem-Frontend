export interface PatientAllergy {
  id: number;
  substance: string;
  severity: 'MILD' | 'MODERATE' | 'CRITICAL';
  reaction: string;
}

export interface PatientCondition {
  id: number;
  name: string;
  diagnosedDate: string;
  status: 'CHRONIC' | 'ACUTE' | 'RECOVERED';
}

export interface PrescriptionDTO {
  id: number;
  doctorName: string;
  date: string;
  notes: string;
  items: MedicationItem[];
}

export interface MedicationItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: number; // days
  startDate: string; // ISO Date
}

export interface LabReportDTO {
  id: number;
  testName: string;
  testCode: string;
  doctorName: string;
  requestDate: string;
  completedDate?: string;
  status: 'PENDING' | 'SAMPLE_COLLECTED' | 'COMPLETED';
  reportUrl?: string;
}

export interface DiagnosisDTO {
  id: number;
  condition: string;
  doctorName: string;
  date: string;
  notes?: string;
}