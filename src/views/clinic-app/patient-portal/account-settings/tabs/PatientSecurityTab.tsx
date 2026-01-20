'use client'

import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Service Import
import { requestOtp, changePassword } from '@/services/patient.server.service'

const PatientSecurityTab = () => {
  // --- States ---
  const [step, setStep] = useState<'request' | 'submit'>('request')
  const [isLoading, setIsLoading] = useState(false)
  
  // Form Data
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Visibility States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  // Feedback States
  const [alertInfo, setAlertInfo] = useState<{ severity: 'success' | 'error' | 'info', message: string } | null>(null)

  // --- Handlers ---

  const handleRequestOtp = async () => {
    setIsLoading(true)
    setAlertInfo(null)

    const res : any = await requestOtp()

    if (res.success) {
      setStep('submit') // Move to next step
      setAlertInfo({ severity: 'success', message: 'OTP sent to your registered email.' })
    } else {
      setAlertInfo({ severity: 'error', message: res.message })
    }
    setIsLoading(false)
  }

  const handleSubmitChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic Client Validation
    if (!otp) {
        setAlertInfo({ severity: 'error', message: 'Please enter the OTP.' })
        return
    }
    if (password !== confirmPassword) {
        setAlertInfo({ severity: 'error', message: 'Passwords do not match.' })
        return
    }

    setIsLoading(true)
    setAlertInfo(null)

    const res: any = await changePassword(otp, password, confirmPassword)

    if (res.success) {
      setAlertInfo({ severity: 'success', message: 'Password changed successfully!' })
      // Reset form
      setOtp('')
      setPassword('')
      setConfirmPassword('')
      setStep('request')
    } else {
      setAlertInfo({ severity: 'error', message: res.message })
    }
    setIsLoading(false)
  }

  const handleReset = () => {
      setStep('request')
      setOtp('')
      setPassword('')
      setConfirmPassword('')
      setAlertInfo(null)
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Change Password' />
          <CardContent className='flex flex-col gap-4'>
            
            {/* Status Alert */}
            {alertInfo && (
                <Alert severity={alertInfo.severity} onClose={() => setAlertInfo(null)}>
                    {alertInfo.message}
                </Alert>
            )}

            {/* --- STEP 1: REQUEST OTP --- */}
            {step === 'request' && (
                <div className='flex flex-col gap-4 items-start'>
                    <Alert icon={false} severity='info' className='w-full'>
                        <AlertTitle>Security Verification</AlertTitle>
                        To change your password, we need to verify your identity. Click the button below to receive an OTP on your email.
                    </Alert>
                    
                    <Button 
                        variant='contained' 
                        onClick={handleRequestOtp} 
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <i className='tabler-mail-forward' />}
                    >
                        {isLoading ? 'Sending...' : 'Send OTP & Proceed'}
                    </Button>
                </div>
            )}

            {/* --- STEP 2: ENTER DETAILS --- */}
            {step === 'submit' && (
                <form onSubmit={handleSubmitChange}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12 }}>
                             <Alert icon={false} severity='warning'>
                                <AlertTitle>Ensure that these requirements are met</AlertTitle>
                                Minimum 8 characters long, uppercase & symbol
                            </Alert>
                        </Grid>

{/* OTP Input */}
                        <Grid size={{ xs: 12 }}>
                             <Typography variant="subtitle2" className='mb-1 font-bold'>Step 1: Enter Verification Code</Typography>
                             <CustomTextField
                                fullWidth
                                id='PasswordResetOTP'
                                label='OTP Code'
                                placeholder='123456'
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                autoComplete='off' // <--- Prevents autocomplete for OTP
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                             <Divider />
                             <Typography variant="subtitle2" className='mt-2 font-bold'>Step 2: Set New Password</Typography>
                        </Grid>

                        {/* Password Inputs */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                            fullWidth
                            label='New Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={isPasswordShown ? 'text' : 'password'}
                            placeholder='············'
                            autoComplete='new-password' // <--- Key change: stops browser pre-fill
                            InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                <IconButton
                                    edge='end'
                                    onClick={() => setIsPasswordShown(!isPasswordShown)}
                                    onMouseDown={e => e.preventDefault()}
                                >
                                    <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                </IconButton>
                                </InputAdornment>
                            )
                            }}
                        />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                            fullWidth
                            label='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type={isConfirmPasswordShown ? 'text' : 'password'}
                            placeholder='············'
                            autoComplete='new-password' // <--- Key change: stops browser pre-fill
                            InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                <IconButton
                                    edge='end'
                                    onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                                    onMouseDown={e => e.preventDefault()}
                                >
                                    <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                </IconButton>
                                </InputAdornment>
                            )
                            }}
                        />
                        </Grid>
                        
                        {/* Actions */}
                        <Grid size={{ xs: 12 }} className='mt-2 flex gap-4'>
                        <Button variant='contained' type='submit' disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Change Password'}
                        </Button>
                        <Button variant='tonal' color='secondary' onClick={handleReset} disabled={isLoading}>
                            Cancel
                        </Button>
                        </Grid>
                    </Grid>
                </form>
            )}

          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

// Helper component for simple divider if not imported
const Divider = ({ className }: { className?: string }) => (
    <hr className={`border-gray-200 dark:border-gray-700 my-2 ${className}`} />
)

export default PatientSecurityTab