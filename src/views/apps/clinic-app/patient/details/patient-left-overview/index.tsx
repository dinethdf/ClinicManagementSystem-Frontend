// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { Patient } from '@/types/patient.types'

// Component Imports
import PatientDetailsSection from './PatientDetailsSection'

const CustomerLeftOverview = ({ patientData }: { patientData?: Patient }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PatientDetailsSection patientData={patientData} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        {/* <PatientPlan /> */}
      </Grid>
    </Grid>
  )
}

export default CustomerLeftOverview
