'use client';

import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useForm, Controller } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { object, string, minLength, pipe, number, optional, union, literal, minValue } from 'valibot';
import { toast } from 'react-toastify';

import Typography from '@mui/material/Typography';
import CustomTextField from '@core/components/mui/TextField';
import type { ClinicDetailsDTO, ClinicBasicInfoUpdateDTO, ClinicSettingsDTO } from '@/services/settings.server.service';
import { updateClinicBasicInfo, updateBusinessSettings } from '@/services/settings.server.service';

const basicInfoSchema = object({
  name: pipe(string(), minLength(1, 'Name is required')),
  mobileNo1: pipe(string(), minLength(1, 'Mobile No is required')),
  mobileNo2: optional(string()),
  landlineNo: optional(string()),
  address: pipe(string(), minLength(1, 'Address is required')),
  city: optional(string()),
  district: optional(string()),
});

const businessSettingsSchema = object({
  currency: pipe(string(), minLength(1, 'Currency is required')),
  timezone: pipe(string(), minLength(1, 'Timezone is required')),
  language: pipe(string(), minLength(1, 'Language is required')),
  invoicePrefix: pipe(string(), minLength(1, 'Invoice Prefix is required')),
  taxRate: pipe(number(), minValue(0, 'Tax Rate must be at least 0')),
  otpSmsGateway: optional(union([string(), literal(null as const)])),
  appointmentBookedSmsGateway: optional(union([string(), literal(null as const)])),
  appointmentConfirmSmsGateway: optional(union([string(), literal(null as const)])),
});

const GeneralSettingsTab = ({ initialData }: { initialData: ClinicDetailsDTO }) => {
  const [isUpdatingBasic, setIsUpdatingBasic] = useState(false);
  const [isUpdatingBusiness, setIsUpdatingBusiness] = useState(false);

  // 1. Basic Info Form
  const {
    control: basicControl,
    handleSubmit: handleBasicSubmit,
    formState: { errors: basicErrors },
  } = useForm<ClinicBasicInfoUpdateDTO>({
    resolver: valibotResolver(basicInfoSchema),
    defaultValues: {
      name: initialData.name || '',
      mobileNo1: initialData.mobileNo1 || '',
      mobileNo2: initialData.mobileNo2 || '',
      landlineNo: initialData.landlineNo || '',
      address: initialData.address || '',
      city: initialData.city || '',
      district: initialData.district || '',
    },
  });

  // 2. Business Settings Form
  const {
    control: businessControl,
    handleSubmit: handleBusinessSubmit,
    formState: { errors: businessErrors },
  } = useForm<ClinicSettingsDTO>({
    resolver: valibotResolver(businessSettingsSchema),
    defaultValues: {
      currency: initialData.settings?.currency || 'LKR',
      timezone: initialData.settings?.timezone || 'Asia/Colombo',
      language: initialData.settings?.language || 'en',
      invoicePrefix: initialData.settings?.invoicePrefix || 'INV-',
      taxRate: initialData.settings?.taxRate || 0,
      otpSmsGateway: initialData.settings?.otpSmsGateway || null,
      appointmentBookedSmsGateway: initialData.settings?.appointmentBookedSmsGateway || null,
      appointmentConfirmSmsGateway: initialData.settings?.appointmentConfirmSmsGateway || null,
    },
  });

  const onBasicSubmit = async (data: ClinicBasicInfoUpdateDTO) => {
    setIsUpdatingBasic(true);
    const result = await updateClinicBasicInfo(data);
    setIsUpdatingBasic(false);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const onBusinessSubmit = async (data: ClinicSettingsDTO) => {
    setIsUpdatingBusiness(true);
    const result = await updateBusinessSettings(data);
    setIsUpdatingBusiness(false);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Grid container spacing={6}>
      {/* Basic Information */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Clinic Information' />
          <Divider />
          <CardContent>
            <form onSubmit={handleBasicSubmit(onBasicSubmit)}>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='name'
                    control={basicControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Clinic Name'
                        placeholder='CureGuard Wellness Center'
                        error={!!basicErrors.name}
                        helperText={basicErrors.name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='Email (Read-only)'
                    value={initialData.email ?? ''}
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name='mobileNo1'
                    control={basicControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Mobile No 1'
                        placeholder='0771234567'
                        error={!!basicErrors.mobileNo1}
                        helperText={basicErrors.mobileNo1?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name='mobileNo2'
                    control={basicControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Mobile No 2 (Optional)'
                        placeholder='0771234568'
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name='landlineNo'
                    control={basicControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Landline No (Optional)'
                        placeholder='0112223334'
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='address'
                    control={basicControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Address'
                        placeholder='123 Main St'
                        error={!!basicErrors.address}
                        helperText={basicErrors.address?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='city'
                    control={basicControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='City'
                        placeholder='Colombo'
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='district'
                    control={basicControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='District'
                        placeholder='Colombo'
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button variant='contained' type='submit' disabled={isUpdatingBasic}>
                    {isUpdatingBasic ? 'Saving...' : 'Save Basic Info'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>

      {/* Business Settings */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Business Settings' />
          <Divider />
          <CardContent>
            <form onSubmit={handleBusinessSubmit(onBusinessSubmit)}>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name='currency'
                    control={businessControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        select
                        fullWidth
                        label='Currency'
                        error={!!businessErrors.currency}
                        helperText={businessErrors.currency?.message}
                      >
                        <MenuItem value='LKR'>LKR (Sri Lankan Rupee)</MenuItem>
                        <MenuItem value='USD'>USD (US Dollar)</MenuItem>
                        <MenuItem value='GBP'>GBP (British Pound)</MenuItem>
                        <MenuItem value='EUR'>EUR (Euro)</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name='timezone'
                    control={businessControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Timezone'
                        placeholder='Asia/Colombo'
                        error={!!businessErrors.timezone}
                        helperText={businessErrors.timezone?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name='language'
                    control={businessControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        select
                        fullWidth
                        label='Language'
                        error={!!businessErrors.language}
                        helperText={businessErrors.language?.message}
                      >
                        <MenuItem value='en'>English</MenuItem>
                        <MenuItem value='si'>Sinhala</MenuItem>
                        <MenuItem value='ta'>Tamil</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='invoicePrefix'
                    control={businessControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Invoice Prefix'
                        placeholder='INV-'
                        error={!!businessErrors.invoicePrefix}
                        helperText={businessErrors.invoicePrefix?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='taxRate'
                    control={businessControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        type='number'
                        label='Tax Rate (%)'
                        error={!!businessErrors.taxRate}
                        helperText={businessErrors.taxRate?.message}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    )}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant='h6' sx={{ mb: 4 }}>SMS Gateway Configurations</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name='otpSmsGateway'
                    control={businessControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        select
                        fullWidth
                        label='OTP SMS Gateway'
                        value={field.value || 'NONE'}
                        onChange={e => field.onChange(e.target.value === 'NONE' ? null : e.target.value)}
                      >
                        <MenuItem value='NONE'>None (Disabled)</MenuItem>
                        <MenuItem value='SMS_GATEWAY'>SMS Gateway (International/Local)</MenuItem>
                        <MenuItem value='SMS_APP'>SMS App (Android)</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name='appointmentBookedSmsGateway'
                    control={businessControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        select
                        fullWidth
                        label='Booking Confirmation Gateway'
                        value={field.value || 'NONE'}
                        onChange={e => field.onChange(e.target.value === 'NONE' ? null : e.target.value)}
                      >
                        <MenuItem value='NONE'>None (Disabled)</MenuItem>
                        <MenuItem value='SMS_GATEWAY'>SMS Gateway (International/Local)</MenuItem>
                        <MenuItem value='SMS_APP'>SMS App (Android)</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name='appointmentConfirmSmsGateway'
                    control={businessControl}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        select
                        fullWidth
                        label='Reminders/Confirm Gateway'
                        value={field.value || 'NONE'}
                        onChange={e => field.onChange(e.target.value === 'NONE' ? null : e.target.value)}
                      >
                        <MenuItem value='NONE'>None (Disabled)</MenuItem>
                        <MenuItem value='SMS_GATEWAY'>SMS Gateway (International/Local)</MenuItem>
                        <MenuItem value='SMS_APP'>SMS App (Android)</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button variant='contained' type='submit' disabled={isUpdatingBusiness}>
                    {isUpdatingBusiness ? 'Saving...' : 'Save Business Settings'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default GeneralSettingsTab;
