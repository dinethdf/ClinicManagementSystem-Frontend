'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const HeroSection = ({ mode }: { mode: SystemMode }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section id='home' className={classnames('pbs-[100px] pbe-[50px]', styles.heroSection)}>
      <div className={classnames(frontCommonStyles.layoutSpacing)}>
        <Grid container spacing={6} alignItems='center'>
          <Grid size={{ xs: 12, lg: 6 }}>
            <div className='flex flex-col gap-6 max-lg:text-center max-lg:items-center'>
              <Chip
                label='Advanced Healthcare Solution'
                size='small'
                color='primary'
                variant='tonal'
                className='self-start max-lg:self-center'
              />
              
              <Typography variant='h2' className='font-extrabold leading-tight' color='text.primary'>
                Empowering Healthcare Professionals with <span className='text-primary'>CureGuard</span>
              </Typography>
              
              <Typography variant='body1' color='text.secondary' className='text-lg max-w-xl'>
                Streamline your clinic operations from patient registration and scheduling to lab management and billing. A fully integrated platform designed to enhance patient care and clinical efficiency.
              </Typography>
              
              <div className='flex flex-wrap gap-4 mt-2'>
                <Button component={Link} href='/login' variant='contained' size='large'>
                  Get Started
                </Button>
                <Button component={Link} href='#features' variant='outlined' size='large'>
                  Discover Features
                </Button>
              </div>
              
              <div className='flex items-center gap-4 mt-4 text-sm text-textSecondary'>
                <div className='flex items-center gap-1'>
                  <i className='tabler-check text-primary' /> No setup fee
                </div>
                <div className='flex items-center gap-1'>
                  <i className='tabler-check text-primary' /> 14-day free trial
                </div>
                <div className='flex items-center gap-1'>
                  <i className='tabler-check text-primary' /> Cancel anytime
                </div>
              </div>
            </div>
          </Grid>
          
          <Grid size={{ xs: 12, lg: 6 }} className='relative'>
             {/* Decorative Elements */}
             <div className='relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-100 flex items-center justify-center'>
               <div className='absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent' />
               
               {/* Dashboard Mockup Representation */}
               <div className='w-full h-full p-6 flex flex-col gap-4 relative z-10'>
                  {/* Top Bar Mockup */}
                  <div className='flex justify-between items-center w-full pb-4 border-b border-gray-100'>
                     <div className='w-32 h-6 bg-gray-200 rounded-md animate-pulse' />
                     <div className='flex gap-2'>
                        <div className='w-8 h-8 rounded-full bg-gray-200 animate-pulse' />
                     </div>
                  </div>
                  
                  <div className='flex gap-4 h-full'>
                     {/* Sidebar Mockup */}
                     <div className='w-1/4 h-full flex flex-col gap-3'>
                        {[1, 2, 3, 4, 5].map((i) => (
                           <div key={i} className='w-full h-8 bg-gray-100 rounded-md animate-pulse' />
                        ))}
                     </div>
                     
                     {/* Main Content Mockup */}
                     <div className='w-3/4 h-full flex flex-col gap-4'>
                        <div className='flex gap-4'>
                           {[1, 2, 3].map((i) => (
                              <div key={i} className='flex-1 h-24 bg-primary/10 rounded-xl animate-pulse flex items-center justify-center text-primary/30'>
                                 <i className='tabler-activity text-2xl' />
                              </div>
                           ))}
                        </div>
                        <div className='flex-1 bg-gray-50 rounded-xl border border-gray-100 p-4'>
                           <div className='w-1/3 h-5 bg-gray-200 rounded mb-4' />
                           {[1, 2, 3, 4].map((i) => (
                              <div key={i} className='w-full h-12 bg-white rounded-md shadow-sm mb-2 animate-pulse' />
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
             </div>
             
             {/* Floating Badge */}
             <div className='absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 animate-bounce'>
                <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600'>
                   <i className='tabler-trending-up text-xl' />
                </div>
                <div>
                   <Typography variant='subtitle2' className='font-bold'>+34% Efficiency</Typography>
                   <Typography variant='caption' color='text.secondary'>Reported by clinics</Typography>
                </div>
             </div>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default HeroSection
