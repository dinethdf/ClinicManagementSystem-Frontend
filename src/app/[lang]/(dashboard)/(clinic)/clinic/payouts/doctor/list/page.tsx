import Grid from '@mui/material/Grid'
import PayoutListTable from '@/views/clinic-app/payouts/list/PayoutListTable'

const PayoutsPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PayoutListTable />
      </Grid>
    </Grid>
  )
}

export default PayoutsPage
