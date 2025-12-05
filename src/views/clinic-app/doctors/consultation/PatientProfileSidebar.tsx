'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'

import type { PatientDetailDTO } from '@/types/consultation.types'

// --- HARDCODED ALERTS (As requested) ---
const MOCK_ALLERGIES = [
  { id: 1, name: "Penicillin", note: "Severe skin rash" },
  { id: 2, name: "Dust", note: "Mild sneezing" }
]

const MOCK_DISEASES = [
  { id: 1, name: "Diabetes Type 2" },
  { id: 2, name: "Hypertension" }
]

const PatientProfileSidebar = ({ patient }: { patient: PatientDetailDTO }) => {
  
  const genderLabel = patient.gender === 1 ? 'Male' : patient.gender === 2 ? 'Female' : 'Other'

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

      {/* 2. Hardcoded Allergies */}
      <Card className='border-l-4 border-l-error'>
        <CardContent>
            <div className='flex items-center gap-2 mb-3'>
                <i className='tabler-alert-triangle text-error text-xl' />
                <Typography variant='h6' color='error'>Allergies</Typography>
            </div>
            <div className='flex flex-col gap-2'>
                {MOCK_ALLERGIES.map((allergy) => (
                    <Alert severity="error" icon={false} key={allergy.id} className='font-bold py-0'>
                        {allergy.name}
                        {allergy.note && <span className='block text-xs font-normal opacity-80'>{allergy.note}</span>}
                    </Alert>
                ))}
            </div>
        </CardContent>
      </Card>

      {/* 3. Hardcoded Chronic Diseases */}
      <Card className='border-l-4 border-l-warning'>
        <CardContent>
            <div className='flex items-center gap-2 mb-3'>
                <i className='tabler-activity-heartbeat text-warning text-xl' />
                <Typography variant='h6' color='warning'>Chronic Diseases</Typography>
            </div>
            <div className='flex flex-wrap gap-2'>
                {MOCK_DISEASES.map((disease) => (
                    <Chip key={disease.id} label={disease.name} color='warning' variant='filled' className='font-bold'/>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PatientProfileSidebar