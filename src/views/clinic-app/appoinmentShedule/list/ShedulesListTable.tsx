'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

// TanStack Table
import { createColumnHelper } from '@tanstack/react-table'

// Common Components
import CommonServerTable from '@/components/common-components/table/CommonServerTable'
import { FilterConfig } from '@/components/common-components/table/TableTypes'
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps' 

// Utils & Types
import { getLocalizedUrl } from '@/utils/i18n'
import { encodeHideValue } from '@/utils/encode'
import type { Locale } from '@configs/i18n'

// Service Imports
import { getScheduleList } from '@/services/doctor/doctor.shedule.server.service'
import { Typography } from '@mui/material'
import { SpecializationDTO } from '@/types/public-booking.types'
import { ScheduleDTO } from '@/types/doctor.types'

type Doctor = {
    id: number
    firstName: string
    lastName: string
    specialization: {
        id: number
        name: string
    }
}

const columnHelper = createColumnHelper<ScheduleDTO>()

const ScheduleListTable = () => {
  const router = useRouter()
  const { lang: locale } = useParams()

  // --- 1. FILTER CONFIGURATION ---
  const filterConfigs: FilterConfig[] = [
    {
        key: 'selectedSpecialization', 
        label: 'Specialization',
        type: 'custom', 
        gridSize: { xs: 12, sm: 6, md: 4 },
        render: (values, onChange) => (
            <AsyncAutocomplete
                label='Search Specialization'
                fetchUrl='/api/specialization/list'
                searchParamKey='q'
                placeholder='Enter Specialization'
                getOptionLabel={(specialization: SpecializationDTO) => `${specialization.name}`}
                fetchInputLenth={0}
                fullWidth
                size='small'
                value={values.selectedSpecialization || null} 
                onChange={(newValue: SpecializationDTO | null) => {
                    onChange('selectedSpecialization', newValue) 
                }}
            />
        )
    },
    {
        key: 'Spe', 
        label: 'Doctor',
        type: 'custom', 
        gridSize: { xs: 12, sm: 6, md: 4 },
        render: (values, onChange) => (
            <AsyncAutocomplete
                label='Search Doctor'
                fetchUrl='/api/doctor/search'
                searchParamKey='q'
                placeholder='Enter Name'
                getOptionLabel={(doctor: Doctor) => `${doctor.firstName} ${doctor.lastName} : ${doctor.specialization.name}`}
                fetchInputLenth={2}
                fullWidth
                size='small'
                value={values.selectedDoctor || null} 
                onChange={(newValue: Doctor | null) => {
                    onChange('selectedDoctor', newValue) 
                }}
            />
        )
    },    
    {
      key: 'startDate',
      label: 'Schedule Start Date',
      type: 'date', 
      placeholder: 'Select Date',
      gridSize: { xs: 12, sm: 6, md: 4 }
    },
    {
      key: 'endDate',
      label: 'Schedule End Date',
      type: 'date', 
      placeholder: 'Select Date',
      gridSize: { xs: 12, sm: 6, md: 4 }
    }    
  ]

  // --- 2. DATA FETCHING WRAPPER (UPDATED FOR NEW API) ---
  const fetchSchedulesWrapper = async (params: any) => {
    const page = params.page ?? 0
    const pageSize = params.pageSize ?? 10
    
    const selectedDoctor = params.selectedDoctor as Doctor | null
    const selectedSpecialization = params.selectedSpecialization as SpecializationDTO | null

    const doctorId = selectedDoctor?.id 
    const specializationId = selectedSpecialization?.id
    
    // 3. Map Date to Start/End Range
    let startDate = params.startDate
    let endDate = params.endDate


    return await getScheduleList(
      page,
      pageSize,
      doctorId, 
      specializationId, 
      startDate,
      endDate
    )
  }

  // --- 3. COLUMNS DEFINITION ---
  const columns = useMemo(() => [
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
        const statusObj = row.original.status;
        return (
          <Chip
            label={statusObj.displayName || statusObj.code}
            size='small'
            sx={{ 
                backgroundColor: statusObj.colorCode, 
                color: '#fff', 
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem'
            }}
          />
        )
      }
    }),

    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className='flex items-center' onClick={(e) => e.stopPropagation()}>
            <Tooltip title="Edit">
                <IconButton size='small' onClick={() => router.push(getLocalizedUrl(`/clinic/appoinment-shedule/edit/${encodeHideValue(row.original.id)}`, locale as Locale))}>
                    <i className='tabler-edit text-textSecondary' />
                </IconButton>
            </Tooltip>
            <OptionMenu
                iconButtonProps={{ size: 'medium' }}
                iconClassName='text-textSecondary'
                options={[
                { text: 'View Details', icon: 'tabler-eye', href: getLocalizedUrl(`/clinic/appoinment-shedule/details/${encodeHideValue(row.original.id)}`, locale as Locale) },
                { text: 'Cancel Schedule', icon: 'tabler-ban', menuItemProps: { className: 'text-error' } }
                ]}
            />
        </div>
      )
    }
  ], [locale, router])

  return (
    <CommonServerTable<ScheduleDTO>
        tableId="schedule-list-table"
        title="Schedule Management"
        fetchDataFunction={fetchSchedulesWrapper}
        columns={columns}
        filterConfig={filterConfigs}      
        baseRowUrl={getLocalizedUrl('/clinic/appoinment-shedule/details', locale as Locale)}
        getRowUrlParam={(row) => row.id}
        actionComponent={
            <>
                <Button variant='tonal' color='secondary' startIcon={<i className='tabler-upload' />}>
                    Export
                </Button>

                <Button 
                    variant='contained' 
                    onClick={() => router.push(getLocalizedUrl('/clinic/appoinment-shedule/add', locale as Locale))}
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