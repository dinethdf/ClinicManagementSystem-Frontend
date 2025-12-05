import Grid from '@mui/material/Grid2'
import PayoutListTable from '@/views/apps/clinic-app/payouts/list/PayoutListTable'

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