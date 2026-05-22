'use client'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

type Props = {
    identifier: string;
    setIdentifier: (val: string) => void;
    loading: boolean;
    onSearch: () => void;
    onBack: () => void;
}

const StepSearch = ({ identifier, setIdentifier, loading, onSearch, onBack }: Props) => {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in">
        <TextField 
            label="NIC or Mobile Number" 
            fullWidth 
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="e.g., 200012345678 or 0771234567"
        />
        <div className='flex gap-3 justify-end'>
            <Button onClick={onBack} color="inherit">Back</Button>
            <Button variant="contained" size="large" onClick={onSearch} disabled={!identifier || loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Check Availability'}
            </Button>
        </div>
    </div>
  )
}

export default StepSearch