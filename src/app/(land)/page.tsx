// Component Imports
import LandingPageWrapper from '@views/landing-page-new'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <LandingPageWrapper />
}

export default LandingPage
