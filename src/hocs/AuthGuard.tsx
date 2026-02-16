// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'
import { verifyToken } from '@/libs/verifyToken'
import ClientAuthContextProvider from '@/contexts/ClientAuthContextProvider'
import NotAuthorizedGoBack from '@/views/NotAuthorizedGoBack'

// Config
import { Feature, hasPermission } from '@/configs/subscriptionConfig'

interface Props extends ChildrenType {
  locale: Locale
  notAllowedRoles?: string[]
  requiredFeature?: Feature
}

export default async function AuthGuard({ children, locale, notAllowedRoles, requiredFeature }: Props) {
  const user = await verifyToken()

  console.log("Auth User", user)

  // 1. Check Login
  if (!user.valid) {
    return <AuthRedirect lang={locale} />
  }

  const { role, userName, sub, subscription } = user.payload

  if (notAllowedRoles && notAllowedRoles.includes(role)) {
    console.log(`User role ${role} is not allowed on this Route.`)
    if (role === 'PATIENT') {
      return <NotAuthorizedGoBack mode={"light"} />
    } else {
      return <AuthRedirect lang={locale} />
    }
  }


  if (requiredFeature) {
    if (!subscription || !hasPermission(subscription, requiredFeature)) {
      console.log(`User subscription (${subscription}) missing feature: ${requiredFeature}`)
      return <NotAuthorizedGoBack mode={"light"} /> 
    }
  }

  const essentialUserInfo = { role, userName, sub, subscription }

  return (
    <ClientAuthContextProvider userData={essentialUserInfo}>
      {children}
    </ClientAuthContextProvider>
  )
}