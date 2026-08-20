'use client'

import { useState, useEffect } from 'react'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import Skeleton from '@mui/material/Skeleton'

import { getLabReports } from '@/services/patient-portal/patient.health.service'
import type { LabReportDTO } from '@/types/patient-portal/patient.health.types'

const LabReportsTab = () => {
  const [reports, setReports] = useState<LabReportDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLabReports().then(data => {
        setReports(data)
        setLoading(false)
    })
  }, [])

  const getStatusColor = (status: string) => {
      if (status === 'COMPLETED') return 'success';
      if (status === 'SAMPLE_COLLECTED') return 'info';
      
return 'warning';
  }

  // Helper for Status Steps
  const getStatusStep = (status: string) => {
      if (status === 'COMPLETED') return 3;
      if (status === 'SAMPLE_COLLECTED') return 2;
      
return 1;
  }

  if (loading) return <div className='p-4'><Skeleton height={80} /><Skeleton height={80} className='mt-2' /></div>

  return (
    <div className='flex flex-col gap-4 animate-in fade-in'>
        {reports.length === 0 ? (
            <div className='text-center p-10 text-gray-400'>No lab reports found.</div>
        ) : (
            reports.map(report => (
                <Card key={report.id} className='p-4 border border-gray-100 shadow-sm'>
                    <div className='flex justify-between items-start flex-wrap gap-2'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <Typography variant='h6' fontWeight={600}>{report.testName}</Typography>
                                <Chip label={report.testCode} size='small' className='text-[10px]' />
                            </div>
                            <Typography variant='body2' color='text.secondary'>
                                Prescribed by {report.doctorName} on {new Date(report.requestDate).toLocaleDateString()}
                            </Typography>
                        </div>
                        
                        <Button 
                            variant='contained' 
                            size='small' 
                            disabled={report.status !== 'COMPLETED'}
                            startIcon={<i className='tabler-download' />}
                            color={report.status === 'COMPLETED' ? 'primary' : 'inherit'}
                        >
                            Download
                        </Button>
                    </div>

                    {/* Status Tracker Bar */}
                    <div className='mt-6 mb-2'>
                        <div className='relative w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
                            <div 
                                className={`absolute top-0 left-0 h-full transition-all duration-1000 bg-${getStatusColor(report.status)}`} 
                                style={{ width: `${(getStatusStep(report.status) / 3) * 100}%` }}
                            />
                        </div>
                        <div className='flex justify-between text-[10px] text-gray-500 mt-1 font-bold uppercase'>
                            <span className={getStatusStep(report.status) >= 1 ? 'text-warning' : ''}>Pending</span>
                            <span className={getStatusStep(report.status) >= 2 ? 'text-info' : ''}>Sample Collected</span>
                            <span className={getStatusStep(report.status) >= 3 ? 'text-success' : ''}>Completed</span>
                        </div>
                    </div>
                </Card>
            ))
        )}
    </div>
  )
}

export default LabReportsTab