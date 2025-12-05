'use client'

import { useState, useEffect, useMemo } from 'react'

// MUI
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// TanStack Table
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import type { PayoutBillDTO } from '@/types/payout.types'
// UPDATE: Import specific function
import { getPendingPayouts } from '@/services/payout.server.service'
import tableStyles from '@core/styles/table.module.css'

// Component
import PaymentConfirmationDialog from './PaymentConfirmationDialog'

const columnHelper = createColumnHelper<PayoutBillDTO>()

const PayoutListTable = () => {
  const [data, setData] = useState<PayoutBillDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null) // Added Error State
  const [rowSelection, setRowSelection] = useState({})
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch Data
  const loadData = async () => {
    setLoading(true)
    setErrorMsg(null)
    
    // UPDATE: New Service Pattern handling
    const res = await getPendingPayouts() 
    
    if (res.success && res.data) {
        setData(res.data)
    } else {
        setData([])
        // Optional: Set error message if needed, or just leave empty table
        if (res.error) setErrorMsg(res.error.message)
    }

    setLoading(false)
    setRowSelection({}) // Reset selection on reload
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate Totals for Selection
  const selectedRows = Object.keys(rowSelection).map(index => data[Number(index)])
  const totalSelectedAmount = selectedRows.reduce((sum, row) => sum + (row?.finalPayableAmount || 0), 0)
  const selectedIds = selectedRows.map(row => row?.payoutId).filter(id => id !== undefined)

  const columns = useMemo(() => [
      // Checkbox Column
      {
        id: 'select',
        header: ({ table }: any) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }: any) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      columnHelper.accessor('payoutId', {
        header: 'Bill ID',
        cell: info => <span className='text-primary font-medium'>#{info.getValue()}</span>
      }),
      columnHelper.accessor('doctorName', {
        header: 'Doctor',
        cell: info => <Typography className='font-medium'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('scheduleDate', {
        header: 'Schedule Date',
      }),
      columnHelper.accessor('totalFee', {
        header: 'Total Collections',
        cell: info => `LKR ${info.getValue().toFixed(2)}`
      }),
      columnHelper.accessor('finalPayableAmount', {
        header: 'Payable',
        cell: info => (
            <Typography color='primary' className='font-bold'>
                LKR {info.getValue().toFixed(2)}
            </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => <Chip label={info.getValue()} color='warning' variant='tonal' size='small' />
      }),
    ], [])

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {} as any
   })

  return (
    <Card>
      <CardHeader 
        title="Pending Doctor Payouts" 
        action={
            <Button variant='contained' onClick={loadData} startIcon={<i className='tabler-refresh'/>}>
                Refresh
            </Button>
        }
      />
      
      {loading ? (
         <div className='flex justify-center p-10'><CircularProgress /></div>
      ) : errorMsg ? (
         <div className='p-6'><Alert severity='error'>{errorMsg}</Alert></div>
      ) : (
        <>
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
                <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                        <tr><td colSpan={7} className='text-center p-4'>No pending bills found.</td></tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                        <tr key={row.id} className={row.getIsSelected() ? 'bg-primary/5' : ''}>
                            {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                        </tr>
                        ))
                    )}
                </tbody>
                </table>
            </div>

            {/* Sticky Footer Action Bar */}
            <div className='p-4 border-t flex justify-between items-center bg-gray-50'>
                <Typography>
                    Selected: <strong>{Object.keys(rowSelection).length}</strong> bills
                </Typography>
                <div className='flex items-center gap-4'>
                    <Typography variant='h6'>
                        Total: <span className='text-primary'>LKR {totalSelectedAmount.toFixed(2)}</span>
                    </Typography>
                    <Button 
                        variant='contained' 
                        color='success'
                        disabled={selectedIds.length === 0}
                        onClick={() => setIsDialogOpen(true)}
                        startIcon={<i className='tabler-cash' />}
                    >
                        Process Payment
                    </Button>
                </div>
            </div>
        </>
      )}

      <PaymentConfirmationDialog 
        open={isDialogOpen} 
        setOpen={setIsDialogOpen}
        selectedIds={selectedIds}
        totalAmount={totalSelectedAmount}
        onSuccess={loadData}
      />
    </Card>
  )
}

export default PayoutListTable