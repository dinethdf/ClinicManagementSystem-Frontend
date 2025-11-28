// MUI Imports
import Grid from '@mui/material/Grid2'


// Component Imports
import PatientDetailsSection from './DoctorDetailsSection'

const CustomerLeftOverview = ({ doctorData }: { doctorData?: any }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PatientDetailsSection doctorData={doctorData} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        {/* <PatientPlan /> */}
      </Grid>
    </Grid>
  )
}

export default CustomerLeftOverview
