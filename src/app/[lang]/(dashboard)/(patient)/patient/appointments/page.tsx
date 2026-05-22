import Typography from '@mui/material/Typography'

import { requireUser } from '@/libs/auth-guard';
import { ROLES } from '@/constants/roles';
import AppointmentList from '@/views/clinic-app/patient-portal/appointments/AppointmentList';

const MyAppointmentsPage = async () => {
  // Allow only Patient
  
//   await requireUser([ROLES.PATIENT]);

  return (
    <div className='max-w-3xl mx-auto'>
        <div className='mb-6'>
            <Typography variant='h4' fontWeight={700} color='primary'>My Appointments</Typography>
            <Typography variant='body2' color='text.secondary'>Manage your bookings, view history and track live queues</Typography>
        </div>
        
        <AppointmentList />
    </div>
  )
}

export default MyAppointmentsPage