'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link' // <--- Import Link

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import PatientSelectorDialog from '@/components/dialogs/patient/PatientSelectorDialog'

// Utils
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

const QuickActionStaff = () => {

  const router = useRouter()
  const { lang: locale } = useParams()
  
  // --- STATE MANAGEMENT ---
  const [openDialog, setOpenDialog] = useState(false)
  const [initialTab, setInitialTab] = useState('1') // '1' = Search, '2' = Barcode

  // --- SPACE BAR LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const isInputActive = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        if (e.code === 'Space' && !isInputActive && !openDialog) {
            e.preventDefault(); 
            setInitialTab('2'); 
            setOpenDialog(true); 
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openDialog]);

  // --- HANDLERS ---
  const handleOpenSearch = () => {
      setInitialTab('1');
      setOpenDialog(true);
  }

  const handlePatientSelected = (patientData: any) => {
     if (patientData?.id) {
         const url = getLocalizedUrl(`/clinic/patient/details/${patientData.id}`, locale as Locale)
         router.push(url)
     }
  }

  return (
    <>
        <Card>
          <CardContent className='flex flex-col gap-4'>
            
            {/* Image */}
            <div className='flex justify-center pli-2.5 pbs-4 rounded bg-primaryLight'>
              <img src='/images/illustrations/characters/4.png' className='bs-[82px]' alt="Character" />
            </div>
            
            {/* Title */}
            <div>
              <Typography variant='h5' className='mbe-2'>
                Patient Management
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Quick access to patient operations
              </Typography>
            </div>

            {/* Buttons */}
            
            {/* BUTTON 1: Find Patient (Opens Modal) */}
            <Button 
                variant='contained' 
                size='large' 
                fullWidth 
                startIcon={<i className='tabler-user-search' />}
                onClick={handleOpenSearch} 
            >
                Find Patient
            </Button>
            
            <div className="text-xs text-center text-gray-400 -mt-2 mb-1">
                Press (Space) to Quick Scan
            </div>

            {/* BUTTON 2: Register Patient (Navigate) */}
            <Button 
                component={Link} // Use Link component
                href={getLocalizedUrl('/clinic/patient/register', locale as Locale)} // Set URL
                variant='tonal' 
                color='primary' 
                size='large' 
                startIcon={<i className='tabler-user-plus' />}
            >
                Register Patient
            </Button>

            {/* BUTTON 3: New Appointment (Navigate) */}
            <Button 
                component={Link} // Use Link component
                href={getLocalizedUrl('/clinic/appoinment/create', locale as Locale)} // Set URL
                variant='outlined' 
                size='large' 
                startIcon={<i className='tabler-calendar-plus' />}
            >
                New Appointment
            </Button>      
          </CardContent>
        </Card>

        <PatientSelectorDialog 
            open={openDialog} 
            setOpen={setOpenDialog} 
            onPatientSelect={handlePatientSelected}
            initialTab={initialTab} 
        />
    </>
  )
}

export default QuickActionStaff