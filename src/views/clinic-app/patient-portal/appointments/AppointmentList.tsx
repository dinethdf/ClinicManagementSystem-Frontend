'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// TanStack Table Imports
import { createColumnHelper } from '@tanstack/react-table'

// Component Imports
import SimpleCommonTable from '@/components/common-components/table/simpleDataTable/SimpleCommonTable'
import OptionMenu from '@core/components/option-menu'

import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick' // Import this
import AppointmentDetailsDialog from './AppointmentDetailsDialog' // Import new dialog

// Service & Types
import { patientAppointmentService } from '@/services/patient-portal/patient.appointments.service'
import type { PatientAppointmentDTO } from '@/types/patient-portal/patient.appointments.types'

// Utils
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import type { ThemeColor } from '@core/types'

// --- Configuration ---
const columnHelper = createColumnHelper<any>()

type StatusType = {
  color: ThemeColor
  label: string
}

const appointmentStatusObj: { [key: string]: StatusType } = {
  PENDING: { color: 'warning', label: 'Pending' },
  SCHEDULED: { color: 'primary', label: 'Scheduled' },
  COMPLETED: { color: 'success', label: 'Completed' },
  CANCELLED: { color: 'error', label: 'Cancelled' },
  NOSHOW: { color: 'secondary', label: 'No Show' }
}

const AppointmentList = () => {
  // State
  const [tabValue, setTabValue] = useState('1') // '1' = Upcoming, '2' = History
  const [data, setData] = useState<PatientAppointmentDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { lang: locale } = useParams()

  // --- Fetch Data ---
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const requestType = tabValue === '1' ? 'UPCOMING' : 'HISTORY'
      
      const result = await patientAppointmentService.getPatientAppointments(requestType)
      setData(result)
      
    } catch (err: any) {
      console.error(err)
      setError('Failed to load appointments. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [tabValue])

  useEffect(() => { 
      fetchData() 
  }, [fetchData])

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  // --- Action: Cancel Appointment ---
  const handleCancel = async (id: number) => {
      if(!window.confirm('Are you sure you want to cancel this appointment?')) return;

      try {
          await patientAppointmentService.cancelAppointment(id);
          fetchData();
      } catch (error: any) {
          alert(error || "Failed to cancel");
      }
  }

  // --- Column Definitions ---
  const columns = useMemo(() => [
      columnHelper.accessor('appointmentId', {
        header: 'Reference',
        cell: ({ row }) => (
          // REPLACED Link with OpenDialogOnElementClick
          <OpenDialogOnElementClick
              element={Typography}
              elementProps={{
                  children: `#${row.original.appointmentId}`,
                  className: 'font-medium cursor-pointer text-primary hover:underline',
                  component: 'span' // Render as span to avoid p nesting issues if any
              }}
              dialog={AppointmentDetailsDialog}
              dialogProps={{
                  appointmentId: row.original.appointmentId // Pass ID to dialog
              }}
          />
        )
      }),
    columnHelper.accessor('scheduleDate', {
      header: 'Date & Time',
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <Typography className='font-medium' color='text.primary'>
            {row.original.scheduleDate}
          </Typography>
          <Typography variant='caption' color='text.disabled'>
            {row.original.startTime}
          </Typography>
        </div>
      )
    }),
    columnHelper.accessor('doctorName', {
      header: 'Doctor',
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <Typography color='text.primary' className='font-medium'>
             {row.original.doctorName}
          </Typography>
          <Typography variant='caption' color='text.disabled'>
             {row.original.specialization}
          </Typography>
        </div>
      )
    }),
    columnHelper.accessor('queuePosition', {
        header: 'Queue No',
        cell: ({ row }) => (
            <div className='flex justify-center'>
                 <span className='font-bold text-lg text-blue-600 bg-blue-50 px-2 rounded'>
                    {row.original.queuePosition}
                 </span>
            </div>
        )
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => {
        const status = appointmentStatusObj[row.original.status] || { color: 'secondary', label: row.original.status }
        return <Chip label={status.label} color={status.color} size='small' variant="tonal" />
      }
    }),
    columnHelper.accessor('appointmentId', {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <OptionMenu
          iconButtonProps={{ size: 'medium' }}
          iconClassName='text-textSecondary'
          options={[
            {
              text: 'View Details',
              icon: 'tabler-eye',
              href: getLocalizedUrl(`/patient/appointments/${row.original.appointmentId}`, locale as Locale)
            },
            ...(row.original.status !== 'CANCELLED' && row.original.status !== 'COMPLETED' ? [{
                text: 'Cancel',
                icon: 'tabler-circle-x', 
                menuItemProps: { 
                    onClick: () => handleCancel(row.original.appointmentId),
                    className: 'text-error hover:bg-red-50' 
                }
            }] : [])
          ]}
        />
      ),
      enableSorting: false
    })
  ], [locale, fetchData])

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <TabList onChange={handleTabChange} aria-label="Appointment Tabs">
            <Tab label="Upcoming" value="1" icon={<i className='tabler-calendar-time'/>} iconPosition="start" />
            <Tab label="History" value="2" icon={<i className='tabler-history'/>} iconPosition="start" />
          </TabList>
        </Box>

        {/* --- UPCOMING TAB --- */}
        <TabPanel value="1" className='p-0'>

            <SimpleCommonTable 
                data={data}
                columns={columns}
                isLoading={loading}
                error={error}
                searchPlaceholder="Search upcoming appointments..."
            />
        </TabPanel>

        {/* --- HISTORY TAB --- */}
        <TabPanel value="2" className='p-0'>
            <SimpleCommonTable 
                data={data}
                columns={columns}
                isLoading={loading}
                error={error}
                searchPlaceholder="Search past appointments..."
            />
        </TabPanel>

      </TabContext>
    </div>
  )
}

export default AppointmentList