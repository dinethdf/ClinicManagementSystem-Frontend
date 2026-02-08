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

// Component Imports
import PatientIdCard from './PatientIdCard'

// Service Imports
import { getPatientBarcode } from '@/services/patient/patient.server.service'

// Type Imports
import type { Patient } from '@/types/patient.types'

const PatientIdWidget = ({ patient }: { patient: Patient }) => {
  const componentRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [barcodeData, setBarcodeData] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // 1. Fetch Logic
  const fetchBarcodeIfNeeded = async () => {
    if (barcodeData) return true
    setLoading(true)
    setError(null)
    const res = await getPatientBarcode(Number(patient.id))

    if (res.success && res.data) {
      setBarcodeData(res.data)
      setLoading(false)
      return true
    } else {
      setError(res.error?.message || "Failed to load barcode")
      setLoading(false)
      return false
    }
  }

  // 2. Print Configuration
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
    documentTitle: `PatientID_${patient.id}`,
    pageStyle: pageStyle
  })

  // 3. Handlers
  const handlePreviewClick = async () => {
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
            {error && <Alert severity='error' onClose={() => setError(null)}>{error}</Alert>}
            <Button variant='outlined' fullWidth onClick={handlePreviewClick} disabled={loading}>
                {loading ? <CircularProgress size={16} /> : 'Preview ID Card'}
            </Button>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', bgcolor: '#ccc', py: 8 }}>
            
            {/* The Print Wrapper */}
            <div ref={componentRef} className="print-wrapper">
               <PatientIdCard patient={patient} barcodeString={barcodeData} />
            </div>

        </DialogContent>
        <DialogActions>
            <Button onClick={() => setPreviewOpen(false)} color='secondary'>Close</Button>
            <Button onClick={() => triggerPrint()} variant='contained' startIcon={<i className='tabler-printer'/>}>
                Print Now
            </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PatientIdWidget