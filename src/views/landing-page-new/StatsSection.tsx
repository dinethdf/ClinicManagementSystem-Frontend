// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Styles Imports
import styles from './styles.module.css'

const stats = [
  { value: '500+', label: 'Clinics Onboarded' },
  { value: '1.2M+', label: 'Appointments Managed' },
  { value: '99.9%', label: 'Platform Uptime' },
  { value: '14 Days', label: 'Free Trial — No Card Required' }
]

const StatsSection = () => {
  return (
    <div className={styles.statsBar} role='region' aria-label='Platform statistics'>
      <div className='max-w-[1200px] mli-auto pli-[5%]'>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid key={index} size={{ xs: 6, md: 3 }}>
              <div className='text-center'>
                <Typography className={styles.statsValue}>{stat.value}</Typography>
                <Typography variant='body2' className={styles.statsLabel}>{stat.label}</Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  )
}

export default StatsSection
