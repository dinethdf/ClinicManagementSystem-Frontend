// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'
import ClientAuthContextProvider from '@/contexts/ClientAuthContextProvider'
import NotAuthorizedGoBack from '@/views/NotAuthorizedGoBack'

import { verifyToken } from '@/libs/verifyToken'
import { decryptClinicPlane } from '@/utils/encode' // <--- Import Decryption Utility

// Config
import { Feature, hasPermission } from '@/configs/subscriptionConfig'

interface Props extends ChildrenType {
  locale: Locale
  notAllowedRoles?: string[]
  requiredFeature?: Feature
}

export default async function AuthGuard({ children, locale, notAllowedRoles, requiredFeature }: Props) {
  const user = await verifyToken()
  
  if (!user.valid) {
    return <AuthRedirect lang={locale} />
  }

  const { role, userName, sub, planeCode } = user.payload

  const realSubscription = planeCode ? decryptClinicPlane(planeCode) : 'BASIC';
  
  if (notAllowedRoles && notAllowedRoles.includes(role)) {
    console.log(`User role ${role} is not allowed on this Route.`)
    if (role === 'PATIENT') {
      return <NotAuthorizedGoBack mode={"light"} />
    } else {
      return <AuthRedirect lang={locale} />
    }
  }

  if (requiredFeature) {
    // Use the DECRYPTED plan for the check
    if (!realSubscription || !hasPermission(realSubscription, requiredFeature)) {
      console.log(`User subscription (${realSubscription}) missing feature: ${requiredFeature}`)
      return <NotAuthorizedGoBack mode={"light"} /> 
    }
  }

  const essentialUserInfo = { 
      role, 
      userName: sub,
      sub,
      subscription: realSubscription ?? '' 
  }


  return (
    <ClientAuthContextProvider userData={essentialUserInfo}>
      {children}
    </ClientAuthContextProvider>
  )
}