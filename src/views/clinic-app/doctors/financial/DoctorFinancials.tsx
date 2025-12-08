'use client'

import { useState, useEffect } from 'react'
import { 
  Card, CardContent, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, 
  Drawer, Divider, CircularProgress, Box, Grid, Avatar
} from '@mui/material'

// Import the actions
import { getDoctorSelfPayouts, getFinancialScheduleDetails } from '@/services/payout.server.service'

import type { PayoutSummaryDTO } from '@/types/payout.types'
import { AppointmentFinancialDTO } from '@/types/financial.types'

export default function DoctorFinancials({ doctorId }: { doctorId: number }) {
  // State for Main Table
  const [payouts, setPayouts] = useState<PayoutSummaryDTO[]>([])
  const [loading, setLoading] = useState(true)

  // State for Detail Drawer
  const [selectedPayout, setSelectedPayout] = useState<PayoutSummaryDTO | null>(null)
  const [details, setDetails] = useState<AppointmentFinancialDTO[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // 1. Fetch Main List
  useEffect(() => {
    const loadPayouts = async () => {
      setLoading(true)
      const result = await getDoctorSelfPayouts()
      if (result?.success) {
        setPayouts(result.data.content)
      }
      setLoading(false)
    }

    if (doctorId) loadPayouts()
  }, [doctorId])

  // 2. Handle View Details Click
  const handleViewDetails = async (payout: PayoutSummaryDTO) => {
    setSelectedPayout(payout)
    setDrawerOpen(true)
    setLoadingDetails(true)

    const appointmentData = await getFinancialScheduleDetails(payout.scheduleId)
    setDetails(appointmentData)
    setLoadingDetails(false)
  }

  // Helper for Currency
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)

  return (
    <div className='flex flex-col gap-6'>
      
      {/* HEADER STATS */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
            <Card className='bg-primary text-white'>
                <CardContent className='flex flex-col gap-1'>
                    <Typography color='white'  className='opacity-80'>Total Earnings Last 50 Shedules</Typography>
                    <Typography variant='h4' className='font-bold'>
                        {formatCurrency(payouts.reduce((sum, item) => sum + item.finalPayableAmount, 0))}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
            <Card className='h-full flex items-center p-4 bg-blue-50 border-blue-100 border'>
                {/* ICON REPLACED: PaidIcon -> tabler-report-money */}
                <i className='tabler-report-money text-blue-500 text-4xl mr-4' />
                <div>
                    <Typography variant='h6' className='font-bold text-blue-900'>Financial Dashboard</Typography>
                    <Typography variant='body2' className='text-blue-700'>
                        Manage your payouts and view detailed appointment breakdowns per schedule.
                    </Typography>
                </div>
            </Card>
        </Grid>
      </Grid>

      {/* MAIN TABLE: PAYOUT HISTORY */}
      <Card className='shadow-sm'>
        <CardContent className='p-0'>
            <div className='p-4 border-b flex justify-between items-center bg-gray-50'>
                <Typography variant='h6' className='font-bold text-gray-700'>
                    Payout History
                </Typography>
                <Chip label={`${payouts.length} Records`} size='small' />
            </div>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className='font-bold text-gray-500'>Date</TableCell>
                            <TableCell className='font-bold text-gray-500'>Schedule ID</TableCell>
                            <TableCell className='font-bold text-gray-500'>Status</TableCell>
                            <TableCell align='right' className='font-bold text-gray-500'>Total Fee</TableCell>
                            <TableCell align='right' className='font-bold text-gray-500'>Final Payout</TableCell>
                            <TableCell align='center' className='font-bold text-gray-500'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                             <TableRow>
                                <TableCell colSpan={6} align='center' className='py-8'>
                                    <CircularProgress size={24} />
                                </TableCell>
                             </TableRow>
                        ) : payouts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align='center' className='py-8 text-gray-400'>
                                    No payouts found.
                                </TableCell>
                             </TableRow>
                        ) : (
                            payouts.map((row) => (
                            <TableRow key={row.payoutId} hover>
                                <TableCell>
                                    <div className='flex items-center gap-2'>
                                        {/* ICON REPLACED: CalendarMonthIcon -> tabler-calendar */}
                                        <i className='tabler-calendar text-gray-400 text-lg' />
                                        {row.scheduleDate}
                                    </div>
                                </TableCell>
                                <TableCell>#{row.scheduleId}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.status} 
                                        color={row.status === 'PAID' ? 'success' : 'warning'} 
                                        size='small' 
                                        variant='filled'
                                        className='font-bold'
                                    />
                                </TableCell>
                                <TableCell align='right' className='text-gray-400 line-through text-xs'>
                                    {formatCurrency(row.totalFee)}
                                </TableCell>
                                <TableCell align='right' className='font-bold text-green-700 text-lg'>
                                    {formatCurrency(row.finalPayableAmount)}
                                </TableCell>
                                <TableCell align='center'>
                                    <IconButton 
                                        color='primary' 
                                        onClick={() => handleViewDetails(row)}
                                        className='bg-blue-50 hover:bg-blue-100'
                                    >
                                        {/* ICON REPLACED: VisibilityIcon -> tabler-eye */}
                                        <i className='tabler-eye text-xl' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </CardContent>
      </Card>

      {/* DRAWER: DETAILED APPOINTMENT LIST */}
<Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', md: 600 } } }}
      >
        <div className='h-full flex flex-col bg-gray-50/50'>
            {/* 1. Drawer Header */}
            <div className='p-5 border-b bg-white flex justify-between items-start shadow-sm z-10'>
                <div>
                    <div className='flex items-center gap-2 mb-1'>
                        <Chip label="Processed" color="success" size="small" variant="tonal" className="font-bold" />
                        <Typography variant='caption' className='text-gray-400 font-mono'>
                            #{selectedPayout?.payoutId}
                        </Typography>
                    </div>
                    <Typography variant='h5' className='font-bold text-gray-800'>
                        {selectedPayout?.scheduleDate}
                    </Typography>
                    <Typography variant='body2' className='text-gray-500'>
                        Schedule Ref: #{selectedPayout?.scheduleId}
                    </Typography>
                </div>
                <IconButton onClick={() => setDrawerOpen(false)} className='bg-gray-100 hover:bg-gray-200'>
                    <i className='tabler-x text-xl' />
                </IconButton>
            </div>

            {/* 2. Drawer Content */}
            <div className='flex-1 overflow-y-auto p-5 custom-scrollbar'>
                {loadingDetails ? (
                    <div className='flex flex-col justify-center items-center h-60 gap-3'>
                        <CircularProgress size={30} />
                        <Typography variant='body2' color='text.secondary'>Loading payout details...</Typography>
                    </div>
                ) : (
                    <div className='flex flex-col gap-6'>
                        
                        {/* --- NEW: ANALYTICS SECTION --- */}
                        <div className='grid grid-cols-2 gap-3'>
                            {/* Card 1: Total Appointments */}
                            <div className='bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center'>
                                <Typography variant='h3' className='font-bold text-primary'>
                                    {details.length}
                                </Typography>
                                <Typography variant='caption' className='text-gray-500 font-bold uppercase tracking-wider'>
                                    Patients
                                </Typography>
                            </div>

                            <div className='p-4 rounded-xl border border-primary shadow-sm flex flex-col items-center justify-center text-center text-white'>
                                <Typography variant='h3' className='font-bold'>
                                    {formatCurrency(details.reduce((sum, app) => sum + app.netDoctorPayout, 0))}
                                </Typography>
                                <Typography variant='caption' className='opacity-80 font-bold uppercase tracking-wider'>
                                    Net Payout
                                </Typography>
                            </div>

                            {/* Card 3: Gross vs Discount (Wide) */}
                            <div className='col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm'>
                                <div className='flex justify-between items-center mb-2'>
                                    <span className='text-gray-500 text-sm'>Gross Doctor Fees</span>
                                    <span className='font-bold text-gray-700'>
                                        {formatCurrency(details.reduce((sum, app) => sum + app.baseDoctorFee, 0))}
                                    </span>
                                </div>
                                <div className='flex justify-between items-center text-error'>
                                    <span className='text-sm flex items-center gap-1'>
                                        <i className='tabler-arrow-down-right text-xs'/> Less Discounts
                                    </span>
                                    <span className='font-bold'>
                                        - {formatCurrency(details.reduce((sum, app) => sum + app.doctorDiscountAmount, 0))}
                                    </span>
                                </div>
                                <Divider className='my-2 border-dashed'/>
                                <div className='flex justify-between items-center'>
                                    <span className='text-gray-900 font-bold text-sm'>Adjusted Total</span>
                                    <span className='font-bold text-primary'>
                                        {formatCurrency(
                                            details.reduce((sum, app) => sum + app.baseDoctorFee, 0) - 
                                            details.reduce((sum, app) => sum + app.doctorDiscountAmount, 0)
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* --- APPOINTMENT LIST SECTION --- */}
                        <div>
                            <Typography variant='overline' className='text-gray-400 font-bold mb-3 block'>
                                Transaction History
                            </Typography>
                            
                            <div className='flex flex-col gap-3'>
                                {details.map((apt) => (
                                    <div key={apt.appointmentId} className='border border-gray-200 rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all bg-white group'>
                                        
                                        {/* Top Row: Patient & Status */}
                                        <div className='flex justify-between items-start mb-3'>
                                            <div className='flex items-center gap-3'>
                                                <div className='h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm border border-gray-200 group-hover:bg-primary group-hover:text-white transition-colors'>
                                                    {apt.queueNo}
                                                </div>
                                                <div>
                                                    <Typography variant='subtitle2' className='font-bold leading-tight'>
                                                        {apt.patientName}
                                                    </Typography>
                                                    <Typography variant='caption' className='text-gray-400 font-mono'>
                                                        ID: #{apt.appointmentId}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <Chip 
                                                label="PAID" 
                                                size='small' 
                                                color='success' 
                                                variant='tonal' 
                                                className='h-6 text-[10px] font-bold px-1' 
                                            />
                                        </div>

                                        {/* Bottom Row: Financials */}
                                        <div className='bg-gray-50 rounded-lg p-3 flex justify-between items-center'>
                                            <div className='flex flex-col'>
                                                <span className='text-[10px] uppercase text-gray-400 font-bold'>Base Fee</span>
                                                <span className='text-sm font-medium text-gray-600'>{formatCurrency(apt.baseDoctorFee)}</span>
                                            </div>

                                            {apt.doctorDiscountAmount > 0 && (
                                                <div className='flex flex-col items-center border-l border-r border-gray-200 px-4 mx-2'>
                                                    <span className='text-[10px] uppercase text-red-400 font-bold'>Discount</span>
                                                    <span className='text-sm font-bold text-red-500'>-{formatCurrency(apt.doctorDiscountAmount)}</span>
                                                </div>
                                            )}

                                            <div className='flex flex-col items-end'>
                                                <span className='text-[10px] uppercase text-primary font-bold'>Net Payout</span>
                                                <span className='text-base font-bold text-primary'>{formatCurrency(apt.netDoctorPayout)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* 3. Footer */}
            <div className='p-4 border-t bg-white text-center z-10'>
                 <Typography variant='caption' className='text-gray-400 flex items-center justify-center gap-1'>
                    <i className='tabler-info-circle text-sm'/> Clinic service fees have been deducted from the gross amount.
                 </Typography>
            </div>
        </div>
      </Drawer>
    </div>
  )
}