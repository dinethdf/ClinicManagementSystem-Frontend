'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm, Controller, useFieldArray, FormProvider } from 'react-hook-form'
import { toast } from 'react-toastify'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@core/components/mui/IconButton'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

import { doctorService } from '@/services/doctor/doctor.service'
import type { Doctor, DoctorSchedule, DoctorScheduleCreateDTO } from '@/types/doctor.types'

const initialScheduleState = { 
  date: '', 
  startTime: '', 
  endTime: '', 
  doctorFee: 0, 
  clinicFee: 0, 
  maxPatientCount: 0, 
  registeredPatientCount: 0 
}

type AddDoctorScheduleDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  doctorData: Doctor
}

const AddDoctorScheduleDialog = ({ open, setOpen, doctorData }: AddDoctorScheduleDialogProps) => {
  const router = useRouter()
  const params = useParams()

  const methods = useForm<DoctorSchedule>({
    defaultValues: {
      doctor: doctorData,
      schedules: [initialScheduleState]
    }
  })

  const { control, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules'
  })

  useEffect(() => {
    if (open) {
      reset({ doctor: doctorData, schedules: [initialScheduleState] })
    }
  }, [open, doctorData, reset])

  const handleDateChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return
    const pad = (num: number) => num.toString().padStart(2, '0')
    const date = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`
    setValue(`schedules.${index}.date`, date, { shouldValidate: true })
  }

  const handleStartTimeChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return
    const time = dateObj.toTimeString().split(' ')[0].slice(0, 5)
    setValue(`schedules.${index}.startTime`, time, { shouldValidate: true })
  }

  const handleEndTimeChange = (index: number, dateObj: Date | null) => {
    if (!dateObj) return
    const time = dateObj.toTimeString().split(' ')[0].slice(0, 5)
    setValue(`schedules.${index}.endTime`, time, { shouldValidate: true })
  }

  const onSubmit = async (data: DoctorSchedule) => {
    const payload: DoctorScheduleCreateDTO[] = data.schedules.map(schedule => ({
      doctorId: doctorData.id || 0,
      scheduleDate: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      doctorFee: Number(schedule.doctorFee),
      clinicFee: Number(schedule.clinicFee),   
      maxPatientCount: Number(schedule.maxPatientCount), 
      registeredPatientCount: 0
    }))
    
    try {
      await doctorService.createBatchSchedules(payload)
      toast.success("Schedules published successfully!")
      setOpen(false)
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || "An unknown error occurred.")
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={() => setOpen(false)} 
      maxWidth="lg" 
      fullWidth 
      scroll="body"
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Add Doctor Schedule
        <Typography component='span' className='flex flex-col text-center'>
          Create new schedules for Dr. {doctorData?.firstName} {doctorData?.lastName}
        </Typography>
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="overflow-visible pbs-0 sm:pli-16">
            <Grid container spacing={6}>
              {fields.map((item, index) => (
                <Grid key={item.id} container spacing={4} className='repeater-item mbe-4 items-center'>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                      name={`schedules.${index}.date`}
                      control={control}
                      rules={{ required: 'Select Date' }}
                      render={({ field }) => (
                        <AppReactDatepicker
                          id={`date-picker-${index}`}
                          dateFormat='MM/dd/yyyy'
                          autoComplete="off"
                          selected={field.value ? new Date(`${field.value}T00:00:00`) : null}
                          onChange={date => handleDateChange(index, date)}
                          customInput={
                            <CustomTextField
                              label='Date'
                              fullWidth
                              error={!!errors?.schedules?.[index]?.date}
                              helperText={errors?.schedules?.[index]?.date?.message}
                            />
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 1.5 }}>
                    <Controller
                      name={`schedules.${index}.startTime`}
                      control={control}
                      rules={{ required: 'Required' }}
                      render={({ field }) => (
                        <AppReactDatepicker
                          showTimeSelect
                          showTimeSelectOnly
                          timeFormat='HH:mm'
                          timeIntervals={15}
                          id={`start-time-picker-${index}`}
                          dateFormat='HH:mm'
                          autoComplete="off"
                          selected={field.value ? new Date(`1970-01-01T${field.value}`) : null}
                          onChange={date => handleStartTimeChange(index, date)}
                          customInput={
                            <CustomTextField
                              label='Start Time'
                              fullWidth
                              placeholder='Start Time'
                              error={!!errors?.schedules?.[index]?.startTime}
                              helperText={errors?.schedules?.[index]?.startTime?.message}
                            />
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 1.5 }}>
                    <Controller
                      name={`schedules.${index}.endTime`}
                      control={control}
                      rules={{ required: 'Required' }}
                      render={({ field }) => (
                        <AppReactDatepicker
                          showTimeSelect
                          showTimeSelectOnly
                          timeFormat='HH:mm'
                          timeIntervals={15}
                          id={`end-time-picker-${index}`}
                          dateFormat='HH:mm'
                          autoComplete="off"
                          selected={field.value ? new Date(`1970-01-01T${field.value}`) : null}
                          onChange={date => handleEndTimeChange(index, date)}
                          customInput={
                            <CustomTextField
                              label='End Time'
                              fullWidth
                              placeholder='End Time'
                              error={!!errors?.schedules?.[index]?.endTime}
                              helperText={errors?.schedules?.[index]?.endTime?.message}
                            />
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Controller
                      name={`schedules.${index}.doctorFee`}
                      control={control}
                      rules={{ required: 'Required', min: 1 }}
                      render={({ field }) => (
                        <CustomTextField
                          label='Doctor Fee'
                          type='number'
                          fullWidth
                          placeholder='Fee'
                          {...field}
                          value={field.value === 0 ? '' : field.value}
                          onChange={e => field.onChange(Number(e.target.value))}
                          error={!!errors?.schedules?.[index]?.doctorFee}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Controller
                      name={`schedules.${index}.clinicFee`}
                      control={control}
                      rules={{ required: 'Required', min: 1 }}
                      render={({ field }) => (
                        <CustomTextField
                          label='Clinic Fee'
                          type='number'
                          fullWidth
                          placeholder='Fee'
                          {...field}
                          value={field.value === 0 ? '' : field.value}
                          onChange={e => field.onChange(Number(e.target.value))}
                          error={!!errors?.schedules?.[index]?.clinicFee}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 10, md: 1 }}>
                    <Controller
                      name={`schedules.${index}.maxPatientCount`}
                      control={control}
                      rules={{ required: 'Required', min: 1 }}
                      render={({ field }) => (
                        <CustomTextField
                          label='Max Count'
                          type='number'
                          fullWidth
                          placeholder='Count'
                          {...field}
                          value={field.value === 0 ? '' : field.value}
                          onChange={e => field.onChange(Number(e.target.value))}
                          error={!!errors?.schedules?.[index]?.maxPatientCount}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 2, md: 1 }}>
                    <CustomIconButton onClick={() => remove(index)} color="error" className="mt-4">
                      <i className='tabler-trash' />
                    </CustomIconButton>
                  </Grid>
                </Grid>
              ))}

              <Grid size={{ xs: 12 }}>
                <Button variant='outlined' onClick={() => append(initialScheduleState)} startIcon={<i className='tabler-plus' />}>
                  Add Another Option
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-6">
            <Button variant='contained' type='submit' disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}>
              {isSubmitting ? 'Publishing...' : 'Publish Schedule'}
            </Button>
            <Button variant='tonal' color='secondary' onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  )
}

export default AddDoctorScheduleDialog
