import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic' 

// MUI Imports
import Grid from '@mui/material/Grid' // Using your specified import

// Component Imports
import DashboardHeader from '@/views/clinic-app/dashboard/DashboardHeader'
import TodaySessionsCard from '@/views/clinic-app/dashboard/TodaySessionsCard'


import { verifyToken } from '@/libs/verifyToken'


const ShedulesByDoctorListTable = dynamic(() => import('@/views/clinic-app/dashboard/ShedulesByDoctorListTable'), {
  loading: () => <p>Loading Schedule...</p>
})

const DashboardClinics = async () => {
  const { valid, payload } = await verifyToken()

  if (!valid || !payload) {
    redirect('/login')
  }

  const userRole = payload.role || 'GUEST'
  const doctorId = payload.userDetailsId || 0 

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <DashboardHeader user={payload} />
      </Grid>

      {/* --- DOCTOR VIEW --- */}
      {(userRole === 'DOCTOR') && (
        <>
            {/* 1. TODAY'S ACTION AREA */}
            <Grid size={{ xs: 12 }}>
                <TodaySessionsCard doctorId={doctorId} />
            </Grid>

            {/* 2. UPCOMING LIST */}
            <Grid size={{ xs: 12, lg: 12 }}>
               <ShedulesByDoctorListTable doctorId={doctorId} />
            </Grid>
        </>
      )}
    </Grid>
  )
}

export default DashboardClinics