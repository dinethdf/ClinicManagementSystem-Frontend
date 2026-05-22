'use server'

import type { PatientInvoiceDTO, PatientInsuranceDTO, BillingSummaryDTO } from '@/types/patient-portal/patient.billing.types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- MOCK DATA ---

export async function getBillingSummary() {
  await delay(500);
  
return {
    totalPaid: 45000.00,
    totalPending: 3500.00, // Simulating an outstanding amount to trigger alerts
    lastPaymentDate: "2025-12-20"
  } as BillingSummaryDTO;
}

export async function getInvoices() {
  await delay(800);
  
return [
    {
      id: 101, invoiceNo: "INV-2026-001", date: "2026-01-02",
      serviceType: 'Consultation', description: "Consultation with Dr. Kamal Gunawardena",
      amount: 1500.00, status: 'PENDING'
    },
    {
      id: 102, invoiceNo: "INV-2026-002", date: "2026-01-02",
      serviceType: 'Lab Test', description: "Full Blood Count (FBC)",
      amount: 2000.00, status: 'PENDING'
    },
    {
      id: 99, invoiceNo: "INV-2025-890", date: "2025-12-20",
      serviceType: 'Pharmacy', description: "Prescription Medications",
      amount: 4500.00, status: 'PAID', paymentMethod: 'CARD', downloadUrl: '#'
    },
    {
      id: 98, invoiceNo: "INV-2025-800", date: "2025-11-15",
      serviceType: 'Consultation', description: "Consultation with Dr. Sarah Perera",
      amount: 2500.00, status: 'REFUNDED', paymentMethod: 'ONLINE'
    }
  ] as PatientInvoiceDTO[];
}

export async function getInsuranceDetails() {
  await delay(600);
  
return {
    providerName: "Allianz Insurance",
    policyNumber: "P-99887766",
    holderName: "Isuru Abeywickrama",
    expiryDate: "2026-12-31",
    status: 'ACTIVE'
  } as PatientInsuranceDTO;
}

export async function updateInsuranceDetails(data: PatientInsuranceDTO) {
    await delay(1000);

    // In a real app, this would be a POST/PUT request
    return { success: true, message: "Insurance details updated successfully." };
}