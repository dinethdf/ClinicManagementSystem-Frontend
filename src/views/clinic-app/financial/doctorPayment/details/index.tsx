// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { FinancialScheduleItem } from '@/types/financial.types'

// Component Imports
import FinancialDoctorHeader from './FinancialDoctorHeader'
import FinancialDoctorDetailsCard from './FinancialDoctorDetailsCard'
import FinancialSummaryCards from './FinancialSummaryCards' // Renamed component

const SchedulePaymentDetails = ({ data, scheduleId }: { data: FinancialScheduleItem[]; scheduleId: string }) => {
  return (
    <Grid container spacing={6}>
      
      {/* 1. Header Section */}
      <Grid size={{ xs: 12 }}>
        <FinancialDoctorHeader 
          scheduleId={scheduleId} 
          itemCount={data.length} 
          paymentDueDate={data[0]?.paymentDueDate || null}
        />
      </Grid>

      {/* 2. NEW: High-Level Summary Cards at the TOP */}
      <Grid size={{ xs: 12 }}>
        <FinancialSummaryCards data={data} />
      </Grid>

      {/* 3. Detailed Table Section */}
      <Grid size={{ xs: 12 }}>
         <FinancialDoctorDetailsCard data={data} />
      </Grid>

    </Grid>
  )
}

export default SchedulePaymentDetails