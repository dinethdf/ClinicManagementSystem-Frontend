// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import StaffAccountDetails from './StaffAccountDetails'

const Account = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <StaffAccountDetails />
      </Grid>
    </Grid>
  )
}

export default Account