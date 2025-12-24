'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import PatientSelectorDialog from '@/components/dialogs/patient/PatientSelectorDialog'

const QuickActionStaff = () => {
  
  // --- STATE MANAGEMENT ---
  const [openDialog, setOpenDialog] = useState(false)
  const [initialTab, setInitialTab] = useState('1') // '1' = Search, '2' = Barcode

  // --- SPACE BAR LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        // Don't trigger if user is typing in an input
        const isInputActive = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        // If SPACE is pressed and dialog is NOT open
        if (e.code === 'Space' && !isInputActive && !openDialog) {
            e.preventDefault(); // Prevent scrolling
            setInitialTab('2'); // Set to Barcode Tab
            setOpenDialog(true); // Open Dialog
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openDialog]);

  // --- HANDLERS ---
  
  // Handle manual click on "Find Patient" button
  const handleOpenSearch = () => {
      setInitialTab('1'); // Default to Search tab on click
      setOpenDialog(true);
  }

  // Handle data received from dialog
  const handlePatientSelected = (patientData: any) => {
      console.log("PARENT RECEIVED DATA:", patientData);
      // Logic: router.push(...) or state update
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
            
            {/* BUTTON 1: Find Patient */}
            <Button 
                variant='contained' 
                size='large' 
                fullWidth 
                startIcon={<i className='tabler-user-search' />}
                onClick={handleOpenSearch} // Manually handle click
            >
                Find Patient
            </Button>
            
            <div className="text-xs text-center text-gray-400 -mt-2 mb-1">
                Press (Space) to Quick Scan
            </div>

            <Button 
                variant='tonal' 
                color='primary' 
                size='large' 
                startIcon={<i className='tabler-user-plus' />}
            >
                Register Patient
            </Button>

            <Button 
                variant='outlined' 
                size='large' 
                startIcon={<i className='tabler-calendar-plus' />}
            >
                New Appointment
            </Button>      
          </CardContent>
        </Card>

        {/* DIALOG COMPONENT - Rendered at root but controlled by state */}
        <PatientSelectorDialog 
            open={openDialog} 
            setOpen={setOpenDialog} 
            onPatientSelect={handlePatientSelected}
            initialTab={initialTab} // Pass the tab state
        />
    </>
  )
}

export default QuickActionStaff