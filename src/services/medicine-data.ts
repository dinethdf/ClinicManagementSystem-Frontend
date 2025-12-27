import { promises as fs } from 'fs';
import path from 'path';

// Matches your JSON keys exactly
export interface RawMedicine {
  "GENERIC NAME": string;
  "BRAND": string;
  "DOSAGE": string;
  "PACK SIZE": string;
  "PACK TYPE": string;
  "MANUFACTURE": string;
  "COUNTRY": string;
  "AGENT": string;
  "REG.DATE": string;
  "REG.NO.": string;
  "SCHEDULE": string;
  "VALIDATION": string;
  "DOSSIER NO.": string;
}

const jsonDirectory = path.join(process.cwd(), 'src', 'data');
const filePath = path.join(jsonDirectory, 'medicines.json');

// --- IN-MEMORY CACHE ---
// This variable lives in the server's RAM. 
// It has NO 2MB limit.
let cachedData: RawMedicine[] | null = null;

export async function getCachedMedicines(): Promise<RawMedicine[]> {
  // 1. Return from RAM if already loaded (Instant)
  if (cachedData) {
    return cachedData;
  }

  // 2. If empty, read from disk and save to RAM
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    cachedData = JSON.parse(fileContents);
    return cachedData || [];
  } catch (error) {
    console.error("CRITICAL ERROR: Could not read medicines.json", error);
    return []; // Return empty array so app doesn't crash
  }
}