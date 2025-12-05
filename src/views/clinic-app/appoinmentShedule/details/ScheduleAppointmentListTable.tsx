'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

import Link from 'next/link'

import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// Type Imports
import type { ScheduleAppointmentDTO } from '@/types/appoinments.types'
import type { ThemeColor } from '@core/types'
import type { Locale } from '@configs/i18n'

// Service Imports
import { appointmentService } from '@/services/appoinment.service'

// Utils
import { getLocalizedUrl } from '@/utils/i18n'

// Styles
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/components/TablePaginationComponent'

// Status Colors Mapping
const statusColors: { [key: string]: ThemeColor } = {
  Booked: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'error',
  NOSHOW: 'warning',
  PENDING_PAYMENT: 'info'
}

const columnHelper = createColumnHelper<ScheduleAppointmentDTO>()

const ScheduleAppointmentListTable = ({ scheduleId }: { scheduleId: number }) => {
  // Hooks
  const { lang: locale } = useParams()

  // States
  const [data, setData] = useState<ScheduleAppointmentDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
   
    const loadData = async () => {
      if (!scheduleId) return
      
      setIsLoading(true)
     
      try {
      
        const result = await appointmentService.getAppointmentsByScheduleId(
            scheduleId, 
            pagination.pageIndex, 
            pagination.pageSize
        )

        if (result) {
            setData(result.content)
            setTotalCount(result.totalElements)
        } else {
            setData([])
        }
      } catch (error: any) {
        setErrorMessage('Failed to load appointments')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [scheduleId, pagination.pageIndex, pagination.pageSize])

  // Columns Definition
  const columns = useMemo<ColumnDef<ScheduleAppointmentDTO, any>[]>(
    () => [
      columnHelper.accessor('queuePosition', {
        header: 'Queue',
        cell: ({ row }) => (
           <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 30, height: 30, fontSize: '0.875rem', fontWeight: 'bold' }}>
              {row.original.queuePosition}
           </Avatar>
        )
      }),
      columnHelper.accessor('patientName', {
        header: 'Patient Details',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.patientName}
            </Typography>
            <div className='flex gap-2'>
                <Typography variant='caption' color='text.disabled'>{row.original.patientNo}</Typography>
                <Typography variant='caption' color='text.disabled'>|</Typography>
                <Typography variant='caption' color='text.disabled'>{row.original.patientMobile}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('startTime', { // Using startTime as time indicator
        header: 'Time',
        cell: ({ row }) => <Typography>{row.original.startTime}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.status}
            color={statusColors[row.original.status] || 'secondary'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('id', {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <Link
            href={getLocalizedUrl(`/apps/appointments/details/${row.original.id}`, locale as Locale)}
            className='text-primary hover:underline text-sm font-medium'
          >
            View
          </Link>
        )
      })
    ],
    [locale]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    filterFns: {} as any
  })

  if (isLoading && data.length === 0) return <Card className='h-[200px] flex items-center justify-center'><CircularProgress /></Card>
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>

  return (
    <Card>
      <CardContent className='flex justify-between items-center gap-4'>
        <Typography variant='h5'>Scheduled Appointments</Typography>
        {/* Optional Search Bar can go here */}
      </CardContent>
      
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
                <tr>
                    <td colSpan={columns.length} className='text-center py-4'>
                        <Typography color="text.secondary">No appointments found for this schedule.</Typography>
                    </td>
                </tr>
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
      
      <TablePagination
        component={() => <TablePaginationComponent table={table as any} />}
        count={totalCount}
        rowsPerPage={pagination.pageSize}
        page={pagination.pageIndex}
        onPageChange={(_, page) => setPagination(prev => ({ ...prev, pageIndex: page }))}
      />
    </Card>
  )
}

export default ScheduleAppointmentListTable