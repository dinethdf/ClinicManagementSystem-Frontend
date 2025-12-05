'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Redux Imports
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '@/redux-store'
import { fetchRevenueData, setSelectedYear } from '@/redux-store/slices/adminDashboardSlice'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'), { 
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height={320} />
})

const RevenueReport = () => {
  // -- Redux Hooks --
  const dispatch = useDispatch<AppDispatch>()
  
  // Get data directly from the Store
  const { revenueData: rawData, selectedYear, revenueStatus } = useSelector((state: RootState) => state.adminDashboard)
  
  const loading = revenueStatus === 'loading'

  // -- Local UI State --
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // -- Hooks --
  const theme = useTheme()

  // -- Helpers --
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    
    return [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]
  }

  // -- Data Transformation (Memoized) --
  const { chartData, totalRevenue } = useMemo(() => {
    const processedData = Array(12).fill(0)
    let total = 0

    if (rawData && rawData.length > 0) {
      rawData.forEach(item => {
        
        const index = item.monthIndex - 1 
        
        if (index >= 0 && index < 12) {
          processedData[index] = item.totalRevenue
          total += item.totalRevenue
        }
      })
    }

    return { chartData: processedData, totalRevenue: total }
  }, [rawData])


  useEffect(() => {

    if (!rawData || rawData.length === 0) {
      dispatch(fetchRevenueData({ year: selectedYear }))
    }

  }, [dispatch]) 

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (year?: number) => {
   
    if (year && typeof year === 'number') {
    
      dispatch(setSelectedYear(year))
      
      dispatch(fetchRevenueData({ year }))
    }
    
    setAnchorEl(null)
  }

  // -- Chart Config --
  const disabledText = 'var(--mui-palette-text-disabled)'

  const barSeries = [
    { name: 'Revenue', data: chartData }, 
  ]

  const barOptions: ApexOptions = {
    chart: {
      stacked: false,
      parentHeightOffset: 0,
      toolbar: { show: true }
    },
    tooltip: { 
      enabled: true,
      shared: false, 
      intersect: false
    },
    dataLabels: { enabled: false },
    colors: ['var(--mui-palette-primary-main)'],
    legend: { show: false },
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      yaxis: {
        lines: { show: true }
      },
      padding: {
        left: -6,
        right: -11,
        bottom: -11
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: disabledText,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (value) => `Rs. ${value}`,
        offsetX: -14,
        style: {
          colors: disabledText,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '40%',
      }
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      <Grid container>
        {/* Left Side: Chart */}
        <Grid size={{ xs: 12, sm: 8 }} className='border-r'>
          <CardHeader title='Revenue Report' subheader={`Analysis for ${selectedYear}`} />
          <CardContent>
            {loading ? (
              <Skeleton 
                variant="rectangular" 
                height={320} 
                width="100%" 
                sx={{ borderRadius: 1 }}
              />
            ) : (
              <AppReactApexCharts 
                type='bar' 
                height={320} 
                width='100%' 
                series={barSeries} 
                options={barOptions} 
              />
            )}
          </CardContent>
        </Grid>

        {/* Right Side: Controls & Summary */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <CardContent className='flex flex-col items-center justify-center min-bs-full gap-8'>
            
            {/* Year Selector */}
            <Button
              size='small'
              variant='tonal'
              onClick={handleClick}
              endIcon={<i className='tabler-chevron-down text-xl' />}
              disabled={loading}
            >
              {selectedYear}
            </Button>
            <Menu
              keepMounted
              anchorEl={anchorEl}
              onClose={() => handleClose()}
              open={Boolean(anchorEl)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {generateYearOptions().map((year: number) => (
                <MenuItem key={year} onClick={() => handleClose(year)} selected={year === selectedYear}>
                  {year}
                </MenuItem>
              ))}
            </Menu>

            {/* Total Summary */}
            <div className='flex flex-col items-center'>
              {loading ? (
                <>
                  <Skeleton variant="text" width={120} height={60} />
                  <Skeleton variant="text" width={80} height={20} />
                </>
              ) : (
                <>
                  <Typography variant='h3'>
                    Rs. {(totalRevenue/1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}K
                  </Typography>
                  <Typography color="text.secondary">
                    Total Revenue
                  </Typography>
                </>
              )}
            </div>
            
            <Button variant='contained'>Download Report</Button>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default RevenueReport
