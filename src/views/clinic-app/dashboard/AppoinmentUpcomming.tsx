'use client'

// React Imports
import { useState, useEffect, useCallback, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import TablePagination from '@mui/material/TablePagination'
import Grid from '@mui/material/Grid'

// Third-party Imports
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef
} from '@tanstack/react-table'

// Service & Style Imports
import { doctorSheduleService } from '@/services/doctor.shedule.service'
import tableStyles from '@core/styles/table.module.css'

// --- TYPES ---
export interface DoctorScheduleDTO {
  id?: number
  doctorId: number
  scheduleDate: string
  doctorName?: string
  specialization?: string
  startTime: string
  endTime: string
  doctorFee: number
  clinicFee: number
  registeredPatientCount: number
  maxPatientCount: number
  isActive?: boolean
  status?: string
}

// =============================================================================
// SUB-COMPONENT: Table View
// =============================================================================
const columnHelper = createColumnHelper<DoctorScheduleDTO>()

const ScheduleListTable = ({ 
  data, 
  totalRows, 
  pagination, 
  setPagination, 
  onBookNow,
  isLoading 
}: {
  data: DoctorScheduleDTO[]
  totalRows: number
  pagination: { pageIndex: number; pageSize: number }
  setPagination: (val: any) => void
  onBookNow: (id: number) => void
  isLoading: boolean
}) => {

  const columns = useMemo<ColumnDef<DoctorScheduleDTO, any>[]>(
    () => [
      columnHelper.accessor('scheduleDate', {
        header: 'Date & Time',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='body2' className='font-bold text-textPrimary'>
                {dayjs(row.original.scheduleDate).format('MMM DD, YYYY')}
            </Typography>
            <div className='flex items-center gap-1'>
                <i className='tabler-clock text-base text-primary' />
                <Typography variant='caption' color='text.secondary'>
                    {dayjs(`${row.original.scheduleDate}T${row.original.startTime}`).format('h:mm A')}
                </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('doctorName', {
        header: 'Doctor',
        cell: ({ row }) => (
          <div className='flex flex-col'>
             <Typography variant='body2' className='font-medium text-textPrimary'>
                Dr. {row.original.doctorName || 'Unknown'}
             </Typography>
             <Typography variant='caption' color='text.secondary'>
                {row.original.specialization || 'General'}
             </Typography>
          </div>
        )
      }),
      columnHelper.accessor('doctorFee', {
        header: 'Total Fee',
        cell: ({ row }) => {
            const total = (row.original.doctorFee || 0) + (row.original.clinicFee || 0)
            return <Typography variant='body2' className='font-bold'>Rs. {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
        }
      }),
      columnHelper.accessor('registeredPatientCount', {
        header: 'Availability',
        cell: ({ row }) => {
            const max = row.original.maxPatientCount
            const current = row.original.registeredPatientCount
            const progress = max > 0 ? (current / max) * 100 : 0
            const isFull = current >= max
            return (
                <div className='flex flex-col gap-1 is-[140px]'>
                    <div className='flex justify-between items-center'>
                        <Typography variant='caption' color='text.secondary'>Slots</Typography>
                        <Typography variant='caption' className={isFull ? 'text-error font-bold' : 'text-primary font-bold'}>{current} / {max}</Typography>
                    </div>
                    <LinearProgress variant='determinate' value={progress} color={isFull ? 'error' : 'primary'} className='bs-1.5 rounded-sm'/>
                </div>
            )
        }
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
            const isFull = row.original.registeredPatientCount >= row.original.maxPatientCount
            const isClosed = row.original.status !== 'ACTIVE' && row.original.isActive === false
            if (isClosed) return <Chip label='Closed' color='error' size='small' variant='tonal' />
            if (isFull) return <Chip label='Full' color='warning' size='small' variant='tonal' />
            return <Chip label='Open' color='success' size='small' variant='tonal' />
        }
      }),
      columnHelper.accessor('id', {
        header: 'Action',
        cell: ({ row }) => {
            const isFull = row.original.registeredPatientCount >= row.original.maxPatientCount
            const isClosed = row.original.status !== 'ACTIVE' && row.original.isActive === false
            const isDisabled = isFull || isClosed
            return (
                <div className='flex items-center'>
                    <Button 
                        variant='contained' size='small' color={isDisabled ? 'secondary' : 'primary'}
                        disabled={isDisabled} onClick={() => row.original.id && onBookNow(row.original.id)}
                        startIcon={!isDisabled ? <i className='tabler-bookmark' /> : null}
                    >
                        {isFull ? 'Waitlist' : 'Book'}
                    </Button>
                </div>
            )
        }
      })
    ],
    [onBookNow]
  )

  const table = useReactTable({
    data, columns, pageCount: Math.ceil(totalRows / pagination.pageSize),
    state: { pagination }, manualPagination: true,
    onPaginationChange: setPagination, getCoreRowModel: getCoreRowModel(),
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
                  <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
                <tr><td colSpan={columns.length} className='text-center py-10'><LinearProgress /></td></tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={columns.length} className='text-center py-10'><Typography color='text.secondary'>No schedules found.</Typography></td></tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component='div' count={totalRows} rowsPerPage={pagination.pageSize} page={pagination.pageIndex}
        onPageChange={(_, page) => setPagination((prev: any) => ({ ...prev, pageIndex: page }))}
        onRowsPerPageChange={e => setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })}
      />
    </Card>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const PublicScheduleManager = () => {
  const [schedules, setSchedules] = useState<DoctorScheduleDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  
  // Pagination
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 })
  const [filters, setFilters] = useState({ doctorName: '', specialization: '', date: '' })

  const fetchSchedules = useCallback(async () => {
    setLoading(true)
    try {
      const response = await doctorSheduleService.getUpcomingSchedules({
        page: pagination.pageIndex, 
        size: pagination.pageSize,
        doctorName: filters.doctorName || undefined,
        specialization: filters.specialization || undefined,
        date: filters.date || undefined
      })

      if (response && response.content) {
        setSchedules(response.content)
        setTotalRows(response.totalElements)
      } else {
        setSchedules([])
        setTotalRows(0)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to load schedules')
    } finally {
      setLoading(false)
    }
  }, [pagination.pageIndex, pagination.pageSize, filters])

  useEffect(() => { fetchSchedules() }, [fetchSchedules])

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    setPagination(prev => ({ ...prev, pageIndex: 0 })) 
  }

  const handleBookNow = (id: number) => {
    console.log("Book Schedule ID:", id)
    toast.info(`Booking initiated for Schedule #${id}`)
  }

  return (
    <div className='flex flex-col gap-6'>
        
        {/* --- 1. SEARCH / FILTERS --- */}
        <Card>
            <CardContent className='p-4'>
                <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size='small' label="Search Doctor" placeholder="Dr. Name" value={filters.doctorName} onChange={(e) => handleFilterChange('doctorName', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><i className='tabler-search text-gray-400'/></InputAdornment> }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField select fullWidth size='small' label="Specialization" value={filters.specialization} onChange={(e) => handleFilterChange('specialization', e.target.value)}>
                            <MenuItem value="">All Specializations</MenuItem>
                            <MenuItem value="General Practitioner">General Practitioner</MenuItem>
                            <MenuItem value="Cardiologist">Cardiologist</MenuItem>
                            <MenuItem value="Dermatologist">Dermatologist</MenuItem>
                            <MenuItem value="Pediatrician">Pediatrician</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField type='date' fullWidth size='small' label="Date" InputLabelProps={{ shrink: true }} value={filters.date} onChange={(e) => handleFilterChange('date', e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <Button variant='tonal' color='secondary' fullWidth onClick={() => { setFilters({ doctorName: '', specialization: '', date: '' }); setPagination(p => ({...p, pageIndex: 0})); }} startIcon={<i className='tabler-filter-off'/>}>Reset</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

        {/* --- 2. TABLE --- */}
        <ScheduleListTable 
            data={schedules}
            totalRows={totalRows}
            pagination={pagination}
            setPagination={setPagination}
            onBookNow={handleBookNow}
            isLoading={loading}
        />
    </div>
  )
}

export default PublicScheduleManager