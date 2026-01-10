// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@views/Login'
import LoginPatient from '@/views/LoginPatient'
import LoginV1 from '@views/pages/auth/LoginV1'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = async (props: { params: Promise<{ type: string }> }) => {
  // 1. Get the server mode
  const mode = await getServerMode()

  const params = await props.params

  // 3. Check the specific 'type' value inside params
  if (params.type === 'clinic') { 
    return <Login mode={mode} />
  }
  
  // return <LoginPatient mode={mode} />
   return (
    <div className='flex flex-col justify-center items-center min-bs-dvh p-6'>
      <LoginPatient mode={mode} />
    </div>
  )
}

export default LoginPage