'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import dayjs from 'dayjs'

// MUI Imports
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
import InputAdornment from '@mui/material/InputAdornment'
import type { TextFieldProps } from '@mui/material/TextField'

// Custom Components
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import CustomDatePicker from '@/components/custome/DatePickerTextField' 
import GuardianSelectDialogBox from '@components/dialogs/guardian-select'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

// Types & Services
import type { Patient, Guardian } from '@/types/patient.types'
import { patientService } from '@/services/patient/patient.service'
import { getPatientValidationSchema } from '@/schemas/patienDetailsValidation'
import { toast } from 'react-toastify'

type EditPatientDetailsProps = {
  open: boolean
  setOpen: (open: boolean) => void
  patientData?: Patient
  bySelf : boolean 
}

const EditPatientDetails = ({ open, setOpen, patientData, bySelf}: EditPatientDetailsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Logic for Underage check
  const [isUnderAge, setIsUnderAge] = useState(false)
  const triggerRef = useRef(null)

  // Dynamic Validation Schema
  const validationSchema = useMemo(() => getPatientValidationSchema(isUnderAge), [isUnderAge])

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<Patient>({
    resolver: valibotResolver(validationSchema) as any,
    defaultValues: {}
  })

  // 1. Initialize Form Data on Open
  useEffect(() => {
    if (open && patientData) {
      // Calculate age logic safely
      let isChild = false
      if (patientData.dob) {
         const today = new Date()
         const bday = new Date(patientData.dob)
         let age = today.getFullYear() - bday.getFullYear()
         const m = today.getMonth() - bday.getMonth()
         if (m < 0 || (m === 0 && today.getDate() < bday.getDate())) age--
         isChild = age < 18
      }
      setIsUnderAge(isChild)

      // Safely map all potential nulls to empty strings for controlled inputs
      reset({
        ...patientData,
        firstName: patientData.firstName || '',
        lastName: patientData.lastName || '',
        fullName: patientData.fullName || '',
        dob: patientData.dob ? patientData.dob : null, 
        gender: patientData.gender ? String(patientData.gender) : '',
        ethnicity: patientData.ethnicity ? String(patientData.ethnicity) : '',
        maritalStatus: patientData.maritalStatus ? String(patientData.maritalStatus) : '',
        bloodGroup: patientData.bloodGroup || '',
        
        weight: patientData.weight ?? '', 
        height: patientData.height ?? '',
        
        nic: patientData.nic || '',
        address: patientData.address || '',
        city: patientData.city || '',
        district: patientData.district || '',
        mobileNo: patientData.mobileNo || '',
        landNo: patientData.landNo || '',
        email: patientData.email || '',

        relationshipToGuardian: patientData.relationshipToGuardian || '',
        guardian: patientData.guardian || null,
        
        emergencyContactName: patientData.emergencyContactName || '',
        emergencyContactRelationship: patientData.emergencyContactRelationship || '',
        emergencyContactMobile: patientData.emergencyContactMobile || '',
        emergencyContactEmail: patientData.emergencyContactEmail || '',
      } as any)
    }
  }, [open, patientData, reset])

  const handleClose = () => {
    setOpen(false)
    setErrorMessage(null)
  }

  // 2. Guardian Selection Logic
  const selectGuardian = (guardian: Guardian) => {
       setValue("nic", "") // Children don't usually use NIC if guardian is present
       setValue("address", guardian.address || '')
       setValue("city", guardian.city || '')
       setValue("district", guardian.district || '')
       setValue("email", guardian.email || '')
       setValue("mobileNo", guardian.mobileNo || '')
       setValue("landNo", guardian?.landNo || "")
       setValue("guardian", guardian || null)
       clearErrors('guardian')
  } 
  
  const resetGuardian = () => {
       setValue("nic", '')
       setValue("address", '')
       setValue("city", '')
       setValue("district", '')
       setValue("email", '')
       setValue("mobileNo", '')
       setValue("landNo", '')
       setValue("guardian", null)
       setValue("relationshipToGuardian", '') 
  }   

  const onSubmit = async (data: Patient) => {
    if (!patientData?.id) return
    setIsLoading(true)
    setErrorMessage(null)

    // 3. Build Payload & Enforce Guardian Rules
    const payload: Patient = {
      ...data,
      // Parse numbers safely
      weight: !data.weight ? null : Number(data.weight),
      height: !data.height ? null : Number(data.height),
      
      // Strictly enforce guardian logic for backend
      guardian: isUnderAge ? data.guardian : null,
      relationshipToGuardian: isUnderAge ? data.relationshipToGuardian : null,
      nic: isUnderAge ? '' : (data.nic || '')
    }

    try {
      if (bySelf) {
        await patientService.updatePatientBySelf(String(patientData.id), payload)
      } else {
        await patientService.updatePatient(String(patientData.id), payload)
      }
      router.refresh()
      handleClose()
      toast.success('Patient details updated successfully!', { className: 'custom-toast' })
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

      {/* Changed variant to div to prevent HTML validation errors */}
      <DialogTitle component="div" className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <Typography variant='h4'>Edit Patient Information</Typography>
        {patientData?.isTemp === false && (
          <Typography variant='body2' color='warning.main'>
            Please complete the missing required fields to fully register this temporary patient.
          </Typography>
        )}
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
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='First Name' error={!!errors.firstName} helperText={errors.firstName?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Last Name' error={!!errors.lastName} helperText={errors.lastName?.message} />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='fullName'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Full Name' error={!!errors.fullName} helperText={errors.fullName?.message} />
                )}
              />
            </Grid>            
            
            {/* DOB & Age Logic */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='dob'
                control={control}
                render={({ field }) => (
                  <CustomDatePicker 
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={newValue => {
                      let age = 0
                      if (newValue) {
                        const today = new Date()
                        const bday = newValue.toDate()
                        age = today.getFullYear() - bday.getFullYear()
                        const m = today.getMonth() - bday.getMonth()
                        if (m < 0 || (m === 0 && today.getDate() < bday.getDate())) age--
                      }

                      // If they were underage, and now are an adult, clear the guardian
                      if(isUnderAge && age >= 18){
                          resetGuardian()
                      }
                      setIsUnderAge(age < 18 && newValue !== null) 
                      field.onChange(newValue ? newValue.format('YYYY-MM-DD') : null)
                    }} 
                    label='Date of Birth' 
                    openTo='year'
                    views={['year', 'month', 'day']}
                    maxDate={dayjs()}
                    format='YYYY-MM-DD'
                    slotProps={{ textField: { error: !!errors.dob, helperText: errors.dob?.message } }}
                  />
                )}
              />
            </Grid>

            {/* NIC - Disabled for Children */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='nic'
                control={control}
                render={({ field }) => (
                  <CustomTextField 
                    {...field} 
                    value={field.value ?? ''}
                    fullWidth 
                    label='NIC' 
                    disabled={isUnderAge} // Disabled if underage
                    error={!!errors.nic} 
                    helperText={errors.nic?.message} 
                  />
                )}
              />
            </Grid>

            {/* Gender, Ethnicity, Marital Status */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='gender'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} select fullWidth label='Gender' error={!!errors.gender} helperText={errors.gender?.message}>
                    <MenuItem value=''>Select</MenuItem>
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
                  <CustomTextField {...field} value={field.value ?? ''} select fullWidth label='Ethnicity' error={!!errors.ethnicity} helperText={errors.ethnicity?.message}>
                    <MenuItem value=''>Select</MenuItem>
                    <MenuItem value="0">Sinhala</MenuItem>
                    <MenuItem value="1">Tamil</MenuItem>
                    <MenuItem value="2">Muslims</MenuItem>
                    <MenuItem value="3">Other</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='maritalStatus'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} select fullWidth label='Marital Status' error={!!errors.maritalStatus} helperText={errors.maritalStatus?.message}>
                    <MenuItem value=''>Select</MenuItem>
                    <MenuItem value="1">Single</MenuItem>
                    <MenuItem value="2">Married</MenuItem>
                    <MenuItem value="3">Divorced</MenuItem>
                    <MenuItem value="4">Widowed</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='bloodGroup'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} select fullWidth label='Blood Group' error={!!errors.bloodGroup} helperText={errors.bloodGroup?.message}>
                    <MenuItem value=''>Select</MenuItem>
                    <MenuItem value='A+'>A+</MenuItem>
                    <MenuItem value='O+'>O+</MenuItem>
                    <MenuItem value='B+'>B+</MenuItem>
                    <MenuItem value='AB+'>AB+</MenuItem>
                    <MenuItem value='A-'>A-</MenuItem>
                    <MenuItem value='O-'>O-</MenuItem>
                    <MenuItem value='B-'>B-</MenuItem>
                    <MenuItem value='AB-'>AB-</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                    name='weight'
                    control={control}
                    render={({ field }) => (
                    <CustomTextField
                        {...field}
                        fullWidth
                        type="number"
                        label='Weight (kg)'
                        placeholder='e.g. 65'
                        onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === '' ? '' : val);
                        }}
                        value={field.value ?? ''} 
                        error={!!errors.weight}
                        helperText={errors.weight?.message}
                    />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                    name='height'
                    control={control}
                    render={({ field }) => (
                    <CustomTextField
                        {...field}
                        fullWidth
                        type="number"
                        label='Height (cm)'
                        placeholder='e.g. 170'
                        onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === '' ? '' : val);
                        }}
                        value={field.value ?? ''} 
                        error={!!errors.height}
                        helperText={errors.height?.message}
                    />
                    )}
                />
            </Grid>

            {/* --- GUARDIAN & RELATIONSHIP (Visible only if Underage) --- */}
            {isUnderAge && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                    name='guardian'
                    control={control}
                    render={({ field }) => {
                        const displayValue = field.value && typeof field.value === 'object'
                            ? `${field.value.firstName} ${field.value.lastName}` : ''          

                        const textFieldProps: TextFieldProps = {
                            ...field,
                            fullWidth: true,
                            label: 'Guardian',
                            placeholder: 'Click to Select Guardian',
                            value: displayValue,
                            InputProps: {
                                readOnly: true,
                                startAdornment: (
                                <InputAdornment position='start'>
                                    <i className='tabler-user' />
                                </InputAdornment>
                                )
                            },
                            inputProps: {style: {cursor: 'pointer'}},
                            error: !!errors.guardian,
                            helperText: errors.guardian?.message
                        }
                        return (
                        <OpenDialogOnElementClick
                            element={CustomTextField}
                            elementProps={textFieldProps}
                            dialog={GuardianSelectDialogBox}
                            dialogProps={{
                                onSelectGuardian: selectGuardian,
                                triggerRef: triggerRef
                            }}
                        />
                        )
                    }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name='relationshipToGuardian'
                        control={control}
                        render={({ field }) => (
                        <CustomTextField
                            {...field}
                            value={field.value ?? ''}
                            select
                            fullWidth
                            label='Relationship to Guardian'
                            error={!!errors.relationshipToGuardian} 
                            helperText={errors.relationshipToGuardian?.message}
                        >
                            <MenuItem value=''>Select</MenuItem>
                            <MenuItem value='Father'>Father</MenuItem>
                            <MenuItem value='Mother'>Mother</MenuItem>
                            <MenuItem value='Grandparent'>Grandparent</MenuItem>
                            <MenuItem value='Other'>Other</MenuItem>
                        </CustomTextField>
                        )}
                    />
                </Grid>
              </>
            )}

            {/* 2. Contact Details Section */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' color='primary' className='mt-4'>2. Contact Details</Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='mobileNo'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Mobile No' disabled={isUnderAge} error={!!errors.mobileNo} helperText={errors.mobileNo?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='landNo'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Land No' disabled={isUnderAge} error={!!errors.landNo} helperText={errors.landNo?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Email' disabled={isUnderAge} error={!!errors.email} helperText={errors.email?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Address' disabled={isUnderAge} error={!!errors.address} helperText={errors.address?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='City' disabled={isUnderAge} error={!!errors.city} helperText={errors.city?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='district'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='District' disabled={isUnderAge} error={!!errors.district} helperText={errors.district?.message} />
                )}
              />
            </Grid>

            {/* 3. Emergency Contact Section */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' color='primary' className='mt-4'>3. Emergency Contact</Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactName'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Contact Name' error={!!errors.emergencyContactName} helperText={errors.emergencyContactName?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactRelationship'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Relationship' error={!!errors.emergencyContactRelationship} helperText={errors.emergencyContactRelationship?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactMobile'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Contact Mobile' error={!!errors.emergencyContactMobile} helperText={errors.emergencyContactMobile?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactEmail'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Contact Email' error={!!errors.emergencyContactEmail} helperText={errors.emergencyContactEmail?.message} />
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