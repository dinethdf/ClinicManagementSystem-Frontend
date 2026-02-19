'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import HeroSection from './HeroSection'
import ProblemSection from './ProblemSection'
import FeaturesSection from './FeaturesSection'
import HowItWorks from './HowItWorks'
import RolesSection from './RolesSection'
import StatsSection from './StatsSection'
import PricingSection from './PricingSection'
import FaqSection from './FaqSection'
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
      <StatsSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <RolesSection />
      <PricingSection />
      <FaqSection />
      <CtaSection mode={mode} />
    </div>
  )
}

export default LandingPageWrapper
