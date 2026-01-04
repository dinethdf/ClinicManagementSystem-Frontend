'use client'

import { useState } from 'react'

// Imports
import ScheduleSelection from './ScheduleSelection'
import PatientIdentification from './PatientIdentification'
import type { PublicScheduleDTO } from '@/types/public-booking.types'

import ChatBot from './ChatBot'


// MUI Icons (Optional, or keep your class based icons)
// import { IconCheck } from '@tabler/icons-react' 

const PublicBookingWizard = () => {
  const [activeStep, setActiveStep] = useState<'SELECTION' | 'DETAILS' | 'SUCCESS'>('SELECTION')
  const [selectedSchedule, setSelectedSchedule] = useState<PublicScheduleDTO | null>(null)
  
  // Store the Appointment ID returned from the backend
  const [finalAppointmentId, setFinalAppointmentId] = useState<number | null>(null)

  // Step 1 -> Step 2
  const handleSelectSchedule = (schedule: PublicScheduleDTO) => {
    setSelectedSchedule(schedule)
    setActiveStep('DETAILS')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Step 2 -> Success
  // Update: This now receives the appointmentID because the API call happens inside PatientIdentification
  const handleBookingSuccess = (appointmentId: number) => {
    setFinalAppointmentId(appointmentId)
    setActiveStep('SUCCESS')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- Success View ---
  if (activeStep === 'SUCCESS') {
    return (
        <div className='flex flex-col items-center justify-center p-12 text-center gap-6 animate-in fade-in zoom-in duration-500'>
            <div className='w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-sm'>
                {/* Ensure you have the icon library or use a standard SVG */}
                <i className='tabler-check text-6xl' /> 
            </div>
            
            <div>
                <h2 className='text-3xl font-bold text-gray-800'>Appointment Booked!</h2>
                <p className='text-gray-500 mt-2'>Thank you for booking with us.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 min-w-[300px]">
                 <p className='text-sm text-gray-500 uppercase tracking-wide'>Reference Number</p>
                 <p className='text-4xl font-bold text-primary mt-1'>#{finalAppointmentId}</p>
            </div>

            <button 
                className='bg-primary text-white px-8 py-3 rounded shadow hover:bg-primary/90 transition-all font-semibold'
                onClick={() => { setActiveStep('SELECTION'); setSelectedSchedule(null); }}
            >
                Book Another Appointment
            </button>
        </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
       {/* Hide Title on Success Screen to keep it clean */}
       {activeStep !== 'SELECTION' && (
           <div className='mb-8 text-center'>
                <h1 className='text-3xl font-bold text-primary mb-2'>Doctor Channeling</h1>
                <p className='text-gray-500'>Find your doctor and book an appointment online.</p>
           </div>
       )}

       {activeStep === 'SELECTION' && (
         <ScheduleSelection onSelectSchedule={handleSelectSchedule} />
       )}

       {activeStep === 'DETAILS' && selectedSchedule && (
         <PatientIdentification 
            selectedSchedule={selectedSchedule} 
            onBack={() => setActiveStep('SELECTION')}
            onSubmitBooking={handleBookingSuccess} // Pass the new handler
         />
       )}

        <ChatBot />
    </div>
  )
}

export default PublicBookingWizard