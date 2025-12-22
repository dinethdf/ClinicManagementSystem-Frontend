// src/components/clinic/patient/PatientIdCard.tsx
import React, { useEffect, useState } from 'react'
import Barcode from 'react-barcode'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

// Service & Type Imports
import { getCompanyDetails, CompanyDetails } from '@/services/company.server.service'
import type { Patient } from '@/types/patient.types'

interface PatientIdCardProps {
  patient: Patient
  barcodeString: string
}

const PatientIdCard = ({ patient, barcodeString }: PatientIdCardProps) => {
  const [company, setCompany] = useState<CompanyDetails | null>(null)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanyDetails();
        setCompany(data);
      } catch (e) {
        console.error("Failed to load company details", e);
      }
    }
    fetchCompany();
  }, [])

  if (!company) {
    return (
        <Box sx={{ width: '90mm', height: '60mm', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={20} />
        </Box>
    )
  }

  return (
    <Box
      sx={{
        // --- DIMENSIONS: 90mm x 60mm ---
        width: '90mm', 
        height: '60mm', 
        
        flexShrink: 0, 
        
        // Styles
        backgroundColor: '#fff',
        borderRadius: '0px', 
        border: '2px solid #000', // Solid black border
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Arial, Helvetica, sans-serif', 

        // Print settings
        printColorAdjust: 'exact',
        WebkitPrintColorAdjust: 'exact',
      }}
    >
      {/* 1. HEADER SECTION */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 0.5 }}>
        
        {/* Company Name */}
        <Box sx={{ flex: 1 }}>
            <Typography sx={{ 
                fontSize: '18px', 
                fontWeight: 800, // Bold Header
                color: '#000000', 
                textTransform: 'uppercase', 
                lineHeight: 1,
                letterSpacing: '1px' 
            }}>
                {company.name}
            </Typography>
            <Typography sx={{ 
                fontSize: '11px', 
                color: '#000000', 
                mt: 0.5, 
                fontWeight: 500, 
                letterSpacing: '0.5px'
            }}>
                {company.subTitle}
            </Typography>
        </Box>

        {/* --- COMPANY LOGO FROM SERVICE --- */}
        <Box sx={{ 
            width: 40, 
            height: 40, 
            // Optional: Remove border if logo has its own background
            // border: '1px solid #ccc', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: 1
        }}>
             {company.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                    src={company.logoUrl} 
                    alt="Clinic Logo" 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain' // Keeps aspect ratio
                    }} 
                />
             ) : (
                 <Typography sx={{ fontWeight: 800, fontSize: '10px' }}>LOGO</Typography>
             )}
        </Box>
      </Box>

      {/* Divider */}
      <Divider sx={{ mb: 1.5, borderColor: '#000000', borderBottomWidth: '1.5px', opacity: 1 }} />

      {/* 2. PATIENT DETAILS */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
        
        {/* ID - BOLD */}
        <DetailRow label="ID No" value={patient.patientNo || patient.id} isBold={true} />
        
        {/* Name - BOLD */}
        <DetailRow label="Name" value={`${patient.firstName} ${patient.lastName}`} isBold={true} />
        
        {/* Others - NORMAL */}
        <DetailRow label="NIC No" value={patient.nic} isBold={false} />
        <DetailRow label="Phone" value={patient.mobileNo} isBold={false} />
        <DetailRow label="Address" value={patient.address || ""} isBold={false} />

      </Box>

      {/* 3. BARCODE */}
      <Box sx={{ 
          mt: 'auto', 
          display: 'flex', 
          justifyContent: 'center', 
          height: '42px', 
          overflow: 'hidden',
          pt: 0.5
      }}>
        {barcodeString && (
            <Barcode
                value={barcodeString}
                format="CODE128"
                width={1.7}     
                height={40}     
                fontSize={0}    
                margin={0}
                background='transparent'
                lineColor="#000000" 
            />
        )}
      </Box>
    </Box>
  )
}

// Helper Component
const DetailRow = ({ label, value, isBold = false }: { label: string, value: any, isBold?: boolean }) => (
    <Box sx={{ display: 'flex', alignItems: 'baseline', lineHeight: 1.3 }}>
        <Typography sx={{ 
            fontSize: '12px', 
            fontWeight: 500,  
            width: '80px',    
            color: '#000000', 
            flexShrink: 0,
            letterSpacing: '0.5px' 
        }}>
            {label} :
        </Typography>
        <Typography sx={{ 
            fontSize: isBold ? '14px' : '13px', 
            fontWeight: isBold ? 900 : 500, 
            color: '#000000', 
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '220px',
            letterSpacing: '0.5px' 
        }}>
            {value || ""}
        </Typography>
    </Box>
)

export default PatientIdCard