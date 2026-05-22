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
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// Type Imports
import type { ScheduleAppointmentDTO } from '@/types/appoinments.types'
import type { Locale } from '@configs/i18n'

// Service Imports
import { appointmentService } from '@/services/appointment/appoinment.service'

// Utils
import { getLocalizedUrl } from '@/utils/i18n'

// Custom Components
import SimpleCommonTable from '@/components/common-components/table/simpleDataTable/SimpleCommonTable'

const columnHelper = createColumnHelper<ScheduleAppointmentDTO>()

const ScheduleAppointmentListTable = ({ scheduleId }: { scheduleId: number }) => {
  // Hooks
  const { lang: locale } = useParams()

  // States
  const [data, setData] = useState<ScheduleAppointmentDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Local Filter State
  const [statusFilter, setStatusFilter] = useState<string>('')

  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  
  const [totalCount, setTotalCount] = useState(0)

  // 1. Fetch Data
  useEffect(() => {
    const loadData = async () => {
      if (!scheduleId) return
      
      setIsLoading(true)

      try {
        const result = await appointmentService.getAppointmentsByScheduleId(
            scheduleId, 
            pagination.pageIndex, 
            pagination.pageSize
        )

        if (result) {
            setData(result.content || [])
            setTotalCount(result.totalElements || 0)
        } else {
            setData([])
        }
      } catch (error: any) {
        setErrorMessage('Failed to load appointments')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [scheduleId, pagination.pageIndex, pagination.pageSize])

  // 2. Define Columns
  const columns = useMemo<ColumnDef<ScheduleAppointmentDTO, any>[]>(
    () => [
      columnHelper.accessor('queuePosition', {
        header: 'Queue',
        cell: ({ row }) => (
           <Avatar variant="rounded">
              {row.original.queuePosition}
           </Avatar>
        )
      }),
      columnHelper.accessor('patientName', {
        header: 'Patient Details',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.patientName}
            </Typography>
            <div className='flex gap-2 items-center'>
                <Typography>
                    {row.original.patientNo}
                </Typography>
                <Typography variant='caption' color='text.disabled'>|</Typography>
                <div className='flex items-center gap-1'>
                    <i className='tabler-phone text-[10px] text-textDisabled' />
                    <Typography variant='caption' color='text.disabled'>{row.original.patientMobile}</Typography>
                </div>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('startTime', { 
        header: 'Time',
        cell: ({ row }) => <Typography variant="body2">{row.original.startTime}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
            // Use API provided colors and labels
            const colorCode = row.original.statusColor || '#808080';
            const label = row.original.statusDisplayName || row.original.status;

            return (
                <Chip
                    label={label}
                    size='small'
                    sx={{ 
                        backgroundColor: colorCode, 
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                    }}
                />
            )
        }
      })
    ],
    [locale]
  )

  // 3. Client-side Filtering (on current page)
  const filteredData = useMemo(() => {
      if(!statusFilter) return data;

      // Filter by the raw status code (e.g., 'BOOKED', 'PENDING_PAYMENT')
      return data.filter(item => item.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <Card>
      <CardContent className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <Typography variant='h5'>Scheduled Appointments</Typography>
      </CardContent>
      
      <SimpleCommonTable<ScheduleAppointmentDTO>
        data={filteredData} 
        columns={columns} 
        isLoading={isLoading} 
        error={errorMessage} 
        baseRowUrl={getLocalizedUrl('/clinic/appoinment/details', locale as Locale)}
        getRowUrlParam={(row) => row.id}

        // Pass the Status Dropdown to the Common Table
        filters={
            <TextField 
                select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)} 
                size="small" 
                className='max-sm:is-full sm:is-48'
                placeholder="Filter by Status"
                SelectProps={{ displayEmpty: true }}
            >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="BOOKED">Booked</MenuItem>
                <MenuItem value="PENDING_PAYMENT">Pending Payment</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                <MenuItem value="NOSHOW">No Show</MenuItem>
            </TextField>
        }
      />
    </Card>
  )
}

export default ScheduleAppointmentListTable