import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

import type { AppointmentStatusDTO } from '@/types/appoinments.types'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  appointmentInfo: AppointmentStatusDTO | null
}

const StartConsultationDialog = ({ open, onClose, onConfirm, loading, appointmentInfo }: Props) => {
  if (!appointmentInfo) return null

  return (
    <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '90vw' } }}
        onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
                e.preventDefault();
                onConfirm();
            }
        }}
    >
        <DialogTitle className='bg-primary text-white flex justify-between items-center py-3'>
            <span className='flex items-center gap-2 text-lg'>
                <i className='tabler-user-check' /> Patient Found
            </span>
            <Chip label={appointmentInfo.status} size='small' className='bg-white/20 text-white font-bold' />
        </DialogTitle>
        
        <DialogContent className='pt-6 pb-2'>
            <div className='flex flex-col items-center gap-4'>
                {/* Patient Info */}
                <div className='flex flex-col items-center gap-1 text-center'>
                    <Avatar className='w-16 h-16 bg-primary/10 text-primary text-2xl border-2 border-primary mb-1'>
                        {appointmentInfo.fullName.charAt(0)}
                    </Avatar>
                    <div>
                        <Typography variant='h5' className='font-bold'>{appointmentInfo.fullName}</Typography>
                        <Typography variant='body2' color='text.secondary'>ID: {appointmentInfo.patientNo}</Typography>
                    </div>
                </div>

                <Divider flexItem className='w-full' />

                {/* Queue Number */}
                <div className='bg-gray-50 rounded-lg p-4 w-full flex justify-between items-center border border-gray-100'>
                    <div>
                        <Typography variant='caption' className='uppercase tracking-wider text-gray-500 font-bold'>Queue No</Typography>
                        <Typography variant='h2' className='text-primary font-black leading-none'>{appointmentInfo.queueNo}</Typography>
                    </div>
                    <div className='text-right'>
                        <Typography variant='caption' color='text.secondary'>Type</Typography>
                        <Typography variant='subtitle1' className='font-bold text-gray-700'>Standard</Typography>
                    </div>
                </div>

                {/* --- VALIDATION WARNING UI --- */}
                {appointmentInfo.status === 'PENDING_PAYMENT' && (
                    <Alert severity="error" className="w-full font-bold">
                        <Typography variant="subtitle2" color="error" fontWeight={700}>
                            Cannot Start: Payment is Pending
                        </Typography>
                    </Alert>
                )}
            </div>
        </DialogContent>
        
        <DialogActions className='p-4 gap-2'>
            <Button onClick={onClose} color='inherit'>Cancel</Button>
            <Button 
                variant='contained' 
                color='success' 
                fullWidth 
                startIcon={<i className='tabler-stethoscope' />}
                onClick={onConfirm} 
                // --- DISABLE IF PAYMENT PENDING ---
                disabled={loading || appointmentInfo.status === 'PENDING_PAYMENT'}
                autoFocus 
            >
                Start (Enter)
            </Button>
        </DialogActions>
    </Dialog>
  )
}

export default StartConsultationDialog