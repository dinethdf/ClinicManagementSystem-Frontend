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
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import { toast } from 'react-toastify'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { SystemMode } from '@/@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import BackDropFullScreen from '@/components/BackDropFullScreen'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { logoutAndRedirect, setLoginCookie, saveUserDetails } from '@/libs/authentication'
import { styled } from '@mui/material/styles'


// --- Types & Schema (From Previous Component) ---
type ErrorType = {
  message: string[]
}

const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Email is invalid')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(1, 'Password must be at least 1 characters long')
  )
})

type FormData = InferInput<typeof schema>

const LoginPatient = ({ mode }: { mode: SystemMode }) => {
  // --- States ---
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // --- Hooks ---
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()

  // --- Form Setup ---
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: 'admin@cureguard.com',
      password: 'admin'
    }
  })

  // --- Handlers ---
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    console.log("reu")
    setIsLoading(true)
    setErrorState(null)

    try {
      // Added 'patient' param as per your previous component logic (though it wasn't in body in previous code, likely implied)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login-next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email.trim(), password: data.password.trim(), type: "patient" }) 
      })

      if (!res.ok) {
        if (res.status === 401) {
          setErrorState({ message: ['Invalid email or password'] })
        } else {
          setErrorState({ message: [`Login failed Please try again later.`] })
        }
        return
      }

      const result = await res.json()

      if (result && result?.success === true && result?.data?.accessToken && result?.data?.refreshToken) {
        await setLoginCookie(result.data.accessToken, result.data.refreshToken)

        saveUserDetails({
          userName: result.data.userName,
          userEmail: result.data.userEmail,
          userImg: result.data.userImg,
          userRole: result.data.userRole
        })

        const redirectURL = searchParams.get('redirectTo') ?? '/patient'
        
        toast.success('Login Successful')
        router.replace(getLocalizedUrl(redirectURL, locale as Locale))
      } else {
        setErrorState({ message: ['Email or Password is invalid'] })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorState({ message: ['Network error. Please try again later.'] })
    } finally {
      setIsLoading(false)
    }
  }

  // --- Quick Login Helper ---
  const handleQuickLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setErrorState(null)

    try {
      console.log("red")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login-next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim(), type: "patient" }) 
      })

      if (!res.ok) {
        if (res.status === 401) {
          setErrorState({ message: ['Invalid email or password'] })
        } else {
          setErrorState({ message: [`Login failed Please try again later.`] })
        }
        return
      }

      const result = await res.json()

      if (result && result?.success === true && result?.data?.accessToken && result?.data?.refreshToken) {
        await setLoginCookie(result.data.accessToken, result.data.refreshToken)

        saveUserDetails({
          userName: result.data.userName,
          userEmail: result.data.userEmail,
          userImg: result.data.userImg,
          userRole: result.data.userRole
        })
        const redirectURL = searchParams.get('redirectTo') ?? '/clinic'
        
        toast.success('Login Successful')
        router.replace(getLocalizedUrl(redirectURL, locale as Locale))
      } else {
        setErrorState({ message: ['Email or Password is invalid'] })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorState({ message: ['Network error. Please try again later.'] })
    } finally {
      setIsLoading(false)
    }
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
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='238' height='234' viewBox='0 0 238 234' fill='none'%3E%3Crect x='87.9395' y='0.5' width='149' height='149' rx='19.5' stroke='%23${theme.palette.primary.main.slice(
        1
      )}' stroke-opacity='0.16'/%3E%3Crect y='33.5608' width='200' height='200' rx='10' fill='%23${theme.palette.primary.main.slice(
        1
      )}' fill-opacity='0.08'/%3E%3C/svg%3E")`
    },
    '&:after': {
      zIndex: -1,
      position: 'absolute',
      height: '180px',
      width: '180px',
      content: '""',
      right: '-57px',
      bottom: '-64px',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180' fill='none'%3E%3Crect x='1' y='1' width='178' height='178' rx='19' stroke='%23${theme.palette.primary.main.slice(
        1
      )}' stroke-opacity='0.16' stroke-width='2' stroke-dasharray='8 8'/%3E%3Crect x='22.5' y='22.5' width='135' height='135' rx='10' fill='%23${theme.palette.primary.main.slice(
        1
      )}' fill-opacity='0.08'/%3E%3C/svg%3E")`
    }
  }
}))

  return (
    <AuthIllustrationWrapper>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='sm:p-12'>
          <Link href={getLocalizedUrl('/', locale as Locale)} className='flex justify-center mbe-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-1 mbe-6'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign-in to Patient portal</Typography>
          </div>

          {/* Error Alert Display */}
          {errorState && (
            <Alert severity='error' className='mbe-4'>
              {errorState.message.join(', ')}
            </Alert>
          )}

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            
            {/* Email Controller */}
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
                  placeholder='Enter your email'
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...((errors.email || errorState !== null) && {
                    error: true,
                    helperText: errors?.email?.message || errorState?.message[0]
                  })}
                />
              )}
            />

            {/* Password Controller */}
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='············'
                  id='login-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  slotProps={{
                    input: {
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
                    }
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

            <Button fullWidth variant='contained' type='submit' disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </Button>

            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography
                component={Link}
                href={getLocalizedUrl('/register', locale as Locale)}
                color='primary.main'
              >
                Create an account
              </Typography>
            </div>

            {/* --- Quick Logins (Preserved from Previous Component) --- */}
            <Divider className='gap-2 text-textPrimary'>Quick Access</Divider>
            
            <div className='flex flex-col gap-3'>
               {/* Admin Login */}
               <div className='flex justify-between items-center border p-2 rounded'>
                  <div className='flex flex-col'>
                    <Typography variant='body2' className='font-bold'>Admin</Typography>
                    <Typography variant='caption'>admin@cureguard.com</Typography>
                  </div>
                  <Button variant='outlined' size='small' onClick={() => handleQuickLogin('admin@cureguard.com', 'admin')}>
                    Login
                  </Button>
               </div>

               {/* Doctor Login */}
               <div className='flex justify-between items-center border p-2 rounded'>
                  <div className='flex flex-col'>
                    <Typography variant='body2' className='font-bold'>Doctor</Typography>
                    <Typography variant='caption'>test1@doctor.com</Typography>
                  </div>
                  <Button variant='outlined' size='small' onClick={() => handleQuickLogin('test1@doctor.com', 'test1')}>
                    Login
                  </Button>
               </div>

                {/* Staff Login */}
               <div className='flex justify-between items-center border p-2 rounded'>
                  <div className='flex flex-col'>
                    <Typography variant='body2' className='font-bold'>Staff</Typography>
                    <Typography variant='caption'>user@example.com</Typography>
                  </div>
                  <Button variant='outlined' size='small' onClick={() => handleQuickLogin('user@example.com', 'user@123')}>
                    Login
                  </Button>
               </div>
            </div>

            {/* Social Icons (Kept from New UI) */}
            <Divider className='gap-2 text-textPrimary'>or</Divider>
            <div className='flex justify-center items-center gap-1.5'>
              <IconButton className='text-facebook' size='small'>
                <i className='tabler-brand-facebook-filled' />
              </IconButton>
              <IconButton className='text-twitter' size='small'>
                <i className='tabler-brand-twitter-filled' />
              </IconButton>
              <IconButton className='text-textPrimary' size='small'>
                <i className='tabler-brand-github-filled' />
              </IconButton>
              <IconButton className='text-error' size='small'>
                <i className='tabler-brand-google-filled' />
              </IconButton>
            </div>
          </form>
        </CardContent>
      </Card>
      <BackDropFullScreen open={isLoading} />
    </AuthIllustrationWrapper>
  )
}

export default LoginPatient