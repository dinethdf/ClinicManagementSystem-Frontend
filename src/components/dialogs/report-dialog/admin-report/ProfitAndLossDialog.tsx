'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

// Component Imports
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

// Service Import
import { appointmentService } from '@/services/reports/analysis.admin.service'
import type { ProfitAndLossDTO } from '@/types/analysis.types'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const ProfitAndLossDialog = ({ open, setOpen }: Props) => {
  const [formData, setFormData] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Default: Start of year
    endDate: new Date().toISOString().split('T')[0]
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ProfitAndLossDTO | null>(null)

  const handleClose = () => {
    setOpen(false)
    setError(null)
    setData(null)
  }

  const handleGenerate = async () => {
    if (!formData.startDate || !formData.endDate) {
      setError("Please select both Start and End dates.")
      return
    }

    setLoading(true)
    setError(null)

    const res = await appointmentService.getProfitAndLoss(formData.startDate, formData.endDate)

    setLoading(false)

    if (res) {
      setData(res)
    } else {
      setError("Failed to fetch Profit & Loss data.")
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle variant='h4' className='text-center p-6'>
        Profit & Loss Report
        <Typography component='span' className='block text-center text-sm font-normal mt-1'>
          View clinic revenue, expenses, and net profit.
        </Typography>
      </DialogTitle>

      <DialogContent className='p-6'>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        <Grid container spacing={4} className="mb-6">
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField 
              fullWidth 
              type='date' 
              label='Start Date' 
              InputLabelProps={{ shrink: true }}
              value={formData.startDate} 
              onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField 
              fullWidth 
              type='date' 
              label='End Date' 
              InputLabelProps={{ shrink: true }}
              value={formData.endDate} 
              onChange={e => setFormData({ ...formData, endDate: e.target.value })} 
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button variant='contained' fullWidth onClick={handleGenerate} disabled={loading}>
              {loading ? 'Fetching...' : 'Generate Report'}
            </Button>
          </Grid>
        </Grid>

        {loading && (
          <Box className='flex justify-center my-6'>
            <CircularProgress />
          </Box>
        )}

        {data && !loading && (
          <Box className='border rounded p-4'>
            <Typography variant="h5" className='mb-4 text-center'>P&L Statement</Typography>
            <Box className='flex justify-between mb-2'>
              <Typography>Total Revenue</Typography>
              <Typography fontWeight="bold">Rs. {data.totalRevenue.toLocaleString()}</Typography>
            </Box>
            <Box className='flex justify-between mb-2 text-error'>
              <Typography>Doctor Payouts</Typography>
              <Typography fontWeight="bold">- Rs. {data.doctorPayouts.toLocaleString()}</Typography>
            </Box>
            <Box className='flex justify-between mb-2 text-error'>
              <Typography>Operational Expenses</Typography>
              <Typography fontWeight="bold">- Rs. {data.opsExpenses.toLocaleString()}</Typography>
            </Box>
            <Divider className='my-3' />
            <Box className='flex justify-between mt-2'>
              <Typography variant="h6">Net Profit</Typography>
              <Typography variant="h6" color={data.netProfit >= 0 ? "success.main" : "error.main"}>
                Rs. {data.netProfit.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProfitAndLossDialog
