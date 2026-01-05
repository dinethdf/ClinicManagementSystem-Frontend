'use client'

import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'

import { getPrescriptions } from '@/services/patient-portal/patient.health.service'
import type { PrescriptionDTO, MedicationItem } from '@/types/patient-portal/patient.health.types'

const MedicationsTab = () => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPrescriptions().then(data => {
        setPrescriptions(data)
        setLoading(false)
    })
  }, [])

  // Helper: Determine if meds are active (End date > Today)
  const getActiveMeds = () => {
    const active: { med: MedicationItem, doctor: string, date: string }[] = [];
    const today = new Date();
    
    prescriptions.forEach(p => {
        p.items.forEach(item => {
            const startDate = new Date(item.startDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + item.duration);
            
            if (endDate >= today) {
                active.push({ med: item, doctor: p.doctorName, date: p.date });
            }
        })
    })
    return active;
  }

  const activeMeds = getActiveMeds();

  if (loading) return <div className='p-4'><Skeleton height={100} /><Skeleton height={100} className='mt-4' /></div>

  return (
    <div className='flex flex-col gap-6 animate-in fade-in'>
        
        {/* STORY 3.2: Active Medications */}
        <Card className='border-l-4 border-l-success'>
            <CardContent>
                <div className='flex items-center gap-2 mb-4'>
                    <i className='tabler-pill text-success text-xl' />
                    <Typography variant='h6' fontWeight={700}>Active Medications</Typography>
                </div>
                
                {activeMeds.length === 0 ? (
                    <Typography color='text.secondary'>No active medications at the moment.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {activeMeds.map((item, idx) => (
                            <Grid size={{ xs: 12, md: 6 }} key={idx}>
                                <div className='bg-green-50 p-3 rounded-lg border border-green-100'>
                                    <div className='flex justify-between'>
                                        <Typography fontWeight={600}>{item.med.medicineName}</Typography>
                                        <Chip label={item.med.frequency} size='small' color='success' className='font-bold' />
                                    </div>
                                    <Typography variant='caption' className='text-gray-600 block mt-1'>
                                        {item.med.dosage} • {item.med.duration} Days left
                                    </Typography>
                                    <Typography variant='caption' className='text-gray-400 mt-1 block italic'>
                                        Prescribed by {item.doctor}
                                    </Typography>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </CardContent>
        </Card>

        {/* STORY 3.1: Digital Prescriptions List */}
        <div>
            <Typography variant='h6' className='mb-3 flex items-center gap-2'>
                <i className='tabler-history' /> Prescription History
            </Typography>
            
            {prescriptions.map((prescription) => (
                <Accordion key={prescription.id} className='mb-2 border border-gray-200 shadow-none before:hidden'>
                    <AccordionSummary expandIcon={<i className='tabler-chevron-down' />}>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between w-full pr-4'>
                            <div>
                                <Typography fontWeight={600}>{new Date(prescription.date).toLocaleDateString()}</Typography>
                                <Typography variant='caption' color='text.secondary'>{prescription.doctorName}</Typography>
                            </div>
                            <Chip label={`${prescription.items.length} Items`} size='small' variant='outlined' className='mt-2 sm:mt-0 w-fit' />
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Divider className='mb-3' />
                        <ul className='list-disc pl-5 space-y-2 mb-4'>
                            {prescription.items.map((item, i) => (
                                <li key={i} className='text-sm text-gray-700'>
                                    <strong>{item.medicineName}</strong> - {item.dosage} ({item.frequency}) for {item.duration} days.
                                </li>
                            ))}
                        </ul>
                        {prescription.notes && (
                            <div className='bg-gray-50 p-2 rounded text-sm text-gray-600 italic mb-3'>
                                Note: {prescription.notes}
                            </div>
                        )}
                        <Button 
                            variant='outlined' 
                            startIcon={<i className='tabler-printer' />} 
                            size='small'
                            onClick={() => window.print()} // Print placeholder
                        >
                            Print / Download
                        </Button>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    </div>
  )
}

export default MedicationsTab