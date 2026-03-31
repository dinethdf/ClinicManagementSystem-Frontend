'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

// Service Import 
import { 
  createPatientLogin, 
  getPatientLoginStatus, 
  triggerPasswordReset, 
  togglePatientLoginStatus
} from '@/services/patient/patient.server.service'

import type { PatientLoginStatus } from '@/services/patient/patient.server.service'

const PatientLoginCreator = ({ patientId }: { patientId: string }) => {
  // --- States ---
  const [isInitializing, setIsInitializing] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState<PatientLoginStatus | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string } | null>(null)

  // --- Fetch Initial Status ---
  useEffect(() => {
    const fetchStatus = async () => {
      if (!patientId) return
      setIsInitializing(true)
      try {
        const res = await getPatientLoginStatus(patientId)
        if (res.success && res.data) {
          setLoginStatus(res.data)
        } else {
          setFeedback({ type: 'error', message: res.message || 'Failed to load patient login status.' })
        }
      } catch (error) {
        setFeedback({ type: 'error', message: 'An unexpected error occurred.' })
      } finally {
        setIsInitializing(false)
      }
    }
    fetchStatus()
  }, [patientId])

  // --- Action Handlers ---
  
  // 1. Create New Login
  const handleCreateLogin = async () => {
    if (!patientId) return
    setIsLoading(true)
    setFeedback(null)

    const res = await createPatientLogin(patientId)

    if (res.success) {
      setFeedback({ type: 'success', title: 'Account Created', message: res.message })
      setLoginStatus(prev => prev ? { ...prev, hasLogin: true, loginStatus: 'ACTIVE' } : null)
    } else {
      // Custom Title Handling based on backend errorCodes
      let errorTitle = 'Creation Failed'
      
      if (res.errorCode === 'NO_EMAIL') {
        errorTitle = 'Email Missing'
      } else if (res.errorCode === 'ACCOUNT_EXISTS') {
        errorTitle = 'Already Registered'
      }

      setFeedback({ type: 'error', title: errorTitle, message: res.message })
    }
    setIsLoading(false)
  }

  // 2. Forgot Password / Reset Link
  const handleSendResetLink = async () => {
    if (!patientId) return
    setIsLoading(true)
    setFeedback(null)

    const res = await triggerPasswordReset(patientId)

    if (res.success) {
      setFeedback({ type: 'success', title: 'Email Sent', message: res.message })
    } else {
      setFeedback({ type: 'error', title: 'Failed to Send', message: res.message })
    }
    setIsLoading(false)
  }

  // 3. Toggle Account Access (Disable/Enable)
  const handleToggleAccess = async () => {
    if (!patientId || !loginStatus) return
    setIsLoading(true)
    setFeedback(null)

    const action = loginStatus.loginStatus === 'ACTIVE' ? 'disable' : 'enable'
    const res = await togglePatientLoginStatus(patientId, action)

    if (res.success) {
      setFeedback({ type: 'info', message: res.message })
      setLoginStatus(prev => prev ? { ...prev, loginStatus: action === 'enable' ? 'ACTIVE' : 'DISABLED' } : null)
    } else {
      setFeedback({ type: 'error', message: res.message })
    }
    setIsLoading(false)
  }

  // --- Render Helpers ---
  if (isInitializing) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-10">
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader 
        title='Patient Portal Access' 
        action={
          loginStatus?.hasLogin ? (
            <Chip 
              label={loginStatus.loginStatus === 'ACTIVE' ? 'Account Active' : 'Account Disabled'} 
              color={loginStatus.loginStatus === 'ACTIVE' ? 'success' : 'error'} 
              size="small" 
              variant="tonal"
            />
          ) : (
            <Chip label="No Account" color="default" size="small" />
          )
        }
      />
      <Divider />
      <CardContent className='flex flex-col gap-6 pt-6'>
        
        {/* Global Feedback Alert */}
        {feedback && (
          <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
            {feedback.title && <AlertTitle>{feedback.title}</AlertTitle>}
            {feedback.message}
          </Alert>
        )}

        {/* --- STATE 1: Missing Email (Blocks everything) --- */}
        {!loginStatus?.emailOnFile && (
           <Alert severity="warning" icon={<i className='tabler-mail-off text-2xl' />}>
             <AlertTitle>Email Address Required</AlertTitle>
             This patient profile does not have an email address associated with it. You must edit the patient's personal details and add a valid email address before you can create a portal login or send password resets.
           </Alert>
        )}

        {/* --- STATE 2: No Account Exists (But has email) --- */}
        {loginStatus?.emailOnFile && !loginStatus.hasLogin && (
          <div className='flex flex-col gap-4'>
            <Alert severity="info" icon={false} className='border-l-4 border-l-info bg-infoLight'>
              <AlertTitle>Setup Instructions</AlertTitle>
              Clicking the button below will generate a secure username and password for this patient. The credentials will be automatically emailed to the address on file.
            </Alert>
            
            <div>
              <Button 
                variant='contained' 
                onClick={handleCreateLogin} 
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <i className='tabler-user-plus' />}
              >
                {isLoading ? 'Processing...' : 'Create Patient Login'}
              </Button>
            </div>
          </div>
        )}

        {/* --- STATE 3: Account Exists --- */}
        {loginStatus?.emailOnFile && loginStatus.hasLogin && (
          <div className='flex flex-col gap-6'>
            
            {/* Password Reset Section */}
            <Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded bg-actionHover border border-divider">
              <div className="mb-4 sm:mb-0">
                <Typography variant="h6" className="mb-1">Password Reset</Typography>
                <Typography variant="body2" color="text.secondary">
                  Send a secure link to the patient's email to let them reset their password.
                </Typography>
              </div>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={handleSendResetLink}
                disabled={isLoading || loginStatus.loginStatus === 'DISABLED'}
                startIcon={<i className='tabler-mail-forward' />}
              >
                Send Reset Link
              </Button>
            </Box>

            {/* Disable/Enable Account Section */}
            <Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded bg-actionHover border border-divider">
              <div className="mb-4 sm:mb-0">
                <Typography variant="h6" className="mb-1">Account Access</Typography>
                <Typography variant="body2" color="text.secondary">
                  {loginStatus.loginStatus === 'ACTIVE' 
                    ? 'Temporarily revoke the patient\'s access to the portal.'
                    : 'Restore the patient\'s access to the portal.'}
                </Typography>
              </div>
              <Button 
                variant={loginStatus.loginStatus === 'ACTIVE' ? "outlined" : "contained"} 
                color={loginStatus.loginStatus === 'ACTIVE' ? "error" : "success"}
                onClick={handleToggleAccess}
                disabled={isLoading}
                startIcon={<i className={loginStatus.loginStatus === 'ACTIVE' ? 'tabler-user-off' : 'tabler-user-check'} />}
              >
                {loginStatus.loginStatus === 'ACTIVE' ? 'Disable Access' : 'Enable Access'}
              </Button>
            </Box>

          </div>
        )}

      </CardContent>
    </Card>
  )
}

export default PatientLoginCreator