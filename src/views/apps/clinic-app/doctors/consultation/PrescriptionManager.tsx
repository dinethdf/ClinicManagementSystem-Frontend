'use client'

import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Type & Service
import type { PrescriptionItemDTO } from '@/types/consultation.types'
import { createPrescription } from '@/services/consultation.server.service'

type Props = {
    appointmentId: number
    onConsultationComplete: () => void
}

const PrescriptionManager = ({ appointmentId, onConsultationComplete }: Props) => {
  // States
  const [items, setItems] = useState<PrescriptionItemDTO[]>([])
  const [mainNote, setMainNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form State (Single Item)
  const [form, setForm] = useState({
    medicineName: '',
    dosage: '',
    quantity: '',
    duration: '',
    instructions: ''
  })

  // Add Item
  const handleAdd = () => {
    if (!form.medicineName || !form.dosage) return
    setItems([...items, { ...form }])
    setForm({ medicineName: '', dosage: '', quantity: '', duration: '', instructions: '' })
  }

  // Remove Item
  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  // Finalize Submission
  const handleFinalize = async () => {
    if (!appointmentId) {
        setErrorMsg("Error: Invalid Appointment ID")
        return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    const payload = {
        appointmentId: appointmentId,
        note: mainNote || "Routine Checkup",
        items: items
    }

    const res = await createPrescription(payload)

    if (res.success) {
        onConsultationComplete() // Triggers the reset in the parent
    } else {
        setErrorMsg(res.error || "Failed to submit prescription")
    }

    setIsSubmitting(false)
  }

  return (
    <Card className='h-full'>
      <CardHeader title="Prescription & Diagnosis" />
      <Divider />
      <CardContent>
        {errorMsg && <Alert severity='error' className='mb-4'>{errorMsg}</Alert>}

        {/* 1. General Note */}
        <div className='mb-6'>
            <CustomTextField 
                fullWidth 
                multiline 
                rows={2} 
                label="Diagnosis / General Note" 
                placeholder="e.g. Patient has a severe throat infection. Advised rest."
                value={mainNote}
                onChange={(e) => setMainNote(e.target.value)}
            />
        </div>

        {/* 2. Add Medicine Form */}
        <div className='bg-actionHover p-4 rounded-lg mb-6'>
            <Typography variant='h6' className='mb-4 flex items-center gap-2'>
                <i className='tabler-pill text-primary' /> Add Medicine
            </Typography>
            <Grid container spacing={4} alignItems="end">
                <Grid size={{ xs: 12, md: 4 }}>
                    <CustomTextField fullWidth label="Medicine Name" placeholder="e.g. Amoxicillin" 
                        value={form.medicineName} onChange={e => setForm({...form, medicineName: e.target.value})} />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <CustomTextField fullWidth label="Dosage" placeholder="500mg" 
                        value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} />
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                    <CustomTextField fullWidth label="Quantity" placeholder="15" 
                        value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                    <CustomTextField fullWidth label="Duration" placeholder="5 Days" 
                        value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
                </Grid>
                 <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField fullWidth label="Instructions" placeholder="e.g. After meals" 
                        value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Button variant='contained' fullWidth onClick={handleAdd} startIcon={<i className='tabler-plus' />}>Add</Button>
                </Grid>
            </Grid>
        </div>

        {/* 3. Medicine Table */}
        <TableContainer component={Paper} variant='outlined'>
            <Table size='small'>
                <TableHead className='bg-gray-50'>
                    <TableRow>
                        <TableCell>Drug Name</TableCell>
                        <TableCell>Dosage</TableCell>
                        <TableCell>Qty / Duration</TableCell>
                        <TableCell>Instructions</TableCell>
                        <TableCell align='right'>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align='center' className='py-8 text-gray-400'>No medicines added.</TableCell>
                        </TableRow>
                    ) : (
                        items.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className='font-medium'>{row.medicineName}</TableCell>
                                <TableCell>{row.dosage}</TableCell>
                                <TableCell>{row.quantity} ({row.duration})</TableCell>
                                <TableCell>{row.instructions}</TableCell>
                                <TableCell align='right'>
                                    <IconButton size='small' color='error' onClick={() => handleRemove(index)}>
                                        <i className='tabler-trash' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        
        {/* 4. Actions */}
        <div className='mt-6 flex justify-end gap-4'>
             <Button variant='tonal' color='secondary' disabled={isSubmitting}>Save Draft</Button>
             <Button 
                variant='contained' 
                color='primary' 
                onClick={handleFinalize} 
                disabled={isSubmitting || (items.length === 0 && !mainNote)}
                startIcon={isSubmitting ? <CircularProgress size={20} color='inherit'/> : <i className='tabler-check' />}
             >
                {isSubmitting ? 'Finalizing...' : 'Finalize Consultation'}
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PrescriptionManager