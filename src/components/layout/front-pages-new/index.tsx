// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Footer from '@components/layout/front-pages-new/Footer'
import Header from '@components/layout/front-pages-new/Header'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

const FrontLayout = async ({ children }: ChildrenType) => {
  // Vars
  const mode = await getServerMode()

  return (
    <div className={frontLayoutClasses.root}>
      <Header/>
      {children}
      <Footer mode={mode} />
    </div>
  )
}

export default FrontLayout
