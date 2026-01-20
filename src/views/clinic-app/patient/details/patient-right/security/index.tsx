// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ChangePassword from './ChangePassword'
import PatientLoginCreator from './PatientLoginCreator'

// import TwoStepVerification from './TwoStepVerification'
// import RecentDevice from './RecentDevice'

const SecurityTab = ({ patientId }: { patientId?: string }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PatientLoginCreator patientId={patientId || ""}/>
      </Grid>


      <Grid size={{ xs: 12 }}>
        <ChangePassword patientId = {patientId} />
      </Grid>



      {/* <Grid size={{ xs: 12 }}>
        <TwoStepVerification />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RecentDevice />
      </Grid> */}
    </Grid>
  )
}

export default SecurityTab
