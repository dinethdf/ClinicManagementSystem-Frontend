'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'

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
import type { Locale } from '@configs/i18n'

// Component Imports
import TableFilters from './TableFilters'
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Service Imports (Make sure this exists or use the mock below)
import { getScheduleList } from '@/services/doctor.shedule.server.service'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// --- Types ---
export interface ScheduleDTO {
  id: number
  doctorId: number
  doctorName: string
  specialization: string
  scheduleDate: string
  startTime: string
  endTime: string
  doctorFee: number
  clinicFee: number
  maxPatientCount: number
  registeredPatientCount: number
  isActive: boolean
}

// Column Helper
const columnHelper = createColumnHelper<ScheduleDTO>()

const ScheduleListTable = () => {
  // --- States ---
  const [data, setData] = useState<ScheduleDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState<number>(0)
  
  // Pagination State (Server Side)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  
  // Filter State
  const [filters, setFilters] = useState({
    doctorId: '',
    specialization: '',
    date: ''
  })

  // Hooks
  const { lang: locale } = useParams()

  // --- Fetch Data Effect ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {

        const res = await getScheduleList(
            pagination.pageIndex, 
            pagination.pageSize, 
            filters.doctorId, 
            filters.specialization, 
            filters.date
        )

        if (res && res.content) {
          setData(res.content)
          setTotalCount(res.totalElements)
        } else {
            setData([])
            setTotalCount(0)
        }
      } catch (error) {
        console.error('Failed to fetch schedules', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [pagination.pageIndex, pagination.pageSize, filters])


  const columns = useMemo<ColumnDef<ScheduleDTO, any>[]>(
    () => [

      columnHelper.accessor('id', {
        header: 'Ref #',
        cell: ({ row }) => (
          <Link
            href={getLocalizedUrl(`/clinic/appoinment-shedule/details/${row.original.id}`, locale as Locale)}
            className='font-medium text-primary hover:underline'
          >
            #{row.original.id}
          </Link>
        )
      }),

      columnHelper.accessor('doctorName', {
        header: 'Doctor',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar skin='light' color='primary' size={34}>
               {/* Show first letter of Doctor Name */}
               {row.original.doctorName.charAt(0)}
            </CustomAvatar>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.doctorName}
              </Typography>
              <Typography variant='caption'>{row.original.specialization}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('scheduleDate', {
        header: 'Date & Time',
        cell: ({ row }) => (
          <div className='flex flex-col'>
             <Typography className='font-medium'>
                {row.original.scheduleDate}
             </Typography>
             <Typography variant='body2' color='text.disabled'>
                {row.original.startTime.substring(0, 5)} - {row.original.endTime.substring(0, 5)}
             </Typography>
          </div>
        )
      }),
      columnHelper.accessor('maxPatientCount', {
        header: 'Capacity',
        cell: ({ row }) => {
            const percentage = (row.original.registeredPatientCount / row.original.maxPatientCount) * 100
            const isFull = row.original.registeredPatientCount >= row.original.maxPatientCount
            
            return (
                <div className='flex flex-col gap-1 w-[100px]'>
                    <div className='flex justify-between'>
                        <Typography variant='caption'>{row.original.registeredPatientCount} / {row.original.maxPatientCount}</Typography>
                        <Typography variant='caption' color={isFull ? 'error' : 'text.primary'}>{percentage.toFixed(0)}%</Typography>
                    </div>
                    <LinearProgress 
                        variant="determinate" 
                        value={percentage} 
                        color={isFull ? 'error' : 'primary'}
                        className='h-1.5 rounded'
                    />
                </div>
            )
        }
      }),
      columnHelper.accessor('doctorFee', {
        header: 'Total Fee',
        cell: ({ row }) => (
             <Typography>
                LKR {(row.original.doctorFee + row.original.clinicFee).toFixed(2)}
             </Typography>
        )
      }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.isActive ? 'Active' : 'Inactive'}
            variant='tonal'
            color={row.original.isActive ? 'success' : 'error'}
            size='small'
          />
        )
      }),
      columnHelper.accessor('id', {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small'>
              <i className='tabler-edit text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                { text: 'View Details', icon: 'tabler-eye' },
                { text: 'Cancel Schedule', icon: 'tabler-ban', menuItemProps: { className: 'text-error' } }
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
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // IMPORTANT: Tells TanStack we handle pagination server-side
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    filterFns: {} as any
  })

  return (
    <Card>
      <CardHeader title='Schedule Management' />
      <TableFilters onFilterChange={setFilters} />
      
      {/* <div className='flex justify-end p-4 gap-2'>
            <Button
              variant='contained'
              component={Link}
              href={getLocalizedUrl('/clinic/schedule/add', locale as Locale)}
              startIcon={<i className='tabler-plus' />}
            >
              Add Schedule
            </Button>
      </div> */}

      {isLoading && <div className='w-full p-4 flex justify-center'><CircularProgress /></div>}

      {!isLoading && (
        <>
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
                    {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className='text-center p-4'>No schedules found</td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
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
                component={() => <TablePaginationComponent table={table as any} />}
                count={totalCount}
                rowsPerPage={pagination.pageSize}
                page={pagination.pageIndex}
                onPageChange={(_, page) => setPagination(prev => ({ ...prev, pageIndex: page }))}
                onRowsPerPageChange={e => setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })}
            />
        </>
      )}
    </Card>
  )
}

export default ScheduleListTable