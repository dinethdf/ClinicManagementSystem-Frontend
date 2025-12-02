'use client'

import { useState } from 'react'

import dayjs from 'dayjs'

import CustomDatePicker from '@/@core/components/mui/DatePickerTextField'

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
import { 
    checkPatientAvailability, 
    bookPublicAppointment,
    sendOtp, 
    verifyOtp 
} from '@/services/doctor.shedule.server.service'
import type { PublicScheduleDTO, PublicBookingRequest } from '@/types/public-booking.types'
import data from './../../../../../data/searchData';

interface Props {
  selectedSchedule: PublicScheduleDTO;
  onBack: () => void;
  onSubmitBooking: (response: any) => void;
}

const PatientIdentification = ({ selectedSchedule, onBack, onSubmitBooking }: Props) => {

  // --- State ---
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('') 

  // Flow State
  const [step, setStep] = useState<'SEARCH' | 'VERIFY_OTP' | 'CONFIRM_EXISTING' | 'REGISTER_NEW'>('SEARCH')
  
  // OTP State
  const [otp, setOtp] = useState('')
  const [mobileToVerify, setMobileToVerify] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false) 

  // Data State
  const [existingPatient, setExistingPatient] = useState<any>(null)
  
  // New Patient Form Data
  const [regForm, setRegForm] = useState({
      firstName: '', lastName: '', dob: '', gender: 1, mobileNo: '', nic: '', email: ''
  })
  
  const [note, setNote] = useState('')

  // --- Handlers ---

  // 1. Search Logic
  const handleSearchPatient = async () => {
    if (!identifier) return
    setLoading(true); setErrorMsg(''); setSuccessMsg('');

    try {
        const res = await checkPatientAvailability(identifier)
        
        if (res.data) {
            // SCENARIO A: Patient Found
            setExistingPatient(res.data)
            setMobileToVerify(res.data.mobileNo)
            // Send OTP using the EXISTING patient's email and mobile
            await handleSendOtp(res.data.mobileNo, res.data.email)
        } else {
            // SCENARIO B: New Patient
            const isNic = identifier.toLowerCase().includes('v') || identifier.length > 9;
            const mobileInput = !isNic ? identifier : '' 
            
            setRegForm(prev => ({
                ...prev,
                nic: isNic ? identifier : '',
                mobileNo: mobileInput,
                email: '' // Reset email for new registration
            }))

            if(mobileInput) {
                // If searched by mobile, verify it immediately. 
                // Note: We don't have an email yet for a new user in this specific auto-step.
                setMobileToVerify(mobileInput)
                await handleSendOtp(mobileInput, '') 
            } else {
                setStep('REGISTER_NEW') 
            }
        }
    } catch (err) {
        setErrorMsg('Failed to check availability. Please try again.')
    } finally {
        setLoading(false)
    }
  }

  // 2. Send OTP (Accepts Mobile & Email)
  const handleSendOtp = async (mobile: string, email: string = '') => {
      setLoading(true); setErrorMsg(''); setSuccessMsg('');
      try {
          // Send both mobile and email to backend
          const res = await sendOtp(mobile, email) 
          if(res.success) {
              setIsOtpSent(true)
              setStep('VERIFY_OTP')
              setSuccessMsg(res.message || "OTP sent successfully.")
          } else {
              setErrorMsg(res.message || "Failed to send OTP")
          }
      } catch (err: any) { 
          setErrorMsg(err.message || "System error sending OTP") 
      }
      setLoading(false)
  }

  // 3. Verify OTP
  const handleVerifyOtp = async () => {
      if(!otp) return
      setLoading(true); setErrorMsg(''); setSuccessMsg('');
      try {
          const res = await verifyOtp(mobileToVerify, otp) 
          
          if(res.success && res.data === true) {
              setIsVerified(true)
              setSuccessMsg(res.message || "Mobile verified successfully.")

              if(existingPatient) {
                  setStep('CONFIRM_EXISTING')
              } else {
                  setRegForm(prev => ({ ...prev, mobileNo: mobileToVerify }))
                  setStep('REGISTER_NEW')
              }
          } else {
              setErrorMsg(res.message || "Invalid OTP. Please try again.")
          }
      } catch (err: any) { 
          setErrorMsg(err.message || "Verification failed") 
      }
      setLoading(false)
  }

  // 4. Booking Submission
  const handleBookAppointment = async () => {
      if(!isVerified) { setErrorMsg("Mobile number not verified!"); return; }

      setLoading(true); setErrorMsg(''); setSuccessMsg('');

      try {
          const payload: PublicBookingRequest = {
              scheduleId: selectedSchedule.id,
              existingPatientId: null,
              note: note
          }

          if (step === 'CONFIRM_EXISTING') {
              payload.existingPatientId = existingPatient.id
              payload.mobileNo = existingPatient.mobileNo
              payload.email = existingPatient.email 
          } else {
              if(!regForm.firstName || !regForm.lastName || !regForm.dob || !regForm.nic) {
                  setErrorMsg("Please fill in all required fields.")
                  setLoading(false); return;
              }
              payload.existingPatientId = null
              payload.firstName = regForm.firstName
              payload.lastName = regForm.lastName
              payload.nic = regForm.nic
              payload.mobileNo = regForm.mobileNo 
              payload.dob = regForm.dob
              payload.gender = regForm.gender
              payload.email = existingPatient.email
          }

          const response = await bookPublicAppointment(payload)
          
          if (response.success) {
             setSuccessMsg(response.message || "Booking Successful!")
             onSubmitBooking(response.data)
          } else {
             setErrorMsg(response.message || "Booking failed.")
          }

      } catch (err: any) {
          console.error(err)
          setErrorMsg(err.message || "Booking failed. Please try again.")
      } finally {
          setLoading(false)
      }
  }

  // New Patient flow triggers OTP (Sends Email + Mobile from Form)
  const handleVerifyNewMobile = async () => {
      if(!regForm.mobileNo) return
      setMobileToVerify(regForm.mobileNo)
      // Send both the entered mobile AND entered email
      await handleSendOtp(regForm.mobileNo, regForm.email)
  }

  const handleReset = () => {
      setStep('SEARCH')
      setExistingPatient(null)
      setNote('')
      setErrorMsg('')
      setSuccessMsg('')
      setIsVerified(false)
      setOtp('')
      setIsOtpSent(false)
      setIdentifier('')
      // regForm is reset when navigating back or you can reset it here explicitly
  }

  return (
    <Grid container spacing={4} justifyContent="center">
      
      {/* LEFT COLUMN: Summary */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card className="bg-gray-50/50 border-gray-200 border h-full">
             <CardContent className="p-6">
                 <Typography variant="h6" className="font-bold">{selectedSchedule.doctorName}</Typography>
                 <Typography color="text.secondary">{selectedSchedule.specialization}</Typography>
                 <Divider className="my-4"/>
                 <div className="flex justify-between">
                     <Typography>Date:</Typography>
                     <Typography className="font-bold">{selectedSchedule.scheduleDate}</Typography>
                 </div>
                 <div className="flex justify-between mt-2">
                     <Typography>Total Fee:</Typography>
                     <Typography className="font-bold text-primary">LKR {(selectedSchedule.doctorFee + selectedSchedule.clinicFee).toFixed(0)}</Typography>
                 </div>
             </CardContent>
        </Card>
      </Grid>

      {/* RIGHT COLUMN: Logic Flow */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card className="h-full border-t-4 border-t-primary">
            <CardContent className="flex flex-col gap-6 p-8">
                
                <div className='mb-2'>
                    <Typography variant="h5" className="font-semibold">
                        {step === 'SEARCH' && "Patient Identification"}
                        {step === 'VERIFY_OTP' && "Mobile Verification"}
                        {step === 'CONFIRM_EXISTING' && "Confirm Details"}
                        {step === 'REGISTER_NEW' && "New Patient Registration"}
                    </Typography>
                </div>

                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                {successMsg && <Alert severity="success" icon={<i className='tabler-check' />}>{successMsg}</Alert>}

                {/* --- VIEW 1: SEARCH --- */}
                {step === 'SEARCH' && (
                    <div className="flex flex-col gap-5 animate-in fade-in">
                        <TextField 
                            label="NIC or Mobile Number" 
                            fullWidth 
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="e.g., 200012345678 or 0771234567"
                        />
                        {/* Email Input Removed from here as requested */}
                        
                        <div className='flex gap-3 justify-end'>
                            <Button onClick={onBack} color="inherit">Back</Button>
                            <Button variant="contained" size="large" onClick={handleSearchPatient} disabled={!identifier || loading}>
                                {loading ? <CircularProgress size={20} color="inherit" /> : 'Check Availability'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* --- VIEW 2: VERIFY OTP --- */}
                {step === 'VERIFY_OTP' && (
                    <div className="flex flex-col gap-5 animate-in fade-in">
                        <Alert severity="info">
                            We sent a verification code to <strong>{mobileToVerify}</strong>.
                        </Alert>
                        <TextField 
                            label="Enter OTP Code" 
                            fullWidth 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="e.g. 123456"
                        />
                        <div className='flex gap-3 justify-end'>
                            <Button onClick={handleReset} color="inherit">Back</Button>
                            <Button variant="contained" onClick={handleVerifyOtp} disabled={!otp || loading}>
                                {loading ? 'Verifying...' : 'Verify & Proceed'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* --- VIEW 3: CONFIRM EXISTING --- */}
                {step === 'CONFIRM_EXISTING' && existingPatient && (
                    <div className="flex flex-col gap-4 animate-in fade-in">
                        <Alert severity="success" icon={false} className="border-green-200 border">
                            <div className="flex justify-between items-center w-full">
                                <div>
                                    <Typography variant="caption" className="uppercase font-bold text-green-700">Patient</Typography>
                                    <Typography variant="h6" className="text-green-900">{existingPatient.firstName} {existingPatient.lastName}</Typography>
                                </div>
                                <Chip label="Mobile Verified" color="success" size="small" icon={<i className='tabler-check'/>} />
                            </div>
                        </Alert>

                        <TextField 
                            label="Note / Reason (Optional)" 
                            fullWidth multiline rows={2}
                            value={note} onChange={(e) => setNote(e.target.value)}
                        />

                        <div className="flex gap-3 mt-4">
                             <Button variant="outlined" color="error" onClick={handleReset} fullWidth>Not You?</Button>
                             <Button variant="contained" fullWidth size="large" onClick={handleBookAppointment} disabled={loading}>
                                {loading ? 'Booking...' : 'Confirm Appointment'}
                             </Button>
                        </div>
                    </div>
                )}

                {/* --- VIEW 4: REGISTER NEW --- */}
                {step === 'REGISTER_NEW' && (
                    <div className="flex flex-col gap-4 animate-in fade-in">
                        <Alert severity="info" className="mb-2">New Patient Registration</Alert>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="First Name" fullWidth required value={regForm.firstName} onChange={(e) => setRegForm({...regForm, firstName: e.target.value})} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Last Name" fullWidth required value={regForm.lastName} onChange={(e) => setRegForm({...regForm, lastName: e.target.value})} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="NIC" fullWidth required value={regForm.nic} onChange={(e) => setRegForm({...regForm, nic: e.target.value})} />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <CustomDatePicker
                                    label='Date Of Birth'
                                    value={regForm.dob ? dayjs(regForm.dob) : null}
                                    onChange={(newValue) => {
                                        setRegForm({
                                            ...regForm,
                                            dob: newValue ? newValue.format('YYYY-MM-DD') : ''
                                        })
                                    }}
                                    openTo='year'
                                    views={['year', 'month', 'day']}
                                    yearsOrder='desc'
                                    maxDate={dayjs()}
                                    format='YYYY-MM-DD'
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Email Field - Shown only in Registration */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Email" fullWidth value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <div className='flex gap-2 items-center'>
                                    <TextField 
                                        label="Mobile No" fullWidth required 
                                        value={regForm.mobileNo} 
                                        onChange={(e) => setRegForm({...regForm, mobileNo: e.target.value})} 
                                        disabled={isVerified} 
                                    />
                                    {!isVerified && (
                                        <Button variant='contained' size='small' onClick={handleVerifyNewMobile} disabled={!regForm.mobileNo || loading}>
                                            Verify
                                        </Button>
                                    )}
                                    {isVerified && <Chip label="Verified" color='success' size='small'/>}
                                </div>
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
                        </Grid>

                        <div className="flex gap-3 mt-4">
                             <Button variant="outlined" color="inherit" onClick={handleReset}>Cancel</Button>
                             <Button variant="contained" fullWidth size="large" onClick={handleBookAppointment} disabled={loading || !isVerified}>
                                {loading ? 'Creating...' : 'Register & Book'}
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