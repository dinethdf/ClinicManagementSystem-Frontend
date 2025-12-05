// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import DoctorScheduleListTable from './DoctorScheduleListTable'

const DoctorOverview = ({ doctorId }: { doctorId: string }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <DoctorScheduleListTable doctorId={doctorId} />
      </Grid>
    </Grid>
  )
}

export default DoctorOverview
