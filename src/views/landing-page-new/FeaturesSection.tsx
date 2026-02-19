// React Imports
import { useRef, useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const features = [
  {
    icon: '📲',
    iconBg: '#ccfbf1',
    title: 'Smart QR Queue System',
    description:
      'Say goodbye to crowded waiting areas. Patients receive a unique digital QR token upon booking. Scan to check in, track live queue position from any device — no app download required.',
    tag: 'QR Token Check-In'
  },
  {
    icon: '💳',
    iconBg: '#fef3c7',
    title: 'Crystal-Clear Financial Tracking',
    description:
      'No more manual math. Automatically split and track doctor fees versus clinic commissions. Generate instant revenue reports and manage staff payouts with total transparency.',
    tag: 'Auto Payout Splitting'
  },
  {
    icon: '🔒',
    iconBg: '#ede9fe',
    title: 'Role-Based Secure Workspaces',
    description:
      'Dedicated, encrypted portals for Admins, Doctors, Reception Staff, and Patients. Everyone sees exactly what they need — nothing more, nothing less. Enterprise-grade isolation.',
    tag: '4-Level Access Control'
  },
  {
    icon: '⚡',
    iconBg: '#fee2e2',
    title: 'AI-Powered OCR Data Entry',
    description:
      'Save hours of manual typing. Use our smart camera tool to scan prescriptions, lab reports, and ID documents — text is automatically extracted straight into patient records.',
    tag: 'AI Document Scanner'
  },
  {
    icon: '🌐',
    iconBg: '#e0f2fe',
    title: 'Your Own Clinic Portal',
    description:
      'Get a personalized web address (e.g., yourclinic.cureguard.io). Customize with your logo, local currency, timezone, invoice prefix, and tax rates for a fully branded experience.',
    tag: 'Custom Subdomain'
  },
  {
    icon: '🏥',
    iconBg: '#dcfce7',
    title: 'Multi-Clinic Ready',
    description:
      'Manage a single practice or a network of healthcare branches from one platform. Staff and patients log in seamlessly using your unique Clinic Code for isolated, secure access.',
    tag: 'Network Management'
  }
]

const FeaturesSection = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { updateIntersections } = useIntersection()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false

          return
        }

        updateIntersections({ [entry.target.id]: entry.isIntersecting })
      },
      { threshold: 0.35 }
    )

    ref.current && observer.observe(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id='features' ref={ref} className='bg-backgroundPaper plb-[100px]'>
      <div className={classnames('flex flex-col gap-12', frontCommonStyles.layoutSpacing)}>
        {/* Header */}
        <div className='flex flex-col gap-y-4 items-center justify-center text-center'>
          <Chip size='small' variant='tonal' color='primary' label='Core Features' />
          <div className='flex flex-col items-center gap-y-2'>
            <Typography color='text.primary' variant='h4' className='text-center'>
              <span className='font-extrabold'>Everything You Need</span>{' '}
              to Run a{' '}
              <span className='font-extrabold italic text-primary'>World-Class</span>{' '}
              Practice
            </Typography>
            <Typography color='text.secondary' className='max-is-[560px] text-center'>
              Purpose-built tools for modern healthcare — not generic software shoehorned into medicine.
            </Typography>
          </div>
        </div>

        {/* Grid */}
        <Grid container spacing={6}>
          {features.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
              <div className={styles.featureCard}>
                <div className={styles.featureCardBar} aria-hidden='true' />
                <div
                  className={styles.featureIcon}
                  style={{ background: feature.iconBg }}
                  aria-hidden='true'
                >
                  {feature.icon}
                </div>
                <Typography variant='h6' color='text.primary' className='font-bold mbe-2'>
                  {feature.title}
                </Typography>
                <Typography variant='body2' color='text.secondary' className='leading-relaxed mbe-3'>
                  {feature.description}
                </Typography>
                <Chip
                  label={feature.tag}
                  size='small'
                  variant='tonal'
                  color='primary'
                  className='text-xs'
                />
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default FeaturesSection
