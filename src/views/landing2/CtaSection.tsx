// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Type Imports
import type { SystemMode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'
import classnames from 'classnames'

const CtaSection = ({ mode }: { mode: SystemMode }) => {
  return (
    <section id='cta' className={frontCommonStyles.layoutSpacing}>
      <div className={classnames(styles.ctaSection, 'relative shadow-2xl')}>
        <div className='relative z-10 flex flex-col items-center max-w-3xl mx-auto'>
          <Typography variant='h3' className='font-extrabold mb-6 text-white'>
            Ready to upgrade your medical practice?
          </Typography>
          <Typography variant='h6' className='mb-8 text-white/80 font-normal leading-relaxed'>
            Join thousands of healthcare professionals who trust CureGuard to deliver exceptional care while optimizing administrative workflows.
          </Typography>
          
          <div className='flex flex-wrap gap-4 justify-center'>
            <Button
              component={Link}
              href='/register'
              variant='contained'
              size='large'
              color='inherit'
              sx={{ color: 'primary.main', bgcolor: 'common.white', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Start Your Free Trial
            </Button>
            <Button
              component={Link}
              href='/login'
              variant='outlined'
              size='large'
              color='inherit'
              sx={{ borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Sign In to Your Clinic
            </Button>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none' />
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none' />
      </div>
    </section>
  )
}

export default CtaSection
