'use client'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

type Props = {
    patient: any;
    note: string;
    setNote: (val: string) => void;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const StepConfirmExisting = ({ patient, note, setNote, loading, onConfirm, onCancel }: Props) => {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in">
        <Alert severity="success" icon={false} className="border-green-200 border bg-green-50/50 p-0 overflow-hidden">
            <div className="p-4">
                <div className="flex justify-between items-start w-full mb-3">
                    <div>
                        <Typography variant="caption" className="uppercase font-bold text-green-700 tracking-wider">Patient Verified</Typography>
                        <Typography variant="h6" className="text-green-900 font-bold leading-tight">{patient.firstName} {patient.lastName}</Typography>
                    </div>
                    <Chip label="Verified" color="success" size="small" className="font-bold" icon={<i className='tabler-check'/>} />
                </div>
                <Divider className="border-green-200 mb-3 opacity-50" />
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wide">ID</span>
                            <span className="text-sm font-semibold text-gray-800">{patient.patientNo}</span>
                        </div>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wide">NIC</span>
                            <span className="text-sm font-semibold text-gray-800">{patient.nic}</span>
                        </div>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wide">Mobile</span>
                            <span className="text-sm font-semibold text-gray-800">{patient.mobileNo}</span>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </Alert>

        <TextField 
            label="Note / Reason (Optional)" fullWidth multiline rows={2}
            placeholder="e.g., Fever for 2 days" value={note} onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex gap-3 mt-2">
            <Button variant="outlined" color="error" onClick={onCancel} fullWidth>Not You?</Button>
            <Button variant="contained" fullWidth size="large" onClick={onConfirm} disabled={loading}>
                {loading ? 'Booking...' : 'Confirm & Book'}
            </Button>
        </div>
    </div>
  )
}

export default StepConfirmExisting