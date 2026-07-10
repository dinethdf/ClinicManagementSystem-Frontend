'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

// Component Imports
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

// Service Import
import { appointmentService } from '@/services/reports/analysis.admin.service'
import type { CashierReconciliationDTO } from '@/types/analysis.types'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const CashierReconciliationDialog = ({ open, setOpen }: Props) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    staffId: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<CashierReconciliationDTO | null>(null)

  const handleClose = () => {
    setOpen(false)
    setError(null)
    setData(null)
  }

  const handleGenerate = async () => {
    if (!formData.date || !formData.staffId) {
      setError("Please provide both Date and Staff ID.")
      return
    }

    setLoading(true)
    setError(null)

    const res = await appointmentService.getCashierReconciliation(formData.date, Number(formData.staffId))

    setLoading(false)

    if (res) {
      setData(res)
    } else {
      setError("Failed to fetch Cashier Reconciliation data.")
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle variant='h4' className='text-center p-6'>
        Cashier Reconciliation
        <Typography component='span' className='block text-center text-sm font-normal mt-1'>
          End-of-day reconciliation by staff member.
        </Typography>
      </DialogTitle>

      <DialogContent className='p-6'>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        <Grid container spacing={4} className="mb-6">
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField 
              fullWidth 
              type='date' 
              label='Date' 
              InputLabelProps={{ shrink: true }}
              value={formData.date} 
              onChange={e => setFormData({ ...formData, date: e.target.value })} 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField 
              fullWidth 
              type='number' 
              label='Staff ID' 
              placeholder='e.g., 5'
              value={formData.staffId} 
              onChange={e => setFormData({ ...formData, staffId: e.target.value })} 
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
          <Box className='mt-4'>
            <Typography variant="h6" className='mb-4'>Reconciliation Details (Staff ID: {data.staffId})</Typography>
            
            <TableContainer component={Paper} variant='outlined'>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Workstation</TableCell>
                    <TableCell align="right">Transactions</TableCell>
                    <TableCell align="right">Collected (Rs)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.workstations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" className='py-4'>
                        No transactions found for this date.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.workstations.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className='font-medium'>{row.cashierWorkstationId}</TableCell>
                        <TableCell align="right">{row.totalTransactions}</TableCell>
                        <TableCell align="right" className='font-bold text-success'>
                          {row.totalCollected.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CashierReconciliationDialog
