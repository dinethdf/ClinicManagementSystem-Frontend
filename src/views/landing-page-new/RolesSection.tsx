// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const roles = [
  {
    icon: '🩺',
    iconBg: '#ccfbf1',
    title: 'For Doctors',
    subtitle: 'Stay focused on what matters',
    perks: [
      'Clean, distraction-free daily schedule view',
      'See upcoming queue and patient details instantly',
      'Track daily earnings and consultation history',
      'One-click AI OCR to digitize physical documents'
    ],
    cornerColor: 'var(--mui-palette-primary-main)'
  },
  {
    icon: '⚙️',
    iconBg: '#fef3c7',
    title: 'For Admins & Owners',
    subtitle: 'Total control at your fingertips',
    perks: [
      "Bird's-eye view of clinic financial health",
      'Manage staff roles, permissions, and access levels',
      'Upgrade subscription features as you scale',
      'Full audit trail and compliance reporting'
    ],
    cornerColor: '#f59e0b'
  },
  {
    icon: '😊',
    iconBg: '#ede9fe',
    title: 'For Patients',
    subtitle: 'A premium healthcare experience',
    perks: [
      'Easy 24/7 online appointment booking',
      'Real-time queue tracking from their phone',
      'Secure personal health record access',
      'Digital invoices and appointment history'
    ],
    cornerColor: '#f43f5e'
  }
]

const RolesSection = () => {
  return (
    <section id='roles' className='bg-backgroundDefault plb-[100px]'>
      <div className={classnames('flex flex-col gap-12', frontCommonStyles.layoutSpacing)}>
        {/* Header */}
        <div className='flex flex-col gap-y-4 items-center justify-center text-center'>
          <Chip size='small' variant='tonal' color='primary' label='Built For Everyone' />
          <div className='flex flex-col items-center gap-y-2'>
            <Typography color='text.primary' variant='h4' className='font-extrabold text-center'>
              Designed for Every Role{' '}
              <em className='italic text-primary'>in Your Clinic</em>
            </Typography>
            <Typography color='text.secondary' className='max-is-[520px] text-center'>
              Purpose-built workspaces mean every person on your team — and every patient — gets
              exactly the tools they need.
            </Typography>
          </div>
        </div>

        {/* Role Cards */}
        <Grid container spacing={6}>
          {roles.map((role, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <div className={classnames(styles.roleCard, 'bs-full')}>
                {/* Corner decoration */}
                <div
                  className={styles.roleCardCorner}
                  style={{ background: role.cornerColor }}
                  aria-hidden='true'
                />

                {/* Top */}
                <div className='flex items-center gap-4 mbe-6'>
                  <div
                    className={styles.roleAvatar}
                    style={{ background: role.iconBg }}
                    aria-hidden='true'
                  >
                    {role.icon}
                  </div>
                  <div>
                    <Typography variant='h6' color='text.primary' className='font-bold'>
                      {role.title}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {role.subtitle}
                    </Typography>
                  </div>
                </div>

                {/* Perks */}
                <ul className='flex flex-col gap-3 list-none pli-0'>
                  {role.perks.map((perk, pi) => (
                    <li key={pi} className='flex items-start gap-3'>
                      <div className={styles.perkDot} aria-hidden='true' />
                      <Typography variant='body2' color='text.secondary'>
                        {perk}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default RolesSection
