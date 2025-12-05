
// import { getServerSession } from 'next-auth'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

import { verifyToken } from '@/libs/verifyToken'
import ClientAuthContextProvider from '@/contexts/ClientAuthContextProvider'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {

  const user = await verifyToken()

  if (!user.valid) {
    return <AuthRedirect lang={locale} />
  }

  const { role, userName, sub } = user.payload
  const essentialUserInfo = { role, userName, sub }

  return (
    <>
      {user?.valid ? (
        <ClientAuthContextProvider userData={essentialUserInfo || null}>{children}</ClientAuthContextProvider>
      ) : (
        <AuthRedirect lang={locale} />
      )}
    </>
  )
}
