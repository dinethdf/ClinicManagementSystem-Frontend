'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react' // ADDED: useCallback, useMemo, memo

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'

// Services & Types
import { 
  getAllergies, 
  addAllergy, 
  deleteAllergy,
  getDiseases,
  addDisease,
  deleteDisease
} from '@/services/doctor/consultation.server.service'
import type { AllergyDTO, DiseaseDTO, PatientDetailDTO } from '@/types/patient.types'

const PatientProfileSidebar = ({ patient }: { patient: PatientDetailDTO }) => {
  
  // ADDED: Memoized gender label
  const genderLabel = useMemo(() => {
    if (patient.gender === 1) return 'Male';
    if (patient.gender === 2) return 'Female';
    
return 'Other';
  }, [patient.gender]);

  // --- STATES ---
  const [allergies, setAllergies] = useState<AllergyDTO[]>([])
  const [diseases, setDiseases] = useState<DiseaseDTO[]>([])
  const [loading, setLoading] = useState(false)

  // Dialog States
  const [openDialog, setOpenDialog] = useState<'allergy' | 'disease' | null>(null)
  const [formData, setFormData] = useState({ name: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  // ADDED: Memoized fetch function
  const fetchHealthData = useCallback(async () => {
    setLoading(true)

    const [allergiesRes, diseasesRes] = await Promise.all([
      getAllergies(patient.id),
      getDiseases(patient.id)
    ])
    
    if (allergiesRes.success) setAllergies(allergiesRes.data)
    if (diseasesRes.success) setDiseases(diseasesRes.data)
    setLoading(false)
  }, [patient.id])

  // --- FETCH DATA ---
  useEffect(() => {
    if (patient?.id) {
      fetchHealthData()
    }
  }, [patient?.id, fetchHealthData]) // MODIFIED: Added fetchHealthData to deps

  // ADDED: Memoized handlers
  const handleOpenDialog = useCallback((type: 'allergy' | 'disease') => {
    setFormData({ name: '', notes: '' })
    setOpenDialog(type)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(null)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!formData.name) return
    setSubmitting(true)

    if (openDialog === 'allergy') {
      const res = await addAllergy(patient.id, formData)

      if (res.success && res.data) {
        setAllergies([...allergies, res.data])
        handleCloseDialog()
      }
    } else if (openDialog === 'disease') {
      const res = await addDisease(patient.id, formData)

      if (res.success && res.data) {
        setDiseases([...diseases, res.data])
        handleCloseDialog()
      }
    }

    setSubmitting(false)
  }, [formData, openDialog, patient.id, allergies, diseases, handleCloseDialog])

  const handleDelete = useCallback(async (type: 'allergy' | 'disease', id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    if (type === 'allergy') {
        const res = await deleteAllergy(id)

        if (res.success) {
            setAllergies(allergies.filter(a => a.id !== id))
        }
    } else {
        const res = await deleteDisease(id)

        if (res.success) {
            setDiseases(diseases.filter(d => d.id !== id))
        }
    }
  }, [allergies, diseases])

  return (
    <div className='flex flex-col gap-6'>
      
      {/* 1. Profile Card */}
      <Card>
        <CardContent className='flex flex-col items-center gap-4'>
            <Avatar 
                src={patient.profileImg || '/images/avatars/1.png'} 
                alt={patient.fullName} 
                sx={{ width: 100, height: 100 }}
            />
            <div className='text-center'>
                <Typography variant='h5' className='font-bold'>{patient.fullName}</Typography>
                <Typography color='text.secondary'>{patient.patientNo}</Typography>
            </div>
            
            <div className='flex gap-2 flex-wrap justify-center'>
                <Chip label={`${patient.age} Years`} size='small' color='primary' variant='tonal'/>
                <Chip label={genderLabel} size='small' color='info' variant='tonal'/>
                <Chip label={`Blood: ${patient.bloodGroup}`} size='small' color='error' variant='tonal'/>
            </div>

            <Divider className='w-full' />

            <div className='w-full flex flex-col gap-2'>
                <div className='flex justify-between'>
                    <Typography className='font-medium'>Mobile:</Typography>
                    <Typography color='text.secondary'>{patient.mobileNo}</Typography>
                </div>
                 <div className='flex justify-between'>
                    <Typography className='font-medium'>City:</Typography>
                    <Typography color='text.secondary'>{patient.city}</Typography>
                </div>
            </div>
        </CardContent>
      </Card>

      {/* 2. Allergies Section */}
      <Card className='border-l-4 border-l-error'>
        <CardContent>
            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                    <i className='tabler-alert-triangle text-error text-xl' />
                    <Typography variant='h6' color='error'>Allergies</Typography>
                </div>
                <Tooltip title="Add Allergy">
                    <IconButton size='small' color='error' onClick={() => handleOpenDialog('allergy')}>
                        <i className='tabler-plus' />
                    </IconButton>
                </Tooltip>
            </div>
            
            <div className='flex flex-col gap-2'>
                {loading ? <CircularProgress size={20} color="error" /> : allergies.length === 0 ? (
                    <Typography variant='caption' color='text.disabled'>No allergies recorded</Typography>
                ) : (
                    allergies.map((allergy) => (
                        <Alert 
                            severity="error" 
                            icon={false} 
                            key={allergy.id} 
                            className='py-0 relative group'
                            action={
                                <IconButton 
                                    size="small" 
                                    color="inherit" 
                                    onClick={() => handleDelete('allergy', allergy.id)}
                                >
                                    <i className='tabler-trash text-sm' />
                                </IconButton>
                            }
                        >
                            <span className='font-bold'>{allergy.allergyName}</span>
                            {allergy.notes && <span className='block text-xs font-normal opacity-80'>{allergy.notes}</span>}
                        </Alert>
                    ))
                )}
            </div>
        </CardContent>
      </Card>

      {/* 3. Chronic Diseases Section */}
      <Card className='border-l-4 border-l-warning'>
        <CardContent>
            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                    <i className='tabler-activity-heartbeat text-warning text-xl' />
                    <Typography variant='h6' color='warning'>Chronic Diseases</Typography>
                </div>
                <Tooltip title="Add Disease">
                    <IconButton size='small' color='warning' onClick={() => handleOpenDialog('disease')}>
                        <i className='tabler-plus' />
                    </IconButton>
                </Tooltip>
            </div>

            <div className='flex flex-wrap gap-2'>
                {loading ? <CircularProgress size={20} color="warning" /> : diseases.length === 0 ? (
                    <Typography variant='caption' color='text.disabled'>No diseases recorded</Typography>
                ) : (
                    diseases.map((disease) => (
                        <Chip 
                            key={disease.id} 
                            label={disease.diseaseName} 
                            color='warning' 
                            variant='filled' 
                            className='font-bold'
                            onDelete={() => handleDelete('disease', disease.id)}
                        />
                    ))
                )}
            </div>
        </CardContent>
      </Card>

      {/* --- ADD DIALOG --- */}
      <Dialog open={!!openDialog} onClose={handleCloseDialog} fullWidth maxWidth='xs'>
        <DialogTitle>Add {openDialog === 'allergy' ? 'Allergy' : 'Chronic Disease'}</DialogTitle>
        <DialogContent>
            <div className='flex flex-col gap-4 mt-1'>
                <TextField 
                    label="Name" 
                    fullWidth 
                    size="small" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={openDialog === 'allergy' ? 'e.g. Penicillin' : 'e.g. Diabetes'}
                />
                <TextField 
                    label="Notes" 
                    fullWidth 
                    multiline
                    rows={2}
                    size="small"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Optional notes..."
                />
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={submitting || !formData.name}>
                {submitting ? 'Saving...' : 'Add'}
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

PatientProfileSidebar.displayName = 'PatientProfileSidebar' // ADDED
export default memo(PatientProfileSidebar) // MODIFIED: Wrapped in memo