'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

// Child Components
import ScheduleSummaryCard from './ScheduleSummaryCard'
import StepSearch from './StepSearch'
import StepSelectPatient from './StepSelectPatient'
import StepVerifyOtp from './StepVerifyOtp'
import StepConfirmExisting from './StepConfirmExisting'
import StepRegisterNew from './StepRegisterNew'

// Services & Types
import { 
    checkPatientAvailability, 
    bookPublicAppointment,
    sendOtp, 
    verifyOtp 
} from '@/services/doctor/doctor.shedule.server.service'
import type { PublicScheduleDTO, PublicBookingRequest } from '@/types/public-booking.types'

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
  const [step, setStep] = useState<'SEARCH' | 'SELECT_PATIENT' | 'VERIFY_OTP' | 'CONFIRM_EXISTING' | 'REGISTER_NEW'>('SEARCH')
  
  // Data State
  const [foundPatients, setFoundPatients] = useState<any[]>([]) 
  const [existingPatient, setExistingPatient] = useState<any>(null) 

  // OTP & Form State
  const [otp, setOtp] = useState('')
  const [mobileToVerify, setMobileToVerify] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false) 
  const [note, setNote] = useState('')
  
  const [regForm, setRegForm] = useState({
      firstName: '', lastName: '', dob: '', gender: 1, mobileNo: '', nic: '', email: ''
  })

  // --- LOGIC: SEARCH ---
  const handleSearchPatient = async () => {
    if (!identifier.trim()) { setErrorMsg("Please enter an NIC or Mobile Number"); 

return; }

    setLoading(true); setErrorMsg(''); setSuccessMsg('');

    try {
        const res = await checkPatientAvailability(identifier);
        
        if (!res.success && res.message !== "No patient found") {
            setErrorMsg(res.message || "Patient verification failed.");
            setLoading(false);
            
return;
        }

        const patientsList = Array.isArray(res.data) ? res.data : [];

        if (patientsList.length > 1) {
            setFoundPatients(patientsList);
            setStep('SELECT_PATIENT');
            setLoading(false);
        } else if (patientsList.length === 1) {
            handleSelectPatient(patientsList[0]);
        } else {
            handleNewRegistrationSetup();
        }
    } catch (err) {
        console.error("Search Error:", err);
        setErrorMsg('Failed to check availability.');
        setLoading(false);
    }
  }

  const handleNewRegistrationSetup = () => {
      const cleanId = identifier.trim();
      const isNicRegex = /^[0-9]{9}[vVxX]$/.test(cleanId) || (cleanId.length > 10 && !cleanId.startsWith('07')); 
      
      setRegForm(prev => ({
          ...prev,
          nic: isNicRegex ? cleanId : '',
          mobileNo: !isNicRegex ? cleanId : '',
          email: ''
      }));

      if (!isNicRegex && cleanId) {
          setMobileToVerify(cleanId);
          handleSendOtp(cleanId, '');
      } else {
          setStep('REGISTER_NEW');
          setLoading(false);
      }
  }

  const handleSelectPatient = async (patient: any) => {
      setExistingPatient(patient);

      if (patient.mobileNo) {
          setMobileToVerify(patient.mobileNo);
          await handleSendOtp(patient.mobileNo, patient.email || '');
      } else {
          setErrorMsg("Selected patient has no registered mobile number.");
          setLoading(false);
      }
  }

const handleSendOtp = async (mobile: string, email: string = '') => {
      setLoading(true); setErrorMsg(''); setSuccessMsg('');
      
      try {
          const res = await sendOtp(mobile, email) 
          
          if(res.success) {
              setIsOtpSent(true); 
              setStep('VERIFY_OTP'); 

              // UPDATED: Use API message (e.g. "Unable to send SMS...")
              setSuccessMsg(res.message || "OTP sent successfully.") 
          } else {
              // Error case: Use API message or fallback hardcoded value
              setErrorMsg(res.message || "Failed to send OTP")
          }
      } catch (err: any) { 
          // System Error case: Hardcoded fallback
          setErrorMsg(err.message || "System error sending OTP") 
      }
      
      setLoading(false)
  }

// --- LOGIC: VERIFY OTP ---
  const handleVerifyOtp = async () => {
      if(!otp) return
      setLoading(true); setErrorMsg(''); setSuccessMsg('');
      
      try {
          const res = await verifyOtp(mobileToVerify, otp) 
          
          if(res.success && res.data === true) {
              setIsVerified(true); 
              setSuccessMsg(res.message || "Mobile verified successfully.")
              
              if(existingPatient) { 
                  setStep('CONFIRM_EXISTING') 
              } else { 
                  setRegForm(prev => ({ ...prev, mobileNo: mobileToVerify })); 
                  setStep('REGISTER_NEW') 
              }
          } else {
              setErrorMsg(res.message || "Invalid OTP. Please try again.")
          }
      } catch (err: any) { 
          setErrorMsg(err.message || "Verification failed due to a system error.") 
      }

      setLoading(false)
  }

  const handleVerifyNewMobile = async () => {
      if(!regForm.mobileNo) return
      setMobileToVerify(regForm.mobileNo)
      await handleSendOtp(regForm.mobileNo, regForm.email)
  }

  // --- LOGIC: BOOKING ---
  const handleBookAppointment = async () => {
        if(!isVerified) { setErrorMsg("Mobile number not verified!"); 

return; }

        setLoading(true); setErrorMsg(''); setSuccessMsg('');

        try {
            const payload: PublicBookingRequest = {
                scheduleId: selectedSchedule.id,
                existingPatientId: null,
                note: note,
                firstName: '', lastName: '', nic: '', mobileNo: '', dob: '', gender: 1, email: ''
            }

            if (step === 'CONFIRM_EXISTING') {
                payload.existingPatientId = existingPatient.id;
                payload.mobileNo = existingPatient.mobileNo;
                payload.email = existingPatient.email;
            } else {
                if(!regForm.firstName || !regForm.lastName || !regForm.dob || !regForm.nic) {
                    setErrorMsg("Please fill in all required fields."); setLoading(false); 

return;
                }

                payload.firstName = regForm.firstName; payload.lastName = regForm.lastName;
                payload.nic = regForm.nic; payload.mobileNo = regForm.mobileNo; 
                payload.dob = regForm.dob; payload.gender = regForm.gender; payload.email = regForm.email;
            }

            const response = await bookPublicAppointment(payload)

            if (response.success) {
                setSuccessMsg(response.message || "Booking Successful!")
                if(onSubmitBooking) onSubmitBooking(response.data)
            } else {
                setErrorMsg(response.message || "Booking failed.")
            }
        } catch (err: any) {
            console.error("Booking Error:", err); setErrorMsg(err.message || "Booking failed. Please try again.")
        } finally { setLoading(false) }
   }

  const handleReset = () => {
      setStep('SEARCH'); setExistingPatient(null); setFoundPatients([]); setNote('');
      setErrorMsg(''); setSuccessMsg(''); setIsVerified(false); setOtp(''); setIsOtpSent(false);
      setIdentifier(''); setRegForm({ firstName: '', lastName: '', dob: '', gender: 1, mobileNo: '', nic: '', email: '' })
  }

  // --- RENDER ---
  return (
    <Grid container spacing={4} justifyContent="center">
      
      {/* Left Column: Summary Component */}
      <Grid size={{ xs: 12, md: 4 }}>
        <ScheduleSummaryCard selectedSchedule={selectedSchedule} />
      </Grid>

      {/* Right Column: Logic Flow */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card className="h-full border-t-4 border-t-primary">
            <CardContent className="flex flex-col gap-6 p-8">
                
                <div className='mb-2'>
                    <Typography variant="h5" className="font-semibold">
                        {step === 'SEARCH' && "Patient Identification"}
                        {step === 'SELECT_PATIENT' && "Select Patient Profile"}
                        {step === 'VERIFY_OTP' && "Mobile Verification"}
                        {step === 'CONFIRM_EXISTING' && "Confirm Details"}
                        {step === 'REGISTER_NEW' && "New Patient Registration"}
                    </Typography>
                </div>

                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                {successMsg && <Alert severity="success" icon={<i className='tabler-check' />}>{successMsg}</Alert>}

                {/* --- STEPS --- */}
                {step === 'SEARCH' && (
                    <StepSearch 
                        identifier={identifier} setIdentifier={setIdentifier} 
                        loading={loading} onSearch={handleSearchPatient} onBack={onBack} 
                    />
                )}

                {step === 'SELECT_PATIENT' && (
                    <StepSelectPatient 
                        foundPatients={foundPatients} 
                        onSelect={handleSelectPatient} 
                        onRegisterNew={handleNewRegistrationSetup} 
                        onCancel={handleReset} 
                    />
                )}

                {step === 'VERIFY_OTP' && (
                    <StepVerifyOtp 
                        mobile={mobileToVerify} otp={otp} setOtp={setOtp} 
                        loading={loading} onVerify={handleVerifyOtp} onBack={handleReset} 
                    />
                )}

                {step === 'CONFIRM_EXISTING' && existingPatient && (
                    <StepConfirmExisting 
                        patient={existingPatient} note={note} setNote={setNote} 
                        loading={loading} onConfirm={handleBookAppointment} onCancel={handleReset} 
                    />
                )}

                {step === 'REGISTER_NEW' && (
                    <StepRegisterNew 
                        regForm={regForm} setRegForm={setRegForm} 
                        isVerified={isVerified} loading={loading} 
                        onVerifyMobile={handleVerifyNewMobile} 
                        onSubmit={handleBookAppointment} 
                        onCancel={handleReset} 
                    />
                )}

            </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PatientIdentification