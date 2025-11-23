'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

// Type Imports
import type { FinancialScheduleItem } from '@/types/financial.types'

const FinancialSummaryCard = ({ data }: { data: FinancialScheduleItem[] }) => {
  
  const totalProfit = data.reduce((sum, item) => sum + item.netClinicProfit, 0)
  const totalDiscounts = data.reduce((sum, item) => sum + item.clinicDiscountAmount + item.doctorDiscountAmount, 0)
  const paidCount = data.filter(i => i.paymentStatus === 'PAID').length

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <Typography variant='h5'>Session Summary</Typography>
        
        <div className='flex items-center gap-3'>
          <Avatar variant='rounded' color='success'>
            <i className='tabler-currency-dollar' />
          </Avatar>
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>Total Clinic Profit</Typography>
            <Typography variant='h6' color='success.main'>Rs.{totalProfit.toFixed(2)}</Typography>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
           <div className='flex justify-between'>
             <Typography>Appointments:</Typography>
             <Typography className='font-medium'>{data.length}</Typography>
           </div>
           <div className='flex justify-between'>
             <Typography>Paid:</Typography>
             <Typography className='font-medium' color='success.main'>{paidCount}</Typography>
           </div>
           <div className='flex justify-between'>
             <Typography>Total Discounts Given:</Typography>
             <Typography className='font-medium' color='error.main'>-Rs.{totalDiscounts.toFixed(2)}</Typography>
           </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FinancialSummaryCard