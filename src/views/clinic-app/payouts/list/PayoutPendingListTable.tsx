'use client'

import { useState, useMemo } from 'react'

// MUI
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// TanStack
import { createColumnHelper } from '@tanstack/react-table'

// Common Table
import CommonServerTable from '@/components/common-components/table/CommonServerTable'

// Service & Types
import type { PayoutBillDTO } from '@/types/payout.types'
import { getPendingPayouts } from '@/services/payout.server.service'

// Components
import PaymentConfirmationDialog from './PaymentConfirmationDialog'

const columnHelper = createColumnHelper<PayoutBillDTO>()

const PayoutListTable = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPayouts, setSelectedPayouts] = useState<PayoutBillDTO[]>([])

  // --- 1. UPDATED DATA FETCH WRAPPER ---
  const fetchPayoutsWrapper = async (params: any) => {
      // Call service with pagination params from the table
      const response = await getPendingPayouts(
          params.page,  // CommonTable sends 0, 1, 2...
          params.pageSize  // CommonTable sends 10, 25...
      )
      if (response.success && response.data) {
          console.log(response.data)
          return response.data 
      }

      // Fallback if error
      return { data: [], total: 0 }
  }

  // --- 2. COLUMNS ---
  const columns = useMemo(() => [
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

  const selectedIds = selectedPayouts.map(row => row.payoutId)
  const totalSelectedAmount = selectedPayouts.reduce((sum, row) => sum + (row.finalPayableAmount || 0), 0)

  return (
    <>
      <CommonServerTable<PayoutBillDTO>
        tableId="payout-list-table"
        title="Pending Doctor Payouts"
        fetchDataFunction={fetchPayoutsWrapper}
        columns={columns}
        enableRowSelection={true}
        actionComponent={
            <Button variant='contained' onClick={() => window.location.reload()} startIcon={<i className='tabler-refresh'/>}>
                Refresh
            </Button>
        }
        renderSelectionActions={(selectedRows: PayoutBillDTO[]) => {
            const currentTotal = selectedRows.reduce((sum, r) => sum + (r.finalPayableAmount || 0), 0)

            return (
                <div className='flex items-center gap-4'>
                    <Typography variant='h6' className='whitespace-nowrap'>
                        Total: <span className='text-primary'>LKR {currentTotal.toFixed(2)}</span>
                    </Typography>
                    
                    <Button 
                        variant='contained' 
                        color='success' 
                        onClick={() => {
                            setSelectedPayouts(selectedRows)
                            setIsDialogOpen(true)
                        }}
                        startIcon={<i className='tabler-cash' />}
                    >
                        Process Payment
                    </Button>
                </div>
            )
        }}
      />

      <PaymentConfirmationDialog 
        open={isDialogOpen} 
        setOpen={setIsDialogOpen}
        selectedIds={selectedIds}
        totalAmount={totalSelectedAmount}
        onSuccess={() => window.location.reload()} 
      />
    </>
  )
}

export default PayoutListTable