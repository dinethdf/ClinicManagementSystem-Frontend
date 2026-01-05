'use client'

import { useState, useEffect } from 'react'

// MUI
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import TablePagination from '@mui/material/TablePagination'

// Components
import AppointmentCard from './AppointmentCard'
import LiveQueueCard from './LiveQueueCard' 

// Service & Types
import { getPatientAppointments } from '@/services/patient-portal/patient.appointments.service'
import type { PatientAppointmentDTO } from '@/types/patient-portal/patient.appointments.types'

const AppointmentList = () => {
  const [tabValue, setTabValue] = useState('1')
  
  // Data State
  const [upcoming, setUpcoming] = useState<PatientAppointmentDTO[]>([])
  const [history, setHistory] = useState<PatientAppointmentDTO[]>([])
  const [loading, setLoading] = useState(true)
  
  // Pagination State (Simple implementation)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  // Fetch Data Function
  const fetchData = async () => {
    setLoading(true)
    try {
      const type = tabValue === '1' ? 'UPCOMING' : 'HISTORY';
      const res = await getPatientAppointments(type, page);
      
      if(type === 'UPCOMING') {
          setUpcoming(res.data.content);
      } else {
          setHistory(res.data.content);
      }
      setTotalCount(res.data.totalElements);
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Refetch when Tab or Page changes
  useEffect(() => { 
      fetchData() 
  }, [tabValue, page])

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
    setPage(0) // Reset page on tab switch
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  // Helper to check if an appointment is "Today" for the Live Queue
  const isToday = (dateString: string) => {
      const d = new Date(dateString);
      const today = new Date();
      return d.getDate() === today.getDate() && 
             d.getMonth() === today.getMonth() && 
             d.getFullYear() === today.getFullYear();
  }

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <TabList onChange={handleTabChange} aria-label="Appointment Tabs" variant="fullWidth">
            <Tab label="Upcoming" value="1" icon={<i className='tabler-calendar-time'/>} iconPosition="start" />
            <Tab label="History" value="2" icon={<i className='tabler-history'/>} iconPosition="start" />
          </TabList>
        </Box>

        {loading ? (
           <div className='flex flex-col items-center justify-center p-10 gap-2'>
               <CircularProgress />
               <span className='text-gray-500 text-sm'>Loading appointments...</span>
           </div>
        ) : (
           <>
             {/* --- UPCOMING TAB --- */}
             <TabPanel value="1" className='p-0'>
                {upcoming.length === 0 ? (
                    <div className='text-center p-10 opacity-50 bg-gray-50 rounded-lg border-2 border-dashed'>
                        <i className='tabler-calendar-off text-4xl mb-2'/>
                        <p>No upcoming appointments.</p>
                    </div>
                ) : (
                    <div>
                        {/* STORY 2.4: Show Live Queue only for TODAY's appointments */}
                        {upcoming.map(appt => {
                            if (isToday(appt.date) && appt.status === 'SCHEDULED') {
                                return <LiveQueueCard key={`live-${appt.id}`} appointmentId={appt.id} />
                            }
                            return null;
                        })}

                        {upcoming.map(appt => (
                            <AppointmentCard key={appt.id} appt={appt} onRefresh={fetchData} />
                        ))}
                    </div>
                )}
             </TabPanel>

             {/* --- HISTORY TAB --- */}
             <TabPanel value="2" className='p-0'>
                {history.length === 0 ? (
                    <div className='text-center p-10 opacity-50 bg-gray-50 rounded-lg border-2 border-dashed'>
                        <i className='tabler-history-off text-4xl mb-2'/>
                        <p>No past appointments found.</p>
                    </div>
                ) : (
                    history.map(appt => (
                        <AppointmentCard key={appt.id} appt={appt} isHistory onRefresh={fetchData} />
                    ))
                )}
             </TabPanel>
             
             {/* Pagination Control */}
             <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={() => {}} // Fixed size for now based on service
                rowsPerPageOptions={[5]}
             />
           </>
        )}
      </TabContext>
    </div>
  )
}

export default AppointmentList