// components/dialogs/report-dialog/admin-report/SessionSummaryReportDialog.tsx

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
import Alert from '@mui/material/Alert'
import LoadingButton from '@mui/lab/LoadingButton'

// Component Imports
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

// Service Import
import { reportService } from '@/services/admin.report.service'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DoctorWiseSessionSummaryReportDialog = ({ open, setOpen }: Props) => {

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0], // Today
    endDate: new Date().toISOString().split('T')[0],   // Today
    doctorId: '' // Default empty
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setOpen(false)
    setError(null)
    // Optional: Reset form on close
    // setFormData({ ... }) 
  }

  const handleDownload = async () => {
    // 1. Basic Validation
    if (!formData.startDate || !formData.endDate) {
        setError("Please select both Start and End dates.");
        return;
    }

    setLoading(true);
    setError(null);

    // 2. Call Service
    const success = await reportService.downloadDoctorSessionReport(
        formData.startDate,
        formData.endDate,
        formData.doctorId
    );

    setLoading(false);

    if (success) {
        handleClose();
    } else {
        setError("Failed to generate report. Please check your inputs or try again.");
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
        Doctor Session Financials
        <Typography component='span' className='block text-center text-sm font-normal mt-1'>
          Summary of doctor earnings and session details.
        </Typography>
      </DialogTitle>

      <DialogContent className='overflow-visible p-6'>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        <Grid container spacing={4}>
          {/* Date Pickers */}
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

          {/* Doctor ID Field (Optional) */}
          {/* <Grid size={{ xs: 12 }}>
            <CustomTextField 
              fullWidth 
              label='Doctor ID (Optional)' 
              placeholder='Enter Doctor ID (e.g. 101) or leave empty for All'
              value={formData.doctorId}
              onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
              helperText="Leave blank to generate a summary for all doctors."
            />
          </Grid> */}
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
          {loading ? 'Generating...' : 'Download Report'}
        </LoadingButton>
        <Button variant='tonal' color='secondary' onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DoctorWiseSessionSummaryReportDialog