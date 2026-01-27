'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Third-party Imports
// import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import classnames from 'classnames'
import { toast } from 'react-toastify'

// Type Imports
import type { SystemMode } from '@/@core/types'
import type { Locale } from '@/configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

import { logoutAndRedirect, setLoginCookie, getClinicDetails} from '@/libs/authentication'
import BackDropFullScreen from '@/components/BackDropFullScreen'
import data from './../data/searchData';
import { saveClinicDetails, saveUserDetails } from '@/utils/commone'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Email is invalid')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(1, 'Password must be at least 1 characters long')
  )
})

const Login = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/3775385.jpg'
  const lightIllustration = '/images/illustrations/auth/3775385.jpg'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

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

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setIsLoading(true)
    setErrorState(null) // Clear previous errors

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login-next`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: data.email.trim(), password: data.password.trim(), type: "clinic" })
      })


      // Handle non-OK response
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

      try {
          // We pass the accessToken explicitly because cookies might not be readable instantly by axios
          const clinicInfo = await getClinicDetails(result.data.accessToken);
          
          if (clinicInfo) {
         await saveClinicDetails(clinicInfo);
          }
        } catch (clinicError) {

          console.error("Could not fetch clinic info", clinicError);
        }        

        const redirectURL = searchParams.get('redirectTo') ?? '/clinic'

        router.replace(getLocalizedUrl(redirectURL, locale as Locale))
      } else {
        setErrorState({ message: ['Email or Password is invalid'] })
      }
    } catch (error) {

        console.log("hear Come errrer catch")
      console.error('Login error:', error)
      setErrorState({ message: ['Network error. Please try again later.'] })
    } finally {
      setIsLoading(false)
    }
  }

  // ===== NEW CODE START =====
  // Helper function for quick logins
  const handleQuickLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setErrorState(null) // Clear previous errors

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login-next`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password: password.trim(), type: "clinic" })
      })

      // Handle non-OK response
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

      try {
          const clinicInfo = await getClinicDetails(result.data.accessToken);
          if (clinicInfo) {
         await saveClinicDetails(clinicInfo);
          }
        } catch (clinicError) {
          console.error("Could not fetch clinic info", clinicError);
        }    

        const redirectURL = searchParams.get('redirectTo') ?? '/clinic'
     
        toast.success('Login Successful', {
        className: 'custom-toast',
        // progressStyle: {
        //   backgroundColor: 'var(--mui-palette-primary-main)'
        // }
      })

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

  // ===== NEW CODE END =====

  const unAuthState = searchParams.get('unAuth') ?? ''

  useEffect(() => {
    if (unAuthState == '1') {
      try {
        logoutAndRedirect()
      } catch (error) {
        console.error(error)
      }
    }
  }, [])

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-dvh relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper min-is-full! p-6 md:min-is-[unset]! md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign-in</Typography>
          </div>
          <Alert icon={false} className='bg-(--mui-palette-primary-lightOpacity)'>
            <Typography variant='body2' color='primary.main'>
              Email: <span className='font-medium'>admin@cureguard.com</span> / Pass:{' '}
              <span className='font-medium'>admin</span>
            </Typography>
          </Alert>
          <form
            noValidate
            autoComplete='off'
            action={() => {}}
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
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
            <Button fullWidth variant='contained' type='submit'>
              Login
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/register', locale as Locale)} color='primary.main'>
                Create an account
              </Typography>
            </div>
            <Divider className='gap-2'>or</Divider>
            <Button
              color='secondary'
              className='self-center text-textPrimary'
              startIcon={<img src='/images/logos/google.png' alt='Google' width={22} />}
              sx={{ '& .MuiButton-startIcon': { marginInlineEnd: 3 } }}

              // onClick={() => signIn('google')}
            >
              Sign in with Google
            </Button>

            {/* ===== NEW CODE START ===== */}

            <Divider className='gap-2'>or try</Divider>

            <div className='flex flex-col gap-4'>
              {/* Admin Login Section */}
              <div className='flex justify-between items-center flex-wrap gap-2'>
                <div className='flex flex-col'>
                  <Typography variant='body2' className='font-medium'>
                    Admin
                  </Typography>
                  <Typography variant='caption'>Email: dineth@admin.com</Typography>
                  <Typography variant='caption'>Password: admin@123</Typography>
                </div>
                <Button variant='outlined' size='small' onClick={() => handleQuickLogin('dineth@admin.com', 'dd')}>
                  Login
                </Button>
              </div>
              {/* Doctor Login Section */}
              <div className='flex justify-between items-center flex-wrap gap-2'>
                <div className='flex flex-col'>
                  <Typography variant='body2' className='font-medium'>
                    Doctor
                  </Typography>
                  <Typography variant='caption'>Email: test1@doctor.com</Typography>
                  <Typography variant='caption'>Password: test1</Typography>
                </div>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => handleQuickLogin('test1@doctor.com', 'test1')}
                >
                  Login
                </Button>
              </div>
              {/* User Login Section */}
              <div className='flex justify-between items-center flex-wrap gap-2'>
                <div className='flex flex-col'>
                  <Typography variant='body2' className='font-medium'>
                    Staff
                  </Typography>
                  <Typography variant='caption'>Email: user@example.com</Typography>
                  <Typography variant='caption'>Password: user@123</Typography>
                </div>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => handleQuickLogin('user@example.com', 'user@123')}
                >
                  Login
                </Button>
              </div>
            </div>

            {/* ===== NEW CODE END ===== */}
          </form>
        </div>
      </div>
      <BackDropFullScreen open={isLoading} />
    </div>
  )
}

export default Login
