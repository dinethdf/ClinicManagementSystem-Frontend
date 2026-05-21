'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { PatientAppointmentDTO } from '@/types/appoinments.types'
import { createColumnHelper } from '@tanstack/react-table'

// Service & Component Imports
import { appointmentService } from '@/services/appointment/appoinment.service'
import SimpleCommonTable from '@/components/common-components/table/simpleDataTable/SimpleCommonTable' 
import OptionMenu from '@core/components/option-menu'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import type { ThemeColor } from '@core/types'

// --- Configs ---
const columnHelper = createColumnHelper<PatientAppointmentDTO>()

type StatusType = {
  color: ThemeColor
  label: string
}

const appointmentStatusObj: { [key: string]: StatusType } = {
  PENDING_PAYMENT: { color: 'warning', label: 'Pending Payment' },
  Booked: { color: 'success', label: 'Booked' },
  COMPLETED: { color: 'info', label: 'Completed' },
  CANCELLED: { color: 'error', label: 'Cancelled' },
  NOSHOW: { color: 'secondary', label: 'No Show' }
}

const PatientAppoinmentsListTable = ({ patientId }: { patientId: string }) => {
  const [data, setData] = useState<PatientAppointmentDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Local Filter State
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { lang: locale } = useParams()

  // 1. Fetch Data
  useEffect(() => {
    const fetchAppointments = async () => {
        if (!patientId) return;
        setIsLoading(true);
        try {
            const result = await appointmentService.getAppointmentsByPatientId(patientId);
            setData(result);
        } catch (error: any) {
            setErrorMessage(error.message || 'Error fetching data');
        } finally {
            setIsLoading(false);
        }
    };
    fetchAppointments();
  }, [patientId]);

  // 2. Define Columns
  const columns = useMemo(() => [
      columnHelper.accessor('appointmentId', {
        header: 'Ref #',
        cell: ({ row }) => (
          <Typography 
            color='primary.main'
            className='font-medium'
          >
            #{row.original.appointmentId}
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
          <div className='flex items-center' onClick={(e) => e.stopPropagation()}>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary text-[22px]'
              options={[
                {
                  text: 'View Details',
                  icon: 'tabler-eye',
                  href: getLocalizedUrl(`/clinic/appoinment/details/${row.original.appointmentId}`, locale as Locale),
                  linkProps: { className: 'flex items-center is-full plb-1.5 pli-4' }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
  ], [locale])

  // 3. Filter Data (Client-side)
  const filteredData = useMemo(() => {
     if(!statusFilter) return data;
     return data.filter(item => item.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <SimpleCommonTable<PatientAppointmentDTO>
      data={filteredData} 
      columns={columns} 
      isLoading={isLoading} 
      error={errorMessage} 
      searchPlaceholder="Search Appointments..."
      baseRowUrl={getLocalizedUrl('/clinic/appoinment/details', locale as Locale)}
      getRowUrlParam={(row) => row.appointmentId}
      // Pass the Status Dropdown to the Common Table
      filters={
         <TextField 
            select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)} 
            size="small" 
            className='max-sm:is-full sm:is-40'
            // Use slotProps for newer MUI versions
            slotProps={{ select: { displayEmpty: true } }}
         >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="PENDING_PAYMENT">Pending Payment</MenuItem>
            <MenuItem value="Booked">Booked</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
         </TextField>
      }
    />
  )
}

export default PatientAppoinmentsListTable