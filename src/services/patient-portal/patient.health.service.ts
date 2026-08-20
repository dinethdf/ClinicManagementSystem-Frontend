'use server'

import type { 
  PrescriptionDTO, 
  LabReportDTO, 
  DiagnosisDTO, 
  PatientAllergy, 
  PatientCondition 
} from '@/types/patient-portal/patient.health.types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- MOCK DATA ---

export async function getHealthProfile() {
  await delay(500);
  
return {
    allergies: [
      { id: 1, substance: "Penicillin", severity: 'CRITICAL', reaction: "Anaphylaxis" },
      { id: 2, substance: "Peanuts", severity: 'MODERATE', reaction: "Hives" }
    ] as PatientAllergy[],
    conditions: [
      { id: 1, name: "Type 2 Diabetes", diagnosedDate: "2023-05-10", status: 'CHRONIC' },
      { id: 2, name: "Hypertension", diagnosedDate: "2024-01-15", status: 'CHRONIC' }
    ] as PatientCondition[],
    diagnoses: [
      { id: 101, condition: "Acute Bronchitis", doctorName: "Dr. Sarah Perera", date: "2025-11-20", notes: "Prescribed antibiotics." },
      { id: 102, condition: "Viral Fever", doctorName: "Dr. Kamal Gunawardena", date: "2025-08-10" }
    ] as DiagnosisDTO[]
  };
}

export async function getPrescriptions() {
  await delay(800);
  
return [
    {
      id: 501,
      doctorName: "Dr. Sarah Perera",
      date: new Date().toISOString(), // Today (Active)
      notes: "Take after meals",
      items: [
        { medicineName: "Amoxicillin 500mg", dosage: "1 Tablet", frequency: "1-0-1", duration: 5, startDate: new Date().toISOString() },
        { medicineName: "Panadol", dosage: "2 Tablets", frequency: "1-1-1", duration: 3, startDate: new Date().toISOString() }
      ]
    },
    {
      id: 402,
      doctorName: "Dr. Amal Silva",
      date: "2025-10-01", // Past
      notes: "Apply ointment twice daily",
      items: [
        { medicineName: "Betnovate Cream", dosage: "Apply thin layer", frequency: "0-0-2", duration: 7, startDate: "2025-10-01" }
      ]
    }
  ] as PrescriptionDTO[];
}

export async function getLabReports() {
  await delay(600);
  
return [
    { 
      id: 901, testName: "Full Blood Count (FBC)", testCode: "LAB-001", 
      doctorName: "Dr. Sarah Perera", requestDate: "2025-12-28", completedDate: "2025-12-29",
      status: 'COMPLETED', reportUrl: '/mock-report.pdf' 
    },
    { 
      id: 902, testName: "Lipid Profile", testCode: "LAB-005", 
      doctorName: "Dr. Kamal Gunawardena", requestDate: new Date().toISOString(), 
      status: 'SAMPLE_COLLECTED' 
    },
    { 
        id: 903, testName: "Fasting Blood Sugar", testCode: "LAB-002", 
        doctorName: "Dr. Kamal Gunawardena", requestDate: new Date().toISOString(), 
        status: 'PENDING' 
      }
  ] as LabReportDTO[];
}