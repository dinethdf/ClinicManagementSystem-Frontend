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

const PatientHealthReportDialog = ({ open, setOpen }: Props) => {
  const [formData, setFormData] = useState({
    patientId: '',
    reportContent: 'ALL',
    format: 'PDF'
  })

  const handleClose = () => setOpen(false)

  const handleDownload = () => {
    console.log("Downloading Health Report:", formData)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={handleClose} disableRipple><i className='tabler-x' /></DialogCloseButton>
      
      <DialogTitle variant='h4' className='text-center p-6'>
        Patient Health Progress
        <Typography component='span' className='block text-center text-sm font-normal mt-1'>
          Export Electronic Health Records, Lab Results, and Visits.
        </Typography>
      </DialogTitle>

      <DialogContent className='overflow-visible p-6'>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <CustomTextField fullWidth label='Patient Name or ID' placeholder='Search patient...'
              value={formData.patientId} onChange={e => setFormData({ ...formData, patientId: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12 }}>
             <CustomTextField select fullWidth label='Report Content' value={formData.reportContent}
               onChange={e => setFormData({ ...formData, reportContent: e.target.value })}>
                <MenuItem value='ALL'>Full Health Summary</MenuItem>
                <MenuItem value='LABS'>Lab Results Only</MenuItem>
                <MenuItem value='VISITS'>Visit History Only</MenuItem>
              </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
             <CustomTextField select fullWidth label='Export Format' value={formData.format}
               onChange={e => setFormData({ ...formData, format: e.target.value })}>
                <MenuItem value='PDF'>PDF Document</MenuItem>
                <MenuItem value='EXCEL'>Excel Spreadsheet</MenuItem>
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

export default PatientHealthReportDialog