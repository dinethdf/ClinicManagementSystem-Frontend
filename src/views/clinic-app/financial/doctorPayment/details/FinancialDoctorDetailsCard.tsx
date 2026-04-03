'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'

// Type Imports
// Make sure this interface matches the 29 fields from our ScheduleFinancialDTO!
import type { FinancialScheduleItem } from '@/types/financial.types'

// Util Imports
import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper<FinancialScheduleItem>()

// 🚨 V2.1 UPDATE: Aligned with the new Database Lookup Codes
const getRowState = (row: FinancialScheduleItem) => {
  const isFinished = row.appointmentStatusCode === 'COMPLETED'
  const hasPaidSomething = row.paymentStatusCode === 'PAID' || row.paymentStatusCode === 'PARTIAL'
  const isCancelled = row.appointmentStatusCode === 'CANCELLED'
  const isRefunded = row.paymentStatusCode === 'REFUNDED'

  if (isCancelled || isRefunded) return 'REFUNDED'
  if (isFinished && hasPaidSomething) return 'CONFIRMED'
  if (!isFinished && hasPaidSomething) return 'HELD' // Patient paid, but hasn't seen the doctor yet
  
  return 'EXCLUDED' // Unpaid, No-show, or just booked
}

const FinancialDoctorDetailsCard = ({ data }: { data: FinancialScheduleItem[] }) => {
  const [rowSelection, setRowSelection] = useState({})

  const totals = useMemo(() => {
    return data.reduce((acc, curr) => {
      const state = getRowState(curr)
      const isConfirmed = state === 'CONFIRMED'

      return {
        // We only pay the doctor if the appointment is CONFIRMED (Completed + Paid)
        confirmedDoctorPayout: acc.confirmedDoctorPayout + (isConfirmed ? curr.netDoctorPayout : 0),
        confirmedClinicProfit: acc.confirmedClinicProfit + (isConfirmed ? curr.netClinicProfit : 0),
        
        // 🚨 V2.1 UPDATE: Track actual 'amountPaid', not the invoice total
        confirmedRevenue: acc.confirmedRevenue + (isConfirmed ? curr.amountPaid : 0), 
        
        confirmedDoctorDiscount: acc.confirmedDoctorDiscount + (isConfirmed ? curr.doctorDiscountAmount : 0),
        confirmedClinicDiscount: acc.confirmedClinicDiscount + (isConfirmed ? curr.clinicDiscountAmount : 0),
        confirmedCount: acc.confirmedCount + (isConfirmed ? 1 : 0),
        
        heldAmount: acc.heldAmount + (state === 'HELD' ? curr.amountPaid : 0),
        heldCount: acc.heldCount + (state === 'HELD' ? 1 : 0),
        
        // If refunded, the backend amountPaid might be 0, so we look at the invoice total as the "lost" amount
        refundedAmount: acc.refundedAmount + (state === 'REFUNDED' ? curr.totalPaidByPatient : 0),
        refundedCount: acc.refundedCount + (state === 'REFUNDED' ? 1 : 0),
        
        excludedCount: acc.excludedCount + (state === 'EXCLUDED' ? 1 : 0),
        totalAppointments: acc.totalAppointments + 1,
      }
    }, {
      confirmedDoctorPayout: 0,
      confirmedClinicProfit: 0,
      confirmedRevenue: 0,
      confirmedDoctorDiscount: 0,
      confirmedClinicDiscount: 0,
      confirmedCount: 0,
      heldAmount: 0,
      heldCount: 0,
      refundedAmount: 0,
      refundedCount: 0,
      excludedCount: 0,
      totalAppointments: 0,
    })
  }, [data])

  const columns = useMemo(() => [

    columnHelper.accessor('appointmentId', {
      header: '#No',
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <Typography color='text.primary' className='font-medium'>#{row.original.appointmentId}</Typography>
          <Typography variant='caption' color='text.secondary'>Q{row.original.queueNo}</Typography>
        </div>
      )
    }),

    columnHelper.accessor('patientName', {
      header: 'Patient',
      cell: ({ row }) => (
        <div className='flex flex-col items-start'>
          <Typography color='text.primary' className='font-medium'>{row.original.patientName}</Typography>
          <Typography variant='caption' color='text.secondary'>{row.original.patientMobile}</Typography>
        </div>
      )
    }),

    // 🚨 V2.1 UPDATE: Handled 'PARTIAL' and 'REFUNDED' states
    columnHelper.accessor('paymentStatus', {
      header: 'Payment Status',
      cell: ({ row }) => {
        const code = row.original.paymentStatusCode
        let chipColor: 'success' | 'warning' | 'error' | 'default' = 'default'
        
        if (code === 'PAID') chipColor = 'success'
        else if (code === 'PARTIAL') chipColor = 'warning'
        else if (code === 'UNPAID') chipColor = 'error'
        else if (code === 'REFUNDED') chipColor = 'default'

        return (
          <Chip
            label={row.original.paymentStatus}
            color={chipColor}
            size='small'
            variant='tonal'
          />
        )
      }
    }),

    // 🚨 V2.1 UPDATE: Handled 'ONGOING' and 'NOSHOW' states
    columnHelper.accessor('appointmentStatus', {
      header: 'Appointment Status',
      cell: ({ row }) => {
        const state = getRowState(row.original)
        const code = row.original.appointmentStatusCode
        
        let aptColor: 'info' | 'error' | 'warning' | 'primary' | 'default' = 'default'
        if (code === 'COMPLETED') aptColor = 'info'
        else if (code === 'ONGOING') aptColor = 'primary'
        else if (code === 'BOOKED') aptColor = 'warning'
        else if (code === 'CANCELLED' || code === 'NOSHOW') aptColor = 'error'

        return (
          <div className='flex flex-col gap-1 items-start'>
            <Chip
              label={row.original.appointmentStatus}
              color={aptColor}
              size='small'
              variant='outlined'
            />
            {state === 'REFUNDED' && (
              <Chip label='Refunded' color='error' size='small' variant='tonal' />
            )}
            {state === 'HELD' && (
              <Chip label='Payment Held' color='warning' size='small' variant='tonal' />
            )}
            {state === 'EXCLUDED' && (
              <Chip label='Excluded' color='default' size='small' variant='outlined' />
            )}
          </div>
        )
      }
    }),

    // 🚨 V2.1 UPDATE: Shows Cash Collected + Outstanding Balances
    columnHelper.accessor('amountPaid', {
      header: 'Collected Income',
      cell: ({ row }) => {
        const state = getRowState(row.original)
        const isPartial = row.original.paymentStatusCode === 'PARTIAL'
        
        return (
          <div className='flex flex-col'>
            <Typography color={state === 'CONFIRMED' || state === 'HELD' ? 'text.primary' : 'text.disabled'}>
              Rs. {row.original.amountPaid?.toFixed(2) || '0.00'}
            </Typography>
            {isPartial && row.original.balanceRemaining > 0 && (
              <Typography variant='caption' color='error.main' className='font-bold'>
                Owes: Rs. {row.original.balanceRemaining.toFixed(2)}
              </Typography>
            )}
          </div>
        )
      }
    }),

    // V2.1 Discounts are negative in the DB, so we use Math.abs() for clean UI display
    columnHelper.accessor('doctorDiscountAmount', {
      header: 'Dr. Discount',
      cell: ({ row }) => (
        <Typography color={row.original.doctorDiscountAmount < 0 ? 'error.main' : 'text.disabled'}>
          {row.original.doctorDiscountAmount < 0 ? `Rs. ${Math.abs(row.original.doctorDiscountAmount).toFixed(2)}` : '-'}
        </Typography>
      )
    }),

    columnHelper.accessor('clinicDiscountAmount', {
      header: 'Clinic Discount',
      cell: ({ row }) => (
        <Typography color={row.original.clinicDiscountAmount < 0 ? 'error.main' : 'text.disabled'}>
          {row.original.clinicDiscountAmount < 0 ? `Rs. ${Math.abs(row.original.clinicDiscountAmount).toFixed(2)}` : '-'}
        </Typography>
      )
    }),

    columnHelper.accessor('netDoctorPayout', {
      header: 'Net Payout',
      cell: ({ row }) => {
        const state = getRowState(row.original)
        return state === 'CONFIRMED'
          ? <Typography color='primary.main' className='font-bold'>Rs. {row.original.netDoctorPayout?.toFixed(2) || '0.00'}</Typography>
          : <Typography color='text.disabled'>-</Typography>
      }
    }),

  ], [])

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {} as any,
  })

  return (
    <Card>
      <CardHeader title='Doctor Payout Analysis' />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='border-be'>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CardContent>
        <Grid container spacing={4}>

          {/* Section 1 — Session Overview */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='caption' color='text.secondary' className='uppercase font-semibold'>
              Session Overview
            </Typography>
            <div className='flex flex-col gap-2 mt-2'>
              <div className='flex items-center justify-between'>
                <Typography color='text.secondary'>Total Appointments:</Typography>
                <Typography color='text.primary' className='font-medium'>{totals.totalAppointments}</Typography>
              </div>
              <div className='flex items-center justify-between'>
                <Typography color='text.secondary'>Confirmed:</Typography>
                <Chip label={totals.confirmedCount} color='success' size='small' variant='tonal' />
              </div>
              <div className='flex items-center justify-between'>
                <Typography color='text.secondary'>Excluded:</Typography>
                <Chip label={totals.excludedCount} color='default' size='small' variant='tonal' />
              </div>
            </div>
          </Grid>

          {/* Section 2 — Warnings */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='caption' color='text.secondary' className='uppercase font-semibold'>
              Alerts
            </Typography>
            <div className='flex flex-col gap-2 mt-2'>
              {totals.heldCount > 0 ? (
                <Box className='rounded px-3 py-2' sx={{ bgcolor: 'warning.lighterOpacity' }}>
                  <Typography color='warning.main' variant='body2' className='flex items-center gap-1'>
                    <i className='tabler-clock-pause text-sm' />
                    Payment Held ({totals.heldCount})
                  </Typography>
                  <Typography color='warning.main' className='font-bold'>
                    Rs. {totals.heldAmount.toFixed(2)}
                  </Typography>
                </Box>
              ) : (
                <Typography color='text.disabled' variant='body2'>No held payments</Typography>
              )}
              {totals.refundedCount > 0 ? (
                <Box className='rounded px-3 py-2' sx={{ bgcolor: 'error.lighterOpacity' }}>
                  <Typography color='error.main' variant='body2' className='flex items-center gap-1'>
                    <i className='tabler-rotate-clockwise-2 text-sm' />
                    Refunded ({totals.refundedCount})
                  </Typography>
                  <Typography color='error.main' className='font-bold'>
                    - Rs. {totals.refundedAmount.toFixed(2)}
                  </Typography>
                </Box>
              ) : (
                <Typography color='text.disabled' variant='body2'>No refunds</Typography>
              )}
            </div>
          </Grid>

          {/* Section 3 — Confirmed Revenue */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='caption' color='text.secondary' className='uppercase font-semibold'>
              Confirmed Revenue
            </Typography>
            <div className='flex flex-col gap-2 mt-2'>
              <div className='flex items-center justify-between'>
                <Typography color='text.secondary'>Cash Collected:</Typography>
                <Typography color='text.primary' className='font-medium'>Rs. {totals.confirmedRevenue.toFixed(2)}</Typography>
              </div>
              <div className='flex items-center justify-between'>
                <Typography color='text.secondary'>Dr. Discount:</Typography>
                <Typography color='error.main' className='font-medium'>
                  {totals.confirmedDoctorDiscount < 0 ? `- Rs. ${Math.abs(totals.confirmedDoctorDiscount).toFixed(2)}` : 'Rs. 0.00'}
                </Typography>
              </div>
              <div className='flex items-center justify-between'>
                <Typography color='text.secondary'>Clinic Discount:</Typography>
                <Typography color='error.main' className='font-medium'>
                  {totals.confirmedClinicDiscount < 0 ? `- Rs. ${Math.abs(totals.confirmedClinicDiscount).toFixed(2)}` : 'Rs. 0.00'}
                </Typography>
              </div>
              <div className='flex items-center justify-between'>
                <Typography color='text.secondary'>Net Clinic Profit:</Typography>
                <Typography color='success.main' className='font-medium'>+ Rs. {totals.confirmedClinicProfit.toFixed(2)}</Typography>
              </div>
            </div>
          </Grid>

          {/* Section 4 — Final Payout */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='caption' color='text.secondary' className='uppercase font-semibold'>
              Final Payout
            </Typography>
            <div className='flex flex-col gap-2 mt-2'>
              <Divider />
              <div className='flex items-center justify-between mt-2'>
                <Typography color='text.primary' variant='h6'>Doctor Payout:</Typography>
                <Typography color='primary.main' variant='h6'>Rs. {totals.confirmedDoctorPayout.toFixed(2)}</Typography>
              </div>
              <Typography variant='caption' color='text.secondary'>
                Based on {totals.confirmedCount} confirmed appointments only
              </Typography>
            </div>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  )
}

export default FinancialDoctorDetailsCard