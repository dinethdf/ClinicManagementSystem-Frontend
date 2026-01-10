import { redirect } from 'next/navigation'

import { verifyToken } from '@/libs/verifyToken'

export async function proxy() {


  const user = await verifyToken()
  const { role, userName, sub } = user.payload      

  console.log("doctor proxy run ", role)
  if (!role) redirect('/login')

  if (role !== 'DOCTOR') {
    redirect('/unauthorized')
  }
}
