'use client' // 👈 required in Next.js for client-side context

// components/PatientRegistrationContextProvider.tsx

import { createContext, useContext, useState } from 'react'

// Define the type for your Patient Registration State
type PatientRegistrationData = {
  patientId: string | null
  setPatientId: (id: string | null) => void
}

// Create the context with default undefined
const PatientRegistrationContext = createContext<PatientRegistrationData | undefined>(undefined)

// Custom hook for easy access
export const usePatientRegistration = (): PatientRegistrationData => {
  const context = useContext(PatientRegistrationContext)

  if (context === undefined) {
    throw new Error('usePatientRegistration must be used within a PatientRegistrationContextProvider')
  }

  return context
}

// The provider component
export default function PatientRegistrationContextProvider({ children }: { children: React.ReactNode }) {
  const [patientId, setPatientId] = useState<string | null>('Hello patient')

  return (
    <PatientRegistrationContext.Provider value={{ patientId, setPatientId }}>
      {children}
    </PatientRegistrationContext.Provider>
  )
}
