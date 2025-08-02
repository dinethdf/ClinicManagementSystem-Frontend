// Third-party Imports
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@/@core/typesDef'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'
import { validateToken } from '@/libs/authentication'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
const cookieStore = await cookies()
const token: string | undefined = cookieStore.get('accessToken')?.value
const userVerification = token ? await validateToken(token) : false

// const session = await getServerSession()

  return <>{userVerification?.valid ? children : <AuthRedirect lang={locale} />}</>
}
