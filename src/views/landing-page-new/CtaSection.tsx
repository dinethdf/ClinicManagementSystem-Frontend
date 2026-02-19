// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const CtaSection = ({ mode }: { mode: SystemMode }) => {
  return (
    <section id='cta' className={classnames('plb-[100px] relative overflow-hidden', styles.ctaSection)}>
      {/* Background glow */}
      <div className={styles.ctaBgGlow} aria-hidden='true' />

      <div className={classnames('relative z-[1]', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col items-center text-center gap-6 max-is-[700px] mli-auto'>
          <Typography
            variant='h3'
            className='font-extrabold leading-tight'
            style={{ color: 'white' }}
          >
            Ready to{' '}
            <em style={{ color: 'var(--mui-palette-primary-light)', fontStyle: 'italic' }}>
              Transform
            </em>{' '}
            Your Patient Experience?
          </Typography>

          <Typography
            variant='body1'
            className='max-is-[560px]'
            style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.75' }}
          >
            Join the clinics that are saving time, reducing no-shows, and making their patients
            genuinely happier. Setup takes less than 10 minutes.
          </Typography>

          <div className='flex flex-wrap gap-4 justify-center'>
            <Button
              component={Link}
              href='/register'
              variant='contained'
              size='large'
              color='primary'
              className='font-bold'
            >
              Create Your Clinic Account Today
            </Button>
            <Button
              component={Link}
              href='#how-it-works'
              variant='outlined'
              size='large'
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.6)',
                  background: 'rgba(255,255,255,0.08)'
                }
              }}
            >
              See How It Works
            </Button>
          </div>

          <div className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mbs-2'>
            {[
              '✓ Free for 14 days',
              '✓ No credit card',
              '✓ Cancel anytime',
              '✓ Setup in 10 minutes'
            ].map((item, i) => (
              <Typography
                key={i}
                variant='caption'
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {item}
              </Typography>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
