'use client'

import type { ReactNode } from 'react'

import { useAuth } from '@/contexts/ClientAuthContextProvider'
import type { Roles } from '@/configs/roleConfig'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: readonly Roles[] | Roles
  fallback?: ReactNode
}

/**
 * Component to protect UI elements based on user roles.
 * @param allowedRoles - An array of roles or a single role allowed to view the children.
 * @param fallback - Optional fallback UI if the user does not have the required role.
 */
export default function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { hasRole } = useAuth()

  if (hasRole(allowedRoles)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
