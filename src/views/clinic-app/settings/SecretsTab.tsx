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
import InputAdornment from '@mui/material/InputAdornment';
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
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    setLoading(true);
    const data = await getClinicSecrets();
    if (data) {
      setSecrets(data);
    }
    setLoading(false);
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

  const handleSecretChange = (key: string, val: string) => {
    setSecrets({ ...secrets, [key]: val });
  };

  const toggleShowValue = (key: string) => {
    setShowValues({ ...showValues, [key]: !showValues[key] });
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
              Enter the keys exactly as required by your integrations (e.g., twilio_sid, notify_lk_api_key).
            </Alert>

            <Grid container spacing={4}>
              {Object.keys(secrets).map((key) => (
                <Grid size={{ xs: 12 }} key={key}>
                  <Grid container spacing={2} alignItems='center'>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant='subtitle2' className='font-bold'>{key}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                      <CustomTextField
                        fullWidth
                        type={showValues[key] ? 'text' : 'password'}
                        value={secrets[key] ?? ''}
                        onChange={(e) => handleSecretChange(key, e.target.value)}
                        placeholder='Enter secret value'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={() => toggleShowValue(key)} edge='end'>
                                <i className={showValues[key] ? 'tabler-eye' : 'tabler-eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))}

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 4 }} />
                <Typography variant='h6' sx={{ mb: 4 }}>Add New Secret</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 5 }}>
                <CustomTextField
                  fullWidth
                  label='Key Name'
                  placeholder='e.g. twilio_auth_token'
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 5 }}>
                <CustomTextField
                  fullWidth
                  label='Value'
                  type='password'
                  placeholder='Enter value'
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
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
