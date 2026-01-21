'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'next/navigation'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'

// TanStack Table Imports
import { createColumnHelper } from '@tanstack/react-table'

// Component Imports
import SimpleCommonTable from '@/components/common-components/table/simpleDataTable/SimpleCommonTable'
import OptionMenu from '@core/components/option-menu'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import AppointmentDetailsDialog from './AppointmentDetailsDialog'
import DoctorSheduleSelect from '@/components/dialogs/doctor-shedule-select' // <--- The Schedule Picker

// Service & Types
import { patientAppointmentService } from '@/services/patient-portal/patient.appointments.service'
import type { PatientAppointmentDTO } from '@/types/patient-portal/patient.appointments.types'
import type { DoctorScheduleDTO } from '@/types/doctor.types' // Ensure you have this type

// Utils
import { getLocalizedUrl } from '@/utils/i18n'
import { toast } from 'react-toastify'
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
  // --- State ---
  const [tabValue, setTabValue] = useState('1') // '1' = Upcoming, '2' = History
  const [data, setData] = useState<PatientAppointmentDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Dialog State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)

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

  // --- Action: Create Appointment (Book) ---
  const handleScheduleSelect = async (schedule: DoctorScheduleDTO | null) => {
    if (!schedule) return

    try {
        // Call the service (no patientId needed, backend handles user context)
        const result = await patientAppointmentService.createAppointment(
            schedule.id || 0,
            "Quick Appointment created from Portal"
        )

        if (result.success) {
            // 1. Close Modal
            setIsScheduleOpen(false) 
            
            // 2. Show Success
            toast.success(`Appointment #${result.data} booked successfully!`)
            
            // 3. Refresh List to show the new booking
            fetchData()

        } else {
            console.error('Booking failed:', result.error)
            toast.error(result.error?.message || 'Failed to book appointment')
        }

    } catch (error) {
        console.error("System error", error)
        toast.error("An unexpected error occurred.")
    }
  }

  // --- Action: Cancel Appointment ---
  const handleCancel = async (id: number) => {
      if(!window.confirm('Are you sure you want to cancel this appointment?')) return;

      try {
          await patientAppointmentService.cancelAppointment(id);
          toast.success("Appointment cancelled.")
          fetchData(); // Refresh list
      } catch (error: any) {
          toast.error(error || "Failed to cancel");
      }
  }

  // --- Column Definitions ---
  const columns = useMemo(() => [
      columnHelper.accessor('appointmentId', {
        header: 'Reference',
        cell: ({ row }) => (
          <OpenDialogOnElementClick
              element={Typography}
              elementProps={{
                  children: `#${row.original.appointmentId}`,
                  className: 'font-medium cursor-pointer text-primary hover:underline',
                  component: 'span'
              }}
              dialog={AppointmentDetailsDialog}
              dialogProps={{
                  appointmentId: row.original.appointmentId
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
                    onClick: () => handleCancel(row.original.id), // Ensure you use DB ID here if needed
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
        
        {/* HEADER: Tabs + New Button */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TabList onChange={handleTabChange} aria-label="Appointment Tabs">
            <Tab label="My Appointments" value="1" icon={<i className='tabler-calendar-time'/>} iconPosition="start" />
           
          </TabList>

          <Button 
            variant='contained' 
            color='primary' 
            startIcon={<i className='tabler-plus' />}
            onClick={() => setIsScheduleOpen(true)}
          >
            New Appointment
          </Button>
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

      </TabContext>

      {/* --- SCHEDULE SELECTION DIALOG --- */}
      <DoctorSheduleSelect 
        open={isScheduleOpen}
        setOpen={setIsScheduleOpen}
        onSelectShedule={handleScheduleSelect}
      />
    </div>
  )
}

export default AppointmentList