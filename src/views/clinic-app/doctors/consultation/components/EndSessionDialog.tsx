import { memo } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  stats: { booked: number, pendingPayment: number }
}

const EndSessionDialog = ({ open, onClose, onConfirm, stats }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle className='text-warning-main flex items-center gap-2'>
            <i className='tabler-alert-triangle' /> End Session?
        </DialogTitle>
        <DialogContent>
            <Typography variant="body2">
                <strong>{stats.booked}</strong> waiting, <strong>{stats.pendingPayment}</strong> pending payment.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color='inherit'>No</Button>
            <Button onClick={onConfirm} variant='contained' color='warning'>Yes, End</Button>
        </DialogActions>
    </Dialog>
  )
}

EndSessionDialog.displayName = 'EndSessionDialog' // ADDED
export default memo(EndSessionDialog) // MODIFIED: Wrapped in memo