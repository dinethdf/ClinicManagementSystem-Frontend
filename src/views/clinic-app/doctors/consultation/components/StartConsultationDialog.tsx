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
import { AppointmentStatusDTO } from '@/types/appoinments.types'

// Props Interface


interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  appointmentInfo: AppointmentStatusDTO | null
}

const StartConsultationDialog = ({ open, onClose, onConfirm, loading, appointmentInfo }: Props) => {

  if (!appointmentInfo) return null

  // --- 1. STATUS LOGIC ---
  const { statusCode, statusDisplayName } = appointmentInfo;
  
  // STRICT RULE: Only 'BOOKED' allows entry.
  const isAllowedToStart = statusCode === 'BOOKED';

  // --- 2. GET WARNING MESSAGE ---
  const getWarningConfig = () => {
    switch (statusCode) {
        case 'PENDING_PAYMENT':
            return { message: 'Cannot Start: Payment is Pending', severity: 'error', icon: 'tabler-credit-card-off' };
        case 'PARTIAL':
            return { message: 'Cannot Start: Partial Payment (Balance Due)', severity: 'warning', icon: 'tabler-alert-circle' };
        case 'COMPLETED':
            return { message: 'Appointment already Completed', severity: 'info', icon: 'tabler-circle-check' };
        case 'ONGOING':
            return { message: 'Consultation already In Progress', severity: 'info', icon: 'tabler-player-play' };
        case 'CANCELLED':
            return { message: 'Appointment has been Cancelled', severity: 'error', icon: 'tabler-ban' };
        case 'NOSHOW':
            return { message: 'Marked as No Show', severity: 'warning', icon: 'tabler-user-off' };
        default:
            return { message: `Status is ${statusDisplayName}`, severity: 'warning', icon: 'tabler-alert-triangle' };
    }
  };

  const warning = !isAllowedToStart ? getWarningConfig() : null;

  return (
    <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '90vw' } }}
        onKeyDown={(e) => {
            // Prevent Enter key if Action is blocked
            if (e.key === 'Enter' && !loading && isAllowedToStart) {
                e.preventDefault();
                onConfirm();
            }
        }}
    >
        <DialogTitle className='bg-primary text-white flex justify-between items-center py-3'>
            <span className='flex items-center gap-2 text-lg'>
                <i className='tabler-user-check' /> Patient Found
            </span>
            <Chip 
                label={appointmentInfo.statusDisplayName} 
                size='small' 
                sx={{ 
                    backgroundColor: appointmentInfo.statusColor, 
                    color: '#fff', 
                    fontWeight: 'bold',
                    border: '1px solid rgba(255,255,255,0.3)'
                }} 
            />
        </DialogTitle>
        
        <DialogContent className='pt-6 pb-2'>
            <div className='flex flex-col items-center gap-4'>
                {/* Patient Info */}
                <div className='flex flex-col items-center gap-1 text-center'>
                    <Avatar className='w-16 h-16 bg-primary/10 text-primary text-2xl border-2 border-primary mb-1'>
                        {appointmentInfo.patientName.charAt(0)}
                    </Avatar>
                    <div>
                        <Typography variant='h5' className='font-bold'>{appointmentInfo.patientName}</Typography>
                        <div className='flex items-center gap-2 justify-center text-gray-500'>
                            <Typography variant='body2'>ID: {appointmentInfo.patientNo}</Typography>
                            {appointmentInfo.nic && (
                                <>
                                    <span className="text-gray-300">|</span>
                                    <Typography variant='body2'>NIC: {appointmentInfo.nic}</Typography>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <Divider flexItem className='w-full' />

                {/* Queue Number */}
                <div className='bg-gray-50 rounded-lg p-4 w-full flex justify-between items-center border border-gray-100'>
                    <div>
                        <Typography variant='caption' className='uppercase tracking-wider text-gray-500 font-bold'>Queue No</Typography>
                        <Typography variant='h2' className='text-primary font-black leading-none'>
                            {appointmentInfo.queuePosition}
                        </Typography>
                    </div>
                    <div className='text-right'>
                        <Typography variant='caption' color='text.secondary'>Type</Typography>
                        <Typography variant='subtitle1' className='font-bold text-gray-700'>Standard</Typography>
                    </div>
                </div>

                {/* --- DYNAMIC STATUS ALERT --- */}
                {warning && (
                    <Alert 
                        severity={warning.severity as any} 
                        className="w-full font-bold shadow-sm" 
                        icon={<i className={warning.icon} />}
                    >
                        <Typography variant="subtitle2" fontWeight={700}>
                            {warning.message}
                        </Typography>
                    </Alert>
                )}
            </div>
        </DialogContent>
        
        <DialogActions className='p-4 gap-2'>
            <Button onClick={onClose} color='inherit'>Close</Button>
            <Button 
                variant='contained' 
                color='success' 
                fullWidth 
                startIcon={<i className='tabler-stethoscope' />}
                onClick={onConfirm} 
                // --- DISABLE IF NOT BOOKED ---
                disabled={loading || !isAllowedToStart}
                autoFocus 
            >
                Start Consultation
            </Button>
        </DialogActions>
    </Dialog>
  )
}

export default StartConsultationDialog