// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

import { requireUser } from '@/libs/auth-guard';
import { ROLES } from '@/constants/roles';

// Wrapper Component
import AddStaff from '@/views/clinic-app/staff/addStaff'

// Dynamic Import for the Form Tab
const AccountTab = dynamic(() => import('@/views/clinic-app/staff/addStaff/account'))

// Tabs Configuration
const tabContentList = (): { [key: string]: ReactElement } => ({
  account: <AccountTab />
})

const StaffRegisterPage = async () => {
  // Only Admin can register staff
  await requireUser([ROLES.ADMIN]);
  
  return <AddStaff tabContentList={tabContentList()} />
}

export default StaffRegisterPage