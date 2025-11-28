'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

import AppoinmentCard from './AppoinmentCard'
import AppoinmentListTable from './AppoinmentListTable'

const AppoinmentList = () => {

  // Removed redundant state and loadNext function.
  // The Table component now handles its own data fetching and pagination.
  
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AppoinmentCard />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <AppoinmentListTable/>
      </Grid>
    </Grid>
  )
}

export default AppoinmentList