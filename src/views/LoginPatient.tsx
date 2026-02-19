'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import { toast } from 'react-toastify'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import BackDropFullScreen from '@/components/BackDropFullScreen'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { getClinicDetails, logoutAndRedirect, setLoginCookie } from '@/libs/authentication'
import { saveClinicDetails, saveUserDetails } from '@/utils/common'

// Config
import themeConfig from '@configs/themeConfig'
import type { Locale } from '@configs/i18n'
import type { SystemMode } from '@/@core/types'

// --- Types & Schema ---
type ErrorType = {
  message: string[]
}

const schema = object({
  clinicCode: pipe(string(), nonEmpty('Clinic info missing')), // Validates that URL param exists
  email: pipe(string(), minLength(1, 'This field is required'), email('Email is invalid')),
  password: pipe(string(), nonEmpty('This field is required'), minLength(1, 'Password required'))
})

type FormData = InferInput<typeof schema>

// Styled Component
const AuthIllustrationWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 450,
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    '&:before': {
      zIndex: -1,
      position: 'absolute',
      height: '234px',
      width: '238px',
      content: '""',
      top: '-80px',
      left: '-45px',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='238' height='234' viewBox='0 0 238 234' fill='none'%3E%3Crect x='87.9395' y='0.5' width='149' height='149' rx='19.5' stroke='%23${theme.palette.primary.main.slice(1)}' stroke-opacity='0.16'/%3E%3Crect y='33.5608' width='200' height='200' rx='10' fill='%23${theme.palette.primary.main.slice(1)}' fill-opacity='0.08'/%3E%3C/svg%3E")`
    },
    '&:after': {
      zIndex: -1,
      position: 'absolute',
      height: '180px',
      width: '180px',
      content: '""',
      right: '-57px',
      bottom: '-64px',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180' fill='none'%3E%3Crect x='1' y='1' width='178' height='178' rx='19' stroke='%23${theme.palette.primary.main.slice(1)}' stroke-opacity='0.16' stroke-width='2' stroke-dasharray='8 8'/%3E%3Crect x='22.5' y='22.5' width='135' height='135' rx='10' fill='%23${theme.palette.primary.main.slice(1)}' fill-opacity='0.08'/%3E%3C/svg%3E")`
    }
  }
}))

const LoginPatient = ({ mode }: { mode: SystemMode }) => {
  // --- States ---
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // --- Hooks ---
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()

  // Extract 'clinic' param from URL (e.g., login?type=patient&clinic=my-clinic-123)
  const clinicCodeParam = searchParams.get('clinic') || ''

  // --- Form Setup ---
  const {
    control,
    handleSubmit,
    setValue, // For quick login
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      clinicCode: clinicCodeParam, // Pre-fill from URL
      email: '',
      password: ''
    }
  })

  // --- Handlers ---
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setIsLoading(true)
    setErrorState(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login-next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            clinicCode: data.clinicCode, // Send the code from URL
            email: data.email.trim(), 
            password: data.password.trim(), 
            type: "patient" 
        })
      })

      if (!res.ok) {
        if (res.status === 401) {
          setErrorState({ message: ['Invalid email or password'] })
        } else {
          setErrorState({ message: [`Login failed. Please try again.`] })
        }
        return
      }

      const result = await res.json()

      if (result?.success === true && result?.data?.accessToken) {
        await setLoginCookie(result.data.accessToken, result.data.refreshToken)

        saveUserDetails({
          userName: result.data.userName,
          userEmail: result.data.userEmail,
          userImg: result.data.userImg,
          userRole: result.data.userRole
        })

        try {
            const clinicInfo = await getClinicDetails(result.data.accessToken);
            if (clinicInfo) await saveClinicDetails(clinicInfo);
        } catch (clinicError) {
            console.error("Could not fetch clinic info", clinicError);
        }        

        const redirectURL = searchParams.get('redirectTo') ?? '/patient'
        
        toast.success('Welcome back!')
        router.replace(getLocalizedUrl(redirectURL, locale as Locale))
      } else {
        setErrorState({ message: ['Authentication failed'] })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorState({ message: ['Network error'] })
    } finally {
      setIsLoading(false)
    }
  }

  // --- Quick Login Helper (For Demo) ---
  const quickLogin = (email: string, pass: string) => {
      setValue('email', email);
      setValue('password', pass);
  }

  // --- Logout Logic ---
  const unAuthState = searchParams.get('unAuth') ?? ''
  useEffect(() => {
    if (unAuthState == '1') {
      try {
        logoutAndRedirect()
      } catch (error) {
        console.error(error)
      }
    }
  }, [unAuthState])

  return (
    <AuthIllustrationWrapper>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='sm:p-12'>
          <div className='flex justify-center mbe-6'>
            <Logo />
          </div>
          <div className='flex flex-col gap-1 mbe-6 text-center'>
            <Typography variant='h4'>{`Patient Portal`}</Typography>
            {clinicCodeParam ? (
                <Typography variant='body2' className="text-gray-500">
                    Signing in to <span className="font-bold text-primary">{clinicCodeParam}</span>
                </Typography>
            ) : (
                <Alert severity="warning">
                    No Clinic Selected. Please use the link provided by your clinic.
                </Alert>
            )}
          </div>

          {errorState && (
            <Alert severity='error' className='mbe-4'>
              {errorState.message.join(', ')}
            </Alert>
          )}

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            
            {/* HIDDEN / READ-ONLY Clinic Field */}
            <div className='hidden'>
                <Controller
                    name='clinicCode'
                    control={control}
                    render={({ field }) => <input {...field} type="hidden" />}
                />
            </div>

            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='patient@email.com'
                  {...((errors.email || errorState !== null) && {
                    error: true,
                    helperText: errors?.email?.message || errorState?.message[0]
                  })}
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  type={isPasswordShown ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...(errors.password && { error: true, helperText: errors.password.message })}
                />
              )}
            />

            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
              <Typography
                className='text-end'
                color='primary.main'
                component={Link}
                href={getLocalizedUrl('/forgot-password', locale as Locale)}
              >
                Forgot password?
              </Typography>
            </div>

            <Button fullWidth variant='contained' type='submit' disabled={isLoading || !clinicCodeParam}>
              {isLoading ? 'Loading...' : 'Login'}
            </Button>

            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New User?</Typography>
              <Typography
                component={Link}
                href={getLocalizedUrl(`/register?clinic=${clinicCodeParam}`, locale as Locale)}
                color='primary.main'
              >
                Register Here
              </Typography>
            </div>
          </form>
        </CardContent>
      </Card>
      <BackDropFullScreen open={isLoading} />
    </AuthIllustrationWrapper>
  )
}

export default LoginPatient