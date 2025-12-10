'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { ScheduleListTypes } from '@/types/doctor.types'

// Component Imports
import HeaderListCard from './HeaderListCard' // You can use your existing one or a new one
import ScheduleListTable from './ScheduleListTable'

const ScheduleList = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <HeaderListCard /> 
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ScheduleListTable />
      </Grid>
    </Grid>
  )
}

export default ScheduleList
