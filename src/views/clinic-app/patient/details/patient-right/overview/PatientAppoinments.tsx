'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert' // Added for error display

// Third-party Imports
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

// Type Imports
import type { ThemeColor } from '@core/types'
import type { Locale } from '@configs/i18n'
import type { PatientAppointmentDTO } from '@/types/appoinments.types' // Updated import

// Component Imports
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Service Import
import { appointmentService } from '@/services/appoinment.service' // Import the new service

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// --- Status Configuration ---
type StatusType = {
  color: ThemeColor
  label: string
}

export const appointmentStatusObj: { [key: string]: StatusType } = {
  PENDING_PAYMENT: { color: 'warning', label: 'Pending Payment' },
  Booked: { color: 'success', label: 'Booked' },
  COMPLETED: { color: 'info', label: 'Completed' },
  CANCELLED: { color: 'error', label: 'Cancelled' },
  NOSHOW: { color: 'secondary', label: 'No Show' }
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
  }, [value, debounce, onChange])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const columnHelper = createColumnHelper<PatientAppointmentDTO>()

const PatientAppoinmentsListTable = ({ patientId }: { patientId: string }) => {
  // --- Table States ---
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  
  // --- Data States ---
  const [data, setData] = useState<PatientAppointmentDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Hooks
  const { lang: locale } = useParams()

  // --- API Call using Service ---
  useEffect(() => {
    const fetchAppointments = async () => {
        if (!patientId) return;

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const result = await appointmentService.getAppointmentsByPatientId(patientId);
            
            setData(result);
        } catch (error: any) {
            console.error('Error loading appointments:', error);
            setErrorMessage(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    fetchAppointments();
  }, [patientId]); 

  const columns = useMemo<ColumnDef<PatientAppointmentDTO, any>[]>(
    () => [
      columnHelper.accessor('appointmentId', {
        header: 'Ref #',
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={getLocalizedUrl(`/apps/appointments/details/${row.original.appointmentId}`, locale as Locale)}
            color='primary.main'
            className='font-medium'
          >
            {`#${row.original.appointmentId}`}
          </Typography>
        )
      }),
      columnHelper.accessor('scheduleDate', {
        header: 'Date & Time',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.scheduleDate}
            </Typography>
            <Typography variant='body2' color='text.disabled'>
              {row.original.startTime}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('doctorFullName', {
        header: 'Doctor',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary'>{row.original.doctorFullName}</Typography>
            <Typography variant='caption' color='text.disabled'>
                {row.original.specialization}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('queuePosition', {
        header: 'Queue No',
        cell: ({ row }) => (
            <Typography className='font-bold text-center' color='secondary.main'>
                {row.original.queuePosition}
            </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
            const status = appointmentStatusObj[row.original.status] || { color: 'primary', label: row.original.status }
         
            return (
                <Chip
                    label={status.label}
                    color={status.color}
                    variant='tonal'
                    size='small'
                />
            )
        }
      }),
      columnHelper.accessor('totalFee', {
        header: 'Fee',
        cell: ({ row }) => <Typography>LKR. {row.original.totalFee.toFixed(2)}</Typography>
      }),
      columnHelper.accessor('appointmentId', { 
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary text-[22px]'
              options={[
                {
                  text: 'View Details',
                  icon: 'tabler-eye',
                  href: getLocalizedUrl(`/apps/appointments/view/${row.original.appointmentId}`, locale as Locale),
                  linkProps: { className: 'flex items-center is-full plb-1.5 pli-4' }
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

  // --- Table Initialization ---
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
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  // --- Rendering Loading/Error States ---
  if (isLoading) {
      return (
          <Card className='h-[400px] flex items-center justify-center'>
              <CircularProgress />
          </Card>
      )
  }

  if (errorMessage) {
      return (
          <Card className='p-6'>
               <Alert severity="error">{errorMessage}</Alert>
          </Card>
      )
  }

  return (
    <Card>
      <CardContent className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4'>
        <Typography variant='h5'>Patient Appointments</Typography>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search Appointment'
          className='max-sm:is-full'
        />
      </CardContent>
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
          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No appointments found.
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

export default PatientAppoinmentsListTable