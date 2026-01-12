import { requireUser } from '@/libs/auth-guard';
import { ROLES } from '@/constants/roles';
import QueueManagementView from '@/views/clinic-app/staff/queue/QueueManagementView';


// Assuming you have a way to get the logged-in user's Clinic ID
const MOCK_CLINIC_ID = 2; 

// 1. Update the type definition to wrap params in Promise
const QueuePage = async (props: { params: Promise<{ scheduleId: string }> }) => {
  
  // 2. Await the params before accessing properties
  const params = await props.params;
  
  await requireUser([ROLES.ADMIN, ROLES.DOCTOR, ROLES.STAFF]);

  // 3. Now access scheduleId safely
  const scheduleId = parseInt(params.scheduleId);

  return (
    <div className='p-4'>
        <QueueManagementView 
            clinicId={MOCK_CLINIC_ID} 
            scheduleId={102} 
        />
    </div>
  )
}

export default QueuePage