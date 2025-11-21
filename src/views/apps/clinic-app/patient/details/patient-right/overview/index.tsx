// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomerStatisticsCard from './CustomerStatisticsCard'
import PatientAppoinmentsListTable from './PatientAppoinments'

// Data Imports
import { getStatisticsData, getEcommerceData } from '@/app/server/actions'
import ActivityTimeline from './ActivityTimeline'

/* const getStatisticsData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/pages/widget-examples`)

  if (!res.ok) {
    throw new Error('Failed to fetch statistics data')
  }

  return res.json()
} */


/* const getEcommerceData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/ecommerce`)

  if (!res.ok) {
    throw new Error('Failed to fetch ecommerce data')
  }

  return res.json()
} */

const Overview = async ({ patientId }: { patientId?: string }) => {
  // Vars
  const data = await getStatisticsData()
  const constodata = {
    customerStats: [
    {
      color: 'success',
      avatarIcon: 'tabler-gift',
      title: 'Total Appoinment',
      stats: '15',
     
    },
    {
      color: 'warning',
      avatarIcon: 'tabler-star',
      title: 'Follow Up',
      stats: 'Next',
      content: '19 June, 2024 - 11:00 AM',
      // description: 'Antihistamine'
    },
  ],
  }
  const tableData = await getEcommerceData()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CustomerStatisticsCard customerStatData={constodata.customerStats} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ActivityTimeline/>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <PatientAppoinmentsListTable patientId = {patientId ? patientId : "0"} />
      </Grid>
    </Grid>
  )
}

export default Overview
