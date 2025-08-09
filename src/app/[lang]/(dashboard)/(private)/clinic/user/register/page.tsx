// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@views/apps/clinic-app/user/addUser'

const AccountTab = dynamic(() => import('@views/apps/clinic-app/user/addUser/account'))
const SecurityTab = dynamic(() => import('@views/apps/clinic-app/user/addUser/security'))
const BillingPlansTab = dynamic(() => import('@views/apps/clinic-app/user/addUser/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/apps/clinic-app/user/addUser/notifications'))
const ConnectionsTab = dynamic(() => import('@views/apps/clinic-app/user/addUser/connections'))

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
