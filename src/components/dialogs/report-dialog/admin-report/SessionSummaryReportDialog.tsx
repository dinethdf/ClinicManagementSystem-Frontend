'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'

// Component Imports
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

// Services & Context
import { reportService } from '@/services/admin.report.service'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const SessionSummaryReportDialog = ({ open, setOpen }: Props) => {


  // Form State
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  // UI State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setOpen(false)
    setError(null)
  }

  const handleDownload = async () => {
    if (!formData.startDate || !formData.endDate) {
      setError("Please select a valid date range.")
      return
    }

    setLoading(true)
    setError(null)

    const success = await reportService.downloadSessionSummaryReport(
      formData.startDate,
      formData.endDate
    )

    setLoading(false)

    if (success) {
      handleClose()
    } else {
      setError("Failed to generate report. Please try again.")
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth='sm' 
      fullWidth 
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle variant='h4' className='text-center p-6'>
        Doctor Session Financial Summary
        <Typography component='span' className='block text-center text-sm font-normal mt-1'>
          Summary of doctor earnings and session revenues.
        </Typography>
      </DialogTitle>

      <DialogContent className='overflow-visible p-6'>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField 
              fullWidth 
              type='date' 
              label='Start Date' 
              InputLabelProps={{ shrink: true }}
              value={formData.startDate} 
              onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField 
              fullWidth 
              type='date' 
              label='End Date' 
              InputLabelProps={{ shrink: true }}
              value={formData.endDate} 
              onChange={e => setFormData({ ...formData, endDate: e.target.value })} 
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions className='justify-center p-6'>
        <LoadingButton 
          loading={loading}
          loadingPosition="start"
          variant='contained' 
          onClick={handleDownload} 
          startIcon={<i className='tabler-download' />}
        >
          {loading ? 'Generating...' : 'Download PDF'}
        </LoadingButton>
        <Button variant='tonal' color='secondary' onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SessionSummaryReportDialog