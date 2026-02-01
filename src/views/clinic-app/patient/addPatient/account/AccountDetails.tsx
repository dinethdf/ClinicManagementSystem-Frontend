'use client'

// React Imports
import { useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { valibotResolver } from '@hookform/resolvers/valibot'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import { CardHeader, Divider, InputAdornment } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomDatePicker from '@/components/custome/DatePickerTextField'
import type { Guardian, Patient } from '@/types/patient.types'
import { getPatientValidationSchema } from '@/schemas/patienDetailsValidation'
import { patientService } from '@/services/patient/patient.service'
import BackDropFullScreen from '@/components/BackDropFullScreen'
import GuardianSelectDialogBox from '@components/dialogs/guardian-select'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

const initialData: Patient = {
  firstName: '',
  lastName: '',
  fullName: '',
  ethnicity: '',
  gender: '',
  maritalStatus: '',
  bloodGroup: '', 
  nic: '',
  dob: null,
  
  // Guardian & Relationship
  guardian: null,
  relationshipToGuardian: '', // <--- NEW FIELD

  // Physical Stats
  weight: null, // <--- NEW FIELD
  height: null, // <--- NEW FIELD

  address: '',
  city: '',
  district: '',
  email: '',
  mobileNo: '',
  landNo: '',

  emergencyContactName: '',
  emergencyContactRelationship: '',
  emergencyContactMobile: '',
  emergencyContactEmail: ''
}

const AccountDetails = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUnderAge, setIsUnderAge] = useState(false)

  const triggerRef = useRef(null)

  const validationSchema = useMemo(() => {
    return getPatientValidationSchema(isUnderAge)
  }, [isUnderAge])

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<Patient>({
    resolver: valibotResolver(validationSchema) as any,
    defaultValues: { ...initialData }
  })

  const handelFormSubmit = async (data: Patient) => {
    setIsLoading(true) 
    try {  
      const response = await patientService.createPatientDetails(data)
      router.replace(`details/${response?.data?.id ? response?.data?.id : 'error'}`)
      reset()
      toast.success(`${response?.message} - ${response?.data.patientNo}`, {
        hideProgressBar: false,
        className: 'custom-toast'
      })
    } catch (error) {
      toast.error(`${error}`, {
        autoClose: false,
        hideProgressBar: false,
      })
    }
    setIsLoading(false) 
  }

  const selectGuardian = (guardian:Guardian) =>{
       setValue("nic", guardian.nic)
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
       setValue("relationshipToGuardian", '') // <--- RESET NEW FIELD
  }   

  return (
    <Card>
      <CardHeader
        title={'Patient Details'}
        className='pb-2'
        titleTypographyProps={{ variant: 'h4' }}
      />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit(handelFormSubmit)}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Typography variant='body1' className='font-medium'>
                1. Personal Info
              </Typography>
            </Grid>

            {/* --- NAME FIELDS --- */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='First Name'
                    placeholder='John'
                    {...(errors.firstName && { error: true, helperText: errors.firstName.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Last Name'
                    placeholder='Doe'
                    {...(errors.lastName && { error: true, helperText: errors.lastName.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='fullName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Full Name'
                    placeholder='Doe'
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position='start'>
                            <i className='tabler-user' />
                          </InputAdornment>
                        )
                      }
                    }}
                    {...(errors.fullName && { error: true, helperText: errors.fullName.message })}
                  />
                )}
              />
            </Grid>

            {/* --- DEMOGRAPHICS --- */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='ethnicity'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Ethnicity'
                    {...(errors.ethnicity && { error: true, helperText: errors.ethnicity.message })}
                  >
                    <MenuItem value=''>Select Ethnicity</MenuItem>
                    <MenuItem value='0'>Sinhala</MenuItem>
                    <MenuItem value='1'>Tamil</MenuItem>
                    <MenuItem value='2'>Muslims</MenuItem>
                    <MenuItem value='3'>Other</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='gender'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Gender'
                    {...(errors.gender && { error: true, helperText: errors.gender.message })}
                  >
                    <MenuItem value=''>Select Gender</MenuItem>
                    <MenuItem value='1'>Male</MenuItem>
                    <MenuItem value='2'>Female</MenuItem>
                    <MenuItem value='3'>Other</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='maritalStatus'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Marital Status'
                    {...(errors.maritalStatus && { error: true, helperText: errors.maritalStatus.message })}
                  >
                    <MenuItem value=''>Select Marital Status</MenuItem>
                    <MenuItem value='1'>Single</MenuItem>
                    <MenuItem value='2'>Married</MenuItem>
                    <MenuItem value='3'>Divorced</MenuItem>
                    <MenuItem value='4'>Widowed</MenuItem>
                    <MenuItem value='5'>Separated</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* --- PHYSICAL STATS (Updated) --- */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='bloodGroup'
                control={control}
                rules={{ required: false }} // <--- UPDATED: Not Required
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Blood Group'
                    placeholder='Select Blood Group'
                    {...(errors.bloodGroup && { error: true, helperText: errors.bloodGroup.message })}
                  >
                    <MenuItem value=''>Select Blood Group</MenuItem>
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
            
{/* <--- NEW FIELDS: Weight & Height ---> */}
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
                        value={field.value || ''}
                        label='Weight (kg)'
                        placeholder='e.g. 65'
                        onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === '' ? '' : Number(val));
                        }}
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
                        value={field.value || ''}
                        label='Height (cm)'
                        placeholder='e.g. 170'
                        onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === '' ? '' : Number(val));
                        }}
                        {...(errors.height && { error: true, helperText: errors.height.message })}
                    />
                    )}
                />
            </Grid>

            {/* --- DATE OF BIRTH --- */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='dob'
                control={control}
                rules={{ required: 'Date of Birth is required' }}
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

                      if(isUnderAge &&  age > 18){
                          resetGuardian()
                      }
                      setIsUnderAge(age < 18)
                      field.onChange(newValue ? newValue.format('YYYY-MM-DD') : null)
                    }}
                    label='Date Of Birth'
                    openTo='year'
                    views={['year', 'month', 'day']}
                    yearsOrder='desc'
                    maxDate={dayjs()}
                    format='YYYY-MM-DD'
                    slotProps={{
                      textField: {
                        error: !!errors.dob,
                        helperText: errors.dob ? errors.dob.message : ''
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {/* --- GUARDIAN & RELATIONSHIP (Conditional) --- */}
            {isUnderAge && (
              <>
                <Grid size={{ xs: 12, sm: 4 }}>
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
                            ...(errors.guardian && { error: true, helperText: errors.guardian.message })
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

                {/* <--- NEW FIELD: Relationship to Guardian ---> */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Controller
                        name='relationshipToGuardian'
                        control={control}
                        rules={{ required: true }} // Required if underage
                        render={({ field }) => (
                        <CustomTextField
                            {...field}
                            select
                            fullWidth
                            label='Relationship to Guardian'
                            {...(errors.relationshipToGuardian && { error: true, helperText: errors.relationshipToGuardian.message })}
                        >
                            <MenuItem value=''>Select Relationship</MenuItem>
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

            {/* --- CONTACT INFO --- */}
            <Grid size={{ xs: 12, sm: isUnderAge ? 3 : 6 }}>
              <Controller
                name='nic'
                control={control}
                rules={{ required: !isUnderAge }} // Only required if adult
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isUnderAge}
                    label='NIC number'
                    placeholder='****V/****'
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position='start'>
                            <i className='tabler-id' />
                          </InputAdornment>
                        )
                      }
                    }}
                    {...(errors.nic && { error: true, helperText: errors.nic.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: isUnderAge ? 3 : 6 }}>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    disabled={isUnderAge}
                    fullWidth
                    label='Address'
                    placeholder='Address'
                    {...(errors.address && { error: true, helperText: errors.address.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name='city'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isUnderAge}
                    label='City'
                    placeholder='Pelmadulla'
                    {...(errors.city && { error: true, helperText: errors.city.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name='district'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isUnderAge}
                    label='District'
                    placeholder='Rathnapura'
                    {...(errors.district && { error: true, helperText: errors.district.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant='body1' className='font-medium'>
                2. Contact Information
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isUnderAge}
                    label='Email'
                    placeholder='example@gmail.com'
                    {...(errors.email && { error: true, helperText: errors.email.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='mobileNo'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isUnderAge}
                    label='Mobile Number'
                    placeholder='07********'
                    {...(errors.mobileNo && { error: true, helperText: errors.mobileNo.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='landNo'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isUnderAge}
                    label='Land Number'
                    placeholder='0*********'
                    {...(errors.landNo && { error: true, helperText: errors.landNo.message })}
                  />
                )}
              />
            </Grid>

            {/* --- EMERGENCY CONTACT --- */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='body1' className='font-medium'>
                3. Emergency Contact
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Emergancy Contact Name'
                    placeholder='Enter Name'
                    {...(errors.emergencyContactName && { error: true, helperText: errors.emergencyContactName.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactRelationship'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Relationship'
                    placeholder='Enter Relationship'
                    {...(errors.emergencyContactRelationship && { error: true, helperText: errors.emergencyContactRelationship.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactMobile'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Emg Mobile Number'
                    placeholder='0712345678'
                    {...(errors.emergencyContactMobile && { error: true, helperText: errors.emergencyContactMobile.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='emergencyContactEmail'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Emg Email'
                    placeholder='example@gmail.com'
                    {...(errors.emergencyContactEmail && { error: true, helperText: errors.emergencyContactEmail.message })}
                  />
                )}
              />
            </Grid>

            {/* --- ACTION BUTTONS --- */}
            <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
              <Button variant='tonal' type='reset' color='secondary' onClick={() => reset()}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <BackDropFullScreen open={isLoading} />
    </Card>
  )
}

export default AccountDetails