// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { Patient } from '@/libs/types/patient.types'

// Component Imports
import CustomerDetailsHeader from './PatientDetailsHeader'
import CustomerLeftOverview from './patient-left-overview'
import CustomerRight from './patient-right'

const OverViewTab = dynamic(() => import('@views/apps/ecommerce/customers/details/customer-right/overview'))
const SecurityTab = dynamic(() => import('@views/apps/ecommerce/customers/details/customer-right/security'))
const NotificationsTab = dynamic(() => import('@views/apps/ecommerce/customers/details/customer-right/notification'))

const AddressBillingTab = dynamic(
  () => import('@views/apps/ecommerce/customers/details/customer-right/address-billing')
)

const CustomerDetails = ({ patientData }: { patientData: Patient }) => {
  // Vars
  const tabContentList = (): { [key: string]: ReactElement } => ({
    overview: <OverViewTab patientDataNo={patientData.id} />,
    security: <SecurityTab />,
    addressBilling: <AddressBillingTab />,
    notifications: <NotificationsTab />
  })

  const patientRegDate = patientData?.registrationDate
    ? new Date(patientData.registrationDate).toISOString().split('T')[0]
    : 'Not Found'

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CustomerDetailsHeader patientNo={patientData?.patientNo || 'error'} patientRegDate={patientRegDate} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomerLeftOverview patientData={patientData} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <CustomerRight tabContentList={tabContentList()} />
      </Grid>
    </Grid>
  )
}

export default CustomerDetails
