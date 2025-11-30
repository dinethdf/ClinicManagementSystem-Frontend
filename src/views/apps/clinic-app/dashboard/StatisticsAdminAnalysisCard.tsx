'use client'

import Grid from '@mui/material/Grid2'
import Skeleton from '@mui/material/Skeleton'

import { useSelector } from 'react-redux'

import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'


import type { RootState } from '@/libs/redux-store'

const StatisticsAdminAnalysisCard = () => {

const { summaryStats, summaryStatus } = useSelector((state: RootState) => state.adminDashboard)
  
const isLoading = summaryStatus === 'loading' || !summaryStats

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