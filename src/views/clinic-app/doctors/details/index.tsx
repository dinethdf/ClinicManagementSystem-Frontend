// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import DoctorDetailsSection from './doctor-left-overview/DoctorDetailsSection'
import DoctorRight from './doctor-right'

const DoctorDetails = ({ doctorData }: { doctorData: any }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        {/* You can add a Header component here similar to patient header if needed */}
        <h2 className="text-2xl font-bold mb-4">Doctor Dashboard</h2>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <DoctorDetailsSection doctorData={doctorData} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <DoctorRight doctorId={doctorData?.id} />
      </Grid>
    </Grid>
  )
}

export default DoctorDetails
