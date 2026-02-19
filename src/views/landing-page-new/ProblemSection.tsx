// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const painPoints = [
  {
    icon: '😤',
    title: 'Crowded, Chaotic Waiting Rooms',
    desc: 'Patients queue for hours with no updates. Frustration builds, and your staff is overwhelmed managing it all manually.'
  },
  {
    icon: '📝',
    title: 'Endless Paperwork & Manual Records',
    desc: 'Handwritten notes, lost files, and hours spent on admin tasks that should take minutes.'
  },
  {
    icon: '💰',
    title: 'Opaque Financial Tracking',
    desc: 'No clear split between doctor fees and clinic commissions. Month-end reconciliation is a nightmare.'
  },
  {
    icon: '🔓',
    title: 'Zero Role-Based Data Security',
    desc: 'Staff and patients accessing the same systems means data breaches waiting to happen.'
  }
]

const solutionPoints = [
  'Smart QR tokens eliminate waiting room chaos — patients track their queue from their phone',
  'AI-powered OCR scanning converts paper documents to digital records in seconds',
  'Automatic doctor fee vs. clinic commission splitting with instant payout reports',
  'Separate, encrypted portals for Admins, Doctors, Receptionists, and Patients',
  'Your own custom clinic subdomain and branded patient experience from day one'
]

const ProblemSection = () => {
  return (
    <section id='problem' className='bg-backgroundDefault plb-[100px]'>
      <div className={classnames('flex flex-col gap-12', frontCommonStyles.layoutSpacing)}>
        {/* Header */}
        <div className='flex flex-col gap-y-3'>
          <Chip size='small' variant='tonal' color='primary' label='The Problem' className='self-start' />
          <Typography color='text.primary' variant='h4' className='font-extrabold'>
            Healthcare Management,{' '}
            <span className='text-primary italic'>Simplified</span>
          </Typography>
          <Typography color='text.secondary' className='max-is-[540px]'>
            Running a clinic shouldn&apos;t mean drowning in paperwork, managing crowded waiting areas,
            or manually calculating doctor payouts.
          </Typography>
        </div>

        <Grid container spacing={6} alignItems='stretch'>
          {/* Pain Points */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <div className='flex flex-col gap-4'>
              {painPoints.map((item, index) => (
                <div key={index} className={styles.painCard}>
                  <span className={styles.painIcon} aria-hidden='true'>{item.icon}</span>
                  <div>
                    <Typography variant='subtitle2' color='text.primary' className='font-semibold mbe-1'>
                      {item.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {item.desc}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </Grid>

          {/* Solution Card */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <div className={classnames(styles.solutionCard, 'bs-full')}>
              <div className={styles.solutionCardGlow} aria-hidden='true' />
              <Typography variant='h5' className='font-extrabold mbe-4 relative z-[1]' style={{ color: 'white' }}>
                CureGuard brings your entire practice into the{' '}
                <em style={{ color: 'var(--mui-palette-primary-light)' }}>digital age</em>
              </Typography>
              <ul className='flex flex-col gap-3 list-none pli-0 relative z-[1]'>
                {solutionPoints.map((point, index) => (
                  <li key={index} className='flex items-start gap-3'>
                    <div className={styles.solutionCheck} aria-hidden='true'>✓</div>
                    <Typography variant='body2' style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {point}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default ProblemSection
