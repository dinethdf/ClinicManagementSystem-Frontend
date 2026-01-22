import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

import PatientProfileSidebar from '../PatientProfileSidebar'
import PrescriptionManager from '../PrescriptionManager'
import LabRequestManager from './LabRequestManager' // Import your new component

import type { AppointmentStatusDTO } from '@/types/appoinments.types'
import type { PatientDetailDTO } from '@/types/consultation.types'

interface Props {
  appointmentInfo: AppointmentStatusDTO | null
  patientDetail: PatientDetailDTO | null
  onEnd: () => void
  onComplete: () => void
}

const ActiveConsultationView = ({ appointmentInfo, patientDetail, onEnd, onComplete }: Props) => {
  const patientId = patientDetail?.id ? Number(patientDetail.id) : 0;
  const appointmentId = appointmentInfo?.appointmentId ? Number(appointmentInfo.appointmentId) : 0;

  return (
    <div className='flex flex-col gap-4 animate-in slide-in-from-right duration-300'>
      <div className='flex justify-between items-center flex-wrap gap-4 bg-white p-3 rounded shadow-sm border border-gray-100'>
        <div>
            <div className='flex items-center gap-2'>
                <Typography variant='h5' className='text-primary'>Consultation</Typography>
                <Chip label="Active" color='success' size='small' />
            </div>
            <Typography variant="caption" color='text.secondary'>Queue: <strong>#{appointmentInfo?.queueNo}</strong> | {patientDetail?.fullName}</Typography>
        </div>
        <Button variant='outlined' color='error' size='small' startIcon={<i className='tabler-x' />} onClick={onEnd}>End</Button>
      </div>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
             {patientDetail && <PatientProfileSidebar patient={patientDetail} />}
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
             <div className='flex flex-col gap-6'>
                <PrescriptionManager appointmentId={appointmentId} onConsultationComplete={onComplete} />
                <LabRequestManager patientId={patientId} appointmentId={appointmentId} />
             </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default ActiveConsultationView