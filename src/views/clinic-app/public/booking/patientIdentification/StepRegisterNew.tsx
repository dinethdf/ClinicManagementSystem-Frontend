'use client'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import dayjs from 'dayjs'
import CustomDatePicker from '@/components/custome/DatePickerTextField'

type Props = {
    regForm: any;
    setRegForm: (val: any) => void;
    isVerified: boolean;
    loading: boolean;
    onVerifyMobile: () => void;
    onSubmit: () => void;
    onCancel: () => void;
}

const StepRegisterNew = ({ regForm, setRegForm, isVerified, loading, onVerifyMobile, onSubmit, onCancel }: Props) => {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in">
        <Alert severity="info" className="mb-2">New Patient Registration</Alert>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="First Name" fullWidth required value={regForm.firstName} onChange={(e) => setRegForm({...regForm, firstName: e.target.value})} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Last Name" fullWidth required value={regForm.lastName} onChange={(e) => setRegForm({...regForm, lastName: e.target.value})} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="NIC" fullWidth required value={regForm.nic} onChange={(e) => setRegForm({...regForm, nic: e.target.value})} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <CustomDatePicker
                    label='Date Of Birth' value={regForm.dob ? dayjs(regForm.dob) : null}
                    onChange={(newValue) => setRegForm({ ...regForm, dob: newValue ? newValue.format('YYYY-MM-DD') : '' })}
                    format='YYYY-MM-DD' slotProps={{ textField: { fullWidth: true, required: true } }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Email" fullWidth value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <div className='flex gap-2 items-center'>
                    <TextField 
                        label="Mobile No" fullWidth required value={regForm.mobileNo} 
                        onChange={(e) => setRegForm({...regForm, mobileNo: e.target.value})} disabled={isVerified} 
                    />
                    {!isVerified ? (
                        <Button variant='contained' size='small' onClick={onVerifyMobile} disabled={!regForm.mobileNo || loading}>Verify</Button>
                    ) : <Chip label="Verified" color='success' size='small'/>}
                </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField select label="Gender" fullWidth required value={regForm.gender} onChange={(e) => setRegForm({...regForm, gender: Number(e.target.value)})}>
                    <MenuItem value={1}>Male</MenuItem><MenuItem value={2}>Female</MenuItem>
                </TextField>
            </Grid>
        </Grid>
        <div className="flex gap-3 mt-4">
             <Button variant="outlined" color="inherit" onClick={onCancel}>Cancel</Button>
             <Button variant="contained" fullWidth size="large" onClick={onSubmit} disabled={loading || !isVerified}>
                {loading ? 'Creating...' : 'Register & Book'}
             </Button>
        </div>
    </div>
  )
}
export default StepRegisterNew