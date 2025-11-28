// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { AppointmentDetailDTO } from '@/types/appoinments.types'

// Component Imports
import AppointmentLeftOverview from './AppointmentLeftOverview'
import AppointmentRight from './AppointmentRight'

const AppointmentDetails = ({ appointmentData }: { appointmentData: AppointmentDetailDTO }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 4 }}>
        <AppointmentLeftOverview appointmentData={appointmentData} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <AppointmentRight appointmentData={appointmentData} />
      </Grid>
    </Grid>
  )
}

export default AppointmentDetails