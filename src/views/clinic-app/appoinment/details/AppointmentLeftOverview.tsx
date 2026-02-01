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
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'

// Type Imports
import type { AppointmentDetailDTO } from '@/types/appoinments.types'

// Component Imports
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog/ConfirmationDialog'
import RefundDialog from '@/components/dialogs/refund-dialog/RefundDialog'

// Service Imports
import { cancelAppointment } from '@/services/appoinment.server.service'
import { encodeHideValue } from '@/utils/encode'
import { appointmentPrintInvoice } from '@/components/printable/billPrint/AppointmentPrintInvoice'
import { getInvoiceDetails } from '@/services/invoice.server.service'

const AppointmentLeftOverview = ({ appointmentData }: { appointmentData: AppointmentDetailDTO }) => {
  const router = useRouter()
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [openRefundDialog, setOpenRefundDialog] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)

  // --- ACTIONS ---
  const handleCancelConfirm = async (reason?: string) => {
    const finalReason = reason || "No reason provided";
    const result = await cancelAppointment(appointmentData.id, finalReason);
    if (result.success) {
        router.refresh(); 
        return { success: true, message: result.message };
    } 
    return { success: false, message: result.error?.message || "Failed to cancel appointment" };
  }

  const handlePrintInvoice = async () => {
    try {
      setIsPrinting(true)
      const invoiceId = appointmentData.id 
      if (!invoiceId) { alert('Invoice not found'); return }
      const invoiceDetails = await getInvoiceDetails(invoiceId)
      if (!invoiceDetails) { alert('Failed to load invoice details'); return }
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
            clinicFee: appointmentData.clinicFee
        }}
      />

      {/* Refund Dialog */}
      <RefundDialog 
        open={openRefundDialog}
        setOpen={setOpenRefundDialog}
        invoiceId={appointmentData.id}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}

export default AppointmentLeftOverview