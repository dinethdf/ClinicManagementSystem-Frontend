'use client';

import { useState } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { toast } from 'react-toastify';

import type { ClinicDetailsDTO } from '@/services/settings.server.service';
import { updateSubscriptionPlan } from '@/services/settings.server.service';

const plans = [
  {
    code: 'PLAN_BASIC',
    name: 'Basic',
    price: '$0',
    features: ['Up to 100 patients', 'Basic reporting', 'Single user'],
  },
  {
    code: 'PLAN_STANDARD',
    name: 'Standard',
    price: '$29/mo',
    features: ['Up to 1000 patients', 'Advanced reporting', 'Up to 5 users', 'SMS notifications'],
  },
  {
    code: 'PLAN_PREMIUM',
    name: 'Premium',
    price: '$99/mo',
    features: ['Unlimited patients', 'Custom reports', 'Unlimited users', 'Priority support'],
  },
];

const SubscriptionTab = ({ initialData }: { initialData: ClinicDetailsDTO }) => {
  const [updating, setUpdating] = useState(false);
  const currentPlan = plans.find(p => p.code === initialData.planCode) || { name: initialData.planCode, code: initialData.planCode };

  const handleUpgrade = async (planCode: string) => {
    if (planCode === initialData.planCode) return;
    
    setUpdating(true);
    const result = await updateSubscriptionPlan(planCode);

    setUpdating(false);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Current Plan' subheader='Manage your clinic subscription and billing.' />
          <Divider />
          <CardContent>
            <Grid container spacing={4} alignItems='center'>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='h5' color='primary' className='mb-2'>
                  {currentPlan.name} Plan
                </Typography>
                <Typography variant='body2' component='div' className='mb-4 flex items-center gap-2'>
                  Your current status: <Chip label={initialData.status} color={initialData.status === 'ACTIVE' ? 'success' : 'error'} size='small' />
                </Typography>
                <Alert severity='info' icon={<i className='tabler-info-circle' />}>
                  Your plan will automatically renew on the next billing cycle.
                </Alert>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} className='flex justify-end'>
                <Button variant='tonal' color='error'>Cancel Subscription</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography variant='h5' className='mb-4'>Available Plans</Typography>
        <Grid container spacing={6}>
          {plans.map((plan) => (
            <Grid size={{ xs: 12, md: 4 }} key={plan.code}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: plan.code === initialData.planCode ? '2px solid' : 'none', borderColor: 'primary.main' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <div className='flex justify-between items-center mb-4'>
                    <Typography variant='h6'>{plan.name}</Typography>
                    {plan.code === initialData.planCode && <Chip label='Current' color='primary' size='small' />}
                  </div>
                  <Typography variant='h4' className='mb-4'>{plan.price}</Typography>
                  <Divider className='mb-4' />
                  <ul className='p-0 m-0' style={{ listStyle: 'none' }}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className='flex items-center mb-2'>
                        <i className='tabler-check text-success mr-2' />
                        <Typography variant='body2'>{feature}</Typography>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardContent>
                  <Button 
                    fullWidth 
                    variant={plan.code === initialData.planCode ? 'outlined' : 'contained'} 
                    disabled={updating || plan.code === initialData.planCode}
                    onClick={() => handleUpgrade(plan.code)}
                  >
                    {plan.code === initialData.planCode ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SubscriptionTab;
