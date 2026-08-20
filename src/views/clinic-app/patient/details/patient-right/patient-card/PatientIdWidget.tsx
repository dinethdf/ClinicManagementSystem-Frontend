'use client'

import React, { useRef, useState } from 'react'

import { useReactToPrint } from 'react-to-print'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'

// Component Imports
import PatientIdCard from './PatientIdCard'

// Service Imports
import { getPatientBarcode } from '@/services/patient/patient.server.service'

// Type Imports
import type { Patient } from '@/types/patient.types'

const PatientIdWidget = ({ patient }: { patient: any }) => { // Using 'any' since your JSON has extra fields like 'isTemp'
  const componentRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [barcodeData, setBarcodeData] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // 1. Validation Logic
  const canGenerateId = patient.isActive === true && patient.isTemp === false

  // 2. Fetch Logic
  const fetchBarcodeIfNeeded = async () => {
    if (barcodeData) return true
    setLoading(true)
    setError(null)
    
    try {
        const res = await getPatientBarcode(Number(patient.id))

        if (res.success && res.data) {
            setBarcodeData(res.data)
            
return true
        } else {
            setError(res.error?.message || "Failed to load barcode from server.")
            
return false
        }
    } catch (err: any) {
        setError(err.message || "An unexpected error occurred.")
        
return false
    } finally {
        setLoading(false)
    }
  }

  // 3. Print Configuration
  const pageStyle = `
    @page { 
      size: landscape; 
      margin: 0; 
    }
    
    @media print {
      body { 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact;
      }
      /* This wrapper takes up the whole page, 
         but we do NOT let the child stretch.
      */
      .print-wrapper {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  `

  const triggerPrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `PatientID_${patient.patientNo}`,
    pageStyle: pageStyle
  })

  // 4. Handlers
  const handlePreviewClick = async () => {
    if (!canGenerateId) {
        // Fallback catch, though the button should be disabled anyway
        setError("Patient must be fully registered and active to generate an ID.")
        
return
    }

    const success = await fetchBarcodeIfNeeded()

    if (success) setPreviewOpen(true)
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col items-center gap-4 text-center'>
            <div className='bg-primary/10 p-3 rounded-full text-primary'>
                <i className='tabler-id text-3xl' />
            </div>
            <div>
                <Typography variant='h6'>Patient ID Card</Typography>
                <Typography variant='caption' color='text.secondary'>
                    View & Print Official ID
                </Typography>
            </div>

            {/* Validation Alerts */}
            {!canGenerateId && !error && (
                <Alert severity='warning' className='text-left w-full'>
                    ID card generation is unavailable. The patient profile must be <strong>active</strong> and <strong>fully registered</strong> (not temporary).
                </Alert>
            )}

            {/* API Errors */}
            {error && (
                <Alert severity='error' onClose={() => setError(null)} className='text-left w-full'>
                    {error}
                </Alert>
            )}

            <Button 
                variant='outlined' 
                fullWidth 
                onClick={handlePreviewClick} 
                disabled={loading || !canGenerateId}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Preview ID Card'}
            </Button>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', bgcolor: '#e0e0e0', py: 8 }}>
            
            {/* The Print Wrapper */}
            <div ref={componentRef} className="print-wrapper shadow-2xl bg-white">
               <PatientIdCard patient={patient} barcodeString={barcodeData} />
            </div>

        </DialogContent>
        <DialogActions className='p-4 justify-between bg-gray-50 border-t border-gray-200'>
            <Typography variant='body2' color='text.secondary' className='ml-2'>
                Ensure your printer is set to <strong>Landscape</strong> mode.
            </Typography>
            <Box className='flex gap-2'>
                <Button onClick={() => setPreviewOpen(false)} color='secondary' variant='tonal'>
                    Close
                </Button>
                <Button onClick={() => triggerPrint()} variant='contained' startIcon={<i className='tabler-printer'/>}>
                    Print Now
                </Button>
            </Box>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PatientIdWidget