'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Redux Imports
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '@/redux-store'
import { fetchSpecializationData } from '@/redux-store/slices/adminDashboardSlice'
import type { SpecializationStatDTO } from '@/types/analysis.types'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'), { ssr: false })

const donutColors = {
  series1: '#00cfe8', // Teal (Green-Blue)
  series2: '#007bff', // Emerald Green
  series3: '#00d4bd', // Cyan (Light Blue)
  series4: '#0f3c66', // Primary Blue
  series5: '#28c76f', // Deep Navy Blue
  series6: '#a6e4d8'  // Soft Mint (for smaller slices)
}

const SpecializationSummaryChart = () => {

  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()

  const { specializationData: allData, specializationStatus } = useSelector((state: RootState) => state.adminDashboard)
  
  const loading = specializationStatus === 'loading'

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [filterType, setFilterType] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    if (!allData) {
      dispatch(fetchSpecializationData())
    }
  }, [dispatch, allData])

  const { series, labels } = useMemo(() => {
    if (!allData) return { series: [], labels: [] }

    const currentList: SpecializationStatDTO[] = allData[filterType] || []

    return {
      series: currentList.map(item => item.appointmentCount),
      labels: currentList.map(item => item.specialization)
    }
  }, [allData, filterType])

  const handleClick = (event: MouseEvent<HTMLElement>) => {
   
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (type?: 'week' | 'month' | 'year') => {
    if (type) {
      setFilterType(type)
    }
    
    setAnchorEl(null)
  }

  const textSecondary = 'var(--mui-palette-text-secondary)'

  const options: ApexOptions = {
    stroke: { width: 0 },
    labels: labels,
    colors: [
      donutColors.series1,
      donutColors.series2,
      donutColors.series3,
      donutColors.series4,
      donutColors.series5,
      donutColors.series6
    ],
    dataLabels: {
      enabled: true,
      formatter: (val: string) => `${parseInt(val, 10)}%`
    },
    legend: {
      fontSize: '13px',
      position: 'bottom',
      markers: {
        offsetX: theme.direction === 'rtl' ? 7 : -4
      },
      labels: { colors: textSecondary },
      itemMargin: {
        horizontal: 9
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              fontSize: '1.2rem'
            },
            value: {
              fontSize: '1.2rem',
              color: textSecondary,
              formatter: (val: string) => `${parseInt(val, 10)}`
            },
            total: {
              show: true,
              fontSize: '1rem',
              label: filterType.charAt(0).toUpperCase() + filterType.slice(1),
              color: 'var(--mui-palette-text-primary)',
              formatter: (w: any) => {
                
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
                
                return `${total}`
              }
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: { height: 380 },
          legend: { position: 'bottom' }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: { height: 320 },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: { fontSize: '1rem' },
                  value: { fontSize: '1rem' },
                  total: { fontSize: '1rem' }
                }
              }
            }
          }
        }
      }
    ]
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title='Specialization Report'
        subheader={`Appointments by ${filterType}`}
        action={
          <>
            <IconButton aria-haspopup='true' onClick={handleClick} aria-label='settings'>
              <i className='tabler-dots-vertical' />
            </IconButton>
            <Menu
              keepMounted
              anchorEl={anchorEl}
              onClose={() => handleClose()}
              open={Boolean(anchorEl)}
            >
              <MenuItem onClick={() => handleClose('week')} selected={filterType === 'week'}>
                Week
              </MenuItem>
              <MenuItem onClick={() => handleClose('month')} selected={filterType === 'month'}>
                Month
              </MenuItem>
              <MenuItem onClick={() => handleClose('year')} selected={filterType === 'year'}>
                Year
              </MenuItem>
            </Menu>
          </>
        }
      />
      <CardContent>
        {loading ? (
          <div className='flex items-center justify-center h-[400px]'>
             <Skeleton variant="circular" width={250} height={250} />
          </div>
        ) : series.length > 0 ? (
          <AppReactApexCharts 
            type='donut' 
            width='100%' 
            height={320}
            options={options} 
            series={series} 
          />
        ) : (
          <div className='flex items-center justify-center h-[400px] text-gray-500'>
             No appointments found for this {filterType}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SpecializationSummaryChart
