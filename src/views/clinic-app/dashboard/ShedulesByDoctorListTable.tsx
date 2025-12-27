'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import Card from '@mui/material/Card'
import Button from '@mui/material/Button' // (kept imports as requested)
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel, // You can technically remove this for server-side, but keeping it doesn't hurt
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn, PaginationState } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/redux-store'
import { fetchDoctorSchedules } from '@/redux-store/slices/doctorDashboardSlice'
import type { ScheduleDTO } from '@/types/analysis.types'

import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import { getLocalizedUrl } from '@/utils/i18n'
import { encodeHideValue } from '@/utils/encode'
import type { Locale } from '@/configs/i18n'

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

// ... (DebouncedInput kept as is) ...

const columnHelper = createColumnHelper<ScheduleDTO>()

const ShedulesByDoctorListTable = ({ doctorId }: { doctorId: number }) => {
  // -- Hooks --
  const dispatch = useDispatch<AppDispatch>()
  const { lang: locale } = useParams()
  
  // -- Redux State --
  // Get totalSchedules from redux for pagination count
  const { schedules, scheduleStatus, totalSchedules } = useSelector((state: RootState) => state.doctorDashboard)

  // -- Local State --
  const [status, setStatus] = useState<string>('')
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  
  // 1. Add Local Pagination State
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6 // Match your default pageSize
  })

  // -- Fetch Data on Mount or Pagination Change --
  useEffect(() => {
    if (doctorId) {
        // 2. Dispatch with Pagination Params
        dispatch(fetchDoctorSchedules({ 
            doctorId, 
            page: pagination.pageIndex, 
            size: pagination.pageSize 
        }))
    }
  }, [dispatch, doctorId, pagination.pageIndex, pagination.pageSize])

  // -- Column Definitions --
  // (kept exactly as provided in your snippet)
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
          >{`#${row.original.id}`}</Typography>
        )
      }),
      columnHelper.accessor('scheduleDate', {
        header: 'Date',
        cell: ({ row }) => (
            <div className='flex flex-col'>
                <Typography className='font-medium' color='text.primary'>
                    {new Date(row.original.scheduleDate).toLocaleDateString()}
                </Typography>
            </div>
        )
      }),
      columnHelper.accessor('startTime', {
        header: 'Time',
        cell: ({ row }) => (
            <Typography>
                {`${row.original.startTime} - ${row.original.endTime}`}
            </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status
            const statusConfig: any = {
                ACTIVE: { color: 'success', icon: 'tabler-check', label: 'Active' },
                COMPLETED: { color: 'info', icon: 'tabler-circle-check', label: 'Completed' },
                CANCELLED: { color: 'error', icon: 'tabler-alert-circle', label: 'Cancelled' },
            }
            const config = statusConfig[status] || statusConfig.INACTIVE // Note: statusConfig.INACTIVE is undefined in your object, might fallback to undefined/crash if not handled, but keeping as is.

            return (
                <Chip 
                    label={config?.label || status} 
                    color={config?.color || 'default'} 
                    variant="tonal" 
                    size="small" 
                    icon={<i className={config?.icon || ''} />}
                    className='uppercase text-[10px] font-bold'
                />
            )
        }
    }),
      columnHelper.accessor('registeredPatientCount', {
        header: 'Capacity',
        cell: ({ row }) => (
          <div className='flex flex-col'>
             <Typography variant="body2">
                {row.original.registeredPatientCount} / {row.original.maxPatientCount} Patients
             </Typography>
          </div>
        )
      }),
      columnHelper.accessor('id', { 
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton>
              <Link
                href={`/doctor/schedule/${row.original.id}/finish`} 
                className='flex'
              >
                <i className='tabler-check text-textSecondary' />
              </Link>
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Complete Shedule',
                  icon: 'tabler-users',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                },
                {
                  text: 'Cancel Schedule',
                  icon: 'tabler-ban',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
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
    data: schedules || [], // Directly use Redux state
    columns,
    // 3. Enable Server-Side Pagination Logic
    manualPagination: true,
    rowCount: totalSchedules, // Pass total count from server
    state: {
      rowSelection,
      globalFilter,
      pagination // Connect state
    },
    // Remove initialState for pagination since we control it via state now
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    filterFns: {} as any
  })

  return (
    <Card>
      {/* (CardContent commented out in your snippet, keeping it commented) */}
      
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
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
                      </>
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
                <td colSpan={columns.length} className='text-center'>
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
        count={totalSchedules}
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