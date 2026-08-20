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
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import LoadingButton from '@mui/lab/LoadingButton' // Import LoadingButton

// Component Imports
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

// Service Import
import { reportService } from '@/services/reports/admin.report.service'
import { useAuth } from '@/contexts/ClientAuthContextProvider' // Assuming you have this to get clinicId

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const RevenueReportDialog = ({ open, setOpen }: Props) => {


  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0], // Default to Today
    endDate: new Date().toISOString().split('T')[0],
    serviceType: 'ALL'
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
        setError("Please select both Start and End dates.");
        
return;
    }

    setLoading(true);
    setError(null);

    const res : any = await reportService.downloadRevenueReport(
        formData.startDate,
        formData.endDate,
        formData.serviceType,
        'en'
    );

    setLoading(false);

    console.log(res)

    if (res) {
        handleClose(); // Close dialog on success
    } else {
        setError("Failed to generate report. Please try again.");
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
        Revenue & Earnings Report
        <Typography component='span' className='block text-center text-sm font-normal mt-1'>
          Download financial breakdown (PDF).
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
          <Grid size={{ xs: 12 }}>
            <CustomTextField 
              select 
              fullWidth 
              label='Service Type' 
              value={formData.serviceType}
              onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
            >
              <MenuItem value='ALL'>All Services</MenuItem>
              <MenuItem value='CONSULTATION'>Consultations Only</MenuItem>
              <MenuItem value='LAB'>Lab Tests Only</MenuItem>
              {/* Add other types that match your backend ENUM or String checks */}
            </CustomTextField>
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

export default RevenueReportDialog