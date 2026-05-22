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
    icon: 'calendar-event',
    title: 'Smart Scheduling',
    description: 'Effortlessly manage doctor schedules, book patient appointments, and reduce no-shows with automated reminders.'
  },
  {
    icon: 'users',
    title: 'Patient Management',
    description: 'Maintain comprehensive electronic medical records (EMR), clinical histories, and visit logs in one secure place.'
  },
  {
    icon: 'stethoscope',
    title: 'Doctor Portal',
    description: 'Dedicated interfaces for doctors to view daily queues, record consultation notes, and prescribe medications digitally.'
  },
  {
    icon: 'flask',
    title: 'Laboratory Integration',
    description: 'Seamlessly request lab tests, track status, and upload results directly into the patient\'s clinical profile.'
  },
  {
    icon: 'receipt',
    title: 'Billing & Invoicing',
    description: 'Generate accurate invoices, process payments, and track clinic revenue with robust financial reporting tools.'
  },
  {
    icon: 'chart-pie',
    title: 'Analytics & Insights',
    description: 'Gain actionable insights into your clinic\'s performance, patient demographics, and financial health.'
  }
]

const FeaturesSection = () => {
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)
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

    if (ref.current) observer.observe(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id='features' ref={ref} className='plb-[100px]'>
      <div className={classnames(frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col items-center justify-center text-center mb-16'>
          <Chip label='Comprehensive Suite' size='small' color='primary' variant='tonal' className='mb-4' />
          <Typography variant='h3' color='text.primary' className='font-extrabold mb-4 max-w-2xl'>
            Everything you need to run your clinic efficiently
          </Typography>
          <Typography variant='body1' color='text.secondary' className='max-w-3xl'>
            CureGuard provides a complete ecosystem tailored for medical practices, ensuring smooth workflows from the front desk to the doctor's office.
          </Typography>
        </div>

        <Grid container spacing={6}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <div className={styles.featureCard}>
                <div className={styles.featureIconBox}>
                  <i className={`tabler-${feature.icon}`} />
                </div>
                <Typography variant='h5' className='font-bold mb-3'>
                  {feature.title}
                </Typography>
                <Typography variant='body1' color='text.secondary' className='leading-relaxed'>
                  {feature.description}
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default FeaturesSection
