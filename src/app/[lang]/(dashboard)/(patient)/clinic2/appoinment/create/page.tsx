// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import AppoinmentAddHeader from '@/views/clinic-app/appoinment/add/AppoinmentAddHeader'
import AppoinmentInformation from '@views/clinic-app/appoinment/add/AppoinmentInformation'


const appointmentCreate = () => {
  
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AppoinmentAddHeader />
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <AppoinmentInformation />
          </Grid>

        </Grid>
      </Grid>
    </Grid>
  )
}

export default appointmentCreate
