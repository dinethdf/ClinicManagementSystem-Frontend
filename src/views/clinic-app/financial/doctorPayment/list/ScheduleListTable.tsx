'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'

// Third-party Imports
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
import SimpleCommonTable from '@/components/common-components/table/simpleDataTable/SimpleCommonTable'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { encodeHideValue } from '@/utils/encode'

// Service Imports
import { getScheduleList } from '@/services/doctor/doctor.shedule.server.service'

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
  status: string
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
        const res : any = await getScheduleList(
            pagination.pageIndex, 
            pagination.pageSize, 
            Number(filters.doctorId), 
            Number(filters.specialization), 
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
        setData([])
        setTotalCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [pagination.pageIndex, pagination.pageSize, filters])

  // Status Styling Map
  const scheduleStatusObj: { [key: string]: { title: string; color: 'success' | 'info' | 'error' | 'warning' | 'primary' | 'secondary' } } = {
    ACTIVE: { title: 'Active', color: 'success' },     
    COMPLETED: { title: 'Completed', color: 'info' },    
    CANCELLED: { title: 'Cancelled', color: 'error' }  
  }

  // --- Columns Definition ---
  const columns = useMemo<ColumnDef<ScheduleDTO, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'Ref #',
        cell: ({ row }) => (
          <Typography className='font-medium text-primary'>
            #{row.original.id}
          </Typography>
        )
      }),

      columnHelper.accessor('doctorName', {
        header: 'Doctor',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar skin='light' color='primary' size={34}>
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

      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          const statusConfig = scheduleStatusObj[status] || { title: status, color: 'primary' };

          return (
            <Chip
              label={statusConfig.title}
              variant='tonal'
              color={statusConfig.color}
              size='small'
            />
          )
        }
      }),

      columnHelper.accessor('id', {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center' onClick={(e) => e.stopPropagation()}>
            <IconButton size='small'>
              <i className='tabler-edit text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                { text: 'View Details', icon: 'tabler-eye', href: getLocalizedUrl(`/clinic/appoinment-shedule/details/${row.original.id}`, locale as Locale) },
                { text: 'Cancel Schedule', icon: 'tabler-ban', menuItemProps: { className: 'text-error' } }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  )

  return (
    <Card>
      <CardHeader title='Schedule Management' />
      <TableFilters onFilterChange={setFilters} />
      
      <SimpleCommonTable<ScheduleDTO>
        data={data}
        columns={columns}
        isLoading={isLoading}
        baseRowUrl={getLocalizedUrl('clinic/financial/doctor-payment/details', locale as Locale)}
        getRowUrlParam={(row) => encodeHideValue(row.id)}
        manualPagination={true}
        totalItems={totalCount}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </Card>
  )
}

export default ScheduleListTable