import { Suspense } from 'react'
import Typography from '@mui/material/Typography'
import DoctorFinancials from '@/views/clinic-app/doctors/financial/DoctorFinancials';

export const metadata = {
  title: 'Doctor Financials | Clinic OS',
}

export default async function FinancialsPage() {

  const doctorId = 1; // Hardcoded for testing based on your example

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <Typography variant='h4' className='font-bold text-gray-800'>
          My Earnings
        </Typography>
        <Typography variant='body1' className='text-gray-500'>
          Track your appointment revenue and payout status.
        </Typography>
      </div>

      <Suspense fallback={<div>Loading Financials...</div>}>
        <DoctorFinancials doctorId={doctorId} />
      </Suspense>
    </div>
  )
}