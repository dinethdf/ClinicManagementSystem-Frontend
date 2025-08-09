// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { Customer } from '@/types/apps/ecommerceTypes'

// Component Imports
import PatientDetails from './PatientDetails'
import PatientPlan from './PatientPlan'

const CustomerLeftOverview = ({ customerData }: { customerData?: Customer }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PatientDetails customerData={customerData} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <PatientPlan />
      </Grid>
    </Grid>
  )
}

export default CustomerLeftOverview
