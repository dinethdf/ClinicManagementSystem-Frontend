import axios from 'axios'
 
import type { PrescriptionConfigDTO, MedicineDTO } from '@/types/prescription.types'

// --- MOCK CONFIG DATA (Dropdowns) ---
const MOCK_CONFIG: PrescriptionConfigDTO = {
  categories: [
    'TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM', 'OINTMENT', 
    'DROPS', 'INHALER', 'SOLUTION', 'SUSPENSION', 'GEL', 'POWDER', 'SUPPOSITORY',
    'ORAL SUSPENSION', 'EYE DROPS', 'EAR DROPS'
  ],
  units: [
    'mg', 'g', 'ml', 'mcg', 'IU', 'tablet(s)', 'capsule(s)', 
    'puff(s)', 'drop(s)', 'teaspoon(s)', 'sachet(s)', 'application(s)', 'vial'
  ],
  frequencies: [
    '1-0-1 (Morning/Night)', 
    '1-1-1 (Morning/Noon/Night)', 
    '1-0-0 (Morning only)', 
    '0-0-1 (Night only)', 
    '0-1-0 (Noon only)',
    '1-1-1-1 (Every 6 hours)',
    'SOS (As needed)',
    'Stat (Immediately)',
    'Once a week',
    'Before Meals',
    'After Meals'
  ]
}

class PrescriptionService {

  // --- 1. GET CONFIG (Dropdowns) ---
  async getPrescriptionConfig(): Promise<PrescriptionConfigDTO | null> {
    // Return mock data instantly
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_CONFIG), 100) 
    })
  }

  // --- 2. SEARCH MEDICINES (Calls Next.js Internal API) ---
  async searchMedicines(query: string, category: string = ''): Promise<MedicineDTO[]> {
    // Optimization: Don't call API if query is too short
    if (!query || query.length < 4) return [];

    try {
      // WE DO NOT USE 'apiClient' HERE.
      // We use standard axios to call the internal Next.js route.
      const response = await axios.get<{ success: boolean; data: MedicineDTO[] }>(
        '/api/medicines/search', 
        {
          params: { query, category },
          headers: {
             // Security Check
             'x-internal-request': process.env.NEXT_PUBLIC_API_SECRET || 'default-secret'
          }
        }
      )

      
return response.data.data || []
    } catch (error) {
      console.error('Failed to search medicines:', error)
      
return []
    }
  }
}

export const prescriptionService = new PrescriptionService()