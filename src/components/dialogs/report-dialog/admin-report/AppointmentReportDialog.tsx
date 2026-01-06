'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const AppointmentReportDialog = ({ open, setOpen }: Props) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    doctorId: ''
  })

  const handleClose = () => setOpen(false)

  const handleDownload = () => {
    console.log("Downloading Appointment Report:", formData)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={handleClose} disableRipple><i className='tabler-x' /></DialogCloseButton>
      
      <DialogTitle variant='h4' className='text-center p-6'>
        Doctor Appointment Load
        <Typography component='span' className='block text-center text-sm font-normal mt-1'>
           Track patient load, cancellations, and visit types per doctor.
        </Typography>
      </DialogTitle>

      <DialogContent className='overflow-visible p-6'>
        <Grid container spacing={4}>
           <Grid size={{ xs: 12 }}>
            <CustomTextField select fullWidth label='Select Doctor' value={formData.doctorId}
              onChange={e => setFormData({ ...formData, doctorId: e.target.value })}>
              <MenuItem value=''>All Doctors</MenuItem>
              <MenuItem value='101'>Dr. Sarah Perera</MenuItem>
              <MenuItem value='102'>Dr. Kamal Gunawardena</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField fullWidth type='date' label='From' InputLabelProps={{ shrink: true }}
              value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField fullWidth type='date' label='To' InputLabelProps={{ shrink: true }}
              value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
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

export default AppointmentReportDialog