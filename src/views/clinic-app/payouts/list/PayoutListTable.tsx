'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'

// TanStack Table
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import type { PayoutBillDTO } from '@/types/payout.types' // Ensure this type has scheduleId

// Service & Utils
import { getDoctorPayoutsList } from '@/services/financial/payout.server.service'
import { getLocalizedUrl } from '@/utils/i18n'
import { encodeHideValue } from '@/utils/encode' // Import your encoder
import type { Locale } from '@configs/i18n'
import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper<PayoutBillDTO>()

const PayoutListTable = () => {
  // --- States ---
  const [data, setData] = useState<PayoutBillDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // Pagination State
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [totalCount, setTotalCount] = useState(0)

  // Hooks
  const { lang: locale } = useParams()

  // --- Fetch Data ---
  const loadData = async () => {
    setLoading(true)
    setErrorMsg(null)
    
    try {
      // Pass the current pagination state to the service
      const res: any = await getDoctorPayoutsList({
          page: pagination.pageIndex,
          size: pagination.pageSize,
      }) 
      if (res.content) {     
        setData(res.content)          
        setTotalCount(res.totalElements) 
      } else {
        setData([])
        setTotalCount(0)
        if (res.error) setErrorMsg(res.error.message)
      }
    } catch (error) {
        console.error("Failed to load payouts", error)
        setErrorMsg("Failed to connect to server.")
    } finally {
        setLoading(false)
    }
  }

  // Reload when pagination changes
  useEffect(() => {
    loadData()
  }, [pagination.pageIndex, pagination.pageSize])


  // --- Columns ---
  const columns = useMemo(() => [
      columnHelper.accessor('payoutId', {
        header: 'Bill ID',
        cell: info => <span className='font-mono text-gray-500'>#{info.getValue()}</span>
      }),
      
      // NEW: Schedule ID Column with Link
      columnHelper.accessor('scheduleId', {
        header: 'Schedule Ref',
        cell: ({ row }) => {
            const id = row.original.scheduleId;
            const encodedId = encodeHideValue(id); // Use your encoder
            const linkUrl = getLocalizedUrl(`/clinic/financial/doctor-payment/details/${encodedId}`, locale as Locale);

            return (
                <Link href={linkUrl} className='flex items-center gap-1 group'>
                    <span className='font-bold text-primary group-hover:underline'>#{id}</span>
                    <i className='tabler-external-link text-[10px] text-gray-400 group-hover:text-primary transition-colors' />
                </Link>
            )
        }
      }),

      columnHelper.accessor('doctorName', {
        header: 'Doctor',
        cell: info => <Typography className='font-medium'>{info.getValue()}</Typography>
      }),
      
      columnHelper.accessor('scheduleDate', {
        header: 'Schedule Date',
        cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
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
        cell: info => {
            const status = info.getValue();
            const color = status === 'PAID' ? 'success' : status === 'PENDING' ? 'warning' : 'default';
            return <Chip label={status} color={color as any} variant='tonal' size='small' />
        }
      }),

      // Optional: Explicit View Action Button
      columnHelper.display({
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
            <IconButton 
                component={Link} 
                href={getLocalizedUrl(`/clinic/financial/doctor-payment/details/${encodeHideValue(row.original.scheduleId)}`, locale as Locale)}
                color='secondary'
                size='small'
            >
                <i className='tabler-eye' />
            </IconButton>
        )
      })
    ], [locale])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Important for server-side pagination
    state: { pagination },
    onPaginationChange: setPagination, // Not used directly by MUI but good for TanStack state
    filterFns: {} as any
   })

  // --- Handlers for MUI Pagination ---
  const handleChangePage = (event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({
      pageSize: parseInt(event.target.value, 10),
      pageIndex: 0 
    })
  }

  return (
    <Card>
      <CardHeader 
        title="Doctor Payout History" 
        action={
            <Button variant='outlined' onClick={loadData} startIcon={<i className='tabler-refresh'/>}>
                Refresh
            </Button>
        }
      />
      
      {loading ? (
         <div className='flex justify-center p-12'><CircularProgress /></div>
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
                        <tr><td colSpan={columns.length} className='text-center p-4'>No payouts found.</td></tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                        </tr>
                        ))
                    )}
                </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <TablePagination
                component="div"
                count={totalCount}
                page={pagination.pageIndex}
                onPageChange={handleChangePage}
                rowsPerPage={pagination.pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </>
      )}
    </Card>
  )
}

export default PayoutListTable