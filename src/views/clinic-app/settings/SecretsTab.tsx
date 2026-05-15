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
import MenuItem from '@mui/material/MenuItem';
import { toast } from 'react-toastify';

import CustomTextField from '@core/components/mui/TextField';
import { getClinicSecrets, updateClinicSecrets } from '@/services/settings.server.service';
import type { ClinicSecretsDTO } from '@/services/settings.server.service';

const REQUIRED_KEYS = [
  { key: 'smsAppApiKey', label: 'CureGuard SMS App API Key', description: 'Required for Android SMS App integration' },
  { key: 'smsGatewayApiToken', label: 'SMS Gateway API Token', description: 'API Token from your SMS provider (e.g. Text.lk)' },
  { key: 'smsGatewaySenderId', label: 'SMS Gateway Sender ID', description: 'Approved Sender Name/ID for SMS' },
];

const SecretsTab = () => {
  const [secrets, setSecrets] = useState<ClinicSecretsDTO>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    setLoading(true);
    try {
      const data = await getClinicSecrets();
      if (data) {
        setSecrets(data);
      } else {
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
    const finalKey = selectedKey === 'custom' ? customKey : selectedKey;
    
    if (!finalKey || !newValue) {
      toast.error('Both key and value are required');
      return;
    }
    setSecrets({ ...secrets, [finalKey]: newValue });
    setSelectedKey('');
    setCustomKey('');
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
              Select a key type or enter a custom key name to store your integration secrets.
            </Alert>

            <Grid container spacing={4}>
              {Object.keys(secrets).length > 0 ? (
                Object.keys(secrets).map((key) => (
                  <Grid size={{ xs: 12 }} key={key}>
                    <Grid container spacing={2} alignItems='center' className='bg-actionHover p-2 rounded border border-dashed border-divider'>
                      <Grid size={{ xs: 12, sm: 10 }}>
                        <div className='flex items-center gap-2'>
                          <i className='tabler-lock text-success' />
                          <Typography variant='subtitle1' className='font-bold'>{key}</Typography>
                        </div>
                        <Typography variant='caption' color='text.secondary' className='ml-6'>
                          Secret value is stored and encrypted.
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 2 }} className='flex justify-end'>
                        <IconButton color='error' onClick={() => handleDeleteSecret(key)} size='small'>
                          <i className='tabler-trash' />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                ))
              ) : (
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' color='text.secondary' align='center' className='py-4'>
                    No secrets stored yet. Add your first API key below.
                  </Typography>
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 4 }} />
                <Typography variant='h6' sx={{ mb: 4 }}>Add or Update Secret</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='Select Key Type'
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.target.value)}
                >
                  <MenuItem value=''>Select a key</MenuItem>
                  {REQUIRED_KEYS.map((item) => (
                    <MenuItem key={item.key} value={item.key}>
                      {item.label}
                    </MenuItem>
                  ))}
                  <MenuItem value='custom'>Other (Custom Key)</MenuItem>
                </CustomTextField>
              </Grid>

              {selectedKey === 'custom' && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <CustomTextField
                    fullWidth
                    label='Custom Key Name'
                    placeholder='e.g. myServiceApiKey'
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                  />
                </Grid>
              )}

              <Grid size={{ xs: 12, sm: selectedKey === 'custom' ? 4 : 5 }}>
                <CustomTextField
                  fullWidth
                  label='Secret Value'
                  type='password'
                  placeholder='Enter value'
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  autoComplete='new-password'
                />
              </Grid>

              <Grid size={{ xs: 12 }} className='flex justify-end gap-4'>
                <Button 
                    variant='tonal' 
                    onClick={handleAddSecret}
                    startIcon={<i className='tabler-plus' />}
                    disabled={!selectedKey || (selectedKey === 'custom' && !customKey) || !newValue}
                  >
                    Add to Vault
                </Button>
              </Grid>

              <Grid size={{ xs: 12 }} className='mt-6'>
                <Divider className='mb-6' />
                <div className='flex justify-between items-center'>
                  <Typography variant='caption' color='text.secondary italic'>
                    * Remember to click "Save All Changes" to persist your updates to the server.
                  </Typography>
                  <Button 
                    variant='contained' 
                    onClick={handleUpdateSecrets} 
                    disabled={updating}
                    startIcon={updating ? <CircularProgress size={20} color='inherit' /> : <i className='tabler-device-floppy' />}
                  >
                    {updating ? 'Saving Securely...' : 'Save All Changes'}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SecretsTab;