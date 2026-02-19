// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const steps = [
  {
    num: '1',
    icon: '📱',
    title: 'Book Online',
    description:
      'Patients easily book appointments 24/7 through their secure patient portal and receive a unique digital QR token confirmation instantly.'
  },
  {
    num: '2',
    icon: '▦',
    title: 'QR Scan Arrival',
    description:
      'Upon arrival, reception staff scan the QR code to instantly verify the appointment, update status, and assign a live queue number.'
  },
  {
    num: '3',
    icon: '📊',
    title: 'Track Live Queue',
    description:
      "Patients monitor their live queue position on their mobile device. No more guessing. Relax until it's almost their turn."
  },
  {
    num: '4',
    icon: '🩺',
    title: 'Consult & Checkout',
    description:
      'Doctors see the live queue, start the consultation with one click, finalize digital records, and the system auto-generates the invoice.'
  }
]

const HowItWorks = () => {
  return (
    <section id='how-it-works' className={classnames('plb-[100px]', styles.howItWorksSection)}>
      <div className={classnames('flex flex-col gap-12', frontCommonStyles.layoutSpacing)}>
        {/* Header */}
        <div className='flex flex-col gap-y-4 items-center justify-center text-center'>
          <Chip
            size='small'
            label='The Patient Journey'
            className={styles.chipOnDark}
          />
          <div className='flex flex-col items-center gap-y-2'>
            <Typography variant='h4' className={classnames('font-extrabold text-center', styles.headingOnDark)}>
              From Booking to Checkout{' '}
              <em className={styles.headingEmOnDark}>in 4 Simple Steps</em>
            </Typography>
            <Typography className={classnames('max-is-[520px] text-center', styles.subOnDark)}>
              A seamless, stress-free experience for your patients — from their first click to walking out the door.
            </Typography>
          </div>
        </div>

        {/* Steps */}
        <div className='relative'>
          {/* Connector line on desktop */}
          <div className={styles.stepsConnector} aria-hidden='true' />
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                <div className={styles.stepCard}>
                  <div className={styles.stepNum} aria-label={`Step ${step.num}`}>
                    {step.num}
                  </div>
                  <div className={styles.stepIcon} aria-hidden='true'>{step.icon}</div>
                  <Typography variant='h6' className={classnames('font-bold mbe-2', styles.headingOnDark)}>
                    {step.title}
                  </Typography>
                  <Typography variant='body2' className={styles.subOnDark}>
                    {step.description}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
