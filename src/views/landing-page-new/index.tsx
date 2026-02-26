'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: 'tabler-stethoscope', title: 'Consultant Channeling' },
  { icon: 'tabler-microscope', title: 'Laboratory Services' },
  { icon: 'tabler-activity', title: 'Ultrasound Scans' },
  { icon: 'tabler-massage', title: 'Physiotherapy Unit' },
  { icon: 'tabler-message-2', title: 'Speech Therapy' },
  { icon: 'tabler-pill', title: '24 Hours Pharmacy' },
]

const FACILITIES = [
  {
    icon: 'tabler-shield-check',
    title: 'Standard of Treatment',
    desc: 'We provide universally accepted standards of care and services to all our patients.',
  },
  {
    icon: 'tabler-heart-rate-monitor',
    title: 'Quality of Core Services',
    desc: 'Quality, safe and patient-centered care is assured at all our service points.',
  },
  {
    icon: 'tabler-virus-off',
    title: 'Infection Control',
    desc: 'Universally accepted infection control protocols are in place to safeguard patients.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Mr. Perera',
    title: 'Patient',
    text: '"The channeling process was so smooth, and the doctors here are incredibly professional. Highly recommended for anyone in Ratnapura."',
  },
  {
    name: 'Mrs. Manike Rathnayake',
    title: 'Patient',
    text: '"A very clean and welcoming environment. Getting my lab reports quickly through the portal saved me a lot of time."',
  },
  {
    name: 'Mr. Silva',
    title: 'Patient',
    text: '"I visit regularly for physiotherapy. The staff is caring, and the facilities are world-class right here in our city."',
  },
]

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const SenaraLanding = () => {
  const router = useRouter()

  // Auth Handler connecting to your existing Login pages
  const handlePatientLogin = () => router.push('/login?type=patient')
  const handleContact = () => window.location.href = 'tel:+94451234567'

  return (
    <div className='bg-backgroundDefault overflow-x-hidden'>

      {/* ════════════════════════════════════════════════
          1. HERO SECTION (Banner Style)
      ════════════════════════════════════════════════ */}
      <section 
        id='home' 
        className='relative min-h-[85vh] flex items-center pt-[80px] pb-[160px] lg:pt-[100px]'
        style={{
          // Use a dark teal gradient to simulate a premium hospital banner image background
          background: 'linear-gradient(135deg, #003b46 0%, #00796b 100%)',
        }}
      >
        {/* Abstract Background pattern */}
        <div className='absolute inset-0 opacity-10 pointer-events-none' style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className='max-w-[1200px] w-full mx-auto px-6 lg:px-12 relative z-10'>
          <Grid container spacing={8} alignItems='center'>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Typography 
                variant='overline' 
                className='text-white/80 font-bold tracking-[0.2em] mb-4 block uppercase'
              >
                Welcome to Better Health
              </Typography>
              
              <Typography 
                variant='h2' 
                className='font-extrabold text-white leading-tight mb-6' 
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                GOOD HEALTH IS WEALTH, <br />
                <span className='text-[#ffd54f] italic'>PREVENTION IS BETTER</span> <br />
                THAN CURE
              </Typography>

              <Typography variant='h6' className='text-white/80 font-normal leading-relaxed mb-10 max-w-[600px]'>
                New Senara Channel Center is Ratnapura's most trusted multi-specialty facility. We are committed to providing compassionate and high-quality medical care.
              </Typography>

              <div className='flex gap-4 flex-wrap'>
                <Button 
                  variant='contained' 
                  size='large' 
                  onClick={handlePatientLogin} 
                  sx={{ backgroundColor: '#ffd54f', color: '#003b46', '&:hover': { backgroundColor: '#ffc107' } }}
                  className='rounded-none px-8 py-3 text-lg font-bold shadow-lg'
                >
                  More Details
                </Button>
                <Button 
                  variant='outlined' 
                  size='large' 
                  href='#about' 
                  sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
                  className='rounded-none px-8 py-3 text-lg font-bold'
                >
                  Our Services
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          2. QUICK ACTION BAR (Overlapping Hero)
      ════════════════════════════════════════════════ */}
      <div className='max-w-[1200px] mx-auto px-6 lg:px-12 relative z-20 -mt-[100px] mb-[100px]'>
        <Grid container spacing={0} className='shadow-2xl rounded-xl overflow-hidden'>
          
          {/* Emergency Block */}
          <Grid size={{ xs: 12, md: 4 }} className='bg-[#004d40] text-white p-10 flex flex-col justify-center transition-transform hover:-translate-y-2 duration-300'>
            <i className='tabler-phone-call text-5xl mb-6 opacity-80' />
            <Typography variant='h5' className='font-bold text-white mb-2'>
              Emergency Assistance
            </Typography>
            <Typography variant='body2' className='text-white/70 mb-6'>
              We go the extra mile to provide the best and fastest service for you and your loved ones.
            </Typography>
            <Typography variant='h5' className='font-black text-[#ffd54f] mb-2'>
              045 222 XXXX
            </Typography>
            <Button variant='text' className='text-white p-0 justify-start w-fit hover:text-[#ffd54f]' onClick={handleContact}>
              Call Us Now <i className='tabler-arrow-right ml-2' />
            </Button>
          </Grid>

          {/* Channel a Doctor Block */}
          <Grid size={{ xs: 12, md: 4 }} className='bg-primary text-white p-10 flex flex-col justify-center transition-transform hover:-translate-y-2 duration-300'>
            <i className='tabler-stethoscope text-5xl mb-6 opacity-80' />
            <Typography variant='h5' className='font-bold text-white mb-2'>
              Channel a Doctor
            </Typography>
            <Typography variant='body2' className='text-white/70 mb-6'>
              Access Sri Lanka's leading medical specialists. Book your appointment easily through our portal.
            </Typography>
            <div className='mt-auto'>
              <Button variant='contained' onClick={handlePatientLogin} sx={{ backgroundColor: 'white', color: 'primary.main', '&:hover': { backgroundColor: '#f5f5f5' } }} className='rounded-none px-6 py-2 font-bold'>
                Make an Appointment
              </Button>
            </div>
          </Grid>

          {/* Location Block */}
          <Grid size={{ xs: 12, md: 4 }} className='bg-white text-textPrimary p-10 flex flex-col justify-center border-r border-y border-divider transition-transform hover:-translate-y-2 duration-300'>
            <i className='tabler-map-pin text-5xl mb-6 text-primary' />
            <Typography variant='h5' className='font-bold text-textPrimary mb-2'>
              Our Location
            </Typography>
            <Typography variant='body2' className='text-textSecondary mb-6 leading-relaxed'>
              New Senara Channel Center <br />
              Main Road, Ratnapura, <br />
              Sabaragamuwa Province, Sri Lanka.
            </Typography>
            <Button variant='text' className='text-primary p-0 justify-start w-fit mt-auto hover:underline' href='https://maps.google.com' target='_blank'>
              Get Directions <i className='tabler-arrow-right ml-2' />
            </Button>
          </Grid>

        </Grid>
      </div>

      {/* ════════════════════════════════════════════════
          3. ABOUT & CORE SERVICES
      ════════════════════════════════════════════════ */}
      <section id='about' className='py-[80px] bg-backgroundDefault'>
        <div className='max-w-[1200px] mx-auto px-6 lg:px-12 text-center'>
          <Typography variant='h3' className='font-extrabold text-textPrimary mb-6' style={{ fontFamily: "'Playfair Display', serif", textTransform: 'uppercase' }}>
            We Are Committed To <span className='text-primary'>Your Better Health</span>
          </Typography>
          <Typography variant='body1' className='text-textSecondary max-w-[800px] mx-auto mb-16 leading-relaxed'>
            New Senara Channel Center is a modern multi-specialty facility located in the heart of Ratnapura. We are committed to providing compassionate and high-quality medical care of international standards with a focus on value-based healthcare, providing the best clinical outcomes.
          </Typography>

          {/* Services Icon Grid */}
          <Grid container spacing={4} justifyContent="center">
            {SERVICES.map((service, i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, md: 2 }}>
                <div className='flex flex-col items-center group cursor-pointer'>
                  <div className='w-20 h-20 rounded-full bg-primaryLight flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white'>
                    <i className={`${service.icon} text-3xl`} />
                  </div>
                  <Typography variant='subtitle2' className='font-bold text-textPrimary group-hover:text-primary transition-colors'>
                    {service.title}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>

          <div className='mt-16'>
            <Button variant='outlined' size='large' href='#services' className='rounded-none px-10 py-3 font-bold text-primary border-primary'>
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          4. SPECIAL HEALTH PACKAGES
      ════════════════════════════════════════════════ */}
      <section className='py-[100px] bg-backgroundPaper border-y border-divider'>
        <div className='max-w-[1200px] mx-auto px-6 lg:px-12'>
          <Grid container spacing={10} alignItems='center'>
            <Grid size={{ xs: 12, lg: 6 }} className='hidden lg:flex justify-center'>
              {/* Image Placeholder / Abstract Art */}
              <div className='relative w-full aspect-square bg-primaryLight rounded-2xl flex items-center justify-center overflow-hidden shadow-inner'>
                <div className='absolute inset-0 opacity-20' style={{ backgroundImage: 'repeating-linear-gradient(45deg, #009688 25%, transparent 25%, transparent 75%, #009688 75%, #009688), repeating-linear-gradient(45deg, #009688 25%, white 25%, white 75%, #009688 75%, #009688)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }} />
                <div className='z-10 bg-white p-8 rounded-full shadow-2xl'>
                  <i className='tabler-first-aid-kit text-[100px] text-primary' />
                </div>
              </div>
            </Grid>
            
            <Grid size={{ xs: 12, lg: 6 }}>
              <Typography variant='overline' className='text-primary font-bold tracking-widest block mb-2'>
                Wellness & Prevention
              </Typography>
              <Typography variant='h3' className='font-extrabold text-textPrimary mb-6' style={{ fontFamily: "'Playfair Display', serif", textTransform: 'uppercase' }}>
                Special Health Packages <br/><span className='italic font-light text-textSecondary'>& Promotions</span>
              </Typography>
              <Typography variant='body1' className='text-textSecondary leading-relaxed mb-8'>
                The Laboratory and Wellness Centre at New Senara is geared to provide you an array of health screening packages to enhance your health and wellness. Discover comprehensive wellness with our exclusive body check-up packages. Your health, our priority!
              </Typography>
              <ul className='mb-10 space-y-4'>
                {['Comprehensive Blood Panels', 'Diabetic Screening Packages', 'Heart Health Checkups'].map((item, idx) => (
                  <li key={idx} className='flex items-center text-textPrimary font-medium'>
                    <i className='tabler-check text-success text-xl mr-3' /> {item}
                  </li>
                ))}
              </ul>
              <Button variant='contained' size='large' onClick={handlePatientLogin} className='rounded-none px-8 py-3 shadow-md bg-primary'>
                View All Packages
              </Button>
            </Grid>
          </Grid>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          5. FACILITIES & WHY CHOOSE US
      ════════════════════════════════════════════════ */}
      <section className='py-[100px] bg-backgroundDefault'>
        <div className='max-w-[1200px] mx-auto px-6 lg:px-12'>
          <div className='text-center mb-16'>
            <Typography variant='h3' className='font-extrabold text-textPrimary mb-4' style={{ fontFamily: "'Playfair Display', serif", textTransform: 'uppercase' }}>
              Exactly What Facilities We Provide
            </Typography>
            <Typography variant='subtitle1' className='text-primary font-bold tracking-widest uppercase'>
              Medical Quality Care
            </Typography>
          </div>

          <Grid container spacing={4}>
            {FACILITIES.map((facility, i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Card className='h-full border border-divider shadow-none hover:shadow-lg transition-shadow bg-backgroundPaper rounded-xl'>
                  <CardContent className='p-8 text-center flex flex-col items-center'>
                    <div className='w-20 h-20 rounded-full border-2 border-primary border-dashed flex items-center justify-center text-primary mb-6 p-2'>
                       <div className='w-full h-full bg-primaryLight rounded-full flex items-center justify-center'>
                         <i className={`${facility.icon} text-3xl`} />
                       </div>
                    </div>
                    <Typography variant='h6' className='font-bold text-textPrimary mb-4'>
                      {facility.title}
                    </Typography>
                    <Typography variant='body2' className='text-textSecondary leading-relaxed'>
                      {facility.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          6. TESTIMONIALS
      ════════════════════════════════════════════════ */}
      <section className='py-[100px] bg-primaryDark relative overflow-hidden'>
        <div className='absolute inset-0 bg-[#003b46] opacity-90' />
        <div className='max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10'>
          
          <div className='text-center mb-16'>
            <Typography variant='h3' className='font-extrabold text-white mb-4' style={{ fontFamily: "'Playfair Display', serif", textTransform: 'uppercase' }}>
              Satisfied Patients Reviews
            </Typography>
            <Typography variant='body1' className='text-white/80 max-w-[600px] mx-auto'>
              Join countless others on their recovery journey at New Senara Channel Center, where your health and well-being are our top priority.
            </Typography>
          </div>

          <Grid container spacing={4}>
            {TESTIMONIALS.map((review, i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Card className='h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl'>
                  <CardContent className='p-8'>
                    <i className='tabler-quote text-4xl text-[#ffd54f] mb-4 block opacity-50' />
                    <Typography variant='body1' className='text-white italic leading-relaxed mb-8 min-h-[80px]'>
                      {review.text}
                    </Typography>
                    <div className='flex items-center gap-4 mt-auto'>
                      <Avatar sx={{ bgcolor: '#ffd54f', color: '#003b46', fontWeight: 'bold' }}>
                        {review.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Typography variant='subtitle2' className='font-bold text-white'>
                          {review.name}
                        </Typography>
                        <Typography variant='caption' className='text-white/60'>
                          {review.title}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>

    </div>
  )
}

export default SenaraLanding