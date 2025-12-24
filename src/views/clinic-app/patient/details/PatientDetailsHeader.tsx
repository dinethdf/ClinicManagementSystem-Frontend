'use client'

// React Imports
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { DoctorScheduleDTO } from '@/types/doctor.types' // Ensure this path is correct based on your project

// Component Imports
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import DoctorSheduleSelect from '@/components/dialogs/doctor-shedule-select' // Adjust this import path to where you saved the popup code

// Service & Utils Imports
import { createAppointment } from '@/services/appoinment.server.service'
import { encodeHideValue } from '@/utils/encode'
import { toast } from 'react-toastify'

type PatientHeaderProps = {
  patientId: string
  firstName: string
  lastName: string
  patientNo: string
  registrationDate?: string
}

const PatientDetailsHeader = ({ 
  patientId, 
  firstName, 
  lastName, 
  patientNo, 
  registrationDate 
}: PatientHeaderProps) => {
  
  // --- Hooks ---
  const router = useRouter()
  const params = useParams()
  
  // --- States ---
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)

  // --- Helpers ---
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant,
    startIcon: <i className='tabler-trash' />
  })

  // Format Date
  const formattedDate = registrationDate 
    ? new Date(registrationDate).toLocaleDateString() 
    : 'N/A'

  // --- Handlers ---

  const handleScheduleSelect = async (schedule: DoctorScheduleDTO | null) => {
    if (!schedule) return

    // 1. We have the PatientID (props) and ScheduleID (selected)
    try {
        const result = await createAppointment(
            schedule?.id || 0,
            Number(patientId), // Ensure ID is number if your API expects number
            "Quick Appointment created from Patient Profile" // Default note
        )

        if (result.success && result.data) {
            
            // 2. Success Logic
            setIsScheduleOpen(false) // Close modal
            
            toast.success(`Appointment created: #${result.data.id}`)
            
            // 3. Encode ID and Redirect
            const encodedId = encodeHideValue(result.data.id)
            router.replace(`/${params.lang}/clinic/appoinment/payment/${encodedId}`)

        } else {
             // 4. Error Logic
            console.error('Failed to create appointment:', result.error)
            toast.error(result?.error?.message || 'Failed to create appointment')
        }

    } catch (error) {
        console.error("System error", error)
        toast.error("An unexpected error occurred.")
    }
  }

  return (
    <>
        <Card>
        <CardContent>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            
            {/* --- LEFT SIDE: Name & Info --- */}
            <div className='flex flex-col gap-1'>
                <Typography variant='h4' className='font-bold'>
                    {firstName} {lastName}
                </Typography>

                <div className='flex flex-wrap items-center gap-4 text-textSecondary'>
                    <div className='flex items-center gap-1.5'>
                        <i className='tabler-id text-xl text-primary' />
                        <Typography variant='body1' className='font-medium text-textPrimary'>
                            {patientNo || 'N/A'}
                        </Typography>
                    </div>

                    <i className='tabler-point-filled text-xs text-gray-300' />

                    <div className='flex items-center gap-1.5'>
                        <i className='tabler-calendar text-lg' />
                        <Typography variant='body2'>
                            Joined {formattedDate}
                        </Typography>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: Buttons --- */}
            <div className='flex items-center gap-3 w-full md:w-auto'>
                
                {/* 1. New Appointment Button (Triggers Popup) */}
                <Button 
                    variant='contained' 
                    color='primary'
                    startIcon={<i className='tabler-calendar-plus' />}
                    className='flex-1 md:flex-none'
                    onClick={() => setIsScheduleOpen(true)}
                >
                    New Appointment
                </Button>

                {/* 2. Delete Button */}
                <div className='flex-1 md:flex-none'>
                    <OpenDialogOnElementClick
                        element={Button}
                        elementProps={{ 
                            ...buttonProps('Delete', 'error', 'tonal'), 
                            className: 'w-full' 
                        }}
                        dialog={ConfirmationDialog}
                        dialogProps={{ type: 'delete-customer' }} 
                    />
                </div>
            </div>

            </div>
        </CardContent>
        </Card>

        {/* --- SCHEDULE SELECTION DIALOG --- */}
        <DoctorSheduleSelect 
            open={isScheduleOpen}
            setOpen={setIsScheduleOpen}
            onSelectShedule={handleScheduleSelect}
        />
    </>
  )
}

export default PatientDetailsHeader