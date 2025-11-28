// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
// Ensure this path points to the component we just created
import ScheduleListTable from '@/views/apps/clinic-app/appoinmentShedule/list/ShedulesListTable'

const ScheduleListPage = () => {
  
  // Note: We do not fetch data here anymore. 
  // The <ScheduleListTable /> component handles its own data fetching 
  // so that it can manage Page, Size, and Filters dynamically.

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ScheduleListTable />
      </Grid>
    </Grid>
  )
}

export default ScheduleListPage