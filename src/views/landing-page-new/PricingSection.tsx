'use client'

// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Switch from '@mui/material/Switch'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'
import styles from './styles.module.css'

const pricingPlans = [
  {
    icon: '🌱',
    title: 'Basic',
    subtitle: 'Perfect for solo practitioners and small clinics just getting started.',
    monthlyPay: 19,
    annualPay: 14,
    perYearPay: 168,
    features: [
      'Custom Clinic Subdomain',
      'Smart QR Queue System',
      'Core Patient & Appointment Mgmt',
      'Role-Based Access (4 roles)',
      'Standard Financial Reporting'
    ],
    featured: false,
    ctaLabel: 'Start Free Trial',
    ctaVariant: 'tonal' as const
  },
  {
    icon: '🚀',
    title: 'Pro',
    subtitle: 'For growing clinics that need advanced automation and billing power.',
    monthlyPay: 29,
    annualPay: 22,
    perYearPay: 264,
    features: [
      'Everything in Basic',
      'AI-Powered OCR Document Scanning',
      'Advanced Billing & Custom Invoice Prefixes',
      'Doctor Fee vs Commission Auto-Splitting',
      'Priority Support & Onboarding'
    ],
    featured: true,
    ctaLabel: 'Start Free Trial',
    ctaVariant: 'contained' as const
  },
  {
    icon: '🏥',
    title: 'Enterprise',
    subtitle: 'Built for multi-doctor hospitals and premium care networks.',
    monthlyPay: 49,
    annualPay: 37,
    perYearPay: 444,
    features: [
      'Everything in Pro',
      'Multi-Currency & Multi-Branch Support',
      'Advanced Analytics & Data Export',
      'Dedicated Account Manager',
      'Custom SLA & Compliance Reporting'
    ],
    featured: false,
    ctaLabel: 'Contact Sales',
    ctaVariant: 'tonal' as const
  }
]

const PricingSection = () => {
  // States
  const [pricingPlan, setPricingPlan] = useState<'monthly' | 'annually'>('annually')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPricingPlan(e.target.checked ? 'annually' : 'monthly')
  }

  return (
    <section
      id='pricing'
      className={classnames('flex flex-col gap-8 lg:gap-12 plb-[100px] bg-backgroundPaper', styles.sectionRadius)}
    >
      <div className={classnames('is-full', frontCommonStyles.layoutSpacing)}>
        {/* Header */}
        <div className='flex flex-col gap-y-4 items-center justify-center mbe-10'>
          <Chip size='small' variant='tonal' color='primary' label='Pricing Plans' />
          <div className='flex flex-col items-center gap-y-2 text-center'>
            <Typography color='text.primary' variant='h4'>
              <span className='font-extrabold'>Flexible Plans that</span>{' '}
              <em className='italic text-primary font-extrabold'>Grow With</em>{' '}
              <span className='font-extrabold'>Your Practice</span>
            </Typography>
            <Typography color='text.secondary' className='max-is-[520px]'>
              Start with a full-featured 14-day free trial. No credit card. No commitment.
              Upgrade when you&apos;re ready.
            </Typography>
          </div>

          {/* Toggle */}
          <div className='flex justify-center items-center gap-1 mbs-2'>
            <InputLabel htmlFor='pricing-switch' className='cursor-pointer font-medium'>
              Pay Monthly
            </InputLabel>
            <Switch
              id='pricing-switch'
              onChange={handleChange}
              checked={pricingPlan === 'annually'}
            />
            <InputLabel htmlFor='pricing-switch' className='cursor-pointer font-medium'>
              Pay Annually
            </InputLabel>
            <div className='flex gap-x-1 items-start max-sm:hidden mis-2 mbe-4'>
              <img src='/images/front-pages/landing-page/pricing-arrow.png' width='50' alt='' aria-hidden='true' />
              <Typography className='font-semibold text-primary text-sm'>Save 25%</Typography>
            </div>
          </div>
        </div>

        {/* Cards */}
        <Grid container spacing={6}>
          {pricingPlans.map((plan, index) => (
            <Grid key={index} size={{ xs: 12, lg: 4 }}>
              <Card
                className={classnames('bs-full', {
                  'border-2 border-primary shadow-xl': plan.featured
                })}
                style={{ position: 'relative' }}
              >
                {plan.featured && (
                  <div className={styles.featuredBadge}>
                    <Typography variant='caption' className='font-bold'>
                      Most Popular
                    </Typography>
                  </div>
                )}
                <CardContent className='flex flex-col gap-8 p-8'>
                  {/* Plan name */}
                  <div className='flex flex-col items-center gap-2 text-center'>
                    <span className='text-4xl' aria-hidden='true'>{plan.icon}</span>
                    <Typography variant='h4' color='text.primary' className='font-extrabold'>
                      {plan.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {plan.subtitle}
                    </Typography>
                  </div>

                  {/* Price */}
                  <div className='text-center relative'>
                    <div className='flex items-baseline justify-center gap-1'>
                      <Typography variant='h2' color='primary.main' className='font-extrabold'>
                        ${pricingPlan === 'monthly' ? plan.monthlyPay : plan.annualPay}
                      </Typography>
                      <Typography color='text.disabled' className='font-medium'>/mo</Typography>
                    </div>
                    {pricingPlan === 'annually' && (
                      <Typography variant='caption' color='text.disabled'>
                        ${plan.perYearPay} / year
                      </Typography>
                    )}
                    <div className='mbs-1'>
                      <Chip
                        size='small'
                        label='14-day free trial'
                        color='success'
                        variant='tonal'
                        className='text-xs'
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className='flex flex-col gap-3'>
                    {plan.features.map((feature, fi) => (
                      <div key={fi} className='flex items-center gap-3'>
                        <CustomAvatar
                          color='primary'
                          skin={plan.featured ? 'filled' : 'light'}
                          size={20}
                        >
                          <i className='tabler-check text-xs' />
                        </CustomAvatar>
                        <Typography variant='body2' color='text.primary'>
                          {feature}
                        </Typography>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    component={Link}
                    href='/register'
                    variant={plan.ctaVariant}
                    color='primary'
                    size='large'
                    fullWidth
                  >
                    {plan.ctaLabel}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default PricingSection
