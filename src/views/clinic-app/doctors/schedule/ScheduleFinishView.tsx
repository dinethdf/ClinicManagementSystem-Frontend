'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

// Service
import { generateScheduleBill, type PayoutBillResponse } from '@/services/financial/financial.server.service'
import { doctorSheduleService } from '@/services/doctor/doctor.shedule.service'

const ScheduleFinishView = ({ scheduleId }: { scheduleId: number }) => {
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [billData, setBillData] = useState<PayoutBillResponse | null>(null)
  const [errorState, setErrorState] = useState<{ message: string, code?: string } | null>(null)

  // API Call Handler
const handleGenerateBill = async () => {
    console.log(":funct run")
    setLoading(true)
    setErrorState(null)

    // 1. Generate the Bill
    const result = await generateScheduleBill(scheduleId)

    if (result.success && result.data) {
        setBillData(result.data)

        // 2. Finish Session & Delete Queue (Non-blocking)
        try {
            await doctorSheduleService.finishQueueSession(scheduleId);
            console.log("Session marked as finished in Live Queue");
        } catch (queueError) {
            // Log error but don't stop the UI since bill is already ready
            console.error("Queue Finish Error:", queueError);
        }

    } else {
        // Handle Errors based on your codes
        const code = result.error?.code
        const msg = result.error?.message || "Failed to generate bill"
        setErrorState({ message: msg, code: code })
    }
    setLoading(false)
  }

  // Helper to format currency
  const currency = (amount: number) => 
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)

  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6 max-w-2xl mx-auto'>
        
        {/* Header Section */}
        <div className='text-center'>
            <Typography variant='h4' className='mb-2'>Schedule Completion</Typography>
            <Typography color='text.secondary'>
                Session #{scheduleId} has ended. Please generate the payout bill to finalize.
            </Typography>
        </div>

        {/* --- ERROR STATES --- */}
        {errorState && (
            <Alert 
                severity='error' 
                variant='filled' 
                className='w-full shadow-md'
                icon={<i className={errorState.code === 'DUPLICATE' ? 'tabler-files' : 'tabler-alert-triangle'} />}
            >
                <span className='font-bold'>{errorState.code === 'DUPLICATE' ? 'Bill Already Generated!' : 'Error:'}</span> {errorState.message}
            </Alert>
        )}

        {/* --- SUCCESS STATE: BILL RECEIPT --- */}
        {billData ? (
             <Card className='w-full border-t-8 border-t-success shadow-xl animate-in zoom-in-95 duration-500'>
                <CardContent className='flex flex-col gap-4 p-8'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <Typography variant='overline' className='tracking-widest text-gray-400'>OFFICIAL PAYOUT RECEIPT</Typography>
                            <Typography variant='h5' className='font-bold text-gray-800'>Payout #{billData.payoutId}</Typography>
                            <Chip label={billData.status} color='success' size='small' className='mt-1 font-bold' variant='tonal'/>
                        </div>
                        <div className='text-right'>
                            <Typography variant='body2' color='text.secondary'>Date</Typography>
                            <Typography variant='subtitle2' className='font-bold'>{new Date().toLocaleDateString()}</Typography>
                        </div>
                    </div>

                    <Divider className='border-dashed my-2' />

                    {/* Financial Details */}
                    <div className='flex flex-col gap-3'>
                        <div className='flex justify-between'>
                            <Typography color='text.secondary'>Total Doctor Fees Collected</Typography>
                            <Typography className='font-medium'>{currency(billData.totalFee)}</Typography>
                        </div>
                        
                        {billData.totalDiscounts < 0 && (
                            <div className='flex justify-between text-red-500'>
                                <Typography color='inherit'>Total Discounts Given</Typography>
                                <Typography color='inherit'>{currency(billData.totalDiscounts)}</Typography>
                            </div>
                        )}
                        
                        <Divider />
                        
                        <div className='flex justify-between items-center bg-green-50 p-4 rounded-lg border border-green-100'>
                            <Typography variant='h6' className='text-green-900 font-bold'>Net Payable Amount</Typography>
                            <Typography variant='h4' className='text-green-700 font-black'>
                                {currency(billData.finalPayable)}
                            </Typography>
                        </div>
                    </div>

                    <Typography variant='caption' className='text-center text-gray-400 mt-4'>
                        {billData.message}
                    </Typography>

                    {/* Navigation Buttons */}
                    <div className='flex gap-3 mt-4'>
                        <Button 
                            fullWidth 
                            variant='contained' 
                            size='large'
                            onClick={() => router.push('/doctor/financials')} // Go to Financials Page
                        >
                            View All Payouts
                        </Button>
                        <Button 
                            fullWidth 
                            variant='outlined' 
                            size='large'
                            onClick={() => router.push('/doctor')} // Go Home
                        >
                            Back to Schedule
                        </Button>
                    </div>
                </CardContent>
             </Card>
        ) : (
            /* --- INITIAL STATE: GENERATE BUTTON --- */
            <Card className='w-full'>
                <CardContent className='flex flex-col items-center gap-6 p-8 py-12'>
                    <div className='bg-primary/10 p-4 rounded-full text-primary mb-2'>
                        <i className='tabler-calculator text-4xl' />
                    </div>
                    
                    <div className='text-center space-y-2'>
                        <Typography variant='h5'>Ready to Finalize?</Typography>
                        <Typography variant='body2' color='text.secondary' className='max-w-xs mx-auto'>
                            Click below to calculate total earnings, apply discounts, and generate your payout slip for this session.
                        </Typography>
                    </div>

                    <Button 
                        variant='contained' 
                        size='large' 
                        className='px-8 py-3 text-lg shadow-lg'
                        onClick={handleGenerateBill}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color='inherit'/> : <i className='tabler-receipt' />}
                    >
                        {loading ? 'Processing...' : 'Generate Payout Bill'}
                    </Button>
                    
                    {/* Bypass option if they just want to leave */}
                    <Button 
                        variant='text' 
                        color='secondary' 
                        onClick={() => router.push('/clinic/schedule/list')}
                    >
                        Skip & Return to Dashboard
                    </Button>
                </CardContent>
            </Card>
        )}
    </div>
  )
}

export default ScheduleFinishView