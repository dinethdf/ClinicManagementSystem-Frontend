'use client'

import { useState } from 'react'

// MUI
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

// Components
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const RevenueReportDialog = ({ open, setOpen }: Props) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    serviceType: 'ALL'
  })

  const handleClose = () => setOpen(false)

  const handleDownload = () => {
    console.log("Downloading Revenue Report:", formData)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={handleClose} disableRipple><i className='tabler-x' /></DialogCloseButton>
      
      <DialogTitle variant='h4' className='text-center p-6'>
        Revenue & Earnings Report
        <Typography component='span' className='block text-center text-sm font-normal mt-1'>
          Financial breakdown by doctor, service type, and period.
        </Typography>
      </DialogTitle>

      <DialogContent className='overflow-visible p-6'>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField fullWidth type='date' label='Start Date' InputLabelProps={{ shrink: true }}
              value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField fullWidth type='date' label='End Date' InputLabelProps={{ shrink: true }}
              value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField select fullWidth label='Service Type' value={formData.serviceType}
              onChange={e => setFormData({ ...formData, serviceType: e.target.value })}>
              <MenuItem value='ALL'>All Services</MenuItem>
              <MenuItem value='CONSULTATION'>Consultations</MenuItem>
              <MenuItem value='LAB'>Lab Tests</MenuItem>
              <MenuItem value='PACKAGES'>Packages</MenuItem>
            </CustomTextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions className='justify-center p-6'>
        <Button variant='contained' onClick={handleDownload} startIcon={<i className='tabler-download' />}>Download</Button>
        <Button variant='tonal' color='secondary' onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default RevenueReportDialog