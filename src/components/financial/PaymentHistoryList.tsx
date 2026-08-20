'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Service
import { getPaymentHistory } from '@/services/financial/payment.service'
import type { InvoicePaymentDetailDTO } from '@/types/financial.types'

type Props = {
  invoiceId: number
}

const PaymentHistoryList = ({ invoiceId }: Props) => {
  const [history, setHistory] = useState<InvoicePaymentDetailDTO[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      const result = await getPaymentHistory(invoiceId)
      if (result.success && result.data) {
        setHistory(result.data)
      } else {
        setError(result.message || 'Failed to load payment history')
      }
      setLoading(false)
    }

    if (invoiceId) {
      fetchHistory()
    }
  }, [invoiceId])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-10">
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title='Payment & Refund History' />
      <CardContent className='flex flex-col gap-6'>
        {history.length === 0 ? (
          <Typography color='text.secondary'>No transactions found for this invoice.</Typography>
        ) : (
          history.map((transaction, index) => {
            const isRefund = transaction.amount < 0
            const amountColor = isRefund ? 'error.main' : 'success.main'
            const displayAmount = isRefund 
              ? `- LKR ${Math.abs(transaction.amount).toFixed(2)}` 
              : `+ LKR ${transaction.amount.toFixed(2)}`

            return (
              <div key={index} className='flex items-center gap-4'>
                <CustomAvatar 
                  skin='light' 
                  color={isRefund ? 'error' : 'success'} 
                  variant='rounded' 
                  size={40}
                >
                  <i className={isRefund ? 'tabler-arrow-back-up' : 'tabler-cash'} />
                </CustomAvatar>
                
                <div className='flex flex-col flex-grow gap-0.5'>
                  <Typography className='font-medium' color='text.primary'>
                    {isRefund ? 'Refund' : 'Payment'} via {transaction.method}
                  </Typography>
                  <div className='flex items-center gap-2'>
                    <Typography variant='body2' color='text.disabled'>
                      {new Date(transaction.paymentDate).toLocaleString()}
                    </Typography>
                    <span className='text-disabled'>•</span>
                    <Typography variant='body2' color='text.disabled'>
                      By {transaction.receivedBy}
                    </Typography>
                  </div>
                </div>

                <div className='flex flex-col items-end gap-1'>
                  <Typography className='font-medium' sx={{ color: amountColor }}>
                    {displayAmount}
                  </Typography>
                  
                  {/* Dynamic Status Badge from backend */}
                  <Chip 
                    label={transaction.status.displayName}
                    size="small"
                    sx={{ 
                      backgroundColor: `${transaction.status.colorCode}20`, // 20% opacity for background
                      color: transaction.status.colorCode,
                      fontWeight: 500,
                      height: '24px'
                    }} 
                  />
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

export default PaymentHistoryList
