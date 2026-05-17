// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import StaffDetailsSection from './staff-left-overview/StaffDetailsSection'
import StaffRight from './staff-right'
import type { ClinicStaffResponseDTO } from '@/services/staff/staff.server.service'

const StaffDetails = ({ staffData }: { staffData: ClinicStaffResponseDTO }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <h2 className="text-2xl font-bold mb-4">Staff Dashboard</h2>
      </Grid>
      
      {/* LEFT SIDE - Profile Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <StaffDetailsSection staffData={staffData} />
      </Grid>
      
      {/* RIGHT SIDE - Tabs/Overview */}
      <Grid size={{ xs: 12, md: 8 }}>
        <StaffRight staffId={staffData.id} />
      </Grid>
    </Grid>
  )
}

export default StaffDetails