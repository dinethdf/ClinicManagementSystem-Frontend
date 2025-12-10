'use client'

import { useState, useEffect, useMemo } from 'react'

import Link from 'next/link'

import { useParams } from 'next/navigation'


import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip' // Added for better status display
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
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Redux Imports
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '@/redux-store'
import { fetchDoctorSchedules } from '@/redux-store/slices/doctorDashboardSlice'

// Type Imports
import type { ScheduleDTO } from '@/types/analysis.types'

import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'



// Style Imports
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

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
 
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// const scheduleStatusObj: ScheduleStatusObj = {
//   ACTIVE: { color: 'success', icon: 'tabler-check' },
//   COMPLETED: { color: 'info', icon: 'tabler-circle-check' },
//   CANCELLED: { color: 'error', icon: 'tabler-x' }
// }

const columnHelper = createColumnHelper<ScheduleDTO>()

const ShedulesByDoctorListTable = ({ doctorId }: { doctorId: number }) => {
  // -- Hooks --
  const dispatch = useDispatch<AppDispatch>()

    const { lang: locale } = useParams()
  
  // -- Redux State --
  const { schedules, scheduleStatus } = useSelector((state: RootState) => state.doctorDashboard)

  // -- Local State --
  const [status, setStatus] = useState<string>('')
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  
  // NOTE: We update 'data' state when Redux 'schedules' change
  const [data, setData] = useState<ScheduleDTO[]>([])

  // -- Fetch Data on Mount or Prop Change --
  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorSchedules(doctorId))
    }
  }, [dispatch, doctorId])


  useEffect(() => {
    if (schedules) {

        const filteredData = schedules.filter(() => {
            
          // if (status && schedule.isActive !== isActive) return false  // no need If ISACTIV use
         
          return true
        })
        
        setData(filteredData)
    }
  }, [schedules, status])


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

            const config = statusConfig[status] || statusConfig.INACTIVE

            return (
                <Chip 
                    label={config.label} 
                    color={config.color} 
                    variant="tonal" 
                    size="small" 
                    icon={<i className={config.icon} />}
                    className='uppercase text-[10px] font-bold' // Added styling for a professional look
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
      columnHelper.accessor('id', { // Using ID as accessor for Action column
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
    []
  )

  const table = useReactTable({
    data: data,
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
        pageSize: 6
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
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card>
      {/* <CardContent className='flex justify-between flex-wrap items-start gap-4'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <Typography className='hidden sm:block'>Show</Typography>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='is-[70px]'
            >
              <MenuItem value='6'>6</MenuItem>
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
          </div>
        <Button
            variant='contained'
            component={Link}
            startIcon={<i className='tabler-plus' />}
            href={`/apps/schedules/add?doctorId=${doctorId}`}
            className='max-sm:is-full'
          >
            Create Schedule
          </Button>
        </div>
        <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Schedules'
            className='max-sm:is-full sm:is-[250px]'
          />
          <CustomTextField
            select
            id='select-status'
            value={status}
            onChange={e => setStatus(e.target.value)}
            className='max-sm:is-full sm:is-40'
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>All Status</MenuItem>
            <MenuItem value='ACTIVE'>Active</MenuItem>
            <MenuItem value='COMPLETED'>Completed</MenuItem>
            <MenuItem value='CANCELLED'>Cancelled</MenuItem>
          </CustomTextField>
        </div>
      </CardContent> */}
      
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
          
          {/* Handle Loading State or Empty Data */}
          {scheduleStatus === 'loading' ? (
              <tbody>
                <tr>
                  <td colSpan={columns.length} className='text-center p-4'>
                    <Typography>Loading schedules...</Typography>
                  </td>
                </tr>
              </tbody>
          ) : table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  No schedules found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => {
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
        component={() => <TablePaginationComponent table={table as any}  />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}

export default ShedulesByDoctorListTable
