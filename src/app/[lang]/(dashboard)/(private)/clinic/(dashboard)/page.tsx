// MUI Imports
import Grid from '@mui/material/Grid2'

// Next Navigation for redirection if token is invalid
import { redirect } from 'next/navigation'

// Components Imports
import DashboardHeader from '@/views/apps/clinic-app/dashboard/DashboardHeader'
import StatisticsAdminAnalysisCard from '@/views/apps/clinic-app/dashboard/StatisticsAdminAnalysisCard'
import LineChartProfit from '@views/apps/clinic-app/dashboard/LineChartProfit'
import RadialBarChart from '@views/apps/clinic-app/dashboard/RadialBarChart'
import DonutChartGeneratedLeads from '@views/apps/clinic-app/dashboard/DonutChartGeneratedLeads'
import RevenueReport from '@views/apps/clinic-app/dashboard/RevenueReport'
import EarningReports from '@views/apps/clinic-app/dashboard/EarningReports'
import PopularProducts from '@views/apps/clinic-app/dashboard/PopularProducts'
import Orders from '@views/apps/clinic-app/dashboard/Orders'
import Transactions from '@views/apps/clinic-app/dashboard/Transactions'
import InvoiceListTable from '@views/apps/clinic-app/dashboard/InvoiceListTable'
import SpecializationSummaryChart from '@/views/apps/clinic-app/dashboard/SpecializationSummaryChart'

// Data & Auth Imports
import { getInvoiceData } from '@/app/server/actions'
import { verifyToken } from '@/libs/verifyToken'

const DashboardClinics = async () => {
  const { valid, payload } = await verifyToken()
  if (!valid) {
    redirect('/login') 
  }
// console.log(payload)
  const userRole = payload?.role || 'GUEST'

  const invoiceData = await getInvoiceData()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <DashboardHeader user = {payload} />
      </Grid>

      {userRole === 'ADMIN' && (
        <>
      <Grid size={{ xs: 12, md: 12 }}>
        <StatisticsAdminAnalysisCard />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <RevenueReport />
      </Grid>      
      <Grid size={{ xs: 12, md: 4 }}>
        <SpecializationSummaryChart />
      </Grid>
      <Grid size={{ xs: 12, xl: 4 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 6, md: 3, xl: 6 }}>
            <LineChartProfit />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3, xl: 6 }}>
            <RadialBarChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6, xl: 12 }}>
            <DonutChartGeneratedLeads />
          </Grid>
        </Grid>
      </Grid>
</>)}

      {userRole === 'DOCTOR' && (
      <Grid size={{ xs: 12, lg: 12 }}>
        <InvoiceListTable invoiceData={invoiceData} />
      </Grid>
    )}
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <EarningReports />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <PopularProducts />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Orders />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Transactions />
      </Grid>
      <Grid size={{ xs: 12, lg: 8 }}>
        <InvoiceListTable invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default DashboardClinics
