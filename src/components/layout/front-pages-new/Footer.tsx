'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Link from '@components/Link'

// Hooks Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const Footer = ({ mode }: { mode: Mode }) => {
  // Vars
  const footerImageLight = '/images/front-pages/footer-bg-light.png'
  const footerImageDark = '/images/front-pages/footer-bg-dark.png'

  // Hooks
  const dashboardImage = useImageVariant(mode, footerImageLight, footerImageDark)

  return (
    <footer className={frontLayoutClasses.footer}>
      <div className='relative bg-[#0d1f2d]'>
        {/* Optional: Keep your background image if you want the wave effect, or let the solid color above handle it */}
        <img src={dashboardImage} alt='footer bg' className='absolute inset-0 is-full bs-full object-cover -z-[1] opacity-20' />
        
        <div className={classnames('plb-16 text-white', frontCommonStyles.layoutSpacing)}>
          <Grid container rowSpacing={10} columnSpacing={12}>
            
            {/* ─── Column 1: Brand & About ─── */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <div className='flex flex-col items-start gap-6'>
                <Link href='/' className='flex items-center gap-3'>
                  <div className='flex items-center justify-center rounded-xl text-2xl bg-primary text-white w-10 h-10'>
                    🏥
                  </div>
                  <div>
                    <Typography variant='h5' className='font-extrabold text-white leading-tight' style={{ fontFamily: "'Playfair Display', serif" }}>
                      New Senara
                    </Typography>
                    <Typography variant='caption' className='text-primary font-bold uppercase tracking-widest' style={{ fontSize: '0.65rem' }}>
                      Channel Center
                    </Typography>
                  </div>
                </Link>
                <Typography color='white' className='md:max-is-[390px] opacity-[0.78] leading-relaxed'>
                  Ratnapura's most trusted medical channeling and healthcare services center. Providing specialist consultations, diagnostics, and therapy all in one place.
                </Typography>
              </div>
            </Grid>

            {/* ─── Column 2: Quick Links ─── */}
            <Grid size={{ xs: 12, sm: 4, lg: 2 }}>
              <Typography color='white' className='font-bold mbe-6 opacity-[0.92] uppercase tracking-wider text-sm'>
                Quick Links
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography component={Link} href='#services' color='white' className='opacity-[0.78] hover:text-primary transition-colors'>
                  Our Services
                </Typography>
                <Typography component={Link} href='#specialists' color='white' className='opacity-[0.78] hover:text-primary transition-colors'>
                  Find a Doctor
                </Typography>
                <Typography component={Link} href='#about' color='white' className='opacity-[0.78] hover:text-primary transition-colors'>
                  About Us
                </Typography>
                <Typography component={Link} href='#faq' color='white' className='opacity-[0.78] hover:text-primary transition-colors'>
                  Patient FAQ
                </Typography>
              </div>
            </Grid>

            {/* ─── Column 3: Access Portals ─── */}
            <Grid size={{ xs: 12, sm: 4, lg: 3 }}>
              <Typography color='white' className='font-bold mbe-6 opacity-[0.92] uppercase tracking-wider text-sm'>
                Access Portals
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography component={Link} href='/login?type=patient' color='white' className='opacity-[0.78] hover:text-primary transition-colors'>
                  Book Appointment
                </Typography>
                <Typography component={Link} href='/login?type=patient' color='white' className='opacity-[0.78] hover:text-primary transition-colors'>
                  Patient Portal Login
                </Typography>
                <Typography component={Link} href='/login' color='white' className='opacity-[0.78] hover:text-primary transition-colors'>
                  Staff Login
                </Typography>
                <Typography component={Link} href='/login' color='white' className='opacity-[0.78] hover:text-primary transition-colors'>
                  Doctor Dashboard
                </Typography>
              </div>
            </Grid>

            {/* ─── Column 4: Contact Information ─── */}
            <Grid size={{ xs: 12, sm: 4, lg: 3 }}>
              <Typography color='white' className='font-bold mbe-6 opacity-[0.92] uppercase tracking-wider text-sm'>
                Contact Us
              </Typography>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-3 opacity-[0.78]'>
                  <i className='tabler-map-pin text-xl text-primary shrink-0' />
                  <Typography color='white' variant='body2' className='leading-relaxed'>
                    Ratnapura, Sabaragamuwa Province, Sri Lanka
                  </Typography>
                </div>
                <div className='flex gap-3 opacity-[0.78] items-center'>
                  <i className='tabler-phone text-xl text-primary shrink-0' />
                  <Typography color='white' variant='body2'>
                    +94 45 XXX XXXX
                  </Typography>
                </div>
                <div className='flex gap-3 opacity-[0.78] items-center'>
                  <i className='tabler-mail text-xl text-primary shrink-0' />
                  <Typography color='white' variant='body2'>
                    info@newsenara.lk
                  </Typography>
                </div>
                <div className='flex gap-3 opacity-[0.78]'>
                  <i className='tabler-clock text-xl text-primary shrink-0' />
                  <Typography color='white' variant='body2' className='leading-relaxed'>
                    Mon–Sat: 8:00 AM – 8:00 PM <br/>
                    Sun: 9:00 AM – 2:00 PM
                  </Typography>
                </div>
              </div>
            </Grid>
            
          </Grid>
        </div>
      </div>

      {/* ─── Bottom Copyright Bar ─── */}
      <div className='bg-[#08131d]'>
        <div
          className={classnames(
            'flex flex-wrap items-center justify-center sm:justify-between gap-4 plb-[20px]',
            frontCommonStyles.layoutSpacing
          )}
        >
          <Typography className='text-white opacity-60' variant='body2'>
            <span>{`© ${new Date().getFullYear()} New Senara Channel Center. All Rights Reserved.`}</span>
          </Typography>
          
          <div className='flex gap-1.5 items-center'>
            <Typography className='text-white opacity-60 mr-4' variant='body2'>
              Powered by <Link href='/' className='font-bold text-primary hover:text-white transition-colors'>CureGuard</Link>
            </Typography>
            <IconButton component={Link} size='small' href='#' target='_blank'>
              <i className='tabler-brand-facebook-filled text-white/60 hover:text-white transition-colors text-lg' />
            </IconButton>
            <IconButton component={Link} size='small' href='#' target='_blank'>
              <i className='tabler-brand-instagram text-white/60 hover:text-white transition-colors text-lg' />
            </IconButton>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer