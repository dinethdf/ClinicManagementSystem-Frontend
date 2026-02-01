'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'

// TanStack Table
import { createColumnHelper } from '@tanstack/react-table'

// Common Components
import CommonServerTable from '@/components/common-components/table/CommonServerTable'
import { FilterConfig } from '@/components/common-components/table/TableTypes'
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Utils & Types
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

// Service Imports
import { getScheduleList } from '@/services/doctor/doctor.shedule.server.service'

// --- Types ---
export interface ScheduleDTO {
  id: number
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

const columnHelper = createColumnHelper<ScheduleDTO>()

const ScheduleListTable = () => {
  const router = useRouter()
  const { lang: locale } = useParams()

  // --- 1. CONFIGURATION: FILTERS & SORTING ---
  const specializationOptions = [
    { label: 'General Practitioner', value: 'General Practitioner' },
    { label: 'Cardiologist', value: 'Cardiologist' },
    { label: 'Dermatologist', value: 'Dermatologist' },
    { label: 'Orthopedic Surgeon', value: 'Orthopedic Surgeon' },
    { label: 'Pediatrician', value: 'Pediatrician' },
    { label: 'Neurologist', value: 'Neurologist' },
    { label: 'Surgeon', value: 'Surgeon' },
  ]

  // Defined exactly like DoctorsListTable
  const filterConfigs: FilterConfig[] = [
    { 
      key: 'doctorName', // Maps to the param expected by your service wrapper
      label: 'Doctor Name', 
      type: 'text', 
      placeholder: 'Search Doctor',
      gridSize: { xs: 12, sm: 4 }
    },
    { 
      key: 'specialization', 
      label: 'Specialization', 
      type: 'select', 
      options: specializationOptions,
      gridSize: { xs: 12, sm: 4 }
    },
    {
      key: 'date',
      label: 'Schedule Date',
      type: 'date', 
      placeholder: 'Select Date',
      gridSize: { xs: 12, sm: 4 }
    }
  ]


const fetchSchedulesWrapper = async (params: any) => {
    const page = params.page ?? 0
    const pageSize = params.pageSize ?? 10 // Map 'limit' to 'size'
    
    // Extract filters (ensure empty strings if undefined)
    const doctorName = params.doctorName || ''
    const specialization = params.specialization || ''
    
    // Handle Date: If it's a Date object, format it. If string, use as is.
    let date = params.date || ''
    if (params.date instanceof Date) {
        // Formats to YYYY-MM-DD (e.g., 2025-10-14)
        date = params.date.toISOString().split('T')[0]
    }

    // Call service with POSITIONAL arguments
    return await getScheduleList(
      page,
      pageSize,
      doctorName, 
      specialization, 
      date
    )
  }

  // --- 3. STATUS COLORS ---
  const scheduleStatusObj: { [key: string]: { title: string; color: 'success' | 'info' | 'error' | 'warning' | 'primary' | 'secondary' } } = {
    ACTIVE: { title: 'Active', color: 'success' },     
    COMPLETED: { title: 'Completed', color: 'info' },    
    CANCELLED: { title: 'Cancelled', color: 'error' }  
  }

  // --- 4. COLUMNS DEFINITION ---
  const columns = useMemo(() => [
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
              <div className='flex flex-col gap-1 w-[120px]'>
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

    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className='flex items-center'>
            <Tooltip title="Edit">
                <IconButton size='small' onClick={() => router.push(getLocalizedUrl(`/clinic/appoinment-shedule/edit/${row.original.id}`, locale as Locale))}>
                    <i className='tabler-edit text-textSecondary' />
                </IconButton>
            </Tooltip>
            <OptionMenu
                iconButtonProps={{ size: 'medium' }}
                iconClassName='text-textSecondary'
                options={[
                { text: 'View Details', icon: 'tabler-eye', href: getLocalizedUrl(`/clinic/appoinment-shedule/details/${row.original.id}`, locale as Locale) },
                { text: 'Cancel Schedule', icon: 'tabler-ban', menuItemProps: { className: 'text-error' } }
                ]}
            />
        </div>
      )
    }
  ], [locale, router])

  return (
    <CommonServerTable
      // 1. Unique ID for Redux Persistence
      tableId="schedule-list-table"
      
      title="Schedule Management"
      
      // 2. Fetch Wrapper Function
      fetchDataFunction={fetchSchedulesWrapper}
      
      columns={columns}
      
      // 3. Filter Configuration (Inputs)
      filterConfig={filterConfigs}      
      // 4. Action Buttons (Top Right - Add Button)
      actionComponent={
        <>
            {/* Optional Export Button matching Doctor Table */}
            <Button variant='tonal' color='secondary' startIcon={<i className='tabler-upload' />}>
                Export
            </Button>

            {/* ✅ Add Schedule Button */}
            <Button 
                variant='contained' 
                onClick={() => router.push(getLocalizedUrl('/clinic/appoinment-shedule/create', locale as Locale))}
                startIcon={<i className='tabler-plus' />}
            >
                Add Schedule
            </Button>
        </>
      }
    />
  )
}

export default ScheduleListTable