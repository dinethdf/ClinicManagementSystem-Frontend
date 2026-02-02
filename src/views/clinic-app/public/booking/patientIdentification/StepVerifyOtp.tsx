
'use client'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

type Props = {
    mobile: string;
    otp: string;
    setOtp: (val: string) => void;
    loading: boolean;
    onVerify: () => void;
    onBack: () => void;
}

const StepVerifyOtp = ({ mobile, otp, setOtp, loading, onVerify, onBack }: Props) => {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in">
        <Alert severity="info">
            We sent a verification code check Your Email or Mobile No.
        </Alert>
        <TextField 
            label="Enter OTP Code" fullWidth value={otp}
            onChange={(e) => setOtp(e.target.value)} placeholder="e.g. 123456"
        />
        <div className='flex gap-3 justify-end'>
            <Button onClick={onBack} color="inherit">Back</Button>
            <Button variant="contained" onClick={onVerify} disabled={!otp || loading}>
                {loading ? 'Verifying...' : 'Verify & Proceed'}
            </Button>
        </div>
    </div>
  )
}
export default StepVerifyOtp