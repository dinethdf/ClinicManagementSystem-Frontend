'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

// Redux Imports
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '@/libs/redux-store'
import { refreshDashboard } from '@/libs/redux-store/slices/adminDashboardSlice'

const DashboardHeader = (props: any) => {
  // Destructure user from props based on your log
  const { user } = props

  const dispatch = useDispatch<AppDispatch>()
  const { lastUpdated, status } = useSelector((state: RootState) => state.adminDashboard)

  const isLoading = status === 'loading'

  useEffect(() => {
    if (!lastUpdated) {
      dispatch(refreshDashboard())
    }
  }, [dispatch, lastUpdated])

  const handleRefresh = () => {
    dispatch(refreshDashboard())
  }

  // --- HELPER FUNCTION: Format the Role ---
  const getDisplayRole = (role: string | undefined) => {
    if (!role) return 'Overview' // Default if no role found

    // If Admin, return "Administrator"
    if (role === 'ADMIN') {
      return 'Administrator'
    }

    // For others (e.g., "DOCTOR"), capitalize first letter only -> "Doctor"
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }

  const roleTitle = getDisplayRole(user?.role)

  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full'>
      <div>
        {/* Updated Title to use the dynamic Role Name */}
        <Typography variant='h4'>{roleTitle} Dashboard</Typography>
        <Typography variant='body2' className='text-textSecondary'>
          Monitor your clinic performance
        </Typography>
      </div>
      <div className='flex items-center gap-4 pr-4'>
        <Button
          variant='outlined'
          size='small'
          onClick={handleRefresh}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color='inherit' /> : <i className='tabler-refresh' />}
        >
          {isLoading ? '' : 'Refresh '}
        </Button>
        <Typography variant='caption' className='hidden sm:block text-textDisabled'>
          Last updated: {lastUpdated ? lastUpdated : 'error'}
        </Typography>
      </div>
    </div>
  )
}

export default DashboardHeader