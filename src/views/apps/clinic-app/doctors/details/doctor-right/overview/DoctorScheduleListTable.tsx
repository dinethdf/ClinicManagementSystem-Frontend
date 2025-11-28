'use client'

import { useState, useEffect, useMemo } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'

import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'


import type { DoctorScheduleDTO } from '@/types/doctor.types'

import { getSchedulesByDoctorId } from '@/services/doctor.shedule.server.service'

import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

import tableStyles from '@core/styles/table.module.css'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  
  addMeta({ itemRank })
 
  return itemRank.passed
}

const columnHelper = createColumnHelper<DoctorScheduleDTO>()

const DoctorScheduleListTable = ({ doctorId }: { doctorId: string }) => {
  // States
  const [data, setData] = useState<DoctorScheduleDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [globalFilter, setGlobalFilter] = useState('')

  // Fetch Data
  useEffect(() => {
   
    const fetchSchedules = async () => {
      if (!doctorId) return
      setIsLoading(true)
    
      try {    
        
        const result = await getSchedulesByDoctorId(doctorId)
        
        setData(result)
      } catch (error: any) {
       
        setErrorMessage(error.message || 'Failed to load schedules')
      } finally {
       
        setIsLoading(false)
      }
    }
    
    fetchSchedules()
  }, [doctorId])

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
      columnHelper.accessor('clinicFee', { // Using clinicFee as a proxy for fees display
        header: 'Fees (LKR)',
        cell: ({ row }) => (
            <div className='flex flex-col'>
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
            const percent = (row.original.registeredPatientCount / row.original.maxPatientCount) * 100;
           
            return (
            
            <div className='flex flex-col w-full gap-1'>
                    <div className='flex justify-between'>
                        <Typography variant='caption'>{`${row.original.registeredPatientCount} / ${row.original.maxPatientCount} Booked`}</Typography>
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
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: ({ row }) => (
            <Chip 
                label={row.original.isActive ? 'Active' : 'Inactive'} 
                color={row.original.isActive ? 'success' : 'secondary'} 
                variant='tonal' 
                size='small' 
            />
        )
      }),
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  })

  if (isLoading) return <Card className='h-[300px] flex items-center justify-center'><CircularProgress /></Card>
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>

  return (
    <Card>
      <CardContent className='flex justify-between flex-col sm:flex-row sm:items-center gap-4'>
        <Typography variant='h5'>Schedule List</Typography>
        <CustomTextField
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder='Search Schedule'
        />
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
      <TablePagination
        component={() => <TablePaginationComponent table={table as any} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />
    </Card>
  )
}

export default DoctorScheduleListTable