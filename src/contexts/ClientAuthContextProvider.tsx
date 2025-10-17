'use client' // 👈 This is crucial!

// components/ClientAuthContextProvider.tsx

// for the context tocken Veryfy use this

import { createContext, useContext } from 'react'

// Define the type for your User/Auth State
type UserData = {
  sub: string
  role: string
  userName: string
} | null

const AuthContext = createContext<UserData>(null)

// Custom hook for easy access

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an ClientAuthContextProvider')
  }

  return context
}

// The provider component
export default function ClientAuthContextProvider({
  children,
  userData
}: {
  children: React.ReactNode
  userData: UserData
}) {
  return <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
}
