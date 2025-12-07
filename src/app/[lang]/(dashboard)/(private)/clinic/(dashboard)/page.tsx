import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic' // 👈 Import this


import Grid from '@mui/material/Grid'

import DashboardHeader from '@/views/clinic-app/dashboard/DashboardHeader'


import { verifyToken } from '@/libs/verifyToken'


const StatisticsAdminAnalysisCard = dynamic(() => import('@/views/clinic-app/dashboard/StatisticsAdminAnalysisCard'), {
  loading: () => <p>Loading Stats...</p>
})

const RevenueReport = dynamic(() => import('@/views/clinic-app/dashboard/RevenueReport'))

const SpecializationSummaryChart = dynamic(() => import('@/views/clinic-app/dashboard/SpecializationSummaryChart'))

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
      <Grid size={{ xs: 12 }}>
        <DashboardHeader user={payload} />
      </Grid>

      {/* --- ADMIN VIEW --- */}
      {userRole === 'ADMIN' && (
        <>
          <Grid size={{ xs: 12, md: 12 }}>
            <StatisticsAdminAnalysisCard />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <RevenueReport />
          </Grid>       
          <Grid size={{ xs: 12, md: 4 }}>
            <SpecializationSummaryChart />
          </Grid>
        </>
      )}

      {/* --- DOCTOR VIEW (Also visible to Admin) --- */}
      {(userRole === 'DOCTOR') && (
        <Grid size={{ xs: 12, lg: 12 }}>
           {/* The code for this table is ONLY downloaded if this block renders */}
          <ShedulesByDoctorListTable doctorId={doctorId} />
        </Grid>
      )}

      {/* --- PATIENT VIEW --- */}
      {userRole === 'PATIENT' && (
         <Grid size={{ xs: 12 }}>
             {/* You can create a dynamic component for patients here too */}
             <div className="p-4 bg-white rounded shadow">
                <h3>Patient Dashboard Coming Soon</h3>
             </div>
         </Grid>
      )}
    </Grid>
  )
}

export default DashboardClinics