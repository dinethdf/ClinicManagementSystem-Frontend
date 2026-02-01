'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'

import type { DoctorScheduleDTO } from '@/types/doctor.types'
import { getSchedulesByDoctorId } from '@/services/doctor/doctor.shedule.server.service'

import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

import tableStyles from '@core/styles/table.module.css'

// Configuration for Status Chips
const statusObj: Record<string, { title: string; color: 'success' | 'info' | 'error' | 'secondary' }> = {
  ACTIVE: { title: 'Active', color: 'success' },
  COMPLETED: { title: 'Completed', color: 'info' },
  CANCELLED: { title: 'Cancelled', color: 'error' },
  DEFAULT: { title: 'Unknown', color: 'secondary' }
}

const columnHelper = createColumnHelper<DoctorScheduleDTO>()

const DoctorScheduleListTable = ({ doctorId }: { doctorId: string }) => {
  // --- States ---
  const [data, setData] = useState<DoctorScheduleDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // 2. Add Pagination State
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  
  // 3. Add Row Count State (from Server)
  const [rowCount, setRowCount] = useState(0)

  // Router
  const router = useRouter()
  const params = useParams()
  const lang = params.lang || 'en'

  // --- Fetch Data (Server-Side Pagination) ---
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!doctorId) return
      setIsLoading(true)
    
      try {
        // Pass pageIndex and pageSize to the service
        const response = await getSchedulesByDoctorId(
            doctorId, 
            pagination.pageIndex, 
            pagination.pageSize
        )

        // Handle Paginated Response
        if (response.success && response.data) {
            setData(response.data.content) // Set Rows
            setRowCount(response.data.totalElements) // Set Total Count
        } else {
            setErrorMessage(response.message || 'Failed to fetch data')
        }

      } catch (error: any) {
        setErrorMessage(error.message || 'Failed to load schedules')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSchedules()
  }, [doctorId, pagination.pageIndex, pagination.pageSize]) // Re-fetch on page/size change

  const columns = useMemo<ColumnDef<DoctorScheduleDTO, any>[]>(
    () => [
      columnHelper.accessor('scheduleDate', {
        header: 'Date & Time',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.scheduleDate}
            </Typography>
            <Typography variant='body2' color='text.disabled'>
              {`${row.original.startTime} - ${row.original.endTime}`}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('clinicFee', {
        header: 'Fees (LKR)',
        cell: ({ row }) => (
            <div className='flex flex-col min-w-[120px]'>
            <div className='flex justify-between gap-2'>
                <Typography variant='body2'>Doc:</Typography>
                <Typography variant='body2' className='font-medium'>{row.original.doctorFee.toFixed(2)}</Typography>
            </div>
            <div className='flex justify-between gap-2'>
                <Typography variant='body2'>Clinic:</Typography>
                <Typography variant='body2' className='font-medium'>{row.original.clinicFee.toFixed(2)}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('registeredPatientCount', {
        header: 'Availability',
        cell: ({ row }) => {
            const current = row.original.registeredPatientCount;
            const max = row.original.maxPatientCount;
            const percent = (current / max) * 100;
            const bookingStatus = row.original.status || 'CLOSED';
           
            return (
            <div className='flex flex-col w-full gap-1 min-w-[150px]'>
                    <div className='flex justify-between items-center'>
                        <Typography variant='caption' className='font-semibold'>
                            {`${current} / ${max} Booked`}
                        </Typography>
                        <Typography variant='caption' color={bookingStatus === 'OPEN' ? 'success.main' : 'error.main'} className='text-[10px] uppercase font-bold tracking-wider'>
                            {bookingStatus}
                        </Typography>
                    </div>
                    <LinearProgress 
                        variant="determinate" 
                        value={percent} 
                        color={percent >= 100 ? 'error' : percent > 80 ? 'warning' : 'success'} 
                        className='h-2 rounded'
                    />
                </div>
            )
        }
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status || 'Unknown';
            const statusConfig = statusObj[status] || statusObj.DEFAULT;

            return (
                <Chip 
                    label={statusConfig.title} 
                    color={statusConfig.color} 
                    variant='tonal' 
                    size='small' 
                />
            )
        }
      }),
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    rowCount: rowCount,
    state: {
        pagination
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    filterFns:{} as any
  })

  // Navigation Handler
  const handleRowClick = (scheduleId: number) => {
    router.push(`/${lang}/clinic/appoinment-shedule/details/${scheduleId}`)
  }

  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>

  return (
    <Card>
      <CardContent className='flex justify-between flex-col sm:flex-row sm:items-center gap-4'>
        <Typography variant='h5'>Schedule List</Typography>
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
            {isLoading ? (
                <tr>
                    <td colSpan={columns.length} className='h-24 text-center'>
                        <CircularProgress />
                    </td>
                </tr>
            ) : (
                table.getRowModel().rows.map(row => (
                <tr 
                    key={row.id} 
                    onClick={() => handleRowClick(row.original.id || 0)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
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
        // 1. REMOVE THIS LINE:
        // component={() => <TablePaginationComponent table={table as any} />}
        
        // 2. Keep standard props
        component="div" // Use standard div wrapper
        count={rowCount}
        rowsPerPage={pagination.pageSize}
        page={pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        
        // 3. This enables the dropdown
        rowsPerPageOptions={[5, 10, 25, 50]} 
        onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        
        // Optional: formatting text
        labelRowsPerPage="Rows per page:"
      />
    </Card>
  )
}

export default DoctorScheduleListTable