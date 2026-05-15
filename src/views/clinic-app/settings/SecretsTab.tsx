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
import InputAdornment from '@mui/material/InputAdornment';
import { toast } from 'react-toastify';

import CustomTextField from '@core/components/mui/TextField';
import { getClinicSecrets, updateClinicSecrets } from '@/services/settings.server.service';
import type { ClinicSecretsDTO } from '@/services/settings.server.service';
import { transportEncrypt, transportDecrypt } from '@/utils/FEValueEncryption';

const REQUIRED_KEYS = [
  { key: 'smsAppApiKey', label: 'CureGuard SMS App API Key', description: 'Required for Android SMS App integration' },
  { key: 'smsGatewayApiToken', label: 'SMS Gateway API Token', description: 'API Token from your SMS provider (e.g. Text.lk)' },
  { key: 'smsGatewaySenderId', label: 'SMS Gateway Sender ID', description: 'Approved Sender Name/ID for SMS' },
];

const SecretsTab = () => {
  const [secrets, setSecrets] = useState<ClinicSecretsDTO>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    setLoading(true);
    try {
      const encryptedData = await getClinicSecrets();
      if (encryptedData) {
        const decryptedJson = transportDecrypt(encryptedData);
        if (decryptedJson) {
            try {
                setSecrets(JSON.parse(decryptedJson));
            } catch (e) {
                console.error("Failed to parse secrets JSON:", e);
                setSecrets({});
            }
        } else {
            setSecrets({});
        }
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
    
    // Encrypt for transport to hide from Network Tab
    const encryptedData = transportEncrypt(JSON.stringify(secrets));
    
    if (!encryptedData) {
      toast.error('Failed to secure data for transmission');
      setUpdating(false);
      return;
    }

    const result = await updateClinicSecrets(encryptedData);
    setUpdating(false);
    if (result.success) {
      toast.success(result.message);
      setIsEditing(false); // Disable editing after success
      fetchSecrets();
    } else {
      toast.error(result.message);
    }
  };

  const handleSecretChange = (key: string, value: string) => {
    setSecrets(prev => ({ ...prev, [key]: value }));
  };

  const handleAddSecret = () => {
    const finalKey = selectedKey === 'custom' ? customKey : selectedKey;
    
    if (!finalKey || !newValue) {
      toast.error('Both key and value are required');
      return;
    }

    if (secrets[finalKey]) {
        toast.warn('Key already exists in the list above.');
    }

    setSecrets(prev => ({ ...prev, [finalKey]: newValue }));
    setSelectedKey('');
    setCustomKey('');
    setNewValue('');
    toast.success(`${finalKey} added to the edit list.`);
  };

  const handleDeleteSecret = (keyToDelete: string) => {
    const newSecrets = { ...secrets };
    delete newSecrets[keyToDelete];
    setSecrets(newSecrets);
  };

  // Filter out required keys that are already present in the secrets list
  const availableRequiredKeys = REQUIRED_KEYS.filter(rk => !Object.keys(secrets).includes(rk.key));

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
            subheader='Manage your sensitive API keys. All values are stored securely and encrypted.'
            action={
                <Button 
                    variant='tonal' 
                    color={isEditing ? 'error' : 'primary'}
                    startIcon={<i className={isEditing ? 'tabler-lock-open' : 'tabler-edit'} />}
                    onClick={() => setIsEditing(!isEditing)}
                    size='small'
                >
                    {isEditing ? 'Cancel Editing' : 'Edit Secrets'}
                </Button>
            }
          />
          <Divider />
          <CardContent>
            <Alert severity={isEditing ? 'warning' : 'info'} className='mb-6'>
              {isEditing 
                ? 'Editing mode is active. You can now modify your integration secrets below.' 
                : 'Secrets are locked. Click the "Edit Secrets" button above to make changes.'
              }
            </Alert>

            <Grid container spacing={5}>
              {Object.keys(secrets).length > 0 ? (
                Object.keys(secrets).map((key) => {
                    const requiredInfo = REQUIRED_KEYS.find(rk => rk.key === key);
                    const label = requiredInfo ? requiredInfo.label : key;
                    const description = requiredInfo ? requiredInfo.description : 'Custom integration secret';

                    return (
                        <Grid size={{ xs: 12 }} key={key}>
                            <CustomTextField
                                fullWidth
                                label={label}
                                placeholder={description}
                                type='password'
                                value={secrets[key] || ''}
                                onChange={(e) => handleSecretChange(key, e.target.value)}
                                autoComplete='new-password'
                                helperText={description}
                                disabled={!isEditing}
                                InputProps={{
                                    endAdornment: isEditing && (
                                        <InputAdornment position='end'>
                                            <IconButton color='error' onClick={() => handleDeleteSecret(key)} size='small' title='Remove Secret'>
                                                <i className='tabler-trash' />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    );
                })
              ) : (
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' color='text.secondary' align='center' className='py-10 bg-actionHover rounded border border-dashed'>
                    No secrets stored yet. {isEditing ? 'Add your first API key below.' : 'Click "Edit" to add a secret.'}
                  </Typography>
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 6 }} />
                <Typography variant='h6' sx={{ mb: 4 }} color={isEditing ? 'text.primary' : 'text.disabled'}>
                    Add New Secret Key
                </Typography>
              </Grid>

              <Grid container spacing={4} className='items-end'>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <CustomTextField
                    select
                    fullWidth
                    label='Select Key Type'
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    disabled={!isEditing}
                    >
                    <MenuItem value=''>Select a key</MenuItem>
                    {availableRequiredKeys.map((item) => (
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
                        disabled={!isEditing}
                    />
                    </Grid>
                )}

                <Grid size={{ xs: 12, sm: selectedKey === 'custom' ? 4 : 5 }}>
                    <CustomTextField
                    fullWidth
                    label='Secret Value'
                    type='password'
                    placeholder='Enter secure value'
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    autoComplete='new-password'
                    disabled={!isEditing}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 3 }} className='flex items-end'>
                    <Button 
                        variant='tonal' 
                        onClick={handleAddSecret}
                        startIcon={<i className='tabler-plus' />}
                        disabled={!isEditing || !selectedKey || (selectedKey === 'custom' && !customKey) || !newValue}
                        className='mb-1'
                    >
                        Add to List
                    </Button>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }} className='mt-10'>
                <Divider className='mb-6' />
                <div className='flex flex-wrap justify-between items-center gap-4'>
                  <Typography variant='caption' color='text.secondary italic'>
                    * All changes made above are temporary until you click "Save All Changes".
                  </Typography>
                  <Button 
                    variant='contained' 
                    onClick={handleUpdateSecrets} 
                    disabled={!isEditing || updating}
                    size='large'
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
