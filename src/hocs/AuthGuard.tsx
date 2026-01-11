
// import { getServerSession } from 'next-auth'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

import { verifyToken } from '@/libs/verifyToken'
import ClientAuthContextProvider from '@/contexts/ClientAuthContextProvider'
import NotAuthorizedGoBack from '@/views/NotAuthorizedGoBack'

// Add notAllowedRoles to props
interface Props extends ChildrenType {
  locale: Locale
  notAllowedRoles?: string[] // e.g. ['PATIENT']
}

export default async function AuthGuard({ children, locale, notAllowedRoles }: Props) {
  const user = await verifyToken()

  // 1. Check if logged in
  if (!user.valid) {
    return <AuthRedirect lang={locale} />
  }

  const { role, userName, sub } = user.payload

  if (notAllowedRoles && notAllowedRoles.includes(role)) {
    console.log(`User role ${role} is not allowed this Route.`)
    if (role === 'PATIENT') {
      return( <NotAuthorizedGoBack mode={"light"} />) }
    else{<AuthRedirect lang={locale} />}
   }

  const essentialUserInfo = { role, userName, sub }

  return (
    <ClientAuthContextProvider userData={essentialUserInfo || null}>
      {children}
    </ClientAuthContextProvider>
  )
}
