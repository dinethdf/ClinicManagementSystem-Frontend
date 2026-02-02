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

type EditPatientDetailsProps = {
  open: boolean
  setOpen: (open: boolean) => void
  patientData?: Patient
  bySelf : boolean 
}

const EditPatientDetails = ({ open, setOpen, patientData, bySelf}: EditPatientDetailsProps) => {

  console.log("Load the components")

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

    console.log(patientData)
    if (open && patientData) {
      // Calculate age logic
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

      reset({
        ...patientData,
        dob: patientData.dob ? patientData.dob : null, 
        gender: patientData.gender?.toString(),
        ethnicity: patientData.ethnicity?.toString(),
        maritalStatus: patientData.maritalStatus?.toString(),
        bloodGroup: patientData.bloodGroup || '',
        
        // FIX: Ensure null becomes empty string '' to avoid uncontrolled input errors
        weight: patientData.weight !== null ? patientData.weight : '',
        height: patientData.height !== null ? patientData.height : '',
        
        relationshipToGuardian: patientData.relationshipToGuardian || '',
        guardian: patientData.guardian || null,
        
        // Ensure other potential nulls are handled for text fields
        landNo: patientData.landNo || '',
        emergencyContactName: patientData.emergencyContactName || '',
        emergencyContactRelationship: patientData.emergencyContactRelationship || '',
        emergencyContactMobile: patientData.emergencyContactMobile || '',
        emergencyContactEmail: patientData.emergencyContactEmail || '',
        address: patientData.address || '',
        city: patientData.city || '',
        district: patientData.district || ''
      } as any)
    }
  }, [open, patientData, reset])

  const handleClose = () => {
    setOpen(false)
    setErrorMessage(null)
  }

  // 2. Guardian Selection Logic
  const selectGuardian = (guardian:Guardian) =>{
       setValue("nic", "")
       setValue("address", guardian.address)
       setValue("city", guardian.city)
       setValue("district", guardian.district)
       setValue("email", guardian.email)
       setValue("mobileNo", guardian.mobileNo)
       setValue("landNo", guardian?.landNo || "")
       setValue("guardian", guardian || null)
       clearErrors('guardian')
  } 
  
  const resetGuardian = () =>{
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

    const payload: Patient = {
      ...data,
      // Ensure dropdown values are sent correctly
      gender: data.gender,
      ethnicity: data.ethnicity,
      maritalStatus: data.maritalStatus,
      bloodGroup: data.bloodGroup,
      
      // FIX: Ensure empty string is converted back to null or number for API
      weight: data.weight === '' ? null : Number(data.weight),
      height: data.height === '' ? null : Number(data.height),
      
      relationshipToGuardian: data.relationshipToGuardian
    }

    try {
      if (bySelf){
        await patientService.updatePatientBySelf(String(patientData.id), payload)
      }else{
        await patientService.updatePatient(String(patientData.id), payload)
      }
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

            {/* Names */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='First Name' error={!!errors.firstName} helperText={errors.firstName?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Last Name' error={!!errors.lastName} helperText={errors.lastName?.message} />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='fullName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Full Name' error={!!errors.fullName} helperText={errors.fullName?.message} />
                )}
              />
            </Grid>            
            {/* DOB & Age Logic */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='dob'
                control={control}
                rules={{ required: 'Date of Birth is required' }}
                render={({ field }) => (
                  <CustomDatePicker 
                    {...field}
                    // Handle Dayjs or String value
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

                      if(isUnderAge && age > 18){
                          resetGuardian()
                      }
                      setIsUnderAge(age < 18)
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
                rules={{ required: !isUnderAge }} // Conditional Rule
                render={({ field }) => (
                  <CustomTextField 
                    {...field} 
                    fullWidth 
                    label='NIC' 
                    disabled={isUnderAge} // Disabled logic
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
                  <CustomTextField {...field} select fullWidth label='Gender' error={!!errors.gender} helperText={errors.gender?.message}>
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
                  <CustomTextField {...field} select fullWidth label='Ethnicity' error={!!errors.ethnicity} helperText={errors.ethnicity?.message}>
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
                  <CustomTextField {...field} select fullWidth label='Marital Status' error={!!errors.maritalStatus} helperText={errors.maritalStatus?.message}>
                    <MenuItem value="1">Single</MenuItem>
                    <MenuItem value="2">Married</MenuItem>
                    <MenuItem value="3">Divorced</MenuItem>
                    <MenuItem value="4">Widowed</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Blood, Height, Weight */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='bloodGroup'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} select fullWidth label='Blood Group' placeholder='Select' error={!!errors.bloodGroup} helperText={errors.bloodGroup?.message}>
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
            
            {/* <--- FIX: Weight & Height Logic ---> */}
            <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                    name='weight'
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                    <CustomTextField
                        {...field}
                        fullWidth
                        type="number"
                        label='Weight (kg)'
                        placeholder='e.g. 65'
                        onChange={(e) => {
                            const val = e.target.value;
                            // Ensure it sets as string for TextField, but logic will parse on submit
                            field.onChange(val);
                        }}
                        value={field.value ?? ''} // Ensure no null passed to input
                        {...(errors.weight && { error: true, helperText: errors.weight.message })}
                    />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                    name='height'
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                    <CustomTextField
                        {...field}
                        fullWidth
                        type="number"
                        label='Height (cm)'
                        placeholder='e.g. 170'
                        onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val);
                        }}
                        value={field.value ?? ''} // Ensure no null passed to input
                        {...(errors.height && { error: true, helperText: errors.height.message })}
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
                    rules={{ required: true }}
                    render={({ field }) => {
                        const displayValue = field.value && typeof field.value === 'object'
                            ? `${field.value.firstName} ${field.value.lastName}` : ''          

                        const textFieldProps: TextFieldProps = {
                            ...field,
                            fullWidth: true,
                            label: 'Guardian',
                            placeholder: 'Select Guardian',
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
                        rules={{ required: true }}
                        render={({ field }) => (
                        <CustomTextField
                            {...field}
                            select
                            fullWidth
                            label='Relationship to Guardian'
                            error={!!errors.relationshipToGuardian} 
                            helperText={errors.relationshipToGuardian?.message}
                        >
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
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Mobile No' disabled={isUnderAge} error={!!errors.mobileNo} helperText={errors.mobileNo?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='landNo'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Land No' disabled={isUnderAge} error={!!errors.landNo} helperText={errors.landNo?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Email' disabled={isUnderAge} error={!!errors.email} helperText={errors.email?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Address' disabled={isUnderAge} error={!!errors.address} helperText={errors.address?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='City' disabled={isUnderAge} error={!!errors.city} helperText={errors.city?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='district'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='District' disabled={isUnderAge} error={!!errors.district} helperText={errors.district?.message} />
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