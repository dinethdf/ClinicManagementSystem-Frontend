'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'

// Type Imports
import type { DoctorScheduleDTO } from '@/types/doctor.types'
import { getSchedulesByDoctorId } from '@/services/doctor/doctor.shedule.server.service'

// Component Imports
import SimpleCommonTable from '@/components/common-components/table/simpleDataTable/SimpleCommonTable'
import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper<DoctorScheduleDTO>()

const DoctorScheduleListTable = ({ doctorId }: { doctorId: string }) => {
  // --- States ---
  const [data, setData] = useState<DoctorScheduleDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Pagination State
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  
  // Row Count State
  const [rowCount, setRowCount] = useState(0)

  // Router
  const router = useRouter()
  const params = useParams()
  const lang = params.lang || 'en'

  // --- Fetch Data ---
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!doctorId) return
      setIsLoading(true)
    
      try {
        const response = await getSchedulesByDoctorId(
            doctorId, 
            pagination.pageIndex, 
            pagination.pageSize
        )
        
        console.log("schedule response", response)

        if (response.success && 'data' in response && response.data) {
            setData(response.data.content || []) 
            setRowCount(response.data.totalElements || 0)
        } else {
            setErrorMessage(response.message || 'Failed to fetch data')
        }

      } catch (error: any) {
        setErrorMessage(error.message || 'Failed to load schedules')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSchedules()
  }, [doctorId, pagination.pageIndex, pagination.pageSize]) 

  const columns = useMemo<ColumnDef<DoctorScheduleDTO, any>[]>(
    () => [
      columnHelper.accessor('scheduleDate', {
        header: 'Date & Time',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.scheduleDate}
            </Typography>
            <Typography variant='body2' color='text.disabled'>
              {`${row.original.startTime} - ${row.original.endTime}`}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('clinicFee', {
        header: 'Fees (LKR)',
        cell: ({ row }) => (
            <div className='flex flex-col min-w-[120px]'>
            <div className='flex justify-between gap-2'>
                <Typography variant='body2'>Doc:</Typography>
                <Typography variant='body2' className='font-medium'>{row.original.doctorFee.toFixed(2)}</Typography>
            </div>
            <div className='flex justify-between gap-2'>
                <Typography variant='body2'>Clinic:</Typography>
                <Typography variant='body2' className='font-medium'>{row.original.clinicFee.toFixed(2)}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('registeredPatientCount', {
        header: 'Availability',
        cell: ({ row }) => {
            const current = row.original.registeredPatientCount;
            const max = row.original.maxPatientCount;
            const percent = (current / max) * 100;
            
            const statusObj = row.original.status; 
            const bookingStatus = statusObj?.code || 'UNKNOWN';
           
            return (
            <div className='flex flex-col w-full gap-1 min-w-[150px]'>
                    <div className='flex justify-between items-center'>
                        <Typography variant='caption' className='font-semibold'>
                            {`${current} / ${max} Booked`}
                        </Typography>
                        <Typography variant='caption' className='text-[10px] uppercase font-bold tracking-wider'>
                            {row.original.isBookingOpen ? 'OPEN' : 'CLOSED'}
                        </Typography>
                    </div>
                    <LinearProgress 
                        variant="determinate" 
                        value={percent} 
                        color={percent >= 100 ? 'error' : percent > 80 ? 'warning' : 'success'} 
                        className='h-2 rounded'
                    />
                </div>
            )
        }
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
            const statusObj = row.original.status;
            
            return (
                <Chip 
                    label={statusObj?.displayName || statusObj?.code || 'Unknown'} 
                    sx={{ 
                        backgroundColor: statusObj?.colorCode || '#eee', 
                        color: '#fff',
                        fontWeight: 600
                    }} 
                    variant='filled' 
                    size='small' 
                />
            )
        }
      }),
    ],
    []
  )

  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>

  return (
    <Card>
      <CardContent className='flex justify-between flex-col sm:flex-row sm:items-center gap-4'>
        <Typography variant='h5'>Schedule List</Typography>
      </CardContent>
      
      <SimpleCommonTable<DoctorScheduleDTO>
        data={data}
        columns={columns}
        isLoading={isLoading}
        baseRowUrl={`/${lang}/clinic/appoinment-shedule/details`}
        getRowUrlParam={(row) => row.id || 0}
        manualPagination={true}
        totalItems={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </Card>
  )
}

export default DoctorScheduleListTable