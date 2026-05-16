'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import CtaSection from './CtaSection'
import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode }: { mode: SystemMode }) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='bg-backgroundPaper'>
      <HeroSection mode={mode} />
      <FeaturesSection />
      <CtaSection mode={mode} />
    </div>
  )
}

export default LandingPageWrapper
