
// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import SheduleHeader from '@/views/apps/clinic-app/appoinmentShedule/add/SheduleHeader'
import SheduleInformation from '@/views/apps/clinic-app/appoinmentShedule/add/SheduleInformation'

const DoctorAppointment = () => {



  return (

  
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <SheduleHeader />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <SheduleInformation />
          </Grid>
        </Grid>

  )
}

export default DoctorAppointment