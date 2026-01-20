
// src/views/clinic-app/doctor-portal/account-settings/tabs/DoctorSecurityTab.tsx
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
import Divider from '@mui/material/Divider'

import CustomTextField from '@core/components/mui/TextField'
import { requestDoctorOtp, changeDoctorPassword } from '@/services/doctor.server.service'

const DoctorSecurityTab = () => {
  const [step, setStep] = useState<'request' | 'submit'>('request')
  const [isLoading, setIsLoading] = useState(false)
  
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [alertInfo, setAlertInfo] = useState<{ severity: 'success' | 'error' | 'info', message: string } | null>(null)

  const handleRequestOtp = async () => {
    setIsLoading(true)
    setAlertInfo(null)
    const res = await requestDoctorOtp() // Uses /api/auth/staff/password/request-otp
    if (res.success) {
      setStep('submit') 
      setAlertInfo({ severity: 'success', message: 'OTP sent to your registered email.' })
    } else {
      setAlertInfo({ severity: 'error', message: res.error?.message || 'Failed to send OTP' })
    }
    setIsLoading(false)
  }

  const handleSubmitChange = async (e: React.FormEvent) => {
    e.preventDefault()
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
    const res = await changeDoctorPassword(otp, password, confirmPassword) // Uses /api/auth/staff/password/change
    if (res.success) {
      setAlertInfo({ severity: 'success', message: 'Password changed successfully!' })
      setOtp('')
      setPassword('')
      setConfirmPassword('')
      setStep('request') 
    } else {
      setAlertInfo({ severity: 'error', message: res.error?.message || 'Failed to change password' })
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
            {alertInfo && (
                <Alert severity={alertInfo.severity} onClose={() => setAlertInfo(null)}>
                    {alertInfo.message}
                </Alert>
            )}

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

            {step === 'submit' && (
                <form onSubmit={handleSubmitChange}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12 }}>
                             <Alert icon={false} severity='warning'>
                                <AlertTitle>Requirements</AlertTitle>
                                Minimum 8 characters long, uppercase & symbol
                            </Alert>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                             <Typography variant="subtitle2" className='mb-1 font-bold'>Step 1: Enter Verification Code</Typography>
                             <CustomTextField
                                fullWidth
                                label='OTP Code'
                                placeholder='123456'
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                autoComplete='off'
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                             <Divider />
                             <Typography variant="subtitle2" className='mt-2 font-bold'>Step 2: Set New Password</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                            fullWidth
                            label='New Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={isPasswordShown ? 'text' : 'password'}
                            placeholder='············'
                            autoComplete='new-password'
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
                            autoComplete='new-password'
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

export default DoctorSecurityTab