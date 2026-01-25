// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { Patient } from '@/types/patient.types'

// Component Imports
import PatientDetailsHeader from './PatientDetailsHeader'
import PatientLeftOverview from './patient-left-overview'
import PatientRight from './patient-right'

const OverViewTab = dynamic(() => import('@views/clinic-app/patient/details/patient-right/overview'))
const SecurityTab = dynamic(() => import('@views/clinic-app/patient/details/patient-right/security'))
const Analysis = dynamic(() => import('@/views/clinic-app/patient/details/patient-right/analysis'))

// const InsuranceOverview = dynamic(
//   () => import('@views/clinic-app/patient/details/patient-right/address-billing/PaymentMethodCard')
// )

const PatientIdTab = dynamic(() => import('@views/clinic-app/patient/details/patient-right/patient-card/PatientIdTab'))

const CustomerDetails = ({ patientData }: { patientData: Patient }) => {
  // Vars
  const tabContentList = (): { [key: string]: ReactElement } => ({
    overview: <OverViewTab patientId={patientData.id} />,
    security: <SecurityTab patientId={patientData.id}/>,
    // insurance: <InsuranceOverview />,
    analysis: <Analysis patientId={Number(patientData?.id) || 0} />,
    identity: <PatientIdTab patientData={patientData} />
  })

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PatientDetailsHeader 
            patientId={patientData.id || ''}
            firstName={patientData.firstName} 
            lastName={patientData.lastName} 
            patientNo={patientData.patientNo || ''}
            registrationDate={patientData.registrationDate}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 3.5 }}>
        <PatientLeftOverview patientData={patientData} />
      </Grid>
      <Grid size={{ xs: 12, md: 8.5 }}>
        <PatientRight tabContentList={tabContentList()} />
      </Grid>
    </Grid>
  )
}

export default CustomerDetails