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
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// Type Imports
import type { AppointmentListDTO } from '@/types/appoinments.types'
import type { ThemeColor } from '@/@core/typesDef'
import type { Locale } from '@configs/i18n'

// Service
import { getAppointmentList } from '@/services/appoinment.server.service'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Status Colors
const appointmentStatusObj: { [key: string]: { color: ThemeColor; label: string } } = {
  Booked: { color: 'primary', label: 'Booked' },
  COMPLETED: { color: 'success', label: 'Completed' },
  CANCELLED: { color: 'error', label: 'Cancelled' },
  NOSHOW: { color: 'warning', label: 'No Show' }
}

const columnHelper = createColumnHelper<AppointmentListDTO>()

const AppointmentListTable = () => {
  // States
  const [data, setData] = useState<AppointmentListDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [totalCount, setTotalCount] = useState(0)

  const { lang: locale } = useParams()

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Note: This calls the server action from the client
      const res = await getAppointmentList(pagination.pageIndex, pagination.pageSize)
      
      if (res) {
        setData(res.content)
        setTotalCount(res.totalElements)
      }
      setIsLoading(false)
    }
    loadData()
  }, [pagination.pageIndex, pagination.pageSize])

  const columns = useMemo<ColumnDef<AppointmentListDTO, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'Ref #',
        cell: ({ row }) => (
          <Link
            href={getLocalizedUrl(`/clinic/appoinment/details/${row.original.id}`, locale as Locale)}
            className='font-medium text-primary hover:underline'
          >
            #{row.original.id}
          </Link>
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
      columnHelper.accessor('patientName', {
        header: 'Patient',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.patientName}
            </Typography>
            <Typography variant='caption' color='text.disabled'>
              {row.original.patientNo}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('doctorName', {
        header: 'Doctor',
        cell: ({ row }) => <Typography>{row.original.doctorName}</Typography>
      }),
      columnHelper.accessor('queuePosition', {
        header: 'Queue',
        cell: ({ row }) => (
             <div className='flex justify-center'>
                 <Chip label={row.original.queuePosition} size='small' variant='outlined' />
             </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const status = appointmentStatusObj[row.original.status] || { color: 'secondary', label: row.original.status }
          return <Chip label={status.label} color={status.color} variant='tonal' size='small' />
        }
      }),
      columnHelper.accessor('id', {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <OptionMenu
            iconButtonProps={{ size: 'medium' }}
            iconClassName='text-textSecondary'
            options={[
              {
                text: 'View Details',
                icon: 'tabler-eye',
                href: getLocalizedUrl(`/clinic/appoinment/details/${row.original.id}`, locale as Locale)
              }
            ]}
          />
        ),
        enableSorting: false
      })
    ],
    [locale]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Important for server-side pagination
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    filterFns: {} as any
  })

  return (
    <Card>
      <CardContent className='flex justify-between items-center gap-4'>
        <Typography variant='h5'>Appointment List</Typography>
        {/* You can add Search Input here later */}
      </CardContent>
      
      {isLoading ? (
        <div className='p-12 flex justify-center'><CircularProgress /></div>
      ) : (
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
      )}

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

export default AppointmentListTable