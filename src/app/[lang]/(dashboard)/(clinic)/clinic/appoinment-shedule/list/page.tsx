// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
// Ensure this path points to the component we just created
import ScheduleListTable from '@/views/clinic-app/appoinmentShedule/list/ShedulesListTable'

const ScheduleListPage = () => {
  

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ScheduleListTable />
      </Grid>
    </Grid>
  )
}

export default ScheduleListPage
