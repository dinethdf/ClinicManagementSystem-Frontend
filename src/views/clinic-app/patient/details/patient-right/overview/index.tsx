// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CustomerStatisticsCard from './CustomerStatisticsCard'
import PatientAppoinmentsListTable from './PatientAppoinments'

import ActivityTimeline from './ActivityTimeline'



const Overview = async ({ patientId }: { patientId?: string }) => {
  // Vars
  const constodata = {
  
    customerStats: [
    {
      color: 'success',
      avatarIcon: 'tabler-gift',
      title: 'Total Appoinment',
      stats: '-',
     
    },
    {
      color: 'warning',
      avatarIcon: 'tabler-star',
      title: 'Follow Up',
      stats: 'Next',
      content: '-',

      // description: 'Antihistamine'
    },
  ],
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PatientAppoinmentsListTable patientId = {patientId ? patientId : "0"} />
      </Grid>
      {/* <Grid size={{ xs: 12 }}>
        <CustomerStatisticsCard customerStatData={constodata.customerStats} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ActivityTimeline/>
      </Grid> */}
    </Grid>
  )
}

export default Overview
