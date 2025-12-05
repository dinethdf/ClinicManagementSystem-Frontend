'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps' 
import PatientProfileSidebar from './PatientProfileSidebar'
import PrescriptionManager from './PrescriptionManager'

// Service Imports
import { checkAppointmentStatus } from '@/services/appoinment.server.service'
import { getConsultationPatientDetails } from '@/services/consultation.server.service'

// Type Imports
import type { AppointmentStatusDTO } from '@/types/appoinments.types'
import type { PatientDetailDTO } from '@/types/consultation.types'

const ConsultationView = ({ scheduleId }: { scheduleId: string }) => {

  const [viewState, setViewState] = useState<'SEARCH' | 'CONSULTATION'>('SEARCH')
  
  // Search Data
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentStatusDTO | null>(null)
  
  // Consultation Data
  const [patientDetail, setPatientDetail] = useState<PatientDetailDTO | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- HANDLER: Check Status ---
  const handleCheckStatus = async () => {
    if (!selectedPatient?.id) {
        setError("Please select a patient first.")
        
        return
    }
    
    setLoading(true); setError(null); setAppointmentInfo(null);

    try {
        
      const res = await checkAppointmentStatus(Number(scheduleId), selectedPatient.id)
       
      if (res.success && res.data) {
            setAppointmentInfo(res.data)

            console.log(res.data)
        } else {
            setError(res.error?.message || "Patient has no appointment in this schedule.")
      
          }
    } catch (e) { setError("System Error") }
   
    setLoading(false)
  }


  const handleStartConsultation = async () => {
    if(!selectedPatient?.id) return;

    setLoading(true)
    

    const res = await getConsultationPatientDetails(selectedPatient.id)
    
    if(res.success && res.data) {
      
      setPatientDetail(res.data)
     
      setViewState('CONSULTATION')
    } else {
    
      setError("Failed to load patient profile")
    }
   
    setLoading(false)
  }


  const handleReset = () => {

    setViewState('SEARCH')
    setAppointmentInfo(null)
    setSelectedPatient(null)
    setPatientDetail(null)
    setError(null)
  }

  if (viewState === 'SEARCH') {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6'>
       
         <Card className='w-full max-w-md overflow-visible'>
            <CardContent className='flex flex-col gap-5'>
                <Alert severity='info' icon={false} className='bg-primary/10 text-primary'>
                    Search for a patient to verify their appointment queue and status.
                </Alert>

                <div className='flex flex-col gap-4'>
                    <AsyncAutocomplete
                        value={selectedPatient}
                        onChange={(newValue: any) => {
                          console.log(newValue)
                          setSelectedPatient(newValue)
                        }}
                        label='Search Patient'
                        fetchUrl='/api/patient/search-by-no' 
                        searchParamKey='patientNo'
                        placeholder='Type Name or NIC'
                        getOptionLabel={(option: any) => `${option.firstName} ${option.lastName} (${option.patientNo})`}
                        fetchInputLenth={2}
                        fullWidth
                    />

                    <Button 
                        variant='contained' fullWidth size='large' 
                        onClick={handleCheckStatus} disabled={loading || !selectedPatient}
                    >
                        {loading ? <CircularProgress size={24} color='inherit'/> : 'Check Status'}
                    </Button>
                    
                    {error && <Typography color='error' variant='body2' className='text-center'>{error}</Typography>}
                </div>

                {appointmentInfo && (
                    <div className='mt-2 border rounded-lg p-4 bg-gray-50 flex flex-col gap-4 animate-fade-in'>
                        <div className='flex items-center gap-4'>
                             <Avatar className='bg-primary/20 text-primary'>{appointmentInfo.fullName.charAt(0)}</Avatar>
                             <div>
                                <Typography className='font-bold'>{appointmentInfo.fullName}</Typography>
                                <Typography variant='body2' color='text.secondary'>{appointmentInfo.patientNo}</Typography>
                             </div>
                        </div>
                        <Divider />
                        <div className='flex justify-between items-center'>
                            <div className='flex flex-col items-center'>
                                <Typography variant='caption' className='uppercase tracking-wide'>Queue No</Typography>
                                <Typography variant='h3' color='primary' className='font-bold'>{appointmentInfo.queueNo}</Typography>
                            </div>
                             <div className='flex flex-col items-end'>
                                <Chip label={appointmentInfo.status} color='warning' variant='tonal' size='small' className='mb-1'/>
                            </div>
                        </div>
                        <Button 
                            variant='contained' color='success' fullWidth startIcon={<i className='tabler-stethoscope' />}
                            onClick={handleStartConsultation} disabled={loading}
                        >
                            {loading ? 'Loading Profile...' : 'Start Consultation'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      
      {/* Header */}
      <div className='flex justify-between items-center flex-wrap gap-4'>
        <div>
            <div className='flex items-center gap-2'>
                <Typography variant='h4'>Consultation Room</Typography>
                <Chip label="Ongoing" color='success' size='small' className='animate-pulse' />
            </div>
            <Typography color='text.secondary'>
                Queue: <span className='font-bold text-black'>{appointmentInfo?.queueNo}</span> | Patient: {patientDetail?.fullName}
            </Typography>
        </div>
        <Button variant='tonal' color='secondary' startIcon={<i className='tabler-x' />} onClick={handleReset}>
            Cancel
        </Button>
      </div>

      <Grid container spacing={6}>
        {/* Left: Patient Profile */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
             {/* We assert patientDetail is not null because viewState only changes if fetch succeeds */}
             {patientDetail && <PatientProfileSidebar patient={patientDetail} />}
        </Grid>

        {/* Right: Prescription */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>

             <PrescriptionManager 
                appointmentId={Number(appointmentInfo?.appointmentId)} 
                onConsultationComplete={handleReset} 
             />
        </Grid>
      </Grid>
    </div>
  )
}

export default ConsultationView
