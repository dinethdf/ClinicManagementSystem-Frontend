'use client'

// React Imports
import { useMemo, useState, useRef } from 'react'

import { useRouter } from 'next/navigation'

import dayjs from 'dayjs'

import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'

import { valibotResolver } from '@hookform/resolvers/valibot'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

import { CardHeader, Divider, InputAdornment } from '@mui/material'

// Component Imports
import type { TextFieldProps } from '@mui/material/TextField'

import CustomTextField from '@core/components/mui/TextField'

import CustomDatePicker from '@/@core/components/mui/DatePickerTextField'

import type { Guardian, PatientDetails } from '@/libs/types/patient.types'

import { getPatientValidationSchema } from '@/schemas/patienDetailsValidation'

import { patientService } from '@/services/patient.service'

import BackDropFullScreen from '@/components/BackDropFullScreen'

// Component Imports
import GuardianSelectDialogBox from '@components/dialogs/guardian-select'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

const initialData: PatientDetails = {
  firstName: '',
  lastName: '',
  fullName: '',
  ethnicity: '',
  gender: '',
  maritalStatus: '',
  nic: '',
  dob: null,
  guardian: null,
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

  // States
  // const [formData, setFormData] = useState<PatientDetails>(initialData)
  // const [fileInput, setFileInput] = useState<string>('')
  // const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  // const [language, setLanguage] = useState<string[]>(['English'])

  // const handleDelete = (value: string) => {
  //   setLanguage(current => current.filter(item => item !== value))
  // }

  // const handleChange = (event: SelectChangeEvent<string[]>) => {
  //   setLanguage(event.target.value as string[])
  // }

  // const handleFileInputChange = (file: ChangeEvent) => {
  //   const reader = new FileReader()
  //   const { files } = file.target as HTMLInputElement

  //   if (files && files.length !== 0) {
  //     reader.onload = () => setImgSrc(reader.result as string)
  //     reader.readAsDataURL(files[0])

  //     if (reader.result !== null) {
  //       setFileInput(reader.result as string)
  //     }
  //   }
  // }

  // const handleFileInputReset = () => {
  //   setFileInput('')
  //   setImgSrc('/images/avatars/1.png')
  // }

  // const handleFormChange = (field: keyof PatientDetails, value: PatientDetails[keyof PatientDetails]) => {
  //   setFormData({ ...formData, [field]: value })
  // }

  const validationSchema = useMemo(() => {
    return getPatientValidationSchema(isUnderAge)
  }, [isUnderAge]) // Re-create schema when isUnderAge changes

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<PatientDetails>({
    resolver: valibotResolver(validationSchema),
    defaultValues: { ...initialData }
  })

  const handelFormSubmit = async (data: PatientDetails) => {
    setIsLoading(true) 
    
    try {  
      const response = await patientService.createPatientDetails(data)
      
      console.log('✅ Patient created successfully:', response)
      router.replace(`view/${response?.data?.id ? response?.data?.id : 'error'}`)
      reset()
      toast.success(`${response?.message} - ${response?.data.patientNo}`, {
        hideProgressBar: false,
        className: 'custom-toast',
        progressStyle: {
          backgroundColor: 'var(--mui-palette-primary-main)'
        }
      })

    } catch (error) {
      toast.error(`${error}`, {
        autoClose: false,
        hideProgressBar: false,
        className: 'custom-toast',
        progressStyle: {
          backgroundColor: 'var(--mui-palette-error-main)'
        }
      })
    } finally {
      setIsLoading(false)
    }
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
                    
  }     

  return (
    <Card>
      {/* <CardContent className='mbe-4'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button component='label' variant='contained' htmlFor='account-settings-upload-image'>
                Upload New Photo
                <input
                  hidden
                  type='file'
                  value={fileInput}
                  accept='image/png, image/jpeg'
                  onChange={handleFileInputChange}
                  id='account-settings-upload-image'
                />
              </Button>
              <Button variant='tonal' color='secondary' onClick={handleFileInputReset}>
                Reset
              </Button>
            </div>
            <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
          </div>
        </div>
      </CardContent> */}
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
                    placeholder='Doe'
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
                    placeholder='Doe'
                    {...(errors.gender && { error: true, helperText: errors.gender.message })}
                  >
                    <MenuItem value=''>Select Gender</MenuItem>
                    <MenuItem value='0'>Male</MenuItem>
                    <MenuItem value='1'>Female</MenuItem>
                    <MenuItem value='2'>Other</MenuItem>
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
                    placeholder='Doe'
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
            {isUnderAge && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='guardian'
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => {

   
                    const displayValue =
                      field.value && typeof field.value === 'object'
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
                          onSelectGuardian: selectGuardian, // or just field.onChange
                          triggerRef: triggerRef        // 5. Pass the ref to the dialog
                        }}
                      />
                    )
                  }}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: isUnderAge ? 3 : 6 }}>
              <Controller
                name='nic'
                control={control}
                rules={{ required: true }}
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
                            <i className='tabler-user' />
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
                    {...(errors.emergencyContactName && {
                      error: true,
                      helperText: errors.emergencyContactName.message
                    })}
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
                    {...(errors.emergencyContactRelationship && {
                      error: true,
                      helperText: errors.emergencyContactRelationship.message
                    })}
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
                    {...(errors.emergencyContactMobile && {
                      error: true,
                      helperText: errors.emergencyContactMobile.message
                    })}
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
                    {...(errors.emergencyContactEmail && {
                      error: true,
                      helperText: errors.emergencyContactEmail.message
                    })}
                  />
                )}
              />
            </Grid>
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
