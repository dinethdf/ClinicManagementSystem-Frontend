'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'

// Service & Type Imports
import { checkPatientAvailability, bookPublicAppointment } from '@/services/doctor.shedule.server.service'
import type { PublicScheduleDTO, PublicBookingRequest } from '@/types/public-booking.types'

interface Props {
  selectedSchedule: PublicScheduleDTO;
  onBack: () => void;
  onSubmitBooking: (response: any) => void; // Passed back to wizard on success
}

const PatientIdentification = ({ selectedSchedule, onBack, onSubmitBooking }: Props) => {

  const queueNumber = selectedSchedule.registeredPatientCount + 1

  // --- State ---
  const [identifier, setIdentifier] = useState('') 
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Flow State
  const [step, setStep] = useState<'SEARCH' | 'CONFIRM_EXISTING' | 'REGISTER_NEW'>('SEARCH')
  
  // Data State
  const [existingPatient, setExistingPatient] = useState<any>(null)
  
  // New Patient Form Data
  const [regForm, setRegForm] = useState({
      firstName: '',
      lastName: '',
      dob: '',
      gender: 1, // Default 1 (Male)
      mobileNo: '', // Will pre-fill from search if mobile used
      nic: ''       // Will pre-fill from search if nic used
  })
  
  const [note, setNote] = useState('')

  // --- Handlers ---

  // 1. Search Logic
  const handleSearchPatient = async () => {
    if (!identifier) return
    setLoading(true)
    setErrorMsg('')

    try {
        const res = await checkPatientAvailability(identifier)
        
        if (res.data) {
            // SCENARIO A: Patient Found
            setExistingPatient(res.data)
            setStep('CONFIRM_EXISTING')
        } else {
            // SCENARIO B: Patient Not Found -> Show Registration Form
            // Pre-fill fields based on what they typed
            const isNic = identifier.toLowerCase().includes('v') || identifier.length > 9;
            
            setRegForm(prev => ({
                ...prev,
                nic: isNic ? identifier : '',
                mobileNo: !isNic ? identifier : ''
            }))
            setStep('REGISTER_NEW')
        }
    } catch (err) {
        setErrorMsg('Failed to check availability. Please try again.')
    } finally {
        setLoading(false)
    }
  }

  // 2. Booking Submission
  const handleBookAppointment = async () => {
      setLoading(true)
      setErrorMsg('')

      try {
          const payload: PublicBookingRequest = {
              scheduleId: selectedSchedule.id,
              existingPatientId: null,
              note: note
          }

          if (step === 'CONFIRM_EXISTING') {
              // --- Case 1: Existing Patient ---
              payload.existingPatientId = existingPatient.id
          } else {
              // --- Case 2: New Patient ---
              // Validate inputs
              if(!regForm.firstName || !regForm.lastName || !regForm.dob || !regForm.mobileNo || !regForm.nic) {
                  setErrorMsg("Please fill in all required fields.")
                  setLoading(false)
                 
                  return;
              }

              payload.existingPatientId = null // Explicitly null
              payload.firstName = regForm.firstName
              payload.lastName = regForm.lastName
              payload.nic = regForm.nic
              payload.mobileNo = regForm.mobileNo
              payload.dob = regForm.dob
              payload.gender = regForm.gender
          }

          // Call API
          const response = await bookPublicAppointment(payload)
          
          // Notify Parent (Wizard) to show Success Screen
          onSubmitBooking(response.data)

      } catch (err: any) {
          console.error(err)
          setErrorMsg(err.message || "Booking failed. Please try again.")
      } finally {
          setLoading(false)
      }
  }

  const handleReset = () => {
      setStep('SEARCH')
      setExistingPatient(null)
      setNote('')
      setErrorMsg('')
  }

  return (
    <Grid container spacing={4} justifyContent="center">
      
      {/* LEFT COLUMN: Summary (Same as before) */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card className="bg-gray-50/50 border-gray-200 border h-full">
            <CardContent className="flex flex-col gap-5 p-6 h-full">
                {/* Doctor Header */}
                <div className="flex flex-col items-center text-center">
                    <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 text-xl font-bold'>
                         {selectedSchedule.doctorName.charAt(0)}
                    </div>
                    <Typography variant="h6" className="font-bold leading-tight">
                        {selectedSchedule.doctorName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {selectedSchedule.specialization}
                    </Typography>
                </div>
                <Divider />
                {/* Date Highlight */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center shadow-sm">
                    <Typography variant="caption" className="uppercase text-gray-500 font-semibold tracking-wide">
                        Appointment Date
                    </Typography>
                    <Typography variant="h5" color="primary" className="font-bold my-1">
                        {selectedSchedule.scheduleDate}
                    </Typography>
                    <div className="inline-flex items-center justify-center bg-primary/5 px-3 py-1 rounded-full mt-1">
                        <Typography variant="body2" className="font-medium text-primary">
                            {selectedSchedule.startTime.substring(0,5)} - {selectedSchedule.endTime.substring(0,5)}
                        </Typography>
                    </div>
                </div>
                {/* Footer Details */}
                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="flex flex-col">
                        <Typography variant="caption" className="text-gray-500">Queue No</Typography>
                        <Typography variant="h6" className="font-semibold text-gray-700">
                             #{String(queueNumber).padStart(2, '0')}
                        </Typography>
                    </div>
                    <div className="flex flex-col text-right">
                        <Typography variant="caption" className="text-gray-500">Total Fee</Typography>
                        <Typography variant="h6" className="font-bold text-primary">
                             LKR {(selectedSchedule.doctorFee + selectedSchedule.clinicFee).toFixed(0)}
                        </Typography>
                    </div>
                </div>
            </CardContent>
        </Card>
      </Grid>

      {/* RIGHT COLUMN: Logic Flow */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card className="h-full border-t-4 border-t-primary">
            <CardContent className="flex flex-col gap-6 p-8">
                
                {/* Header Text Changes based on Step */}
                <div className='mb-2'>
                    <Typography variant="h5" className="font-semibold">
                        {step === 'SEARCH' && "Patient Identification"}
                        {step === 'CONFIRM_EXISTING' && "Confirm Details"}
                        {step === 'REGISTER_NEW' && "New Patient Registration"}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                        {step === 'SEARCH' && "Enter your NIC or Mobile Number to proceed."}
                        {step === 'CONFIRM_EXISTING' && "We found your details. Please confirm below."}
                        {step === 'REGISTER_NEW' && "We couldn't find an account. Please enter your details to book."}
                    </Typography>
                </div>

                {/* ERROR ALERT */}
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}


                {/* --- VIEW 1: SEARCH --- */}
                {step === 'SEARCH' && (
                    <div className="flex flex-col gap-5 mt-2 animate-in fade-in">
                        <TextField 
                            label="NIC or Mobile Number" 
                            fullWidth 
                            variant="outlined"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="e.g., 200012345678 or 0771234567"
                            disabled={loading}
                        />
                        <div className='flex gap-3 justify-end'>
                            <Button onClick={onBack} disabled={loading} color="inherit">Back</Button>
                            <Button 
                                variant="contained" 
                                size="large"
                                onClick={handleSearchPatient}
                                disabled={!identifier || loading}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? 'Checking...' : 'Check Availability'}
                            </Button>
                        </div>
                    </div>
                )}


                {/* --- VIEW 2: CONFIRM EXISTING --- */}
                {step === 'CONFIRM_EXISTING' && existingPatient && (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4">
                        <Alert severity="success" icon={false} className="border-green-200 border">
                            <div className="flex justify-between items-center w-full">
                                <div>
                                    <Typography variant="caption" className="uppercase font-bold text-green-700">Patient Name</Typography>
                                    <Typography variant="h6" className="text-green-900">{existingPatient.firstName} {existingPatient.lastName}</Typography>
                                </div>
                                <Chip label="Verified Account" color="success" size="small" />
                            </div>
                        </Alert>

                        <TextField 
                            label="Note / Reason (Optional)" 
                            fullWidth 
                            multiline rows={2}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g., Fever for 2 days"
                        />

                        <div className="flex gap-3 mt-4">
                             <Button variant="outlined" color="error" onClick={handleReset} fullWidth>
                                Not You?
                             </Button>
                             <Button 
                                variant="contained" fullWidth size="large"
                                onClick={handleBookAppointment}
                                disabled={loading}
                             >
                                {loading ? 'Booking...' : 'Confirm Appointment'}
                             </Button>
                        </div>
                    </div>
                )}


                {/* --- VIEW 3: REGISTER NEW --- */}
                {step === 'REGISTER_NEW' && (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8">
                        <Alert severity="info" className="mb-2">
                             You are booking as a new patient. We will create an account for you automatically.
                        </Alert>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="First Name" fullWidth required 
                                    value={regForm.firstName}
                                    onChange={(e) => setRegForm({...regForm, firstName: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Last Name" fullWidth required
                                    value={regForm.lastName}
                                    onChange={(e) => setRegForm({...regForm, lastName: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="NIC" fullWidth required
                                    value={regForm.nic}
                                    onChange={(e) => setRegForm({...regForm, nic: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Mobile No" fullWidth required
                                    value={regForm.mobileNo}
                                    onChange={(e) => setRegForm({...regForm, mobileNo: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Date of Birth" type="date" fullWidth required
                                    InputLabelProps={{ shrink: true }}
                                    value={regForm.dob}
                                    onChange={(e) => setRegForm({...regForm, dob: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField select label="Gender" fullWidth required
                                    value={regForm.gender}
                                    onChange={(e) => setRegForm({...regForm, gender: Number(e.target.value)})}
                                >
                                    <MenuItem value={1}>Male</MenuItem>
                                    <MenuItem value={2}>Female</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField label="Note / Reason" fullWidth multiline rows={2}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <div className="flex gap-3 mt-4">
                             <Button variant="outlined" color="inherit" onClick={handleReset}>
                                Cancel
                             </Button>
                             <Button 
                                variant="contained" fullWidth size="large"
                                onClick={handleBookAppointment}
                                disabled={loading}
                             >
                                {loading ? 'Creating & Booking...' : 'Register & Book'}
                             </Button>
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PatientIdentification