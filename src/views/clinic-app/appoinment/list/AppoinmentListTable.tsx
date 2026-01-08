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

// Services & Types
import { getAppointmentList } from '@/services/appoinment.server.service'
import type { AppointmentListDTO } from '@/types/appoinments.types'
import type { ThemeColor } from '@core/types'
import type { Locale } from '@configs/i18n'
import { getLocalizedUrl } from '@/utils/i18n'

// --- CONSTANTS ---
const appointmentStatusObj: { [key: string]: { color: ThemeColor; label: string } } = {
  Booked: { color: 'primary', label: 'Booked' },
  COMPLETED: { color: 'success', label: 'Completed' },
  CANCELLED: { color: 'error', label: 'Cancelled' },
  NOSHOW: { color: 'warning', label: 'No Show' }
}

const columnHelper = createColumnHelper<AppointmentListDTO>()

const AppointmentListTable = () => {
  const router = useRouter()
  const { lang: locale } = useParams()

  // --- 1. CONFIGURATION: FILTERS ---
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
            value: values.patientName || '', // Display Name
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
              // Store ID for API, Name for UI
              onChange('patientId', patient.id)
              onChange('patientName', `${patient.firstName} ${patient.lastName}`)
            }
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

  // --- 2. COLUMNS DEFINITION ---
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
      // 1. Unique ID for Redux Persistence
      tableId="appointment-list-table"
      
      title="Appointment List"
      
      // 2. Direct Service Function
      fetchDataFunction={getAppointmentList}
      
      columns={columns}
      filterConfig={filterConfigs}
      
      // 3. Action Component
      actionComponent={
        <Button 
          variant='contained' 
          // Uses dynamic locale to match your URL structure: /en/clinic/appoinment/create
          onClick={() => router.push(`/${locale}/clinic/appoinment/create`)} 
          startIcon={<i className='tabler-plus' />}
        >
          Add Appointment
        </Button>
      }
    />
  )
}

export default AppointmentListTable