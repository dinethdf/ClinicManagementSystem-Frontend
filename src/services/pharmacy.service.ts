// import type { Medicine } from "@/lib/types/pharmacy.types"

// // Mock pharmacy inventory
// const MOCK_INVENTORY: Medicine[] = [
//   {
//     id: "MED-001",
//     name: "Paracetamol 500mg",
//     genericName: "Paracetamol",
//     manufacturer: "GSK",
//     category: "Analgesics",
//     stockQuantity: 500,
//     reorderLevel: 100,
//     unitPrice: 2.5,
//     batchNumber: "BATCH-2025-001",
//     expiryDate: "2026-12-31",
//     createdAt: "2025-01-01T00:00:00Z",
//     updatedAt: "2025-03-20T10:00:00Z",
//   },
//   {
//     id: "MED-002",
//     name: "Amoxicillin 250mg",
//     genericName: "Amoxicillin",
//     manufacturer: "Pfizer",
//     category: "Antibiotics",
//     stockQuantity: 45,
//     reorderLevel: 50,
//     unitPrice: 15.0,
//     batchNumber: "BATCH-2025-002",
//     expiryDate: "2026-06-30",
//     createdAt: "2025-01-01T00:00:00Z",
//     updatedAt: "2025-03-20T10:00:00Z",
//   },
//   {
//     id: "MED-003",
//     name: "Amoxicillin 500mg",
//     genericName: "Amoxicillin",
//     manufacturer: "Pfizer",
//     category: "Antibiotics",
//     stockQuantity: 120,
//     reorderLevel: 50,
//     unitPrice: 25.0,
//     batchNumber: "BATCH-2025-003",
//     expiryDate: "2026-06-30",
//     createdAt: "2025-01-01T00:00:00Z",
//     updatedAt: "2025-03-20T10:00:00Z",
//   },
//   {
//     id: "MED-004",
//     name: "Amlodipine 5mg",
//     genericName: "Amlodipine",
//     manufacturer: "Novartis",
//     category: "Cardiovascular",
//     stockQuantity: 200,
//     reorderLevel: 80,
//     unitPrice: 8.5,
//     batchNumber: "BATCH-2025-004",
//     expiryDate: "2027-03-31",
//     createdAt: "2025-01-01T00:00:00Z",
//     updatedAt: "2025-03-20T10:00:00Z",
//   },
//   {
//     id: "MED-005",
//     name: "Amlodipine 10mg",
//     genericName: "Amlodipine",
//     manufacturer: "Novartis",
//     category: "Cardiovascular",
//     stockQuantity: 150,
//     reorderLevel: 80,
//     unitPrice: 12.0,
//     batchNumber: "BATCH-2025-005",
//     expiryDate: "2027-03-31",
//     createdAt: "2025-01-01T00:00:00Z",
//     updatedAt: "2025-03-20T10:00:00Z",
//   },
//   {
//     id: "MED-006",
//     name: "Metformin 500mg",
//     genericName: "Metformin",
//     manufacturer: "Merck",
//     category: "Antidiabetic",
//     stockQuantity: 300,
//     reorderLevel: 100,
//     unitPrice: 5.0,
//     batchNumber: "BATCH-2025-006",
//     expiryDate: "2026-09-30",
//     createdAt: "2025-01-01T00:00:00Z",
//     updatedAt: "2025-03-20T10:00:00Z",
//   },
//   {
//     id: "MED-007",
//     name: "Metformin 850mg",
//     genericName: "Metformin",
//     manufacturer: "Merck",
//     category: "Antidiabetic",
//     stockQuantity: 25,
//     reorderLevel: 100,
//     unitPrice: 7.5,
//     batchNumber: "BATCH-2025-007",
//     expiryDate: "2026-09-30",
//     createdAt: "2025-01-01T00:00:00Z",
//     updatedAt: "2025-03-20T10:00:00Z",
//   },
//   {
//     id: "MED-008",
//     name: "Omeprazole 20mg",
//     genericName: "Omeprazole",
//     manufacturer: "AstraZeneca",
//     category: "Gastrointestinal",
//     stockQuantity: 180,
//     reorderLevel: 60,
//     unitPrice: 6.0,
//     batchNumber: "BATCH-2025-008",
//     expiryDate: "2026-11-30",
//     createdAt: "2025-01-01T00:00:00Z",
//     updatedAt: "2025-03-20T10:00:00Z",
//   },
// ]

// class PharmacyService {
//   private inventory: Medicine[] = [...MOCK_INVENTORY]

//   async getInventory(): Promise<Medicine[]> {
//     await new Promise((resolve) => setTimeout(resolve, 500))
//     return [...this.inventory].sort((a, b) => a.name.localeCompare(b.name))
//   }

//   async getLowStockMedicines(): Promise<Medicine[]> {
//     await new Promise((resolve) => setTimeout(resolve, 400))
//     return this.inventory.filter((m) => m.stockQuantity <= m.reorderLevel)
//   }

//   async getMedicineById(id: string): Promise<Medicine | null> {
//     await new Promise((resolve) => setTimeout(resolve, 300))
//     return this.inventory.find((m) => m.id === id) || null
//   }

//   async checkStockAvailability(medicineName: string, quantity: number): Promise<boolean> {
//     await new Promise((resolve) => setTimeout(resolve, 200))
//     const medicine = this.inventory.find((m) => m.name === medicineName)
//     return medicine ? medicine.stockQuantity >= quantity : false
//   }

//   async dispenseMedicine(medicineName: string, quantity: number): Promise<void> {
//     await new Promise((resolve) => setTimeout(resolve, 400))
//     const medicine = this.inventory.find((m) => m.name === medicineName)
//     if (medicine && medicine.stockQuantity >= quantity) {
//       medicine.stockQuantity -= quantity
//       medicine.updatedAt = new Date().toISOString()
//     } else {
//       throw new Error(`Insufficient stock for ${medicineName}`)
//     }
//   }

//   async updateStock(id: string, quantity: number): Promise<Medicine> {
//     await new Promise((resolve) => setTimeout(resolve, 400))
//     const index = this.inventory.findIndex((m) => m.id === id)
//     if (index === -1) {
//       throw new Error("Medicine not found")
//     }

//     this.inventory[index] = {
//       ...this.inventory[index],
//       stockQuantity: quantity,
//       updatedAt: new Date().toISOString(),
//     }

//     return this.inventory[index]
//   }

//   async addMedicine(medicineData: Omit<Medicine, "id" | "createdAt" | "updatedAt">): Promise<Medicine> {
//     await new Promise((resolve) => setTimeout(resolve, 600))

//     const newMedicine: Medicine = {
//       ...medicineData,
//       id: `MED-${String(this.inventory.length + 1).padStart(3, "0")}`,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }

//     this.inventory.push(newMedicine)
//     return newMedicine
//   }
// }

// export const pharmacyService = new PharmacyService()
