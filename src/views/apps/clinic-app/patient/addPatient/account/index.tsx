// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Component Imports
import AccountDetails from './AccountDetails'
import StepperCustomHorizontal from './StepperCustomHorizontal'

const Account = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AccountDetails />
      </Grid>
      {/* <Grid size={{ xs: 12 }}>
        <Typography variant='h5'>Extra Details section</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <StepperCustomHorizontal />
      </Grid> */}
    </Grid>
  )
}

export default Account
