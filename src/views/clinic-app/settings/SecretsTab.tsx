'use client';

import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { toast } from 'react-toastify';

import CustomTextField from '@core/components/mui/TextField';
import { getClinicSecrets, updateClinicSecrets } from '@/services/settings.server.service';
import type { ClinicSecretsDTO } from '@/services/settings.server.service';

const SecretsTab = () => {
  const [secrets, setSecrets] = useState<ClinicSecretsDTO>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    setLoading(true);
    try {
      const data = await getClinicSecrets();
      if (data) {
        if (typeof data === 'string') {
          try {
            setSecrets(JSON.parse(data));
          } catch (e) {
            console.error('Failed to parse secrets string:', e);
            setSecrets({});
          }
        } else if (typeof data === 'object' && !Array.isArray(data)) {
          setSecrets(data);
        } else {
          setSecrets({});
        }
      } else {
        // If data is null, it might be an error or just empty
        // But our service logs the error. We can show a generic message here if we want.
        // toast.error('Failed to load secrets. Please try again.');
        setSecrets({});
      }
    } catch (err: any) {
      toast.error('Failed to load secrets. Please check your connection.');
      setSecrets({});
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSecrets = async () => {
    setUpdating(true);
    const result = await updateClinicSecrets(secrets);
    setUpdating(false);
    if (result.success) {
      toast.success(result.message);
      fetchSecrets();
    } else {
      toast.error(result.message);
    }
  };

  const handleAddSecret = () => {
    if (!newKey || !newValue) {
      toast.error('Both key and value are required');
      return;
    }
    setSecrets({ ...secrets, [newKey]: newValue });
    setNewKey('');
    setNewValue('');
  };

  const handleDeleteSecret = (keyToDelete: string) => {
    const newSecrets = { ...secrets };
    delete newSecrets[keyToDelete];
    setSecrets(newSecrets);
  };

  if (loading) {
    return (
      <Grid container justifyContent='center' className='mt-10'>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader 
            title='Secure Vault (API Keys & Secrets)' 
            subheader='Store your sensitive API keys for gateways here. Values are encrypted on the server.'
          />
          <Divider />
          <CardContent>
            <Alert severity='info' className='mb-4'>
              Enter the keys exactly as required by your integrations. For SMS:
              <ul className='mt-2'>
                <li><b>smsAppApiKey</b>: For CureGuard SMS App</li>
                <li><b>smsGatewayApiToken</b>: For Text.lk Gateway</li>
                <li><b>smsGatewaySenderId</b>: For Text.lk Sender Name (e.g. CureGuard)</li>
              </ul>
            </Alert>

            <Grid container spacing={4}>
              {Object.keys(secrets).map((key) => (
                <Grid size={{ xs: 12 }} key={key}>
                  <Grid container spacing={2} alignItems='center' className='bg-actionHover p-2 rounded'>
                    <Grid size={{ xs: 12, sm: 10 }}>
                      <Typography variant='subtitle1' className='font-bold'>{key}</Typography>
                      <Typography variant='caption' color='text.secondary'>Secret value is stored and encrypted.</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }} className='flex justify-end'>
                      <IconButton color='error' onClick={() => handleDeleteSecret(key)}>
                        <i className='tabler-trash' />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              ))}

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 4 }} />
                <Typography variant='h6' sx={{ mb: 4 }}>Add or Update Secret</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 5 }}>
                <CustomTextField
                  fullWidth
                  id='clinic_secret_key'
                  label='Key Name'
                  placeholder='e.g. smsGatewayApiToken'
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  autoComplete='off'
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 5 }}>
                <CustomTextField
                  fullWidth
                  label='Value'
                  id='clinic_secret'
                  type='password'
                  placeholder='Enter value'
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  autoComplete='new-password'
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }} className='flex items-end'>
                <Button variant='tonal' fullWidth onClick={handleAddSecret}>Add</Button>
              </Grid>

              <Grid size={{ xs: 12 }} className='mt-6'>
                <Button 
                  variant='contained' 
                  onClick={handleUpdateSecrets} 
                  disabled={updating || Object.keys(secrets).length === 0}
                >
                  {updating ? 'Saving Securely...' : 'Save All Secrets'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SecretsTab;
