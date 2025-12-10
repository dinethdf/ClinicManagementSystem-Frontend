'use client'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { toast } from 'react-toastify'

// React Hook Form Imports
import { useForm, FormProvider, Controller } from 'react-hook-form'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps'

import SheduleVariants from './SheduleVariants'

import type {Doctor, DoctorSchedule, DoctorScheduleDTO } from '@/types/doctor.types'

import { doctorService } from '@/services/doctor.service';

const SheduleInformation = ({role}: { role: string }) => {

  console.log(role)

  // Initialize React Hook Form
  
  const methods = useForm<DoctorSchedule>({
    defaultValues: {
      doctor: null,
      schedules: []
    }
  })

  const { control, watch, reset } = methods

  const watchedDoctor = watch('doctor');

const onSubmit = async (data: DoctorSchedule) => {
  
  if (!data.doctor) {
    
    toast.error('Please select a doctor first.');
    
    return;
  }

  const payload : DoctorScheduleDTO[] = data.schedules.map(schedule => ({
    doctorId: data?.doctor?.id ? data?.doctor?.id : 0,
    scheduleDate: schedule.date,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    doctorFee: Number(schedule.doctorFee),
    clinicFee: Number(schedule.clinicFee),   
    maxPatientCount: Number(schedule.maxPatientCount), 
    registeredPatientCount:0
  }));
  
  try {

    await doctorService.createBatchSchedules(payload);
    reset();
    
    toast.success("Schedules published successfully!");
    

  } catch (error:any) {
    toast.error(error.message || "An unknown error occurred.");
  }
};


  // useEffect(() => {
  //   if (watchedDoctor) {
  //     // setValue('doctorName', watchedDoctor?.firstName || '')
  //   } else {
  //     // setValue('doctorName', '')
  //   }
  // }, [watchedDoctor, setValue])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader title='Doctor Information' />
              <CardContent>
                <Grid container spacing={6} className='mbe-6'>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name='doctor'
                      control={control}
                      rules={{ required: 'Please select a doctor' }}
                      render={({ field, fieldState: { error } }) => (
                        <AsyncAutocomplete
                          {...field}
                          label='Search Doctor'
                          fetchUrl='/api/doctor/search'
                          searchParamKey='q'
                          placeholder='Enter Name'
                          getOptionLabel={(doctor:Doctor) => doctor.firstName + " " + doctor.lastName + " : " + doctor.specialization.name }
                          fetchInputLenth={2}
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid>
                  {watchedDoctor && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          fullWidth
                          label='Name with Initials'
                          value={(watchedDoctor?.nameWithInitials as string) || ''}
                          slotProps={{
                            htmlInput: { readOnly: true }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          fullWidth
                          label='SLMC Number'
                          value={(watchedDoctor?.slmcNumber as string) || ''}
                          slotProps={{
                            htmlInput: { readOnly: true }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          fullWidth
                          label='Mobile No'
                          value={(watchedDoctor?.mobileNo as string) || ''}
                          slotProps={{
                            htmlInput: { readOnly: true }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          fullWidth
                          label='Email'
                          defaultValue={(watchedDoctor?.email as string) || ''}
                          slotProps={{
                            htmlInput: { readOnly: true }
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                {/* <Typography className='mbe-1'>Description (Optional)</Typography> */}
              </CardContent>
            </Card>
          </Grid>
          <Divider />
          <Grid size={{ xs: 12 }}>
            <SheduleVariants />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default SheduleInformation
