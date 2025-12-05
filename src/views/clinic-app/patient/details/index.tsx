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
const NotificationsTab = dynamic(() => import('@views/clinic-app/patient/details/patient-right/notification'))

const InsuranceOverview = dynamic(
  () => import('@views/apps/ecommerce/customers/details/customer-right/address-billing')
)

const CustomerDetails = ({ patientData }: { patientData: Patient }) => {
  // Vars
  const tabContentList = (): { [key: string]: ReactElement } => ({
    overview: <OverViewTab patientId={patientData.id} />,
    security: <SecurityTab />,
    insurance: <InsuranceOverview />,
    notifications: <NotificationsTab />
  })

  const patientRegDate = patientData?.registrationDate
    ? new Date(patientData.registrationDate).toISOString().split('T')[0]
    : 'Not Found'

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PatientDetailsHeader patientNo={patientData?.patientNo || 'error'} patientRegDate={patientRegDate} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <PatientLeftOverview patientData={patientData} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <PatientRight tabContentList={tabContentList()} />
      </Grid>
    </Grid>
  )
}

export default CustomerDetails
