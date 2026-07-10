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
import type { DiscountLeakageDTO } from '@/types/analysis.types'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DiscountLeakageDialog = ({ open, setOpen }: Props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DiscountLeakageDTO[]>([])

  useEffect(() => {
    if (open) {
      fetchData()
    }
  }, [open])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    const res = await appointmentService.getDiscountLeakageReport()

    setLoading(false)

    if (res) {
      setData(res)
    } else {
      setError("Failed to fetch Discount Leakage Report.")
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
        Discount Leakage Report
        <Typography component='span' className='block text-center text-sm font-normal mt-1'>
          Analysis of discounts authorized across the clinic.
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
                  <TableCell>Discount Type</TableCell>
                  <TableCell>Authorized By</TableCell>
                  <TableCell align="right">Times Given</TableCell>
                  <TableCell align="right">Total Discount (Rs)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" className='py-4'>
                      No discount records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip 
                          label={row.discountType} 
                          color="secondary" 
                          variant="tonal" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{row.authorizedBy}</TableCell>
                      <TableCell align="right">{row.timesGiven}</TableCell>
                      <TableCell align="right" className='font-bold text-error'>
                        {row.totalDiscountGiven.toLocaleString()}
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

export default DiscountLeakageDialog
