'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import Tooltip from '@mui/material/Tooltip' // Added for dense info

import classnames from 'classnames'
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
import type { ColumnDef, FilterFn, PaginationState } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/redux-store'
import { fetchDoctorSchedules } from '@/redux-store/slices/doctorDashboardSlice'

import OptionMenu from '@core/components/option-menu'
import tableStyles from '@core/styles/table.module.css'
import { getLocalizedUrl } from '@/utils/i18n'
import { encodeHideValue } from '@/utils/encode'
import type { Locale } from '@/configs/i18n'
import { ScheduleDTO } from '@/types/doctor.types'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper<ScheduleDTO>()

const ShedulesByDoctorListTable = ({ doctorId }: { doctorId: number }) => {
  // -- Hooks --
  const dispatch = useDispatch<AppDispatch>()
  const { lang: locale } = useParams()
  
  // -- Redux State --
  const { schedules, scheduleStatus, totalSchedules } = useSelector((state: RootState) => state.doctorDashboard)

  // -- Local State --
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6 
  })

  // -- Fetch Data --
  useEffect(() => {
    if (doctorId) {
        dispatch(fetchDoctorSchedules({ 
            doctorId, 
            page: pagination.pageIndex, 
            size: pagination.pageSize 
        }))
    }
  }, [dispatch, doctorId, pagination.pageIndex, pagination.pageSize])

  // -- Column Definitions --
  const columns = useMemo<ColumnDef<ScheduleDTO, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={getLocalizedUrl(`clinic/financial/doctor-payment/details/${encodeHideValue(row.original.id)}`, locale as Locale)}
            color='primary.main'
            className='font-medium hover:underline'
          >{`#${row.original.id}`}</Typography>
        )
      }),
      columnHelper.accessor('scheduleDate', {
        header: 'Date & Time',
        cell: ({ row }) => (
            <div className='flex flex-col'>
                <Typography className='font-medium' color='text.primary'>
                    {row.original.scheduleDate}
                </Typography>
                <Typography variant='caption' color='text.disabled'>
                   {row.original.startTime.substring(0, 5)} - {row.original.endTime.substring(0, 5)}
                </Typography>
            </div>
        )
      }),
      // New: Combined Fee Column
      columnHelper.accessor('doctorFee', {
        header: 'Fees',
        cell: ({ row }) => (
            <div className='flex flex-col'>
                <Typography variant='body2' className='font-medium'>
                    LKR {(row.original.doctorFee + row.original.clinicFee).toLocaleString()}
                </Typography>
                {/* Optional: Payout Status Pill below the fee */}
                {row.original.payoutStatus && (
                     <div className='flex items-center gap-1 mt-0.5'>
                        <span className='h-2 w-2 rounded-full' style={{ backgroundColor: row.original.payoutStatus.colorCode }}></span>
                        <Typography variant='caption' className='text-[10px] uppercase'>
                            {row.original.payoutStatus.displayName}
                        </Typography>
                     </div>
                )}
            </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
            const statusObj = row.original.status as any; 
            
            return (
                <div className='flex flex-col items-start gap-1'>
                    <Chip 
                        label={statusObj?.displayName || statusObj?.code} 
                        sx={{ 
                            backgroundColor: statusObj?.colorCode || '#eee', 
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.70rem',
                            height: 24
                        }} 
                        size='small' 
                    />
                    {/* Booking Open/Closed Indicator */}
                     <Typography 
                        variant='caption' 
                        className={`font-bold text-[10px] ${row.original.isBookingOpen ? 'text-success' : 'text-error'}`}
                     >
                        {row.original.isBookingOpen ? '● BOOKING OPEN' : '● BOOKING CLOSED'}
                     </Typography>
                </div>
            )
        }
      }),
      columnHelper.accessor('registeredPatientCount', {
        header: 'Capacity',
        cell: ({ row }) => (
          <div className='flex flex-col w-[100px]'>
             <div className='flex justify-between items-center'>
                 <Typography variant="caption" className='font-bold'>
                    {row.original.registeredPatientCount}/{row.original.maxPatientCount}
                 </Typography>
                 <Typography variant="caption" color='text.disabled'>
                    {Math.round((row.original.registeredPatientCount / row.original.maxPatientCount) * 100)}%
                 </Typography>
             </div>
             {/* Simple visual bar */}
             <div className='w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden'>
                <div 
                    className='h-full bg-primary' 
                    style={{ width: `${(row.original.registeredPatientCount / row.original.maxPatientCount) * 100}%` }}
                />
             </div>
          </div>
        )
      }),
      columnHelper.accessor('id', { 
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Tooltip title="Finish Schedule">
                <IconButton size='small'>
                <Link
                    href={`/doctor/schedule/${row.original.id}/finish`} 
                    className='flex'
                >
                    <i className='tabler-check text-textSecondary' />
                </Link>
                </IconButton>
            </Tooltip>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Complete Schedule',
                  icon: 'tabler-users',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                },
                {
                  text: 'Cancel Schedule',
                  icon: 'tabler-ban',
                  menuItemProps: { className: 'flex items-center gap-2 text-error' } // Highlight cancel in red
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    [locale]
  )

  const table = useReactTable({
    data: schedules || [],
    columns,
    manualPagination: true,
    rowCount: totalSchedules,
    state: {
      rowSelection,
      globalFilter,
      pagination
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {} as any
  })

  return (
    <Card>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className='tabler-chevron-up text-xl' />,
                          desc: <i className='tabler-chevron-down text-xl' />
                        }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          
          {scheduleStatus === 'loading' ? (
              <tbody>
                <tr>
                  <td colSpan={columns.length} className='text-center p-4'>
                    <Typography>Loading schedules...</Typography>
                  </td>
                </tr>
              </tbody>
          ) : table.getRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className='text-center p-4'>
                  No schedules found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
      
      <TablePagination
        component="div"
        count={totalSchedules || 0}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        rowsPerPageOptions={[6, 10, 25, 50]}
        labelRowsPerPage="Rows per page:"
      />
    </Card>
  )
}

export default ShedulesByDoctorListTable