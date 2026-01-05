'use client'

import { useState } from 'react'

// MUI
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import LoadingButton from '@mui/lab/LoadingButton'

import { addFamilyMember } from '@/services/patient-portal/patient.family.service'

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddDependentDialog = ({ open, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({ fullName: '', relation: '', dob: '', gender: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
      setLoading(true)
      await addFamilyMember(form as any) // Type check omitted for brevity
      setLoading(false)
      onSuccess()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Family Member</DialogTitle>
        <DialogContent dividers>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <TextField 
                        fullWidth label="Full Name" 
                        value={form.fullName} 
                        onChange={e => setForm({...form, fullName: e.target.value})} 
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField 
                        select fullWidth label="Relationship"
                        value={form.relation}
                        onChange={e => setForm({...form, relation: e.target.value})}
                    >
                        <MenuItem value="SPOUSE">Spouse</MenuItem>
                        <MenuItem value="CHILD">Child</MenuItem>
                        <MenuItem value="PARENT">Parent</MenuItem>
                        <MenuItem value="SIBLING">Sibling</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField 
                        select fullWidth label="Gender"
                        value={form.gender}
                        onChange={e => setForm({...form, gender: e.target.value})}
                    >
                        <MenuItem value="MALE">Male</MenuItem>
                        <MenuItem value="FEMALE">Female</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField 
                        fullWidth label="Date of Birth" type="date"
                        InputLabelProps={{ shrink: true }}
                        value={form.dob}
                        onChange={e => setForm({...form, dob: e.target.value})}
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions className='p-4'>
            <Button onClick={onClose} color='inherit'>Cancel</Button>
            <LoadingButton variant='contained' onClick={handleSubmit} loading={loading}>Add Member</LoadingButton>
        </DialogActions>
    </Dialog>
  )
}

export default AddDependentDialog