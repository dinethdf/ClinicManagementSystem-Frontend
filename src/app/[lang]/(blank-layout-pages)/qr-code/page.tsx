'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

// Utils Import
import { decodeHideValue } from '@/utils/encode' // Make sure this path is correct

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // State for the Extracted ID (Encoded)
  const [extractedValue, setExtractedValue] = useState<string | null>(null)
  // State for the Decoded Real Value
  const [decodedValue, setDecodedValue] = useState<string | null>(null)
  
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const qrCodeRegionId = 'qr-reader'

  // Extract the last part after /queue-tracker/
  const extractQueueValue = useCallback((url: string) => {
    try {
      const match = url.match(/\/queue-tracker\/([^/?#]+)/)
      if (match && match[1]) {
        return match[1]
      }
      return null
    } catch (err) {
      console.error('Error extracting value:', err)
      return null
    }
  }, [])

  // Function to stop scanning safely
  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop()
        }
        await scannerRef.current.clear()
        scannerRef.current = null
      } catch (err) {
        console.warn('Error stopping scanner:', err)
      }
    }
    setIsScanning(false)
  }, [])

  // Handle successful scan
  const onScanSuccess = useCallback((decodedText: string) => {
    setScannedData(decodedText)
    
    // 1. Extract the Encoded ID from URL
    const value = extractQueueValue(decodedText)
    
    if (value) {
      setExtractedValue(value)
      
      // 2. Decode the value using your utility function
      try {
          const realValue = decodeHideValue(value)
          setDecodedValue(realValue)
      } catch (e) {
          console.error("Failed to decode value:", e)
          setDecodedValue("Error: Invalid or Corrupt Data")
      }

      stopScanning()
    } else {
      setExtractedValue(null)
      setDecodedValue(null)
      console.warn('Invalid URL format:', decodedText)
    }
  }, [extractQueueValue, stopScanning])

  // Start scanning
  const startScanning = useCallback(async () => {
    setError(null)
    setScannedData(null)
    setExtractedValue(null)
    setDecodedValue(null)

    try {
      if (scannerRef.current) {
        await stopScanning()
      }

      const html5QrCode = new Html5Qrcode(qrCodeRegionId)
      scannerRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        onScanSuccess,
        (errorMessage) => {
           // Ignore frame parse errors
        }
      )

      setIsScanning(true)
    } catch (err: any) {
      console.error('Error starting scanner:', err)
      setError(
        err?.name === 'NotAllowedError' 
          ? 'Camera permission denied. Please allow access.' 
          : 'Failed to start camera.'
      )
      setIsScanning(false)
    }
  }, [onScanSuccess, stopScanning])

  // Cleanup
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
             scannerRef.current?.clear()
        }).catch(err => console.error("Cleanup error", err))
      }
    }
  }, [])

  return (
    <div className='flex flex-col gap-4 max-w-md mx-auto'>
      <Card>
        <CardHeader
          title='QR Code Scanner'
          subheader='Scan queue tracker QR codes'
          action={
            isScanning ? (
              <Chip label='Scanning' color='success' size='small' variant='outlined' icon={<i className='tabler-loader animate-spin' />} />
            ) : (
              <Chip label='Idle' color='default' size='small' variant='outlined' />
            )
          }
        />
        <CardContent className='flex flex-col gap-4'>
          {error && (
            <Alert severity='error' onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Scanner Region */}
          <Box className='relative bg-black rounded-lg overflow-hidden border border-gray-200'>
            <div 
                id={qrCodeRegionId} 
                className='w-full' 
                style={{ minHeight: '300px' }} 
            />
            {!isScanning && (
              <div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10'>
                <i className='tabler-qrcode text-6xl text-gray-300 mb-2' />
                <Typography variant='body2' color='text.secondary'>
                  Camera is off
                </Typography>
              </div>
            )}
          </Box>

          {/* Controls */}
          <div className='flex gap-3'>
            {!isScanning ? (
              <Button
                variant='contained'
                color='primary'
                fullWidth
                startIcon={<i className='tabler-camera' />}
                onClick={startScanning}
              >
                Start Scanning
              </Button>
            ) : (
              <Button
                variant='outlined'
                color='error'
                fullWidth
                startIcon={<i className='tabler-player-stop' />}
                onClick={stopScanning}
              >
                Stop Camera
              </Button>
            )}
          </div>

          {/* Results */}
          {scannedData && (
            <Card variant='outlined' className={`border ${extractedValue ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
              <CardContent className='p-4 space-y-4'>
                <Typography variant='subtitle2' className='font-bold mb-2 flex items-center gap-2'>
                  {extractedValue ? (
                      <><i className='tabler-circle-check text-success' /> Success</>
                  ) : (
                      <><i className='tabler-alert-triangle text-warning' /> Invalid Format</>
                  )}
                </Typography>
                
                {extractedValue ? (
                    <>
                        {/* 1. The Encoded ID */}
                        <div>
                            <Typography variant='caption' color='text.secondary' className='uppercase font-bold text-[10px]'>
                                Extracted ID (Encoded)
                            </Typography>
                            <Typography variant='body2' className='font-mono text-gray-700 break-all bg-white/60 p-1.5 rounded border border-green-100'>
                                {extractedValue}
                            </Typography>
                        </div>

                        {/* 2. The Decoded Real Value (NEW) */}
                        <div className='bg-white p-3 rounded border border-green-200 shadow-sm'>
                            <Typography variant='caption' className='uppercase font-bold text-[10px] text-primary flex items-center gap-1 mb-1'>
                                <i className='tabler-lock-open' /> Decrypted Data
                            </Typography>
                            <Typography variant='h6' className='font-mono text-primary font-bold break-all leading-tight'>
                                {decodedValue || "Decoding..."}
                            </Typography>
                        </div>
                    </>
                ) : (
                    <Alert severity='warning' className='text-xs'>
                      QR Code detected, but URL format is incorrect.
                    </Alert>
                )}

                {/* Raw Data (Hidden details) */}
                <div className='pt-2 border-t border-dashed border-green-200'>
                    <Typography variant='caption' className='font-mono break-all text-gray-400 text-[10px] leading-tight'>
                      Raw: {scannedData}
                    </Typography>
                </div>

              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

QRScanner.displayName = 'QRScanner'

export default QRScanner