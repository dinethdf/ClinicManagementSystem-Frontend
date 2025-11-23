// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { FinancialScheduleItem } from '@/types/financial.types'

// Component Imports
import FinancialDoctorHeader from './FinancialDoctorHeader'
import FinancialDoctorDetailsCard from './FinancialDoctorDetailsCard'
import FinancialSummaryCard from './CustomerDetailsCard'

const SchedulePaymentDetails = ({ data, scheduleId }: { data: FinancialScheduleItem[]; scheduleId: string }) => {
  return (
    <Grid container spacing={6}>
      
      {/* 1. Header Section - Full Width */}
      <Grid size={{ xs: 12 }}>
        <FinancialDoctorHeader scheduleId={scheduleId} itemCount={data.length} />
      </Grid>

      {/* 2. Table Section - Now Full Width (xs: 12) */}
      <Grid size={{ xs: 12 }}>
         <FinancialDoctorDetailsCard data={data} />
      </Grid>

      {/* 3. Summary Section - Moved to Bottom & Full Width */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={6}>
           {/* You can adjust the size here if you want the summary card to be smaller, e.g., md: 4, but keeping it inside a full row */}
           <Grid size={{ xs: 12, md: 4 }}>
             <FinancialSummaryCard data={data} />
           </Grid>
           {/* If you have other bottom cards, add them here */}
        </Grid>
      </Grid>

    </Grid>
  )
}

export default SchedulePaymentDetails