// Next Imports
// import { redirect } from 'next/navigation'

// Third-party Imports
// import { getServerSession } from 'next-auth'

// Type Imports
import type { ChildrenType } from '@/@core/typesDef'
import type { Locale } from '@configs/i18n'

// Config Imports
// import themeConfig from '@configs/themeConfig'

// Util Imports
// import { getLocalizedUrl } from '@/utils/i18n'

const GuestOnlyRoute = async ({ children }: ChildrenType & { lang: Locale }) => {
  // const session = await getServerSession()

  // if (session) {
  //   redirect(getLocalizedUrl(themeConfig.homePageUrl, lang))       // This part Commecnt bec reDirect ahappen again and again
  // }

  return <>{children}</>
}

export default GuestOnlyRoute
