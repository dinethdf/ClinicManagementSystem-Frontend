'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Skeleton from '@mui/material/Skeleton'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

// Service & Types
import { getInvoices, getBillingSummary } from '@/services/patient-portal/patient.billing.service'
import type { PatientInvoiceDTO, BillingSummaryDTO } from '@/types/patient-portal/patient.billing.types'

const BillingHistory = () => {
  const [invoices, setInvoices] = useState<PatientInvoiceDTO[]>([])
  const [summary, setSummary] = useState<BillingSummaryDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [invData, sumData] = await Promise.all([getInvoices(), getBillingSummary()])
            setInvoices(invData)
            setSummary(sumData)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'PAID': return 'success';
          case 'PENDING': return 'warning';
          case 'REFUNDED': return 'info';
          case 'CANCELLED': return 'error';
          default: return 'default';
      }
  }

  if (loading) return <div className='p-4'><Skeleton height={100} /><Skeleton height={200} className='mt-4' /></div>

  return (
    <div className='flex flex-col gap-6 animate-in fade-in'>
        
        {/* STORY 4.2: Outstanding Payment Alert */}
        {summary && summary.totalPending > 0 && (
            <Alert severity='warning' variant='filled' className='shadow-md mb-2'>
                <AlertTitle className='font-bold flex items-center gap-2'>
                    <i className='tabler-alert-circle' /> Outstanding Payment: LKR {summary.totalPending.toFixed(2)}
                </AlertTitle>
                You have unpaid invoices. Please settle them at the clinic counter or pay online to avoid service interruptions.
                <div className='mt-3'>
                    <Button variant='contained' color='inherit' size='small' className='text-warning-main bg-white hover:bg-gray-100 font-bold'>
                        Pay Now
                    </Button>
                </div>
            </Alert>
        )}

        {/* Summary Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Card className='bg-primary/5 border border-primary/20'>
                <CardContent className='p-4 flex items-center gap-4'>
                    <div className='bg-primary text-white p-3 rounded-full'><i className='tabler-wallet text-xl' /></div>
                    <div>
                        <Typography variant='caption' className='text-gray-500 font-bold uppercase'>Total Paid (Lifetime)</Typography>
                        <Typography variant='h5' fontWeight={700} color='primary'>LKR {summary?.totalPaid.toLocaleString()}</Typography>
                    </div>
                </CardContent>
            </Card>
            <Card className='bg-warning/5 border border-warning/20'>
                <CardContent className='p-4 flex items-center gap-4'>
                    <div className='bg-warning text-white p-3 rounded-full'><i className='tabler-clock-dollar text-xl' /></div>
                    <div>
                        <Typography variant='caption' className='text-gray-500 font-bold uppercase'>Pending Amount</Typography>
                        <Typography variant='h5' fontWeight={700} color='warning.main'>LKR {summary?.totalPending.toLocaleString()}</Typography>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* STORY 4.1: Invoice List */}
        <Card>
            <div className='p-5 border-b flex justify-between items-center'>
                <Typography variant='h6' fontWeight={600}>Payment History</Typography>
                <Button size='small' startIcon={<i className='tabler-filter' />}>Filter</Button>
            </div>
            <TableContainer>
                <Table size='small'>
                    <TableHead>
                        <TableRow className='bg-gray-50'>
                            <TableCell>Invoice Details</TableCell>
                            <TableCell>Service</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align='right'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((inv) => (
                            <TableRow key={inv.id} hover>
                                <TableCell>
                                    <div className='flex flex-col'>
                                        <Typography variant='subtitle2' fontWeight={600}>{inv.invoiceNo}</Typography>
                                        <Typography variant='caption' color='text.secondary'>{inv.description}</Typography>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip label={inv.serviceType} size='small' variant='outlined' className='text-xs' />
                                </TableCell>
                                <TableCell>
                                    <Typography variant='body2'>{new Date(inv.date).toLocaleDateString()}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontWeight={600}>LKR {inv.amount.toFixed(2)}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={inv.status} 
                                        size='small' 
                                        color={getStatusColor(inv.status) as any} 
                                        variant='tonal' 
                                        className='font-bold text-[10px]' 
                                    />
                                </TableCell>
                                <TableCell align='right'>
                                    {inv.status === 'PAID' && (
                                        <Tooltip title="Download Invoice">
                                            <IconButton size='small' color='primary'>
                                                <i className='tabler-download' />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {inv.status === 'PENDING' && (
                                        <Button size='small' variant='text' color='warning'>Pay</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    </div>
  )
}

export default BillingHistory