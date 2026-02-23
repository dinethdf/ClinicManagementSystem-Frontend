'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Timeline from '@mui/lab/Timeline'
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import Box from '@mui/material/Box'

// Component Imports
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'


import { getInvoicePaymentHistory } from '@/services/financial/invoice.server.service'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  invoiceId: number
}

interface PaymentHistoryItem {
    paymentId: number;
    paymentDate: string;
    amount: number;
    transactionRef: string | null;
    receivedBy: string;
    method: string;
    location: string;
    status: {
        code: string;
        displayName: string;
        colorCode: string;
    };
}

const PaymentHistoryDialog = ({ open, setOpen, invoiceId }: Props) => {
  const [loading, setLoading] = useState(false)
  const [historyData, setHistoryData] = useState<PaymentHistoryItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (open && invoiceId) {
      fetchHistory()
    }
  }, [open, invoiceId])

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)
    setHistoryData([])

    const result = await getInvoicePaymentHistory(invoiceId)

    if (result.success) {
        setHistoryData(result.data || [])
    } else {
        setError(result.message || "Failed to load history")
    }
    setLoading(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)
  }

  return (
    <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth='sm' 
        fullWidth
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
<DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-8 sm:pbe-6 sm:pli-16'>
        Payment History
        <Typography component='span' variant='subtitle2'>
          Transaction log for Invoice #{invoiceId}
        </Typography>
      </DialogTitle>

      <DialogContent className='pbs-0 sm:pli-16'>
        
        {loading ? (
            <div className="flex justify-center p-8">
                <CircularProgress />
            </div>
        ) : error ? (
            <Alert severity='error'>{error}</Alert>
        ) : historyData.length === 0 ? (
            <Alert severity='info' icon={<i className='tabler-info-circle' />}>
                No payment transactions found.
            </Alert>
        ) : (
            <Timeline 
                sx={{ 
                    my: 0, 
                    py: 0,
                    // FIX: Remove the left-side space reserved for opposite content
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}
            >
                {historyData.map((item, index) => {
                    const isRefund = item.amount < 0 || item.status.code === 'REFUNDED';
                    
                    return (
                        <TimelineItem key={item.paymentId}>
                            <TimelineSeparator>
                                <TimelineDot 
                                    sx={{ 
                                        backgroundColor: isRefund ? '#6C757D' : item.status.colorCode, 
                                        boxShadow: 'none',
                                        margin: '10px 0'
                                    }} 
                                >
                                    <i className={`text-white text-sm ${isRefund ? 'tabler-arrow-back-up' : 'tabler-check'}`} />
                                </TimelineDot>
                                {index < historyData.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Box className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm w-full">
                                    
                                    {/* Header Row: Amount & Status */}
                                    <div className="flex justify-between items-start">
                                        <div className='flex flex-col'>
                                            <Typography variant="h6" className={`font-bold ${isRefund ? 'text-gray-500 line-through decoration-2' : 'text-gray-800'}`}>
                                                {formatCurrency(Math.abs(item.amount))}
                                            </Typography>
                                            {isRefund && (
                                                <Typography variant="body2" className="text-gray-500 font-medium leading-none">
                                                    Refunded
                                                </Typography>
                                            )}
                                        </div>
                                        <Chip 
                                            label={item.status.displayName} 
                                            size="small" 
                                            sx={{ 
                                                backgroundColor: item.status.colorCode, 
                                                color: '#fff', 
                                                fontSize: '0.7rem', 
                                                height: 24,
                                                fontWeight: 'bold',
                                                borderRadius: '4px'
                                            }} 
                                        />
                                    </div>

                                    {/* Date & Transaction Info */}
                                    <div className='flex flex-col gap-2'>
                                        <Typography variant="caption" className="flex items-center gap-1.5 text-gray-500 font-medium">
                                            <i className="tabler-calendar text-sm" />
                                            {new Date(item.paymentDate).toLocaleString()}
                                        </Typography>
                                        
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Chip 
                                                label={item.method} 
                                                size="small" 
                                                variant="outlined" 
                                                className="h-6 text-[11px] font-bold uppercase border-gray-300 bg-white" 
                                            />
                                            {item.transactionRef && (
                                                <Typography variant="caption" className="font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                                    #{item.transactionRef}
                                                </Typography>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Divider */}
                                    <div className="h-px bg-dashed border-t border-gray-200 border-dashed w-full my-1"></div>

                                    {/* Footer: User Info */}
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <span>By:</span>
                                            <span className="font-medium text-gray-700">{item.receivedBy}</span>
                                        </div>
                                        <span className="font-medium bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                                            {item.location}
                                        </span>
                                    </div>

                                </Box>
                            </TimelineContent>
                        </TimelineItem>
                    )
                })}
            </Timeline>
        )}

      </DialogContent>

      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='tonal' color='secondary' onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PaymentHistoryDialog