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

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'

// Type Imports
import type { FinancialScheduleItem } from '@/types/financial.types'

// Util Imports
import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper<FinancialScheduleItem>()

const FinancialDoctorDetailsCard = ({ data }: { data: FinancialScheduleItem[] }) => {
  const [rowSelection, setRowSelection] = useState({})

  // Calculate Footer Totals
  const totals = useMemo(() => {
    return data.reduce((acc, curr) => ({
      doctorPayout: acc.doctorPayout + curr.netDoctorPayout,
      doctorDiscountCount: acc.doctorDiscountCount + (curr.doctorDiscountAmount > 0 ? 1 : 0), 
      clinicProfit: acc.clinicProfit + curr.netClinicProfit,
      totalDoctorDiscount: acc.totalDoctorDiscount + curr.doctorDiscountAmount,
      totalPaid: acc.totalPaid + curr.totalPaidByPatient
    }), { 
        doctorPayout: 0, 
        doctorDiscountCount: 0, 
        clinicProfit: 0,
        totalDoctorDiscount: 0, 
        totalPaid: 0 
    })
  }, [data])

  const columns = useMemo(() => [
      columnHelper.accessor('queueNo', {
        header: 'Queue',
        cell: ({ row }) => <Typography color='text.primary' className='font-medium'>#{row.original.queueNo}</Typography>
      }),
      columnHelper.accessor('patientName', {
        header: 'Patient',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col items-start'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.patientName}
              </Typography>
              <Typography variant='body2'>{row.original.patientMobile}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('paymentStatus', {
        header: 'Status',
        cell: ({ row }) => (
             <Chip 
                label={row.original.paymentStatus} 
                color={row.original.paymentStatus === 'PAID' ? 'success' : 'warning'} 
                size="small" 
                variant="tonal" 
             />
        )
      }),
      columnHelper.accessor('baseDoctorFee', {
        header: 'Base Dr. Fee',
        cell: ({ row }) => <Typography>Rs. {row.original.baseDoctorFee.toFixed(2)}</Typography>
      }),
      columnHelper.accessor('doctorDiscountAmount', {
        header: 'Dr. Discount',
        cell: ({ row }) => (
            <Typography color={row.original.doctorDiscountAmount > 0 ? 'error.main' : 'text.disabled'}>
                {row.original.doctorDiscountAmount > 0 ? `- Rs. ${row.original.doctorDiscountAmount.toFixed(2)}` : '-'}
            </Typography>
        )
      }),
      columnHelper.accessor('netClinicProfit', {
        header: 'Clinic Profit',
        cell: ({ row }) => <Typography color='success.main'>Rs. {row.original.netClinicProfit.toFixed(2)}</Typography>
      }),      
      columnHelper.accessor('netDoctorPayout', {
        header: 'Net Payout',
        cell: ({ row }) => <Typography color='primary.main' className='font-bold'>Rs. {row.original.netDoctorPayout.toFixed(2)}</Typography>
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
      <CardHeader 
        title='Doctor Payout Analysis' 
        subheader={`Total Patients: ${data.length}`}
      />
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
      
      {/* Footer Summary */}
      <CardContent className='flex justify-end'>
        <div className='min-w-[300px]'>
          
          {/* Doctor Discount Stats */}
          <div className='flex items-center justify-between mb-2'>
            <Typography color='text.secondary'>Patients Discounted:</Typography>
            <Typography color='text.primary' className='font-medium'>{totals.doctorDiscountCount}</Typography>
          </div>
          
          <div className='flex items-center justify-between mb-2'>
            <Typography color='text.secondary'>Total Dr. Discount:</Typography>
            <Typography color='error.main' className='font-medium'>- Rs. {totals.totalDoctorDiscount.toFixed(2)}</Typography>
          </div>

          {/* Clinic Profit Stats - Added Here */}
          <div className='flex items-center justify-between mb-4'>
            <Typography color='text.secondary'>Total Clinic Profit:</Typography>
            <Typography color='success.main' className='font-medium'>+ Rs. {totals.clinicProfit.toFixed(2)}</Typography>
          </div>

          <Divider className='mb-4' />

          {/* Net Doctor Payout */}
          <div className='flex items-center justify-between'>
            <Typography color='text.primary' variant='h6'>Net Doctor Payout:</Typography>
            <Typography color='primary.main' variant='h6'>Rs. {totals.doctorPayout.toFixed(2)}</Typography>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}

export default FinancialDoctorDetailsCard