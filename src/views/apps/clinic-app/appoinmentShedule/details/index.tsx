
// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { DoctorScheduleDTO } from '@/types/doctor.types'

// Component Imports
import ScheduleDetailsSection from './ScheduleDetailsSection'
import ScheduleAppointmentListTable from './ScheduleAppointmentListTable'

const ScheduleDetails = ({ scheduleData }: { scheduleData: DoctorScheduleDTO }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <ScheduleDetailsSection scheduleData={scheduleData} />
      </Grid>

      {/* Right Side: Appointment List */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
         <ScheduleAppointmentListTable scheduleId={Number(scheduleData.id)} />
      </Grid>
    </Grid>
  )
}

export default ScheduleDetails