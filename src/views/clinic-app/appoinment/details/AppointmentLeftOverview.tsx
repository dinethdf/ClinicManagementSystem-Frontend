'use client'

import { useState } from 'react'

import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// Type Imports
import type { AppointmentDetailDTO } from '@/types/appoinments.types'

// Component Imports
import ConfirmationDialog from '@/components/dialogs/cancel-appointment-dialog/ConfirmationDialog'
import RefundDialog from '@/components/dialogs/refund-dialog/RefundDialog'

// Service Imports
import { cancelAppointment } from '@/services/appointment/appoinment.server.service'
import { encodeHideValue } from '@/utils/encode'
import { appointmentPrintInvoice } from '@/components/printable/billPrint/AppointmentPrintInvoice'
import { getInvoiceDetails } from '@/services/financial/invoice.server.service'

const AppointmentLeftOverview = ({ appointmentData }: { appointmentData: AppointmentDetailDTO }) => {
  const router = useRouter()
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [openRefundDialog, setOpenRefundDialog] = useState(false)
  const [smsConfirmOpen, setSmsConfirmOpen] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  

  const handleCancelConfirm = async (reason?: string, refundMethod?: string) => {
  const finalReason = reason || "No reason provided";

  // Pass the refundMethod to the service
  const result = await cancelAppointment(appointmentData.id, finalReason, refundMethod);
  
  if (result.success) {
      router.refresh(); 
      
return { success: true, message: result.message };
  }
 
  
return { success: false, message: result.message || "Failed to cancel appointment" };
}

  const handlePrintInvoice = async () => {
    try {
      setIsPrinting(true)
      const invoiceId = appointmentData.id
 
      if (!invoiceId) { alert('Invoice not found'); 

return }

      const invoiceDetails = await getInvoiceDetails(invoiceId)

      if (!invoiceDetails) { alert('Failed to load invoice details'); 

return }

      appointmentPrintInvoice(invoiceDetails)
    } catch (error) {
      console.error('Print error:', error)
      alert('Failed to print invoice')
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <>
      <Card className="overflow-visible">
        <CardContent className='flex flex-col gap-6 p-6'>
           
           {/* --- 1. IDENTITY HEADER --- */}
           <div className='flex flex-col items-center gap-3'>
             <div className="relative">
                <Avatar 
                    src='/images/avatars/common.png' 
                    alt={appointmentData.patientName}
                    sx={{ width: 80, height: 80, border: '3px solid white', boxShadow: 2 }}
                />
                <Chip 
                   label={appointmentData.statusDisplayName || appointmentData.status} 
                   sx={{ 
                       backgroundColor: appointmentData.statusColor || 'primary.main', 
                       color: '#fff',
                       position: 'absolute',
                       bottom: -6,
                       left: '50%',
                       transform: 'translateX(-50%)',
                       height: 20,
                       fontSize: '0.65rem',
                       fontWeight: 'bold'
                   }} 
                   size='small' 
                 />
             </div>
             
             <div className='text-center mt-1'>
               <Typography variant='h6' className="font-bold leading-tight">
                  {appointmentData.patientName}
               </Typography>
               <Typography variant='caption' className="text-gray-400 font-mono block">
                  {appointmentData.patientNo}
               </Typography>
             </div>
           </div>
           
           <Divider />
           
           {/* --- 2. QUICK CONTACT & INFO --- */}
           <div className='flex flex-col gap-3'>
                <div className='flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100'>
                   <div className='flex items-center gap-2'>
                        <i className='tabler-phone text-gray-500 text-lg' />
                        <Typography variant="body2" className="font-medium">{appointmentData.patientMobile}</Typography>
                   </div>
                </div>
                
                <div className='flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100'>
                   <div className='flex items-center gap-2'>
                        <i className='tabler-id text-gray-500 text-lg' />
                        <Typography variant="body2" className="font-medium">{appointmentData.patientNic}</Typography>
                   </div>
                </div>
           </div>

           {/* --- 3. PAYMENT STATUS SUMMARY --- */}
           <Box className="bg-blue-50/50 rounded p-3 text-center border border-blue-100">
                <Typography variant="caption" className="uppercase text-gray-400 font-bold tracking-wide">
                    Payment Status
                </Typography>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <Typography variant="h6" className="font-bold text-gray-700">
                        {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(appointmentData.invoiceFinalAmount)}
                    </Typography>
                    <Chip 
                        label={appointmentData.invoiceStatusDisplayName || appointmentData.invoiceStatus} 
                        size="small" 
                        sx={{ 
                            backgroundColor: appointmentData.invoiceStatusColor || '#eee', 
                            color: '#fff', 
                            fontSize: '0.65rem',
                            height: 20
                        }} 
                    />
                </div>
           </Box>

           <Divider />

           {/* --- 4. ACTIONS (Stacked) --- */}
           <div className='flex flex-col gap-3'>
              {/* Payment Button */}
              <Button
                variant='contained'
                color='primary'
                fullWidth
                startIcon={<i className='tabler-credit-card' />}
                onClick={() => {
                  const encoded = encodeHideValue(appointmentData.id);

                  router.push(`./../payment/${encoded}`)
                }}
                disabled={appointmentData.status === 'CANCELLED'}
              >
                {appointmentData.status === 'PENDING_PAYMENT' ? "Make Payment" : "View Payment" }   
              </Button>  

              <div className="flex gap-2">
                  {/* Print - Only if Paid */}
                  {appointmentData.invoiceStatus === 'PAID' && (
                    <Button
                      variant='tonal'
                      color='secondary'
                      fullWidth
                      onClick={handlePrintInvoice}
                      disabled={isPrinting}
                      title="Bill Print"
                    >
                      <i className='tabler-printer' />
                    </Button>
                  )}

                  {/* Refund - Only if Paid/Partial */}
                  {(appointmentData.invoiceStatus === 'PAID' || appointmentData.invoiceStatus === 'PARTIAL') && appointmentData.status !== 'CANCELLED' && (
                      <Button
                        variant='tonal'
                        color='warning'
                        fullWidth
                        onClick={() => setOpenRefundDialog(true)}
                        title="Give Refund"
                      >
                        <i className='tabler-receipt-refund' />
                      </Button>
                  )}

                  {/* Cancel */}
                  {appointmentData.status !== 'CANCELLED' && (
                      <Button
                        variant='tonal'
                        color='error'
                        fullWidth
                        onClick={() => setOpenCancelDialog(true)}
                        title="Cancel Appointment"
                      >
                        <i className='tabler-x' />
                      </Button>
                  )}
                  
                  {/* Send SMS for Cancelled */}
                  {appointmentData.status === 'CANCELLED' && (
                      <Button
                        variant='contained'
                        color='primary'
                        fullWidth
                        onClick={() => {
                            if (!appointmentData.patientMobile) {
                                toast.error('Patient does not have a mobile number.');
                                return;
                            }
                            setSmsConfirmOpen(true);
                        }}
                        title="Send Cancellation SMS"
                      >
                        <i className='tabler-message' />
                      </Button>
                  )}
              </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={openCancelDialog}
        setOpen={setOpenCancelDialog}
        type='cancel-appointment'
        onConfirm={handleCancelConfirm}
         paymentDetails={{
          invoiceStatus: appointmentData.invoiceStatus,
          invoiceFinalAmount: appointmentData.invoiceFinalAmount,
          doctorFee: appointmentData.doctorFee,
          clinicFee: appointmentData.clinicFee,
          amountPaid: appointmentData.amountPaid || 0, 
          balanceRemaining: appointmentData.balanceRemaining || 0
         }}
         appointmentId={appointmentData.id}
         patientMobile={appointmentData.patientMobile}
      />

      {/* Refund Dialog */}
      <RefundDialog 
        open={openRefundDialog}
        setOpen={setOpenRefundDialog}
        invoiceId={appointmentData.id}
        onSuccess={() => router.refresh()}
      />

      {/* SMS Confirmation Dialog */}
      <Dialog fullWidth maxWidth='xs' open={smsConfirmOpen} onClose={() => setSmsConfirmOpen(false)}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className='tabler-alert-circle text-[88px] mbe-6 text-warning' />
          <Typography variant='h4' className='mb-4'>Send SMS?</Typography>
          <Typography color='text.primary'>
            Are you sure you want to send a cancellation SMS to {appointmentData.patientMobile}?
          </Typography>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' color='primary' onClick={async () => {
              setSmsConfirmOpen(false);
              const { sendCancelSms } = await import('@/services/appointment/appoinment.server.service');
              const response = await sendCancelSms(appointmentData.id);
              if (response.success) {
                  toast.success(response.message);
              } else {
                  toast.error(response.message);
              }
          }}>
            Yes, Send SMS
          </Button>
          <Button variant='tonal' color='secondary' onClick={() => setSmsConfirmOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AppointmentLeftOverview