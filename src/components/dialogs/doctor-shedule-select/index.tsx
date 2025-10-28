'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

// You might also need Box if you prefer it over <div>
import Box from '@mui/material/Box';

// Type Imports
import type { CustomInputHorizontalData } from '@core/components/custom-inputs/types'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps'
import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'
import type { Doctor } from '@/libs/types/doctor.types'
import { doctorSheduleService } from '@/services/doctor.shedule.service'

type TwoFactorAuthProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const appointmentCardData = {
  value: 'appointment-1',
  title: (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          border: '1px solid var(--mui-palette-divider)',
          borderRadius: 'var(--mui-shape-borderRadius)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          1
        </Typography>
      </Box>
    </Box>
  ),
  content: (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
           October, 2024
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="body1" color="text.primary">
          Jane Smith     </Typography>
        <Typography variant="body2" color="text.secondary">
          Gastroenterology
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          09:30AM - 10:00AM
        </Typography>
      </Box>
    </Box>
  )
};

const data: CustomInputHorizontalData[] = [
  appointmentCardData,
  appointmentCardData,
  appointmentCardData,
   appointmentCardData,
    appointmentCardData,
     appointmentCardData,
      appointmentCardData,
  {
    title: "2015-12-33 00:00 PM A",
    value: 'doctorShedule',
    isSelected: true,
    content: 'Get code from an app like Google Authenticator or Microsoft Authenticator.'
  },
  {
    title: (
      <div className='flex items-top gap-1'>
        <Typography className='font-medium' color='text.primary'>
          SMS
        </Typography>
      </div>
    ),
    value: 'sms',
    content: 'We will send a code via SMS if you need to use your backup login method.'
  }
]

const DoctorSheduleSelect = ({ open, setOpen }: TwoFactorAuthProps) => {
  // Vars
  const initialSelectedOption: string = data.filter(item => item.isSelected)[
    data.filter(item => item.isSelected).length - 1
  ].value

  // States
  const [doctorShedule, setDoctorShedule] = useState<CustomInputHorizontalData[]>(data)
  const [doctor, setDoctor] = useState<Doctor | null>()
  const [showMessage, setShowMessage] = useState("")
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleAuthDialogClose = () => {
    setShowAuthDialog(false)
    setShowAuthDialog(false)
  }

  const handleOptionChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      // setAuthType(prop)
    } else {
      // setAuthType((prop.target as HTMLInputElement).value)
    }
  }

const loadShedules = async (id:number) =>{
   
    try {
        const shedules = await doctorSheduleService.getDoctorSchedulesByDoctor(1);
        console.log("shedules")
        console.log(shedules)
        
const appointmentCardData = shedules.map(item => {
  return   {
    title: (
      <div className='flex items-top gap-1'>
        <Typography className='font-medium' color='text.primary'>
          ${item.scheduleDate}
        </Typography>
      </div>
    ),
    value: 'sms',
    content: `'We will ${item.maxPatientCount}.'`
  }
})
      console.log(appointmentCardData)
        setDoctorShedule(appointmentCardData)

      } catch (error:any) {
            console.log("Error")
    }
  }

  useEffect(()=>{
    console.log("first")
  
    if(doctor){

      loadShedules(1);
    
    }
  },[doctor])

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition={false}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-8 sm:pbe-6 sm:pli-16'>
          Select Doctor and Shedule

        </DialogTitle>
        <DialogContent className='pbs-0 sm:pli-16'>
          <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <AsyncAutocomplete
                  value={doctor? doctor : null}
                  onChange={setDoctor}
                  label='Search Doctor'
                  fetchUrl='/api/doctor/search'
                  searchParamKey='q'
                  placeholder='Enter Name'
                  getOptionLabel={(doctor:any) => doctor.firstName + " " + doctor.lastName + " : " + doctor.specialization }
                  fetchInputLenth={2}
                  fullWidth              
                />
              </Grid>
            <Grid container spacing={4} sx={{ maxHeight: '22.8rem', overflowY: 'auto' }}>
              {doctor ? (
                  doctorShedule.length > 0 ? (
                        // 2. Data EXISTS, so map the appointments
                        doctorShedule.map((item, index) => (
                          <Grid size={{ xs: 12, md: 3, sm: 4 }} key={index}>
                            <CustomInputVertical
                              type='radio'
                              selected={"doctorShedule"}
                              handleChange={handleOptionChange}
                              data={item}
                              gridProps={{ size: { xs: 12 } }}
                              name='doctor-shedule'
                            />
                          </Grid>
                        ))
                      ) : (
                        <Grid size={12}>
                          <Box
                            sx={{
                              p: 4,
                              textAlign: 'center',
                              width: '100%',
                              color: 'text.primary',    // <-- Change from text.secondary
                              fontWeight: 'medium'      // <-- Add this (or 500)
                            }}
                          >
                            This doctor has no available appointments.
                          </Box>
                        </Grid>
                      )
              ) : (
                // This part runs IF 'doctor' DOES NOT EXIST
                <Grid size={12}>
                  <Box 
                    sx={{ 
                      p: 4, 
                      textAlign: 'center', 
                      color: 'text.secondary', 
                      width: '100%' 
                    }}
                  >
                    Please select a doctor to see their schedule.
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='pbs-0 sm:pbe-16 sm:pli-16 flex justify-center'>
          <Button
            variant='contained'
            onClick={() => {
              // setOpen(false)
              // setShowAuthDialog(true)
            }}
            className='capitalize'
          >
            Continue
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose} className='capitalize'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        open={showAuthDialog}
        onClose={handleAuthDialogClose}
        closeAfterTransition={false}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleAuthDialogClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        {/* <form onSubmit={e => e.preventDefault()}>
          {authType === 'sms' ? SMSDialog(handleAuthDialogClose) : AppDialog(handleAuthDialogClose)}
        </form> */}
      </Dialog>
    </>
  )
}

export default DoctorSheduleSelect
