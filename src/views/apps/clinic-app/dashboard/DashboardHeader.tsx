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

// Actions Imports
import { refreshDashboard } from '@/libs/redux-store/slices/adminDashboardSlice'
import { refreshDoctorDashboard } from '@/libs/redux-store/slices/doctorDashboardSlice' // Import Doctor Action

const DashboardHeader = (props: any) => {
  // Destructure user from props
  const { user } = props
  
  const dispatch = useDispatch<AppDispatch>()

  // -- 1. Role Detection --
  const isDoctor = user?.role === 'DOCTOR'

  // -- 2. Dynamic Selector --
  // We choose the correct Redux slice based on the user's role
  const { lastUpdated, status } = useSelector((state: RootState) => {
    if (isDoctor) {
      return state.doctorDashboard
    }
    // Default to Admin
    return state.adminDashboard
  })

  const isLoading = status === 'loading'

  // -- 3. Dynamic Action --
  const triggerRefresh = () => {
    if (isDoctor) {
      dispatch(refreshDoctorDashboard())
    } else {
      dispatch(refreshDashboard())
    }
  }

  // Auto-fetch on mount if data is missing
  useEffect(() => {
    if (!lastUpdated) {
      triggerRefresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, lastUpdated, isDoctor])

  const handleRefresh = () => {
    triggerRefresh()
  }

  // --- HELPER FUNCTION: Format the Role ---
  const getDisplayRole = (role: string | undefined) => {
    if (!role) return 'Overview' 

    if (role === 'ADMIN') {
      return 'Administrator'
    }

    // Capitalize first letter -> "Doctor"
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }

  const roleTitle = getDisplayRole(user?.role)

  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full'>
      <div>
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
          {isLoading ? 'Refreshing' : 'Refresh'}
        </Button>
        <Typography variant='caption' className='hidden sm:block text-textDisabled'>
          Last updated: {lastUpdated ? lastUpdated : 'Not synced'}
        </Typography>
      </div>
    </div>
  )
}

export default DashboardHeader