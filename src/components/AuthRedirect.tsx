'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Type Imports
import type { Locale } from '@configs/i18n'

const AuthRedirect = ({ lang }: { lang: Locale }) => {
  const pathname = usePathname() || ''

  // 1. Check if the user is trying to access a Clinic route
  if (pathname.includes('/clinic')) {
    return redirect(`/${lang}/login/clinic?redirectTo=${pathname}`)
  }

  // 2. Check if the user is trying to access a Patient route
  // (Assuming "other type" refers to patient routes)
  if (pathname.includes('/patient')) {
    return redirect(`/${lang}/login/patient?redirectTo=${pathname}`)
  }

  // 3. Else: Redirect to Home Page (http://localhost:3000/en/)
  // This handles cases where the route is neither clinic nor patient specific
  return redirect(`/${lang}`)
}

export default AuthRedirect