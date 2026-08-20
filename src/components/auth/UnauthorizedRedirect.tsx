'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// --- Props Definition ---
interface Props {
  title?: string
  message?: string
  subMessage?: string
  redirectPath?: string
  delay?: number // in seconds
  variant?: 'error' | 'warning' | 'info'
}

const UnauthorizedRedirect = ({
  title = 'Access Denied',
  message = 'You do not have permission to access this page.',
  subMessage,
  redirectPath = '/', // Default redirects to home/dashboard
  delay = 3, // Default 3 seconds
  variant = 'error'
}: Props) => {
  
  const router = useRouter()
  const [count, setCount] = useState(delay)

  useEffect(() => {
    // 1. Countdown Timer
    const timer = setInterval(() => {
      setCount((prev) => prev - 1)
    }, 1000)

    // 2. Redirect Timeout
    const redirectTimeout = setTimeout(() => {
      router.push(redirectPath)
    }, delay * 1000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimeout)
    }
  }, [router, redirectPath, delay])

  // Map variant to icon (Optional styling tweak)
  const getIcon = () => {
      if (variant === 'warning') return <i className='tabler-alert-triangle text-2xl'/>
      if (variant === 'info') return <i className='tabler-info-circle text-2xl'/>
      
return <i className='tabler-lock-off text-2xl'/>
  }

  return (
    <Box className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6 animate-in zoom-in-95 duration-300">
      
      {/* Alert Component */}
      <Alert 
        severity={variant} 
        variant="filled" 
        className="max-w-md w-full shadow-xl"
        icon={getIcon()}
      >
        <AlertTitle className="font-bold text-lg">{title}</AlertTitle>
        {message}
        {subMessage && (
            <Typography variant='caption' className='block mt-1 opacity-90 font-mono bg-black/10 p-1 rounded'>
                 {subMessage}
            </Typography>
        )}
      </Alert>
      
      {/* Feedback & Actions */}
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <div className='flex items-center gap-2'>
            <CircularProgress size={20} color='inherit' />
            <Typography variant='body2'>Redirecting in {count}s...</Typography>
        </div>
        
        <Button 
            variant='outlined' 
            color='secondary'
            size='small' 
            onClick={() => router.push(redirectPath)}
            startIcon={<i className='tabler-arrow-right' />}
        >
            Go Immediately
        </Button>
      </div>
    </Box>
  )
}

export default UnauthorizedRedirect