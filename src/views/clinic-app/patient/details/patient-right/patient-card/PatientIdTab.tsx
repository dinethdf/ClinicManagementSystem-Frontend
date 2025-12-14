'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// Component Imports
import PatientIdWidget from '@/views/clinic-app/patient/details/patient-right/patient-card/PatientIdWidget'

// Type Imports
import type { Patient } from '@/types/patient.types'

const PatientIdTab = ({ patientData }: { patientData: Patient }) => {
  if (!patientData) {
    return <Alert severity="error">Patient data not found</Alert>
  }

  return (
    <Grid container spacing={6}>
      {/* FIX: Remove 'item' and change 'xs={12}' to 'size={{ xs: 12 }}' */}
      <Grid size={{ xs: 12 }}>
        <PatientIdWidget patient={patientData} />
      </Grid>
    </Grid>
  )
}

export default PatientIdTab