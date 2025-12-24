'use client'

import { useState, useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'

import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

import type { Patient } from '@/types/patient.types'

import { patientService } from '@/services/patient.service'

import { getPatientValidationSchema } from '@/schemas/patienDetailsValidation'

type EditPatientDetailsProps = {
  open: boolean
  setOpen: (open: boolean) => void
  patientData?: Patient
}

const EditPatientDetails = ({ open, setOpen, patientData }: EditPatientDetailsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validationSchema = useMemo(() => getPatientValidationSchema(false), [])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Patient>({
    resolver: valibotResolver(validationSchema) as any,
    defaultValues: {}
  })


  useEffect(() => {
    if (open && patientData) {
      reset({
        ...patientData,
        dob: patientData.dob ? new Date(patientData.dob).toISOString().split('T')[0] : '',
        gender: patientData.gender?.toString(),
        ethnicity: patientData.ethnicity?.toString(),
        maritalStatus: patientData.maritalStatus?.toString(),
        bloodGroup: patientData.bloodGroup || '' // Ensure blood group is reset
      } as any)
    }
  }, [open, patientData, reset])

  const handleClose = () => {
    setOpen(false)
    setErrorMessage(null)
  }

  const onSubmit = async (data: Patient) => {
    if (!patientData?.id) return

    setIsLoading(true)
    setErrorMessage(null)

    const payload: Patient = {
      ...data,
      gender: data.gender,
      ethnicity: data.ethnicity,
      maritalStatus: data.maritalStatus,
      bloodGroup: data.bloodGroup
    }

    try {
      await patientService.updatePatient(String(patientData.id), payload)
      router.refresh()
      handleClose()
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update patient details')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit Patient Information
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          {errorMessage && (
            <Grid size={{ xs: 12 }} className='mb-4'>
              <Alert severity='error'>{errorMessage}</Alert>
            </Grid>
          )}

          <Grid container spacing={5}>
            {/* 1. Personal Info Section */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' color='primary'>1. Personal Details</Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='First Name' error={!!errors.firstName} helperText={errors.firstName?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Last Name' error={!!errors.lastName} helperText={errors.lastName?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='fullName'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Full Name' error={!!errors.fullName} helperText={errors.fullName?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='nic'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='NIC' error={!!errors.nic} helperText={errors.nic?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='dob'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth type='date' label='Date of Birth' InputLabelProps={{ shrink: true }} error={!!errors.dob} helperText={errors.dob?.message} />
                )}
              />
            </Grid>

            {/* --- UPDATED ROW: Gender, Ethnicity, Marital Status, Blood Group --- */}
            {/* Adjusted sizes to fit all 4 in one row: 3 + 4 + 3 + 2 = 12 */}

            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name='gender'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Gender'
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                  >
                    <MenuItem value="1">Male</MenuItem>
                    <MenuItem value="2">Female</MenuItem>
                    <MenuItem value="3">Other</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='ethnicity'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Ethnicity'
                    error={!!errors.ethnicity}
                    helperText={errors.ethnicity?.message}
                  >
                    <MenuItem value="0">Sinhala</MenuItem>
                    <MenuItem value="1">Tamil</MenuItem>
                    <MenuItem value="2">Muslims</MenuItem>
                    <MenuItem value="3">Other</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name='maritalStatus'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Marital Status'
                    error={!!errors.maritalStatus}
                    helperText={errors.maritalStatus?.message}
                  >
                    <MenuItem value="1">Single</MenuItem>
                    <MenuItem value="2">Married</MenuItem>
                    <MenuItem value="3">Divorced</MenuItem>
                    <MenuItem value="4">Widowed</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* --- Blood Group Added Here --- */}
            <Grid size={{ xs: 12, sm: 2 }}>
              <Controller
                name='bloodGroup'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Blood Group'
                    // Shortened placeholder to fit sm:2 size
                    placeholder='Select'
                    {...(errors.bloodGroup && { error: true, helperText: errors.bloodGroup.message })}
                  >
                    <MenuItem value='A+'>A+</MenuItem>
                    <MenuItem value='A-'>A-</MenuItem>
                    <MenuItem value='B+'>B+</MenuItem>
                    <MenuItem value='B-'>B-</MenuItem>
                    <MenuItem value='AB+'>AB+</MenuItem>
                    <MenuItem value='AB-'>AB-</MenuItem>
                    <MenuItem value='O+'>O+</MenuItem>
                    <MenuItem value='O-'>O-</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* 2. Contact Details Section */}
            <Grid size={{ xs: 12 }} className='mt-2'>
              <Typography variant='h6' color='primary'>2. Contact Details</Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='mobileNo'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Mobile No' error={!!errors.mobileNo} helperText={errors.mobileNo?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='landNo'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Land No' error={!!errors.landNo} helperText={errors.landNo?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Email' error={!!errors.email} helperText={errors.email?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Address' error={!!errors.address} helperText={errors.address?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='City' error={!!errors.city} helperText={errors.city?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='district'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='District' error={!!errors.district} helperText={errors.district?.message} />
                )}
              />
            </Grid>

            {/* 3. Emergency Contact Section */}
            <Grid size={{ xs: 12 }} className='mt-2'>
              <Typography variant='h6' color='primary'>3. Emergency Contact</Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactName'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Contact Name' error={!!errors.emergencyContactName} helperText={errors.emergencyContactName?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactRelationship'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Relationship' error={!!errors.emergencyContactRelationship} helperText={errors.emergencyContactRelationship?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactMobile'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Contact Mobile' error={!!errors.emergencyContactMobile} helperText={errors.emergencyContactMobile?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactEmail'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Contact Email' error={!!errors.emergencyContactEmail} helperText={errors.emergencyContactEmail?.message} />
                )}
              />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit' disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
          <Button variant='tonal' color='secondary' type='button' onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditPatientDetails