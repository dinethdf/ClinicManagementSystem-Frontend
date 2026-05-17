'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'

// Type Imports
import type { FinancialScheduleItem } from '@/types/financial.types'

const FinancialSummaryCards = ({ data }: { data: FinancialScheduleItem[] }) => {

  const totals = data.reduce((acc, curr) => ({
    collected: acc.collected + (curr.amountPaid || 0),
    clinicProfit: acc.clinicProfit + (curr.netClinicProfit || 0),
    doctorPayout: acc.doctorPayout + (curr.netDoctorPayout || 0),
    outstanding: acc.outstanding + (curr.balanceRemaining || 0),
  }), { collected: 0, clinicProfit: 0, doctorPayout: 0, outstanding: 0 })

  // Base fees are session-level (same for all rows), take from first item
  const baseDoctorFee = data[0]?.baseDoctorFee ?? 0
  const baseClinicFee = data[0]?.baseClinicFee ?? 0
  const paidCount = data.filter(i => i.paymentStatusCode === 'PAID').length
  const cancelledCount = data.filter(i => i.paymentStatusCode === 'CANCELLED').length

  return (
    <Grid container spacing={4}>

      {/* 1. Total Collected */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent className='flex items-center gap-4'>
            <Avatar variant='rounded' className='bg-primary/10 text-primary h-12 w-12'>
              <i className='tabler-cash text-2xl' />
            </Avatar>
            <div className='flex flex-col'>
              <Typography variant='body2' color='text.secondary'>Total Collected</Typography>
              <Typography variant='h5' className='font-bold'>
                Rs. {totals.collected.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {paidCount} paid · {cancelledCount} cancelled
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* 2. Doctor Payout */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent className='flex items-center gap-4'>
            <Avatar variant='rounded' className='bg-info/10 text-info h-12 w-12'>
              <i className='tabler-stethoscope text-2xl' />
            </Avatar>
            <div className='flex flex-col'>
              <Typography variant='body2' color='text.secondary'>Net Doctor Payout</Typography>
              <Typography variant='h5' className='font-bold'>
                Rs. {totals.doctorPayout.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                Base Fee: Rs. {baseDoctorFee.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* 3. Clinic Profit */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent className='flex items-center gap-4'>
            <Avatar variant='rounded' className='bg-success/10 text-success h-12 w-12'>
              <i className='tabler-building-hospital text-2xl' />
            </Avatar>
            <div className='flex flex-col'>
              <Typography variant='body2' color='text.secondary'>Net Clinic Profit</Typography>
              <Typography variant='h5' className='font-bold'>
                Rs. {totals.clinicProfit.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                Base Fee: Rs. {baseClinicFee.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* 4. Outstanding Balances */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent className='flex items-center gap-4'>
            <Avatar variant='rounded' className='bg-warning/10 text-warning h-12 w-12'>
              <i className='tabler-alert-circle text-2xl' />
            </Avatar>
            <div className='flex flex-col'>
              <Typography variant='body2' color='text.secondary'>Pending Balances</Typography>
              <Typography variant='h5' className='font-bold' color={totals.outstanding > 0 ? 'error.main' : 'text.primary'}>
                Rs. {totals.outstanding.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {data.length} total appointments
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  )
}

export default FinancialSummaryCards