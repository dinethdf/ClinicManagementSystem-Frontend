'use client'

import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

const FinancialDoctor = ({ scheduleId, itemCount, paymentDueDate }: { scheduleId: string, itemCount: number, paymentDueDate?: string | null }) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  
  return (
    <div className='flex flex-wrap justify-between sm:items-center max-sm:flex-col gap-y-4 mb-4'>
      <div className='flex items-center gap-4'>
        <IconButton 
          onClick={() => router.push(`/${locale}/clinic/payouts/doctor/list`)}
          className='bg-actionHover'
        >
          <i className='tabler-arrow-left' />
        </IconButton>
        <div className='flex flex-col items-start gap-1'>
          <div className='flex items-center gap-2'>
            <Typography variant='h5'>{`Schedule #${scheduleId}`}</Typography>
            <Chip
              variant='tonal'
              label={itemCount > 0 ? 'Active' : 'Empty'}
              color='primary'
              size='small'
            />
          </div>
          <div className='flex items-center gap-4'>
            <Typography variant='body2' color='text.secondary'>{`Total Appointments: ${itemCount}`}</Typography>
            {paymentDueDate && (
              <>
                <span className='text-divider'>|</span>
                <Typography variant='body2' color={new Date(paymentDueDate) < new Date() ? 'error.main' : 'text.secondary'}>
                  Due Date: {new Date(paymentDueDate).toLocaleDateString()}
                </Typography>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Action Buttons could go here */}
      <Button 
        variant='tonal' 
        color='secondary' 
        startIcon={<i className='tabler-printer' />}
        onClick={() => window.print()}
      >
        Print Report
      </Button>
    </div>
  )
}


export default FinancialDoctor