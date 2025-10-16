// import type { Prescription } from "@/lib/types/patient.types"

// // Mock medicine database for autocomplete
// export const MOCK_MEDICINES = [
//   { id: "MED-001", name: "Paracetamol 500mg", genericName: "Paracetamol", commonDosage: "500mg" },
//   { id: "MED-002", name: "Amoxicillin 250mg", genericName: "Amoxicillin", commonDosage: "250mg" },
//   { id: "MED-003", name: "Amoxicillin 500mg", genericName: "Amoxicillin", commonDosage: "500mg" },
//   { id: "MED-004", name: "Amlodipine 5mg", genericName: "Amlodipine", commonDosage: "5mg" },
//   { id: "MED-005", name: "Amlodipine 10mg", genericName: "Amlodipine", commonDosage: "10mg" },
//   { id: "MED-006", name: "Metformin 500mg", genericName: "Metformin", commonDosage: "500mg" },
//   { id: "MED-007", name: "Metformin 850mg", genericName: "Metformin", commonDosage: "850mg" },
//   { id: "MED-008", name: "Omeprazole 20mg", genericName: "Omeprazole", commonDosage: "20mg" },
//   { id: "MED-009", name: "Salbutamol Inhaler", genericName: "Salbutamol", commonDosage: "100mcg" },
//   { id: "MED-010", name: "Atorvastatin 10mg", genericName: "Atorvastatin", commonDosage: "10mg" },
//   { id: "MED-011", name: "Atorvastatin 20mg", genericName: "Atorvastatin", commonDosage: "20mg" },
//   { id: "MED-012", name: "Losartan 50mg", genericName: "Losartan", commonDosage: "50mg" },
//   { id: "MED-013", name: "Cetirizine 10mg", genericName: "Cetirizine", commonDosage: "10mg" },
//   { id: "MED-014", name: "Ibuprofen 400mg", genericName: "Ibuprofen", commonDosage: "400mg" },
//   { id: "MED-015", name: "Aspirin 75mg", genericName: "Aspirin", commonDosage: "75mg" },
// ]

// const MOCK_PRESCRIPTIONS: Prescription[] = [
//   {
//     id: "RX-001",
//     patientId: "PAT-001",
//     patientName: "Kasun Bandara",
//     doctorId: "2",
//     doctorName: "Dr. Kumari Silva",
//     createdAt: "2025-03-25T10:30:00Z",
//     status: "fulfilled",
//     items: [
//       {
//         id: "RXI-001",
//         medicineName: "Amlodipine 5mg",
//         dosage: "5mg",
//         quantity: 30,
//         duration: "30 days",
//         instructions: "Once daily, morning",
//         fulfilled: true,
//       },
//     ],
//     notes: "Monitor blood pressure weekly",
//   },
//   {
//     id: "RX-002",
//     patientId: "PAT-002",
//     patientName: "Nimali Fernando",
//     doctorId: "2",
//     doctorName: "Dr. Kumari Silva",
//     createdAt: "2025-03-26T14:15:00Z",
//     status: "pending",
//     items: [
//       {
//         id: "RXI-002",
//         medicineName: "Metformin 500mg",
//         dosage: "500mg",
//         quantity: 60,
//         duration: "30 days",
//         instructions: "Twice daily, after meals",
//         fulfilled: false,
//       },
//       {
//         id: "RXI-003",
//         medicineName: "Atorvastatin 10mg",
//         dosage: "10mg",
//         quantity: 30,
//         duration: "30 days",
//         instructions: "Once daily, at night",
//         fulfilled: false,
//       },
//     ],
//     notes: "Follow up in 2 weeks for blood sugar check",
//   },
// ]

// class PrescriptionService {
//   private prescriptions: Prescription[] = [...MOCK_PRESCRIPTIONS]

//   async getAllPrescriptions(): Promise<Prescription[]> {
//     await new Promise((resolve) => setTimeout(resolve, 500))
//     return [...this.prescriptions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//   }

//   async getPrescriptionsByDoctor(doctorId: string): Promise<Prescription[]> {
//     await new Promise((resolve) => setTimeout(resolve, 400))
//     return this.prescriptions
//       .filter((p) => p.doctorId === doctorId)
//       .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//   }

//   async getPrescriptionById(id: string): Promise<Prescription | null> {
//     await new Promise((resolve) => setTimeout(resolve, 300))
//     return this.prescriptions.find((p) => p.id === id) || null
//   }

//   async createPrescription(prescriptionData: Omit<Prescription, "id" | "createdAt" | "status">): Promise<Prescription> {
//     await new Promise((resolve) => setTimeout(resolve, 800))

//     const newPrescription: Prescription = {
//       ...prescriptionData,
//       id: `RX-${String(this.prescriptions.length + 1).padStart(3, "0")}`,
//       createdAt: new Date().toISOString(),
//       status: "pending",
//       items: prescriptionData.items.map((item, index) => ({
//         ...item,
//         id: `RXI-${String(this.prescriptions.length + 1).padStart(3, "0")}-${index + 1}`,
//         fulfilled: false,
//       })),
//     }

//     this.prescriptions.unshift(newPrescription)
//     return newPrescription
//   }

//   async searchMedicines(query: string): Promise<typeof MOCK_MEDICINES> {
//     await new Promise((resolve) => setTimeout(resolve, 200))
//     const lowerQuery = query.toLowerCase()
//     return MOCK_MEDICINES.filter(
//       (m) => m.name.toLowerCase().includes(lowerQuery) || m.genericName.toLowerCase().includes(lowerQuery),
//     )
//   }

//   async updatePrescriptionStatus(id: string, status: Prescription["status"]): Promise<Prescription> {
//     await new Promise((resolve) => setTimeout(resolve, 400))

//     const index = this.prescriptions.findIndex((p) => p.id === id)
//     if (index === -1) {
//       throw new Error("Prescription not found")
//     }

//     this.prescriptions[index] = {
//       ...this.prescriptions[index],
//       status,
//     }

//     return this.prescriptions[index]
//   }
// }

// export const prescriptionService = new PrescriptionService()
