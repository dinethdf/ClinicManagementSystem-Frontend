// Component Imports
import LandingPageWrapper from '@views/landing2'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const LandingPage2 = async () => {
  // Vars
  const mode = await getServerMode()

  return <LandingPageWrapper mode={mode} />
}

export default LandingPage2
