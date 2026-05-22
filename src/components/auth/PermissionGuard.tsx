'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/contexts/ClientAuthContextProvider'
import { Permission } from '@/configs/roleConfig'

interface PermissionGuardProps {
  children: ReactNode
  requiredPermission: Permission
  fallback?: ReactNode
}

/**
 * Component to protect UI elements based on specific permissions.
 * @param requiredPermission - The specific permission required to view the children.
 * @param fallback - Optional fallback UI if the user does not have the required permission.
 */
export default function PermissionGuard({ children, requiredPermission, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = useAuth()

  if (hasPermission(requiredPermission)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
