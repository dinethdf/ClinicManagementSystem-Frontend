'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'
import styles from './styles.module.css'

const faqs = [
  {
    q: 'Do I need a credit card to start the free trial?',
    a: 'No. Your 14-day free trial starts instantly with just an email. No payment information is ever required until you choose to upgrade to a paid plan after the trial period.'
  },
  {
    q: 'How does the QR queue system work in practice?',
    a: 'When a patient books an appointment, they receive a unique QR token via email or SMS. At the clinic, reception scans the QR code to check them in. The patient\'s phone immediately shows their live queue position, allowing them to relax until it\'s their turn.'
  },
  {
    q: 'Can I use my own domain or branding?',
    a: 'Yes. Every clinic gets a custom subdomain (e.g., yourclinic.cureguard.io) from day one. You can upload your own logo, set your color scheme, configure local currency, timezone, and invoice prefix for a fully branded experience.'
  },
  {
    q: 'Is patient data secure and HIPAA-compliant?',
    a: 'Absolutely. We use advanced stateless authentication, end-to-end encryption, and strict data isolation between clinics. Patient records are never accessible across different clinic accounts. We take healthcare compliance extremely seriously.'
  },
  {
    q: 'Can I manage multiple clinic branches?',
    a: 'Yes, this is available on the Enterprise plan. Each branch gets its own workspace, and staff and patients use a unique Clinic Code to access the right branch. Central admin can see a unified view across all locations.'
  },
  {
    q: 'How does doctor payout tracking work?',
    a: "When you configure a doctor's profile, you set their fee structure (fixed, percentage, or consultation rate). CureGuard automatically calculates and records the doctor's earnings vs. clinic commission for every consultation, generating instant payout summaries."
  }
]

const FaqSection = () => {
  const [expanded, setExpanded] = useState<string | false>('faq-0')

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <section id='faq' className='bg-backgroundDefault plb-[100px]'>
      <div className={classnames('flex flex-col gap-12', frontCommonStyles.layoutSpacing)}>
        {/* Header */}
        <div className='flex flex-col gap-y-4 items-center justify-center text-center'>
          <Chip size='small' variant='tonal' color='primary' label='FAQ' />
          <Typography color='text.primary' variant='h4' className='font-extrabold'>
            Frequently Asked{' '}
            <em className='italic text-primary'>Questions</em>
          </Typography>
        </div>

        <Grid container spacing={8} alignItems='start'>
          {/* Accordion */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expanded === `faq-${index}`}
                onChange={handleChange(`faq-${index}`)}
                className='mbe-3'
                disableGutters
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px !important',
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    borderColor: 'primary.main'
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<i className='tabler-chevron-down' />}
                  aria-controls={`faq-${index}-content`}
                  id={`faq-${index}-header`}
                >
                  <Typography variant='subtitle1' className='font-semibold'>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant='body2' color='text.secondary' className='leading-relaxed'>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          {/* CTA Card */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <div className={styles.faqCtaCard}>
              <div className={styles.faqCtaGlow} aria-hidden='true' />
              <Typography variant='h5' className='font-extrabold mbe-3 relative z-[1]' style={{ color: 'white' }}>
                Still have{' '}
                <em style={{ color: 'var(--mui-palette-primary-light)' }}>questions?</em>
              </Typography>
              <Typography variant='body2' className='mbe-6 relative z-[1]' style={{ color: 'rgba(255,255,255,0.75)' }}>
                Our healthcare implementation team is available to walk you through a live demo, answer
                compliance questions, or help you configure CureGuard for your specific specialty.
              </Typography>
              <Button
                component={Link}
                href='/contact'
                variant='contained'
                color='primary'
                size='large'
                className='relative z-[1]'
              >
                📞 Book a Live Demo
              </Button>
              <Typography
                variant='caption'
                className='block mbs-4 relative z-[1]'
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Usually responds within 2 business hours
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default FaqSection
