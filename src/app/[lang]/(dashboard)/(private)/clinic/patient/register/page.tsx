// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@views/apps/clinic-app/user/addUser'

const AccountTab = dynamic(() => import('@views/apps/clinic-app/patient/addPatient/account'))
const SecurityTab = dynamic(() => import('@views/apps/clinic-app/patient/addPatient/security'))
const BillingPlansTab = dynamic(() => import('@views/apps/clinic-app/patient/addPatient/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/apps/clinic-app/patient/addPatient/notifications'))
const ConnectionsTab = dynamic(() => import('@views/apps/clinic-app/patient/addPatient/connections'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  account: <AccountTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlansTab />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const AccountSettingsPage = () => {
  return <AccountSettings tabContentList={tabContentList()} />
}

export default AccountSettingsPage
