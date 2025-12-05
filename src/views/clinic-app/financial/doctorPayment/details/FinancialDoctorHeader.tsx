'use client'

// MUI Imports
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// Type Imports
// import type { ThemeColor } from '@core/types'

const FinancialDoctor = ({ scheduleId, itemCount }: { scheduleId: string, itemCount: number }) => {
  
  return (
    <div className='flex flex-wrap justify-between sm:items-center max-sm:flex-col gap-y-4'>
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
        <Typography>{`Total Appointments: ${itemCount}`}</Typography>
      </div>
      {/* Action Buttons could go here */}
      <Button variant='tonal' color='secondary'>Print Report</Button>
    </div>
  )
}

export default FinancialDoctor