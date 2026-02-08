'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
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

// Type Imports
import type { DoctorScheduleDTO } from '@/types/doctor.types'
import { getSchedulesByDoctorId } from '@/services/doctor/doctor.shedule.server.service'

import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper<DoctorScheduleDTO>()

const DoctorScheduleListTable = ({ doctorId }: { doctorId: string }) => {
  // --- States ---
  const [data, setData] = useState<DoctorScheduleDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Pagination State
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  
  // Row Count State
  const [rowCount, setRowCount] = useState(0)

  // Router
  const router = useRouter()
  const params = useParams()
  const lang = params.lang || 'en'

  // --- Fetch Data ---
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!doctorId) return
      setIsLoading(true)
    
      try {
        const response = await getSchedulesByDoctorId(
            doctorId, 
            pagination.pageIndex, 
            pagination.pageSize
        )
        
        console.log("schedule response", response)

        if (response.success && response.data) {
            // FIX: response.data IS the paginated object, so access .content directly
            setData(response.data.content || []) 
            setRowCount(response.data.totalElements || 0)
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
  }, [doctorId, pagination.pageIndex, pagination.pageSize]) 

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
            
            // FIX: Access status object safely
            const statusObj = row.original.status as any; 
            const bookingStatus = statusObj?.code || 'UNKNOWN';
           
            return (
            <div className='flex flex-col w-full gap-1 min-w-[150px]'>
                    <div className='flex justify-between items-center'>
                        <Typography variant='caption' className='font-semibold'>
                            {`${current} / ${max} Booked`}
                        </Typography>
                        <Typography variant='caption' className='text-[10px] uppercase font-bold tracking-wider'>
                            {row.original.isBookingOpen ? 'OPEN' : 'CLOSED'}
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
            // FIX: Handle Status Object structure { code, displayName, colorCode }
            const statusObj = row.original.status as any;
            
            return (
                <Chip 
                    label={statusObj?.displayName || statusObj?.code || 'Unknown'} 
                    sx={{ 
                        backgroundColor: statusObj?.colorCode || '#eee', 
                        color: '#fff',
                        fontWeight: 600
                    }} 
                    variant='filled' 
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
        component="div" 
        count={rowCount}
        rowsPerPage={pagination.pageSize}
        page={pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        rowsPerPageOptions={[5, 10, 25, 50]} 
        onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        labelRowsPerPage="Rows per page:"
      />
    </Card>
  )
}

export default DoctorScheduleListTable