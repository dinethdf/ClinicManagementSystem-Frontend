'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation' 
import { Html5Qrcode } from 'html5-qrcode'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'

// Utils & Services
import { decodeHideValue } from '@/utils/encode'
import { checkAppointmentStatus } from '@/services/appointment/appoinment.server.service'
import type { AppointmentStatusDTO } from '@/types/appoinments.types'

// Components
import StaffAppointmentActionDialog from '@/components/dialogs/appointment-start/StaffAppointmentActionDialog'

interface QRScannerProps {
  requiredScheduleId: number 
}

const QRScanner = ({ requiredScheduleId }: QRScannerProps) => {
  const router = useRouter()
  
  // -- Scanner State --
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)

  // -- API/Dialog State --
  const [processing, setProcessing] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentStatusDTO | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const qrCodeRegionId = 'qr-reader'

  const extractQueueValue = useCallback((url: string) => {
    try {
      const match = url.match(/\/queue-tracker\/([^/?#]+)/)
      return match && match[1] ? match[1] : null
    } catch (err) { return null }
  }, [])

  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) await scannerRef.current.stop()
        await scannerRef.current.clear()
        scannerRef.current = null
      } catch (err) { console.warn('Error stopping scanner:', err) }
    }
    setIsScanning(false)
  }, [])

  const onScanSuccess = useCallback(async (decodedText: string) => {
    setScannedData(decodedText)
    const encodedValue = extractQueueValue(decodedText)

    if (encodedValue) {
        await stopScanning()
        setProcessing(true)
        setApiError(null)

        try {
            const realValue = decodeHideValue(encodedValue) 
            const parts = realValue.split(':') 
            
            if (parts.length > 0) {
                const scheduleIdFromQR = Number(parts[0])
                const appointmentIdString = parts[parts.length - 1]
                const appointmentId = Number(appointmentIdString)

                if (!isNaN(scheduleIdFromQR) && !isNaN(appointmentId)) {
                    
                    if (scheduleIdFromQR !== requiredScheduleId) {
                        setApiError(`Invalid Schedule. This QR belongs to Schedule #${scheduleIdFromQR}, but you are scanning for Schedule #${requiredScheduleId}.`)
                        setProcessing(false)
                        return
                    }
                    
                    const res = await checkAppointmentStatus(scheduleIdFromQR, appointmentId)

                    if (res.success && res.data) {
                        setAppointmentInfo(res.data)
                        setDialogOpen(true)
                    } else {
                        setApiError(res.error?.message || "Appointment details not found.")
                    }
                } else {
                    setApiError("Invalid ID format in QR code.")
                }
            } else {
                setApiError("Invalid QR Code Data Format.")
            }
        } catch (e) {
            console.error("Process Error", e)
            setApiError("Failed to process QR code. Data might be corrupt.")
        } finally {
            setProcessing(false)
        }
    }
  }, [extractQueueValue, stopScanning, requiredScheduleId])

  const startScanning = useCallback(async () => {
    setScanError(null)
    setScannedData(null)
    setApiError(null)
    setAppointmentInfo(null)

    try {
      if (scannerRef.current) await stopScanning()

      const html5QrCode = new Html5Qrcode(qrCodeRegionId)
      scannerRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        onScanSuccess,
        () => {} 
      )
      setIsScanning(true)
    } catch (err: any) {
      setScanError('Camera permission denied or device not supported.')
      setIsScanning(false)
    }
  }, [onScanSuccess, stopScanning])

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
         scannerRef.current.stop().then(() => scannerRef.current?.clear()).catch(console.error)
      }
    }
  }, [])

  // --- REFRESH AFTER SUCCESS ---
  const handleSuccessAction = () => {
      setDialogOpen(false);
      setAppointmentInfo(null);
      // Optional: You can call startScanning() here if you want it to auto-resume camera
      router.refresh(); 
  }

  return (
    <div className='flex flex-col gap-4 max-w-md mx-auto'>
      <Card>
        <CardHeader
          title='Scan Patient Token'
          subheader={`For Schedule #${requiredScheduleId}`}
          action={
            isScanning ? <Chip label='Scanning' color='success' size='small' icon={<i className='tabler-loader animate-spin' />} /> : <Chip label='Idle' size='small' />
          }
        />
        <CardContent className='flex flex-col gap-4'>
          {(scanError || apiError) && (
            <Alert severity='error' onClose={() => { setScanError(null); setApiError(null); }}>
              {scanError || apiError}
            </Alert>
          )}

          {processing && (
             <Alert severity="info" icon={<CircularProgress size={20} />}>
                Verifying QR Data...
             </Alert>
          )}

          <Box className='relative bg-black rounded-lg overflow-hidden border border-gray-200'>
            <div id={qrCodeRegionId} className='w-full' style={{ minHeight: '300px' }} />
            {!isScanning && (
              <div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10'>
                <i className='tabler-qrcode text-6xl text-gray-300 mb-2' />
                <Typography variant='body2' color='text.secondary'>Camera is off</Typography>
              </div>
            )}
          </Box>

          <div className='flex gap-3'>
            {!isScanning ? (
              <Button variant='contained' fullWidth startIcon={<i className='tabler-camera' />} onClick={startScanning}>
                Start Scanning
              </Button>
            ) : (
              <Button variant='outlined' color='error' fullWidth startIcon={<i className='tabler-player-stop' />} onClick={stopScanning}>
                Stop Camera
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <StaffAppointmentActionDialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        appointmentInfo={appointmentInfo}
        onSuccessAction={handleSuccessAction}
      />
    </div>
  )
}

QRScanner.displayName = 'QRScanner'
export default QRScanner