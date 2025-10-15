import type { PatientDetails } from './../libs/types/patient.types';
import { cookies } from 'next/headers';

export class PatientServerSideService {

  static async getPatientById(id: string): Promise<any | null> {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("accessToken")?.value;

      const res = await fetch(`http://localhost:8080/api/patient/get-details/staff/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Failed to fetch patient:", res.status, res.statusText);
        return null;
      }

      const json = await res.json();
      return json.data as any;
    } catch (error) {
      console.error("Server-side get patient failed:", error);
      return null;
    }
  }
}
