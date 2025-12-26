import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getCachedMedicines, RawMedicine } from '@/services/medicine-data';

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const category = searchParams.get('category');

    // Security Check
    const secretHeader = headersList.get('x-internal-request');
    if (secretHeader !== process.env.NEXT_PUBLIC_API_SECRET) {
         // console.warn("Unauthorized API access attempt");
         // You can uncomment the return below to enforce security strictness
         // return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Input Validation
    if (!query || query.length < 3) { 
        return NextResponse.json({ success: true, data: [] });
    }

    // Load Data (From RAM now - no size limit error)
    const allMedicines = await getCachedMedicines();
    
    // Safety check: Ensure data loaded correctly
    if (!allMedicines || allMedicines.length === 0) {
        return NextResponse.json({ success: true, data: [] });
    }

    const lowerQuery = query.toLowerCase().trim();
    const lowerCategory = category?.toLowerCase().trim();

    // Filter Logic
    const filtered = allMedicines.filter((med: RawMedicine) => {
      // Safety checks for missing fields in bad JSON data
      const brand = med.BRAND ? med.BRAND : "";
      const generic = med["GENERIC NAME"] ? med["GENERIC NAME"] : "";
      const dosage = med.DOSAGE ? med.DOSAGE : "";

      // Handle "***" brands
      const brandName = brand === "***" ? "" : brand;

      // 1. Search Match
      const matchesSearch = 
          brandName.toLowerCase().includes(lowerQuery) ||
          generic.toLowerCase().includes(lowerQuery);

      // 2. Category Match
      let matchesCategory = true;
      if (lowerCategory) {
          matchesCategory = dosage.toLowerCase().includes(lowerCategory);
      }

      return matchesSearch && matchesCategory;
    });

    // Transform to DTO
    const mappedResults = filtered.slice(0, 50).map((med) => {
      const isGenericOnly = med.BRAND === "***";
      const genericName = med["GENERIC NAME"] ? med["GENERIC NAME"].trim() : "Unknown Generic";
      const brandName = med.BRAND ? med.BRAND.trim() : "";
      
      return {
        id: med["REG.NO."] || Math.random().toString(),
        name: isGenericOnly ? genericName : `${genericName} (${brandName})`,
        genericName: genericName,
        category: med.DOSAGE ? med.DOSAGE.trim() : "", 
        packSize: med["PACK SIZE"] || ''
      };
    });

    return NextResponse.json({ success: true, data: mappedResults });

  } catch (error) {
    console.error("API SEARCH ERROR:", error);
    // CRITICAL: Return empty array instead of crashing the UI
    return NextResponse.json({ success: false, data: [] }, { status: 200 });
  }
}