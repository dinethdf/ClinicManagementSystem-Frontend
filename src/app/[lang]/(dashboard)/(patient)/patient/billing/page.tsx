'use client'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import BillingHistory from '@/views/clinic-app/patient-portal/billing/BillingHistory'
import InsuranceCard from '@/views/clinic-app/patient-portal/billing/InsuranceCard'

const BillingPage = () => {
  return (
    <div className='max-w-6xl mx-auto'>
        <div className='mb-6'>
            <Typography variant='h4' fontWeight={700} color='primary'>Billing & Insurance</Typography>
            <Typography variant='body2' color='text.secondary'>View your invoices and manage insurance details.</Typography>
        </div>

        <Grid container spacing={4}>
            {/* Left: Insurance Card (Sticky on Desktop) */}
            <Grid size={{ xs: 12, md: 4 }}>
                <div className='md:sticky md:top-24'>
                    <InsuranceCard />
                </div>
            </Grid>

            {/* Right: Billing History */}
            <Grid size={{ xs: 12, md: 8 }}>
                <BillingHistory />
            </Grid>
        </Grid>
    </div>
  )
}

export default BillingPage