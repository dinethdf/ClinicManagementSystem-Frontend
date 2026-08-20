'use client';

import { useState } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useForm, Controller } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { object, string, optional } from 'valibot';
import { toast } from 'react-toastify';

import CustomTextField from '@core/components/mui/TextField';
import type { ClinicDetailsDTO, ClinicBasicInfoUpdateDTO } from '@/services/settings.server.service';
import { updateClinicBasicInfo } from '@/services/settings.server.service';

type BrandingFormData = {
  logoUrl: string;
};

const brandingSchema = object({
  logoUrl: string(),
});

const BrandingSettingsTab = ({ initialData }: { initialData: ClinicDetailsDTO }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BrandingFormData>({
    resolver: valibotResolver(brandingSchema),
    defaultValues: {
      logoUrl: initialData.logoUrl || '',
    },
  });

  const logoUrl = watch('logoUrl');

  const onSubmit = async (data: BrandingFormData) => {
    setIsUpdating(true);


    // We only want to update the logoUrl part, but the service expects ClinicBasicInfoUpdateDTO
    const result = await updateClinicBasicInfo({
        name: initialData.name,
        mobileNo1: initialData.mobileNo1,
        address: initialData.address,
        logoUrl: data.logoUrl
    });

    setIsUpdating(false);
    
    if (result.success) {
      toast.success('Branding updated successfully');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader 
            title='Clinic Branding' 
            subheader='Manage your clinic logo and visual identity.' 
          />
          <Divider />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={6} alignItems='center'>
                <Grid size={{ xs: 12, md: 4 }} className='flex flex-col items-center justify-center gap-4'>
                  <Typography variant='subtitle1' className='font-medium'>Clinic Logo Preview</Typography>
                  <Avatar 
                    src={logoUrl || '/images/avatars/1.png'} 
                    variant='rounded'
                    sx={{ width: 120, height: 120, border: '1px solid var(--mui-palette-divider)' }}
                  />
                  <Typography variant='caption' color='text.secondary' align='center'>
                    Allowed JPG, GIF or PNG. Max size of 800kB
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                  <Grid container spacing={5}>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name='logoUrl'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Logo URL'
                            placeholder='https://example.com/logo.png'
                            error={!!errors.logoUrl}
                            helperText={errors.logoUrl?.message || 'Enter a URL for your clinic logo.'}
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12 }}>
                      <Alert severity='warning' icon={<i className='tabler-alert-triangle' />}>
                        Direct file upload is coming soon. Please provide a public URL for your logo for now.
                      </Alert>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Button variant='contained' type='submit' disabled={isUpdating}>
                        {isUpdating ? 'Saving...' : 'Save Branding'}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Note: In a real implementation, we would also add theme color selection here */}
    </Grid>
  );
};

import Alert from '@mui/material/Alert';

export default BrandingSettingsTab;
