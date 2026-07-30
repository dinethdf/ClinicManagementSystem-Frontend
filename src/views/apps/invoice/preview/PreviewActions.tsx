// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import SendInvoiceDrawer from '@views/apps/invoice/shared/SendInvoiceDrawer'
import PaymentDialog from '@/components/dialogs/payment-dialog/PaymentDialog'
import RefundDialog from '@/components/dialogs/refund-dialog/RefundDialog'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const PreviewActions = ({ id, onButtonClick }: { id: string; onButtonClick: () => void }) => {
  // States
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [sendDrawerOpen, setSendDrawerOpen] = useState(false)

  // Hooks
  const { lang: locale } = useParams()

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <Button
            fullWidth
            variant='contained'
            className='capitalize'
            startIcon={<i className='tabler-send' />}
            onClick={() => setSendDrawerOpen(true)}
          >
            Send Invoice
          </Button>
          <Button fullWidth color='secondary' variant='tonal' className='capitalize'>
            Download
          </Button>
          <div className='flex items-center gap-4'>
            <Button fullWidth color='secondary' variant='tonal' className='capitalize' onClick={onButtonClick}>
              Print
            </Button>
            <Button
              fullWidth
              component={Link}
              color='secondary'
              variant='tonal'
              className='capitalize'
              href={getLocalizedUrl(`/apps/invoice/edit/${id}`, locale as Locale)}
            >
              Edit
            </Button>
          </div>
          <Button
            fullWidth
            color='success'
            variant='contained'
            className='capitalize'
            onClick={() => setPaymentDialogOpen(true)}
            startIcon={<i className='tabler-currency-dollar' />}
          >
            Add Payment
          </Button>
          <Button
            fullWidth
            color='error'
            variant='tonal'
            className='capitalize'
            onClick={() => setRefundDialogOpen(true)}
            startIcon={<i className='tabler-arrow-back-up' />}
          >
            Process Refund
          </Button>
        </CardContent>
      </Card>
      <PaymentDialog 
        open={paymentDialogOpen} 
        setOpen={setPaymentDialogOpen} 
        invoiceId={Number(id) || 0}
        balanceRemaining={1500} // This should ideally come from invoiceData
        onSuccess={() => {}}
      />
      <RefundDialog 
        open={refundDialogOpen} 
        setOpen={setRefundDialogOpen} 
        invoiceId={Number(id) || 0}
        onSuccess={() => {}}
      />
      <SendInvoiceDrawer open={sendDrawerOpen} handleClose={() => setSendDrawerOpen(false)} />
    </>
  )
}

export default PreviewActions
