'use client'

import { useState, useEffect } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'

import { getHealthProfile } from '@/services/patient-portal/patient.health.service'
import type { PatientAllergy, PatientCondition, DiagnosisDTO } from '@/types/patient-portal/patient.health.types'

const HealthProfileTab = () => {
  const [data, setData] = useState<{ allergies: PatientAllergy[], conditions: PatientCondition[], diagnoses: DiagnosisDTO[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHealthProfile().then(res => {
        setData(res)
        setLoading(false)
    })
  }, [])

  if (loading || !data) return <div className='p-4'><Skeleton height={150} /><Skeleton height={200} className='mt-4' /></div>

  return (
    <div className='flex flex-col gap-6 animate-in fade-in'>
        
        {/* STORY 3.5: Allergies & Conditions */}
        <Grid container spacing={3}>
            {/* Critical Allergies */}
            <Grid size={{ xs: 12 }}>
                {data.allergies.length > 0 ? (
                    <Alert severity='error' variant='filled' className='shadow-md'>
                        <div className='flex justify-between items-center w-full'>
                            <div>
                                <AlertTitle className='font-bold'>Critical Allergies Recorded</AlertTitle>
                                <ul className='list-disc pl-5 mt-1'>
                                    {data.allergies.map(a => (
                                        <li key={a.id}>
                                            <strong>{a.substance}</strong> ({a.severity}) - {a.reaction}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button size='small' color='inherit' className='bg-white/20 hover:bg-white/30 whitespace-nowrap ml-2'>
                                Report Error
                            </Button>
                        </div>
                    </Alert>
                ) : (
                    <Alert severity='success'>No known allergies recorded.</Alert>
                )}
            </Grid>

            {/* Chronic Conditions */}
            <Grid size={{ xs: 12 }}>
                <Card className='bg-blue-50 border border-blue-100'>
                    <CardContent>
                        <Typography variant='h6' className='mb-3 text-blue-900 flex items-center gap-2'>
                            <i className='tabler-activity-heartbeat' /> Chronic Conditions
                        </Typography>
                        <div className='flex gap-2 flex-wrap'>
                            {data.conditions.length > 0 ? data.conditions.map(c => (
                                <Chip 
                                    key={c.id} 
                                    label={c.name} 
                                    color='primary' 
                                    variant='outlined' 
                                    className='bg-white font-semibold'
                                />
                            )) : <Typography variant='body2'>No chronic conditions recorded.</Typography>}
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

        {/* STORY 3.4: Diagnosis History */}
        <div>
            <Typography variant='h6' className='mb-4 flex items-center gap-2'>
                <i className='tabler-stethoscope' /> Diagnosis History
            </Typography>
            
            <div className='relative border-l-2 border-gray-200 ml-3 space-y-6'>
                {data.diagnoses.map((diag) => (
                    <div key={diag.id} className='relative pl-6'>
                        {/* Timeline Dot */}
                        <div className='absolute -left-[9px] top-1 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm'></div>
                        
                        <div className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm'>
                            <div className='flex justify-between items-start'>
                                <Typography fontWeight={700} className='text-lg'>{diag.condition}</Typography>
                                <Typography variant='caption' className='text-gray-500 font-medium'>
                                    {new Date(diag.date).toLocaleDateString()}
                                </Typography>
                            </div>
                            <Typography variant='body2' className='text-primary mt-1'>
                                Diagnosed by {diag.doctorName}
                            </Typography>
                            {diag.notes && (
                                <Typography variant='body2' className='text-gray-600 mt-2 bg-gray-50 p-2 rounded'>
                                    "{diag.notes}"
                                </Typography>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default HealthProfileTab