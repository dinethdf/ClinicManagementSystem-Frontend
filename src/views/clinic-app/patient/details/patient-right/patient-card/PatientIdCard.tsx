import React from 'react'
import Barcode from 'react-barcode'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'

// Type Imports
import type { Patient } from '@/types/patient.types'

interface PatientIdCardProps {
  patient: Patient
  barcodeString: string
}

const PatientIdCard = ({ patient, barcodeString }: PatientIdCardProps) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        // --- STRICT DIMENSIONS ---
        // This is standard Credit Card size.
        // It will NOT stretch because we set specific width/height
        width: '85.6mm', 
        height: '54mm', 
        
        // Prevents flexbox from squashing or stretching it
        flexShrink: 0, 
        
        // Design Styles
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',

        // Print Colors
        printColorAdjust: 'exact',
        WebkitPrintColorAdjust: 'exact',
      }}
    >
      {/* 1. Header Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box sx={{ 
            width: 22, height: 22, 
            bgcolor: theme.palette.primary.main || '#6f42c1', 
            color: 'white', 
            borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '11px'
        }}>
            H
        </Box>
        <Box>
            <Typography sx={{ fontSize: '9px', fontWeight: 800, color: '#444', textTransform: 'uppercase', lineHeight: 1 }}>
                Health Clinic
            </Typography>
            <Typography sx={{ fontSize: '6px', color: '#888' }}>
                Patient Identity Card
            </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 1, borderColor: '#f0f0f0' }} />

      {/* 2. Content Section */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flex: 1 }}>
        <Avatar 
            src={patient.profileImg} 
            variant="rounded"
            sx={{ width: 40, height: 40, bgcolor: '#f5f5f5', border: '1px solid #eee' }}
        />

        <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 'bold', mb: 0.2, color: '#333' }}>
                {patient.firstName} {patient.lastName}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Typography sx={{ fontSize: '8px', color: '#555' }}>
                    <strong style={{ color: '#000' }}>ID:</strong> {patient.patientNo || patient.id}
                </Typography>
                <Typography sx={{ fontSize: '8px', color: '#555' }}>
                    <strong style={{ color: '#000' }}>NIC:</strong> {patient.nic}
                </Typography>
                <Typography sx={{ fontSize: '8px', color: '#555' }}>
                    <strong style={{ color: '#000' }}>Tel:</strong> {patient.mobileNo}
                </Typography>
            </Box>
        </Box>
      </Box>

      {/* 3. Barcode (Bottom) */}
      <Box sx={{ 
          mt: 'auto', 
          display: 'flex', 
          justifyContent: 'center', 
          height: '22px', // Restrict height so it doesn't push layout
          overflow: 'hidden' 
      }}>
        {barcodeString && (
            <Barcode
                value={barcodeString}
                format="CODE128"
                width={1.5}     // Slightly thicker lines
                height={25}     // Tall enough to be readable
                fontSize={0}    // Hide numbers (clean look)
                margin={0}
                background='transparent'
            />
        )}
      </Box>
    </Box>
  )
}

export default PatientIdCard