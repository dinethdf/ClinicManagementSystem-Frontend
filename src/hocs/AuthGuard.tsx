import { cookies } from 'next/headers'

// Third-party Imports
// import { getServerSession } from 'next-auth'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@/@core/typesDef'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

import { verifyToken } from '@/libs/authentication'
import ClientAuthContextProvider from '@/contexts/ClientAuthContextProvider'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const cookieStore = await cookies()
  const token: string | undefined = cookieStore.get('accessToken')?.value

  const user = await verifyToken(token)
  const { role, userName, sub } = user.payload;
  const essentialUserInfo = { role, userName, sub };

  return (<>

  {user?.valid ?
    <ClientAuthContextProvider userData={essentialUserInfo || null}>
      {children}
    </ClientAuthContextProvider>
   : <AuthRedirect lang={locale} />}
  
  </>)
}
