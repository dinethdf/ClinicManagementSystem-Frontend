'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Type Imports
import type { AppointmentDetailDTO } from '@/types/appoinments.types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog/ConfirmationDialog'

// Service Imports
import { cancelAppointment} from '@/services/appoinment.server.service'
import { encodeHideValue } from '@/utils/encode'
import { appointmentPrintInvoice } from '@/components/printable/billPrint/AppointmentPrintInvoice'
import { getInvoiceDetails } from '@/services/invoice.server.service'

const AppointmentLeftOverview = ({ appointmentData }: { appointmentData: AppointmentDetailDTO }) => {
  const router = useRouter()
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)

  const handleCancelConfirm = async (reason?: string) => {
    // 1. Call the Server Action with the selected reason
    const finalReason = reason || "No reason provided";
    const result = await cancelAppointment(appointmentData.id, finalReason);

    // 2. Refresh UI if successful
    if (result.success) {
        router.refresh(); 
        return { success: true, message: result.message };
    } 
    
    // 3. Return error
    return { success: false, message: result.error?.message || "Failed to cancel appointment" };
  }

  const handlePrintInvoice = async () => {
    try {
      setIsPrinting(true)
      
      // Get the invoice ID from appointmentData (adjust field name as needed)
      const invoiceId = appointmentData.id // or appointmentData.id depending on your data structure
      
      if (!invoiceId) {
        alert('Invoice not found for this appointment')
        return
      }

      // Fetch invoice details
      const invoiceDetails = await getInvoiceDetails(invoiceId)
      
      if (!invoiceDetails) {
        alert('Failed to load invoice details')
        return
      }

      // Generate QR code URL (adjust the URL as needed)
      const qrCodeUrl = `${window.location.origin}/en/clinic/appoinment/invoice/${invoiceId}`
      
      // Print the invoice
      appointmentPrintInvoice(invoiceDetails, qrCodeUrl)
      
    } catch (error) {
      console.error('Print error:', error)
      alert('Failed to print invoice')
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
           {/* ... (Previous Avatar/Header Code) ... */}
           
           <div className='flex flex-col justify-self-center items-center gap-6'>
            <div className='flex flex-col items-center gap-4'>
              <CustomAvatar src='/images/avatars/common.png' variant='rounded' size={100} />
              <div className='flex flex-col items-center text-center'>
                <Typography variant='h5'>{appointmentData.patientName}</Typography>
                <Typography variant='body2' color='text.disabled'>{appointmentData.patientNo}</Typography>
                <Chip 
                  label={appointmentData.status} 
                  color={appointmentData.status === 'COMPLETED' ? 'success' : appointmentData.status === 'CANCELLED' ? 'error' : 'primary'} 
                  variant='tonal' 
                  size='small' 
                  className='mt-2' 
                />
              </div>
            </div>
          </div>
          
          <Divider />
          
          {/* ... (Previous Patient Details & Doctor Details) ... */}
          <div className='flex flex-col gap-4'>
            <Typography variant='h6'>Patient Details</Typography>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <i className='tabler-phone text-xl text-textSecondary' />
                <Typography>{appointmentData.patientMobile}</Typography>
              </div>
              <div className='flex items-center gap-2'>
                <i className='tabler-id text-xl text-textSecondary' />
                <Typography>{appointmentData.patientNic}</Typography>
              </div>
            </div>
          </div>

          <Divider />

          {/* ... */}

          <div className='flex flex-col gap-2'>
              {/* Print Invoice Button - Show only if payment is completed */}
              {appointmentData.invoiceStatus === 'PAID' && (
                <Button
                  variant='contained'
                  color='secondary'
                  className='max-sm:is-full'
                  startIcon={<i className='tabler-printer' />}
                  onClick={handlePrintInvoice}
                  disabled={isPrinting}
                >
                  {isPrinting ? 'Loading...' : 'Print Invoice'}
                </Button>
              )}

              {/* Payment Button */}
              <Button
                variant='contained'
                color='primary'
                className='max-sm:is-full'
                startIcon={<i className='tabler-credit-card' />}
                onClick={() => {
                  const appinemntId = appointmentData.id || 0
                  const encoded = encodeHideValue(appinemntId);
                  router.push(`./../payment/${encoded}`)
                }}
                disabled={appointmentData.status === 'CANCELLED'}
              >
                {appointmentData.status === 'PENDING_PAYMENT' ? "Make Payment" : "Payment Details" }   
              </Button>  

              {/* Cancel Button */}
              {appointmentData.status !== 'CANCELLED' && (
                  <Button
                    variant='tonal'
                    color='error'
                    className='max-sm:is-full'
                    startIcon={<i className='tabler-x' />}
                    onClick={() => setOpenCancelDialog(true)}
                  >
                    Cancel & Refund
                  </Button>
              )}
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={openCancelDialog}
        setOpen={setOpenCancelDialog}
        type='cancel-appointment'
        onConfirm={handleCancelConfirm}
        // Updated Payment Details Passing
        paymentDetails={{
            invoiceStatus: appointmentData.invoiceStatus,          // e.g. 'PAID', 'UNPAID'
            invoiceFinalAmount: appointmentData.invoiceFinalAmount, // The amount paid
            doctorFee: appointmentData.doctorFee,
            clinicFee: appointmentData.clinicFee
        }}
      />
    </>
  )
}

export default AppointmentLeftOverview