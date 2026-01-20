'use client'

import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

// Service Import
import { createPatientLogin } from '@/services/patient.server.service'

const PatientLoginCreator = ({ patientId }: { patientId: string }) => {
  // States
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string, title?: string } | null>(null)

  const handleCreateLogin = async () => {
    if (!patientId) return

    setIsLoading(true)
    setFeedback(null)

    const res = await createPatientLogin(patientId)

    if (res.success) {
      setFeedback({
        type: 'success',
        title: 'Account Created',
        message: res.message || "Login credentials have been sent to the patient's email."
      })
    } else {
      // Handle Specific Error Codes from API
      let errorTitle = 'Creation Failed'
      let errorMsg = res.message

      if (res.errorCode === 'EMAIL_REQUIRED') {
        errorTitle = 'Email Missing'
        errorMsg = 'This patient profile does not have an email address. Please go to "Edit Details" and add an email first.'
      } else if (res.errorCode === 'ACCOUNT_EXISTS') {
        errorTitle = 'Already Registered'
        errorMsg = 'This patient already has an active login account.'
      } else if (res.message.includes('Forbidden')) {
        errorTitle = 'Permission Denied'
        errorMsg = 'You do not have permission to perform this action.'
      }

      setFeedback({
        type: 'error',
        title: errorTitle,
        message: errorMsg
      })
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader title='Patient Portal Access' />
      <CardContent className='flex flex-col gap-6'>
        
        {/* Feedback Alert */}
        {feedback && (
          <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
            {feedback.title && <AlertTitle>{feedback.title}</AlertTitle>}
            {feedback.message}
          </Alert>
        )}

        {/* Informational Text */}
        {!feedback?.type && (
             <Alert severity="info" icon={false} className='border-l-4 border-l-info'>
                <AlertTitle>Setup Instructions</AlertTitle>
                Clicking the button below will generate a secure username and password for this patient. 
                <br />
                The credentials will be <strong>automatically emailed</strong> to the address on file.
            </Alert>
        )}

        <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-4'>
                <Button 
                    variant='contained' 
                    onClick={handleCreateLogin} 
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <i className='tabler-user-plus' />}
                >
                    {isLoading ? 'Creating Account...' : 'Create Patient Login'}
                </Button>
            </div>
            
            <Typography variant='caption' color='text.disabled'>
                Ensure the patient's email address is correct before proceeding.
            </Typography>
        </div>

      </CardContent>
    </Card>
  )
}

export default PatientLoginCreator