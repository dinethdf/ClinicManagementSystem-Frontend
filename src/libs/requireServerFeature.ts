import { redirect } from 'next/navigation'
import { verifyToken } from '@/libs/verifyToken'
import { Feature, hasPermission } from '@/configs/subscriptionConfig'


export async function requireServerFeature(feature: Feature) {

  const { valid, payload } = await verifyToken()

  if (!valid || !payload) {
    redirect('/login')
  }

  const userSub = payload.subscription || 'BASIC' 

  const isAllowed = hasPermission(userSub, feature)
  
  if (!isAllowed) {
    console.warn(`User ${payload.userName} (Role: ${payload.role}, Sub: ${userSub}) attempted to access restricted feature: ${feature}`)
    redirect('/unauthorized')
  }

 return { allowed: isAllowed, user: payload }
}