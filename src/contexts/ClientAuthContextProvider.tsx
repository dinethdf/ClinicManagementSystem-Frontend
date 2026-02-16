'use client'

import { createContext, useContext, useMemo, ReactNode } from 'react'
import { Feature, hasPermission } from '@/configs/subscriptionConfig'

// Define the shape of your User Data
type UserData = {
  userName: string
  role: string
  sub: string // User ID
  subscription?: string // <--- Added Subscription
}

type AuthContextType = {
  user: UserData | null
  can: (feature: Feature) => boolean // <--- The magic function
}

const ClientAuthContext = createContext<AuthContextType | null>(null)

export default function ClientAuthContextProvider({ 
  children, 
  userData 
}: { 
  children: ReactNode
  userData: UserData | null 
}) {
  
  const contextValue = useMemo(() => {
    return {
      user: userData,
      // The 'can' function checks the config based on the user's subscription
      can: (feature: Feature) => {
        if (!userData?.subscription) return false
        return hasPermission(userData.subscription, feature)
      }
    }
  }, [userData])

  return (
    <ClientAuthContext.Provider value={contextValue}>
      {children}
    </ClientAuthContext.Provider>
  )
}

// Custom Hook for usage in components
export const useAuth = () => {
  const context = useContext(ClientAuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a ClientAuthContextProvider')
  }
  return context
}