'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { useColorScheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Queue data for the hero dashboard preview
const queueItems = [
  { num: 1, name: 'Fatima Al-Hassan', status: 'In Consultation', active: true },
  { num: 2, name: 'Ravi Krishnamurthy', status: 'Waiting — Est. 12 min', active: false },
  { num: 3, name: 'Sarah Chen', status: 'Checked in remotely', active: false }
]

const heroStats = [
  { value: '14', label: "Today's Patients" },
  { value: '$1.2k', label: 'Revenue Today' },
  { value: '4.9★', label: 'Patient Rating' }
]

const HeroSection = ({ mode }: { mode: SystemMode }) => {
  // States
  const [mounted, setMounted] = useState(false)

  // Hooks
  const { mode: muiMode } = useColorScheme()
  const isAboveLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

  const _mode = (muiMode === 'system' ? mode : muiMode) || mode

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section
      id='home'
      className={classnames('overflow-hidden pbs-[75px] -mbs-[75px] relative', styles.heroSection)}
    >
      {/* Background mesh & grid */}
      <div className={styles.heroBgMesh} />
      <div className={styles.heroGridPattern} />

      <div className={classnames('pbs-[100px] pbe-[60px]', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col lg:flex-row gap-[60px] items-center'>

          {/* ─── Left: Text Content ─── */}
          <div className='flex-1 max-lg:text-center'>
            {/* Badge */}
            <div className={classnames('inline-flex items-center gap-2 mbe-6', styles.heroBadge)}>
              <span className={styles.heroBadgeDot} />
              <Typography variant='caption' className='font-semibold tracking-widest uppercase'>
                Now with AI-powered OCR scanning
              </Typography>
            </div>

            {/* H1 */}
            <Typography
              variant='h1'
              className={classnames('font-extrabold mbe-6', styles.heroHeadline)}
            >
              Modernize Your Clinic.{' '}
              <em className={styles.heroHeadlineEm}>Eliminate</em>{' '}
              the Waiting Room.
            </Typography>

            {/* Sub */}
            <Typography
              className={classnames('font-normal mbe-9', styles.heroSubtitle)}
            >
              The all-in-one smart clinic management platform built for seamless patient flow,
              transparent financials, and effortless administration. From QR check-in to doctor
              payouts — CureGuard does it all.
            </Typography>

            {/* CTAs */}
            <div className='flex flex-wrap gap-4 items-center max-lg:justify-center mbe-8'>
              <Button
                component={Link}
                href='#pricing'
                variant='contained'
                size='large'
                className={styles.btnHeroPrimary}
              >
                ✦&nbsp; Start Free Trial
              </Button>
              <Button
                component={Link}
                href='#how-it-works'
                variant='outlined'
                size='large'
                className={styles.btnHeroSecondary}
              >
                ▶&nbsp; See How It Works
              </Button>
            </div>

            {/* Trust row */}
            <div className='flex items-center gap-3 max-lg:justify-center'>
              <div className={styles.heroAvatarStack}>
                {['DR', 'NR', 'KM', '+'].map((initials, i) => (
                  <div key={i} className={styles.heroAvatar}>{initials}</div>
                ))}
              </div>
              <Typography variant='body2' className={styles.heroTrustText}>
                Trusted by <strong className={styles.heroTrustStrong}>500+ clinics</strong> across 12 countries
              </Typography>
            </div>
          </div>

          {/* ─── Right: Dashboard Preview ─── */}
          {isAboveLgScreen && mounted && (
            <div className='flex-1 relative'>
              <div className={styles.heroDashboardCard}>
                {/* Card header */}
                <div className='flex items-center justify-between mbe-5'>
                  <Typography variant='subtitle2' className={styles.dashboardCardTitle}>
                    📋 Today&apos;s Queue — Dr. Ahmed
                  </Typography>
                  <Chip
                    label='● Live'
                    size='small'
                    className={styles.statusChipLive}
                  />
                </div>

                {/* Queue list */}
                <div className='flex flex-col gap-[10px] mbe-5'>
                  {queueItems.map(item => (
                    <div
                      key={item.num}
                      className={classnames(styles.queueItem, { [styles.queueItemActive]: item.active })}
                    >
                      <div className={classnames(styles.queueNum, { [styles.queueNumActive]: item.active })}>
                        {item.num}
                      </div>
                      <div className='flex-1'>
                        <Typography variant='body2' className={styles.queueName}>{item.name}</Typography>
                        <Typography variant='caption' className={classnames(styles.queueStatus, { [styles.queueStatusActive]: item.active })}>
                          {item.status}
                        </Typography>
                      </div>
                      <div className={styles.qrMini} aria-hidden='true'>▦</div>
                    </div>
                  ))}
                </div>

                {/* Mini stats */}
                <div className={styles.heroStatRow}>
                  {heroStats.map((stat, i) => (
                    <div key={i} className={styles.heroStatItem}>
                      <Typography className={styles.heroStatVal}>{stat.value}</Typography>
                      <Typography variant='caption' className={styles.heroStatLabel}>{stat.label}</Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating tags */}
              <div className={classnames(styles.floatingTag, styles.floatingTag1)}>
                <span>🔒</span>
                <Typography variant='caption' className='font-semibold'>Bank-Grade Encrypted</Typography>
              </div>
              <div className={classnames(styles.floatingTag, styles.floatingTag2)}>
                <span>⚡</span>
                <Typography variant='caption' className='font-semibold'>AI OCR Active</Typography>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}

export default HeroSection
