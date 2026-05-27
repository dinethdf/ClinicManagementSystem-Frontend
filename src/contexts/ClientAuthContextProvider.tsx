'use client'

import type { ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react'

import type { Feature} from '@/configs/subscriptionConfig';
import { hasPermission as checkSubscriptionFeature } from '@/configs/subscriptionConfig'
import type { Roles, Permission} from '@/configs/roleConfig';
import { rolePermissions } from '@/configs/roleConfig'

// Define the shape of your User Data
type UserData = {
  userName: string
  role: string
  sub: string // User ID
  subscription?: string
}

type AuthContextType = {
  user: UserData | null
  can: (feature: Feature) => boolean
  hasRole: (allowedRoles: readonly Roles[] | Roles) => boolean
  hasPermission: (requiredPermission: Permission) => boolean
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
        
return checkSubscriptionFeature(userData.subscription, feature)
      },

      // Check if user has the specified role(s)
      hasRole: (allowedRoles: readonly Roles[] | Roles) => {
        if (!userData?.role) return false
        
        const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

        
return rolesToCheck.includes(userData.role as Roles)
      },

      // Check if user has a specific permission based on their role
      hasPermission: (requiredPermission: Permission) => {
        if (!userData?.role) return false
        
        const userRole = userData.role as Roles;
        const permissionsForRole = rolePermissions[userRole] || [];
        
        return permissionsForRole.includes(requiredPermission);
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