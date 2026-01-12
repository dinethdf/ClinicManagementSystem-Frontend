import { requireUser } from '@/libs/auth-guard';
import { ROLES } from '@/constants/roles';
import Typography from '@mui/material/Typography'
// import FamilyList from '@/views/clinic-app/patient-portal/family/FamilyList';

const FamilyPage = async () => {

      await requireUser([ROLES.PATIENT]);

  return (
    <div className='max-w-5xl mx-auto'>
        <div className='mb-6'>
            <Typography variant='h4' fontWeight={700} color='primary'>Family Profiles</Typography>
            <Typography variant='body2' color='text.secondary'>Manage dependents and switch profiles to view their records.</Typography>
        </div>
        Comming Soon
        {/* <FamilyList /> */}
    </div>
  )
}

export default FamilyPage