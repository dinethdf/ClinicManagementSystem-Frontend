// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { ProfileTabType } from '@/types/pages/profileTypes'

// Component Imports
import AboutOverview from './AboutOverview'
import ActivityTimeline from './ActivityTimeline'
import ConnectionsTeams from './ConnectionsTeams'
import ProjectsTable from './ProjectsTables'

const ProfileTab = ({ data }: { data?: ProfileTabType }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 4, lg: 3.5 }}>
        <AboutOverview data={data} />
      </Grid>
      <Grid size={{ xs: 12, md: 8, lg: 8.5 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <ActivityTimeline />
          </Grid>
          <ConnectionsTeams connections={data?.connections} teamsTech={data?.teamsTech} />
          <Grid size={{ xs: 12 }}>
            <ProjectsTable projectTable={data?.projectTable} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProfileTab
