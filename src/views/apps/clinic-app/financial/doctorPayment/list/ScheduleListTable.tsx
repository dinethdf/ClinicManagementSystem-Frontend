'use client'

// React Imports
import { useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
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
import type { ColumnDef, FilterFn } from '@tanstack/react-table'

// Type Imports
import type { ScheduleListTypes } from '@/types/doctor.types'
import type { Locale } from '@configs/i18n'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'
import { encodeHideValue } from '@/utils/encode' // Assuming you have this to match your decodeHideValue

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Filter Logic
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Column Helper
const columnHelper = createColumnHelper<ScheduleListTypes>()

const ScheduleListTable = ({ scheduleData }: { scheduleData?: ScheduleListTypes[] }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(scheduleData || [])
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<ScheduleListTypes, any>[]>(
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
        header: 'Schedule ID',
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={getLocalizedUrl(`/en/clinic/financial/details/${encodeHideValue(row.original.id)}`, locale as Locale)}
            color='primary.main'
            className='font-medium'
          >{`#${row.original.id}`}</Typography>
        )
      }),
      columnHelper.accessor('doctorName', {
        header: 'Doctor',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <CustomAvatar skin='light' color='primary' size={34}>
               {getInitials(row.original.doctorName)}
            </CustomAvatar>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.doctorName}
              </Typography>
              <Typography variant='body2'>{row.original.specialization}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('scheduleDate', {
        header: 'Date & Time',
        cell: ({ row }) => (
          <div className='flex flex-col'>
             <Typography color='text.primary' className='font-medium'>
                {new Date(row.original.scheduleDate).toDateString()}
             </Typography>
             <Typography variant='body2'>
                {row.original.timeRange}
             </Typography>
          </div>
        )
      }),
      columnHelper.accessor('registeredCount', {
        header: 'Capacity',
        cell: ({ row }) => {
            const isFull = row.original.registeredCount >= row.original.maxCount;
            return (
                <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                         <Typography className='font-medium' color={isFull ? 'error.main' : 'text.primary'}>
                            {row.original.registeredCount}
                         </Typography>
                         <Typography variant='body2'>/</Typography>
                         <Typography variant='body2'>{row.original.maxCount}</Typography>
                    </div>
                     {/* Simple progress visual */}
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${isFull ? 'bg-red-500' : 'bg-primary-500'}`} 
                            style={{ width: `${(row.original.registeredCount / row.original.maxCount) * 100}%` }}
                        />
                    </div>
                </div>
            )
        }
      }),
      columnHelper.accessor('active', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.active ? 'Active' : 'Inactive'}
            color={row.original.active ? 'success' : 'secondary'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('id', {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Button 
                component={Link}
                href={getLocalizedUrl(`/clinic/financial/schedule/${encodeHideValue(row.original.id)}`, locale as Locale)}
                size="small" 
                variant="tonal" 
                endIcon={<i className='tabler-arrow-right' />}
            >
                Financials
            </Button>
          </div>
        ),
        enableSorting: false
      })
    ],
    [locale]
  )

  const table = useReactTable({
    data: data as ScheduleListTypes[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <Card>
      <CardContent className='flex justify-between max-sm:flex-col sm:items-center gap-4'>
        <CustomTextField
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder='Search Schedule'
          className='sm:is-auto'
        />
        <div className='flex items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px] max-sm:is-full'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
        </div>
      </CardContent>
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
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  No schedules available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
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
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />
    </Card>
  )
}

export default ScheduleListTable