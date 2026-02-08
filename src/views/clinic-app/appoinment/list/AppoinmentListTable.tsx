'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// TanStack Table
import { createColumnHelper } from '@tanstack/react-table'

// Common Components
import CommonServerTable from '@/components/common-components/table/CommonServerTable'
import { FilterConfig } from '@/components/common-components/table/TableTypes'

// Dialogs & Helpers
import PatientSelectDialogBox from '@/components/dialogs/patient-select'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import OptionMenu from '@core/components/option-menu'
import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps'

// Services
import { getAppointmentList } from '@/services/appointment/appoinment.server.service'

// Utils
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import { encodeHideValue } from '@/utils/encode'

// --- Types ---
export interface AppointmentListDTO {
  id: number
  startTime: string
  status: string 
  statusDisplayName: string 
  statusColor: string 
  note: string
  queuePosition: number
  scheduleDate: string
  doctorName: string
  patientId: number
  patientName: string
  patientNo: string
  patientMobile: string
}

type Doctor = {
    id: number
    firstName: string
    lastName: string
    specialization: {
        id: number
        name: string
    }
}

const columnHelper = createColumnHelper<AppointmentListDTO>()

const AppointmentListTable = () => {
  const router = useRouter()
  const { lang: locale } = useParams()

  // --- 1. FILTER CONFIGURATION ---
  const filterConfigs: FilterConfig[] = [
    {
      key: 'patient', 
      label: 'Patient',
      type: 'custom',
      gridSize: { xs: 12, sm: 6, md: 3 },
      render: (values, onChange) => (
        <OpenDialogOnElementClick
          element={TextField}
          elementProps={{
            fullWidth: true,
            label: 'Patient',
            placeholder: 'Select Patient',
            value: values.patientName || '', 
            size: "small",
            InputProps: {
              readOnly: true,
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='tabler-user' />
                </InputAdornment>
              )
            },
            inputProps: { style: { cursor: 'pointer' } }
          }}
          dialog={PatientSelectDialogBox}
          dialogProps={{
            onSelectPatient: (patient: any) => {
              onChange('patientId', patient.id)
              onChange('patientName', `${patient.firstName} ${patient.lastName}`)
            }
          }}
        />
      )
    },
    {
        key: 'selectedDoctor', 
        label: 'Doctor',
        type: 'custom', 
        gridSize: { xs: 12, sm: 6, md: 3 },
        render: (values, onChange) => (
            <AsyncAutocomplete
                label=''
                fetchUrl='/api/doctor/search'
                searchParamKey='q'
                placeholder='Search Doctor'
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
      label: 'Start Date',
      type: 'date',
      gridSize: { xs: 12, sm: 6, md: 3 }
    },
    {
      key: 'endDate',
      label: 'End Date',
      type: 'date',
      gridSize: { xs: 12, sm: 6, md: 3 }
    }
  ]

  // --- 2. DATA FETCHING WRAPPER ---
  const fetchAppointmentsWrapper = async (params: any) => {
    const page = params.page ?? 0
    const pageSize = params.pageSize ?? 10
    
    // 1. Extract IDs
    const patientId = params.patientId || null
    
    // Extract Doctor ID from the selected object
    const selectedDoctor = params.selectedDoctor as Doctor | null
    const doctorId = selectedDoctor?.id || null

    // 2. Format Dates
    let startDate = ''
    let endDate = ''

    if (params.startDate instanceof Date) {
        startDate = params.startDate.toISOString().split('T')[0]
    }
    if (params.endDate instanceof Date) {
        endDate = params.endDate.toISOString().split('T')[0]
    }

    // 3. Call Service
    // Ensure you pass the arguments in the order your service expects:
    // (page, pageSize, patientId, doctorId, scheduleId, startDate, endDate)
    return await getAppointmentList(
      page,
      pageSize,
      patientId,
      doctorId,
      null, // scheduleId (not filtering by specific schedule here)
      startDate || undefined,
      endDate || undefined
    )
  }

  // --- 3. COLUMNS DEFINITION ---
  const columns = useMemo(() => [
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
          <div className='flex gap-1 items-center'>
            <Typography variant='caption' color='text.disabled'>
                {row.original.patientNo}
            </Typography>
            <Typography variant='caption' color='text.disabled'>|</Typography>
            <Typography variant='caption' color='text.disabled'>
                {row.original.patientMobile}
            </Typography>
          </div>
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
              <Chip 
                label={row.original.queuePosition} 
                size='small' 
                variant='outlined' 
                color='secondary'
                className='font-bold'
              />
          </div>
      )
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => {
        return (
            <Chip 
                label={row.original.statusDisplayName} 
                size='small' 
                sx={{ 
                    backgroundColor: row.original.statusColor, 
                    color: '#fff',
                    fontWeight: 600,
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
    }
  ], [locale])

  return (
    <CommonServerTable
      tableId="appointment-list-table"
      title="Appointment List"
      fetchDataFunction={fetchAppointmentsWrapper}
      columns={columns}
      filterConfig={filterConfigs}
      actionComponent={
        <Button 
          variant='contained' 
          onClick={() => router.push(getLocalizedUrl('/clinic/appoinment/create', locale as Locale))} 
          startIcon={<i className='tabler-plus' />}
        >
          Add Appointment
        </Button>
      }
    />
  )
}

export default AppointmentListTable