'use client'

// React Imports
import { useState } from 'react'

// import type { ChangeEvent } from 'react'

import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';


// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

import { CardHeader, Divider, InputAdornment } from '@mui/material'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

import CustomDatePicker from '@/@core/components/mui/DatePickerTextField'
import { PatientDetails } from '@/libs/types/patient.types';


const initialData: PatientDetails = {
  firstName: '',
  lastName: '',
  fullName: '',
  ethnicity: '',
  gender: '',
  maritalStatus: '',
  nic: '',
  dob: null,
  address: '',
  city: '',
  district: '',

  email: '',
  mobileNumber: '',
  landNumber: '',

  emgName: '',
  
  emgRelationship: '',
  emgMobileNumber: '',
  emgEmail: ''
}


const AccountDetails = () => {
  // States
  const [formData, setFormData] = useState<PatientDetails>(initialData)

  // const [fileInput, setFileInput] = useState<string>('')
  // const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  // const [language, setLanguage] = useState<string[]>(['English'])

  // const handleDelete = (value: string) => {
  //   setLanguage(current => current.filter(item => item !== value))
  // }

  // const handleChange = (event: SelectChangeEvent<string[]>) => {
  //   setLanguage(event.target.value as string[])
  // }

  const handleFormChange = (field: keyof PatientDetails, value: PatientDetails[keyof PatientDetails]) => {
    setFormData({ ...formData, [field]: value })
  }

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

  const handelFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log(formData)
    
    // setFormData(initialData)
  }

  // const handleFileInputReset = () => {
  //   setFileInput('')
  //   setImgSrc('/images/avatars/1.png')
  // }

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
      <CardHeader title='Patient Details' className='pb-2' titleTypographyProps={{ variant: 'h4'}} />
      <Divider />
      <CardContent>
        <form onSubmit={handelFormSubmit}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Typography variant='body1' className='font-medium'>
                1. Personal Info
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='First Name'
                value={formData.firstName}
                placeholder='John'
                onChange={e => handleFormChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Last Name'
                value={formData.lastName}
                placeholder='Doe'
                onChange={e => handleFormChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                fullWidth
                label='Full Name'
                value={formData.fullName}
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
                onChange={e => handleFormChange('fullName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomTextField
                select
                fullWidth
                label='Ethnicity'
                value={formData.ethnicity}
                onChange={e => setFormData({ ...formData, ethnicity: e.target.value })}
              >
               <MenuItem value=''>Select Ethnicity</MenuItem>
                <MenuItem value='0'>Sinhala</MenuItem>
                <MenuItem value='1'>Tamil</MenuItem>
                <MenuItem value='2'>Muslims</MenuItem>
                <MenuItem value='3'>Other</MenuItem>
              </CustomTextField>              
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomTextField
                select
                fullWidth
                label='Gender'
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                <MenuItem value=''>Select Gender</MenuItem>
                <MenuItem value='0'>Male</MenuItem>
                <MenuItem value='1'>Female</MenuItem>
                <MenuItem value='2'>Other</MenuItem>
             
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomTextField
                select
                fullWidth
                label='Marital Status'
                value={formData.maritalStatus}
                onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
              >
                <MenuItem value=''>Select Marital Status</MenuItem>
                <MenuItem value='1'>Married</MenuItem>
                <MenuItem value='2'>Divorced</MenuItem>
                <MenuItem value='3'>Widowed</MenuItem>
                <MenuItem value='4'>Separated</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='NIC Number'
                value={formData.nic}
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
                onChange={e => handleFormChange('nic', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomDatePicker
                openTo='year'
                label='Date of Birth'
                views={['year', 'month', 'day']}
                value={dayjs(formData.dob)}              
                yearsOrder="desc"
                maxDate={dayjs()}
                format="YYYY-MM-DD"
                onChange={dobDate => {
                  console.log(dobDate);
                  handleFormChange('dob', dobDate ? dobDate.format('YYYY-MM-DD') : null);
                  console.log(dobDate?.format('YYYY-MM-DD'));
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Address'
                value={formData.address}
                placeholder='Address'
                onChange={e => handleFormChange('address', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <CustomTextField
                fullWidth
                label='City'
                value={formData.city}
                placeholder='Pelmadulla'
                onChange={e => handleFormChange('city', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <CustomTextField
                fullWidth
                label='District'
                value={formData.district}
                placeholder='Rathnapura'
                onChange={e => handleFormChange('district', e.target.value)}
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
              <CustomTextField
                fullWidth
                label='Email'
                value={formData.email}
                placeholder='john.doe@gmail.com'
                onChange={e => handleFormChange('email', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomTextField
                fullWidth
                label='Mobile Number'
                value={formData.mobileNumber}
                placeholder='+1 (234) 567-8901'
                onChange={e => handleFormChange('mobileNumber', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomTextField
                fullWidth
                label='Land Number'
                value={formData.landNumber}
                placeholder='+1 (234) 567-8901'
                onChange={e => handleFormChange('landNumber', e.target.value)}
              />
            </Grid>            

            <Grid size={{ xs: 12 }}>
            <Typography variant='body1' className='font-medium'>
                3. Emergency Contact
            </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Contact Name'
                value={formData.emgName}
                placeholder='Enter Name'
                onChange={e => handleFormChange('emgName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <CustomTextField
                fullWidth
                label='Relationship'
                value={formData.emgRelationship}
                placeholder='Enter Relationship'
                onChange={e => handleFormChange('emgRelationship', e.target.value)}
              />
            </Grid>            
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Mobile Number'
                value={formData.emgMobileNumber}
                placeholder='+1 (234) 567-8901'
                onChange={e => handleFormChange('emgMobileNumber', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Email (Optional)'
                value={formData.emgEmail}
                placeholder='john.doe@gmail.com'
                onChange={e => handleFormChange('emgEmail', e.target.value)}
              />
            </Grid>                        
            <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
              <Button variant='tonal' type='reset' color='secondary' onClick={() => setFormData(initialData)}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
