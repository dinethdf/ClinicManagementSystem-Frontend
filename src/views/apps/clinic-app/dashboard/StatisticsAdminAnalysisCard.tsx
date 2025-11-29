'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Skeleton from '@mui/material/Skeleton'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// Redux Imports
import { useSelector } from 'react-redux'
import type { RootState } from '@/libs/redux-store'

const StatisticsAdminAnalysisCard = () => {
  // -- Redux State --
  // Subscribe to the summaryStats and loading status
  const { summaryStats, status } = useSelector((state: RootState) => state.adminDashboard)
  
  // Determine loading state
  const isLoading = status === 'loading' || !summaryStats

  // -- Data Mapping --
  const getCardData = (): UserDataType[] => {
    if (!summaryStats) return []

    return [
      {
        title: 'Today Revenue',
        stats: `$${summaryStats.todayRevenue.toLocaleString()}`,
        avatarIcon: 'tabler-currency-dollar',
        avatarColor: 'primary',
        subtitle: 'Daily Earnings',
        trendNumber: '', 
        trend: ""
      },
      {
        title: 'Appointments',
        stats: summaryStats.todayAppointments.toString(),
        avatarIcon: 'tabler-calendar-stats',
        avatarColor: 'info',
        subtitle: 'Scheduled Today',
        trendNumber: '',
        trend: ""
      },
      {
        title: 'Active Patients',
        stats: summaryStats.activePatients.toString(),
        avatarIcon: 'tabler-user-check',
        avatarColor: 'success',
        subtitle: 'Total Active',
        trendNumber: '',
        trend: ""
      },
      {
        title: 'Pending Payments',
        stats: summaryStats.pendingPayments.toString(),
        avatarIcon: 'tabler-alert-circle',
        avatarColor: 'warning',
        subtitle: 'Unpaid Invoices',
        trendNumber: '',
        trend: ""
      }
    ]
  }

  const cardList = getCardData()

  return (
    <Grid container spacing={6}>
      {isLoading ? (
        // -- LOADING STATE --
        // Render 4 skeletons that match the card shape
        Array.from(new Array(4)).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Skeleton 
              variant="rectangular" 
              height={100} 
              sx={{ borderRadius: 1 }} 
            />
          </Grid>
        ))
      ) : (
        // -- REAL REDUX DATA --
        cardList.map((item, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <HorizontalWithSubtitle {...item} />
          </Grid>
        ))
      )}
    </Grid>
  )
}

export default StatisticsAdminAnalysisCard