// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

import { requireUser } from '@/libs/auth-guard';

import { ROLES } from '@/constants/roles';

import AddDoctor from '@/views/clinic-app/doctors/addDoctor'

const AccountTab = dynamic(() => import('@views/clinic-app/doctors/addDoctor/account'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  account: <AccountTab />
})

const DoctorRegisterPage = async () => {

await  requireUser([ROLES.ADMIN]);
  
return <AddDoctor tabContentList={tabContentList()} />
}

export default DoctorRegisterPage
