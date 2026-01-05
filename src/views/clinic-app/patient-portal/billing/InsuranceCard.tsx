'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LoadingButton from '@mui/lab/LoadingButton'
import Skeleton from '@mui/material/Skeleton'

import { getInsuranceDetails, updateInsuranceDetails } from '@/services/patient-portal/patient.billing.service'
import type { PatientInsuranceDTO } from '@/types/patient-portal/patient.billing.types'

const InsuranceCard = () => {
  const [data, setData] = useState<PatientInsuranceDTO | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Edit State
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<PatientInsuranceDTO | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getInsuranceDetails().then(res => {
        setData(res)
        setLoading(false)
    })
  }, [])

  const handleEdit = () => {
      setFormData(data)
      setOpen(true)
  }

  const handleSave = async () => {
      if(!formData) return;
      setSaving(true)
      await updateInsuranceDetails(formData)
      setData(formData) // Optimistic UI update
      setSaving(false)
      setOpen(false)
  }

  if (loading) return <Skeleton variant="rectangular" height={200} className='rounded-xl' />

  return (
    <>
        <Card className='bg-linear-to-br from-[#1e293b] to-[#334155] text-white shadow-xl relative overflow-hidden'>
            {/* Background Decoration */}
            <div className='absolute right-[-30px] top-[-30px] opacity-10 rotate-12'>
                <i className='tabler-shield-check text-[180px]' />
            </div>

            <CardContent className='p-6 relative z-10'>
                <div className='flex justify-between items-start mb-6'>
                    <div>
                        <Typography variant='overline' className='opacity-70 tracking-widest'>Insurance Provider</Typography>
                        <Typography variant='h5' fontWeight={700}>{data?.providerName || 'Not Added'}</Typography>
                    </div>
                    {data?.status && (
                        <Chip 
                            label={data.status} 
                            size='small' 
                            className={`font-bold ${data.status === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`} 
                        />
                    )}
                </div>

                <div className='grid grid-cols-2 gap-4 mb-6'>
                    <div>
                        <Typography variant='caption' className='opacity-70 block mb-1'>Policy Number</Typography>
                        <Typography variant='subtitle1' className='font-mono tracking-wide'>{data?.policyNumber || '-----'}</Typography>
                    </div>
                    <div>
                        <Typography variant='caption' className='opacity-70 block mb-1'>Policy Holder</Typography>
                        <Typography variant='subtitle1'>{data?.holderName || '-----'}</Typography>
                    </div>
                    <div>
                        <Typography variant='caption' className='opacity-70 block mb-1'>Expires On</Typography>
                        <Typography variant='subtitle1'>{data?.expiryDate || '-----'}</Typography>
                    </div>
                </div>

                <Button 
                    variant='contained' 
                    color='primary' 
                    size='small' 
                    onClick={handleEdit}
                    className='bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm shadow-none'
                    startIcon={<i className='tabler-edit' />}
                >
                    {data ? 'Update Details' : 'Add Insurance'}
                </Button>
            </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Update Insurance Details</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <TextField 
                            fullWidth label="Provider Name" 
                            value={formData?.providerName || ''} 
                            onChange={(e) => setFormData({...formData!, providerName: e.target.value})}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                            fullWidth label="Policy Number" 
                            value={formData?.policyNumber || ''} 
                            onChange={(e) => setFormData({...formData!, policyNumber: e.target.value})}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                            fullWidth label="Expiry Date" type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formData?.expiryDate || ''} 
                            onChange={(e) => setFormData({...formData!, expiryDate: e.target.value})}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField 
                            fullWidth label="Policy Holder Name" 
                            value={formData?.holderName || ''} 
                            onChange={(e) => setFormData({...formData!, holderName: e.target.value})}
                        />
                    </Grid>
                </Grid>
                <div className='bg-yellow-50 p-3 rounded mt-4 text-sm text-yellow-800 flex gap-2'>
                    <i className='tabler-info-circle' />
                    Updates will be verified by the clinic admin within 24 hours.
                </div>
            </DialogContent>
            <DialogActions className='p-4'>
                <Button onClick={() => setOpen(false)} color='inherit'>Cancel</Button>
                <LoadingButton variant='contained' onClick={handleSave} loading={saving}>Save Changes</LoadingButton>
            </DialogActions>
        </Dialog>
    </>
  )
}

export default InsuranceCard