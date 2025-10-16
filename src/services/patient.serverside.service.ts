import { cookies } from 'next/headers';

import type { PatientDetails } from '@/libs/types/patient.types';

export class PatientServerSideService {

  
  static async getPatientById(id: string): Promise<Omit<PatientDetails, "id" | "patientNo"> & {id: string; patientNo: string;} | null> {

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/api/patient/get-details/staff/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to fetch patient:", res.status, res.statusText);

          return null;
        }

        const json = await res.json();
      
        return json.data;

      } catch (error) {
        console.error("Server-side get patient failed:", error);
      
        return null;
      }
  }
}
