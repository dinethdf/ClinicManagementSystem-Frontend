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

// TanStack Table Imports
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

// Service Import
import { getAppointmentList } from '@/services/appoinment.server.service'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import { getLocalizedUrl } from '@/utils/i18n'
import tableStyles from '@core/styles/table.module.css'

const appointmentStatusObj: { [key: string]: { color: ThemeColor; label: string } } = {
  Booked: { color: 'primary', label: 'Booked' },
  COMPLETED: { color: 'success', label: 'Completed' },
  CANCELLED: { color: 'error', label: 'Cancelled' },
  NOSHOW: { color: 'warning', label: 'No Show' }
}

const columnHelper = createColumnHelper<AppointmentListDTO>()

const AppointmentListTable = () => {
  const [data, setData] = useState<AppointmentListDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  // State for Pagination
  const [pagination, setPagination] = useState({ 
    pageIndex: 0, 
    pageSize: 10 
  })
  const [totalCount, setTotalCount] = useState(0)

  const { lang: locale } = useParams()

  // Fetch Data when pagination state changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // API call using current page index and page size
        const res = await getAppointmentList(pagination.pageIndex, pagination.pageSize)
        
        if (res) {
          setData(res.content)
          setTotalCount(res.totalElements)
        } else {
          setData([])
          setTotalCount(0)
        }
      } catch (error) {
        console.error("Failed to load appointments", error)
      } finally {
        setIsLoading(false)
      }
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
    manualPagination: true,
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    filterFns: {} as any,
  })

  // --- Handlers for MUI Pagination ---
  const handleChangePage = (event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({
      pageSize: parseInt(event.target.value, 10),
      pageIndex: 0 // Reset to first page when changing size
    })
  }

  return (
    <Card>
      <CardContent className='flex justify-between items-center gap-4'>
        <Typography variant='h5'>Appointment List</Typography>
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

      {/* Standard MUI Pagination. 
        This is safer than nesting the custom component unless you are 100% sure of its props.
      */}
      <TablePagination
        component="div"
        count={totalCount}
        page={pagination.pageIndex}
        onPageChange={handleChangePage}
        rowsPerPage={pagination.pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Card>
  )
}

export default AppointmentListTable