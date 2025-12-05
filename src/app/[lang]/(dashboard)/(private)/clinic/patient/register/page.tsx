// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@views/clinic-app/patient/addPatient'

const AccountTab = dynamic(() => import('@views/clinic-app/patient/addPatient/account'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  account: <AccountTab />
})

const AccountSettingsPage = () => {
  return <AccountSettings tabContentList={tabContentList()} />
}

export default AccountSettingsPage
