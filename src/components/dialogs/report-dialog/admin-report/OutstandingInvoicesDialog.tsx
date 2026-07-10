'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
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
import Chip from '@mui/material/Chip'

// Component Imports
import DialogCloseButton from '@components/dialogs/DialogCloseButton'

// Service Import
import { appointmentService } from '@/services/reports/analysis.admin.service'
import type { OutstandingInvoiceDTO } from '@/types/analysis.types'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const OutstandingInvoicesDialog = ({ open, setOpen }: Props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<OutstandingInvoiceDTO[]>([])

  useEffect(() => {
    if (open) {
      fetchData()
    }
  }, [open])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    const res = await appointmentService.getOutstandingInvoices()

    setLoading(false)

    if (res) {
      setData(res)
    } else {
      setError("Failed to fetch Outstanding Invoices.")
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle variant='h4' className='text-center p-6'>
        Outstanding Invoices
        <Typography component='span' className='block text-center text-sm font-normal mt-1'>
          Invoices with pending balances.
        </Typography>
      </DialogTitle>

      <DialogContent className='p-6'>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        {loading ? (
          <Box className='flex justify-center my-6'>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} variant='outlined'>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Invoice ID</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell align="right">Total (Rs)</TableCell>
                  <TableCell align="right">Balance (Rs)</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" className='py-4'>
                      No outstanding invoices found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableRow key={row.invoiceId}>
                      <TableCell>#{row.invoiceId}</TableCell>
                      <TableCell>{row.patientName}</TableCell>
                      <TableCell>{row.contact}</TableCell>
                      <TableCell align="right">{row.totalAmount.toLocaleString()}</TableCell>
                      <TableCell align="right" className='font-bold text-error'>
                        {row.balanceRemaining.toLocaleString()}
                      </TableCell>
                      <TableCell>{row.dueDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} 
                          color={row.status === 'PARTIAL' ? 'warning' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default OutstandingInvoicesDialog
