// 1. Define your Subscription Tiers (Match what is in your DB/JWT)
export type SubscriptionType = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE'

// 2. Define all Feature Flags (The actions you want to control)
export type Feature = 
  | 'VIEW_ANALYTICS'
  | 'MANAGE_STAFF'
  | 'EXPORT_REPORTS'
  | 'SMS_NOTIFICATIONS'
  | 'TELEMEDICINE'

// 3. The Permission Matrix
export const SUBSCRIPTION_FEATURES: Record<SubscriptionType, Feature[]> = {
  BASIC: [
    'VIEW_ANALYTICS' 
  ],
  STANDARD: [
    'VIEW_ANALYTICS', 
    'MANAGE_STAFF', 
    'SMS_NOTIFICATIONS'
  ],
  PREMIUM: [
    'VIEW_ANALYTICS', 
    'MANAGE_STAFF', 
    'EXPORT_REPORTS', 
    'SMS_NOTIFICATIONS', 
    'TELEMEDICINE'
  ],
  ENTERPRISE: [
    // Enterprise usually gets everything
    'VIEW_ANALYTICS', 
    'MANAGE_STAFF', 
    'EXPORT_REPORTS', 
    'SMS_NOTIFICATIONS', 
    'TELEMEDICINE'
  ]
}

// 4. Helper Function to check permissions
export const hasPermission = (userSub: string | undefined, feature: Feature): boolean => {
  if (!userSub) return false

  // Default to empty array if subscription type is unknown
  const allowedFeatures = SUBSCRIPTION_FEATURES[userSub as SubscriptionType] || []

  
return allowedFeatures.includes(feature)
}