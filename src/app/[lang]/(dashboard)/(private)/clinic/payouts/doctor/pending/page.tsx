import Grid from '@mui/material/Grid'
import PayoutPendingListTable from '@/views/clinic-app/payouts/list/PayoutPendingListTable'

const PayoutsPendingPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PayoutPendingListTable />
      </Grid>
    </Grid>
  )
}

export default PayoutsPendingPage
