'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'

// Component Imports
import DialogCloseButton from '@components/dialogs/DialogCloseButton'

// Service Import
import { appointmentService } from '@/services/reports/analysis.admin.service'
import type { 
  ScheduleFillRateDTO, 
  UtilizationHeatmapDTO, 
  WaitTimeAnalyticsDTO, 
  DoctorPunctualityDTO 
} from '@/types/analysis.types'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const AdvancedAnalyticsDialog = ({ open, setOpen }: Props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [fillRate, setFillRate] = useState<ScheduleFillRateDTO[]>([])
  const [heatmap, setHeatmap] = useState<UtilizationHeatmapDTO[]>([])
  const [waitTime, setWaitTime] = useState<WaitTimeAnalyticsDTO[]>([])
  const [punctuality, setPunctuality] = useState<DoctorPunctualityDTO[]>([])

  useEffect(() => {
    if (open) {
      fetchAllData()
    }
  }, [open])

  const fetchAllData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [fillRes, heatRes, waitRes, puncRes] = await Promise.all([
        appointmentService.getScheduleFillRate(),
        appointmentService.getUtilizationHeatmap(),
        appointmentService.getWaitTimeAnalytics(),
        appointmentService.getDoctorPunctualityStats()
      ])

      setFillRate(fillRes || [])
      setHeatmap(heatRes || [])
      setWaitTime(waitRes || [])
      setPunctuality(puncRes || [])
    } catch (err) {
      setError("Failed to load some analytics data.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth>
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle variant='h4' className='text-center p-6'>
        Operational Analytics
        <Typography component='span' className='block text-center text-sm font-normal mt-1'>
          Insights into clinic efficiency and doctor punctuality.
        </Typography>
      </DialogTitle>

      <DialogContent className='p-6'>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        {loading ? (
          <Box className='flex justify-center my-6'>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={6}>
            
            {/* Schedule Fill Rate */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" className="mb-4">Schedule Fill Rate</Typography>
                  {fillRate.length === 0 ? <Typography variant="body2">No data available.</Typography> : null}
                  {fillRate.map(item => (
                    <Box key={item.scheduleId} className="mb-4">
                      <Box className="flex justify-between mb-1">
                        <Typography variant="body2" className="font-medium">{item.doctorName}</Typography>
                        <Typography variant="body2">{item.currentPatients} / {item.maxPatients} ({item.fillPercentage}%)</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={item.fillPercentage} 
                        color={item.fillPercentage > 80 ? 'success' : item.fillPercentage > 50 ? 'warning' : 'error'}
                        className="h-2 rounded"
                      />
                      <Typography variant="caption" color="text.secondary">{item.scheduleDate}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Wait Time Analytics */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" className="mb-4">Avg Wait Time by Day</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell align="right">Avg Wait (Mins)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {waitTime.map(row => (
                        <TableRow key={row.dayName}>
                          <TableCell>{row.dayName}</TableCell>
                          <TableCell align="right" className='font-medium text-warning'>
                            {row.avgWaitTimeMinutes} mins
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>

            {/* Doctor Punctuality */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" className="mb-4">Doctor Punctuality</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Doctor</TableCell>
                        <TableCell align="center">Avg Delay</TableCell>
                        <TableCell align="right">Total Schedules</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {punctuality.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{row.doctorName}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={`${row.averageDelayMinutes} mins`} 
                              color={row.averageDelayMinutes > 15 ? 'error' : row.averageDelayMinutes > 5 ? 'warning' : 'success'} 
                              size="small"
                              variant="tonal"
                            />
                          </TableCell>
                          <TableCell align="right">{row.totalSchedules}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>

            {/* Utilization Heatmap (Simplified Table View) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" className="mb-4">Peak Utilization Hours</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell>Hour</TableCell>
                        <TableCell align="right">Appointments</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {heatmap.slice(0, 5).map((row, idx) => ( // Top 5 peaks for brevity
                        <TableRow key={idx}>
                          <TableCell>{row.dayOfWeek}</TableCell>
                          <TableCell>{row.hourOfDay}:00</TableCell>
                          <TableCell align="right" className="font-bold">{row.appointmentCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AdvancedAnalyticsDialog
