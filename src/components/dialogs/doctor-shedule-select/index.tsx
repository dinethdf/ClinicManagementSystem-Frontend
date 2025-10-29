'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react' // Import ReactNode

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Type Imports
// FIX: Make sure this type import is correct for your project
import type { CustomInputVerticalData } from '@core/components/custom-inputs/types'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import AsyncAutocomplete from '@/components/form-components/AsyncAutocompleteProps'
import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'
import type { Doctor } from '@/types/doctor.types' // Assuming Doctor has 'id' and 'specialization'
import { doctorSheduleService } from '@/services/doctor.shedule.service'
import { DoctorScheduleDTO } from '@/types/doctor.types'


type DialogBoxProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onSelectShedule: (shedule: DoctorScheduleDTO | null) => void
}

// Helper function to format time
const formatTime = (timeString: string) => {
  const tempDate = new Date(`1970-01-01T${timeString}`);
  return tempDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const DoctorSheduleSelect = ({ open, setOpen, onSelectShedule }: DialogBoxProps) => {
  // States
  const [doctorShedule, setDoctorShedule] = useState<{
    value: DoctorScheduleDTO;
    title: JSX.Element;
    content: JSX.Element;
    isSelected: boolean;
  }[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  
  // FIX: Added state to manage the selected schedule
  const [selectedSchedule, setSelectedSchedule] = useState<DoctorScheduleDTO | undefined>(undefined);

  const handleClose = () => {
    setOpen(false)
  }

  // FIX: Implemented the logic for handleOptionChange
  const handleOptionChange = (prop: DoctorScheduleDTO) => {

    if (prop != null) {
          console.log("run this")
    console.log(prop)
      setSelectedSchedule(prop)
    } else {
      // setSelectedSchedule((prop.target as HTMLInputElement).value)
    }
  }

  // FIX: Corrected loadShedules to use dynamic data
  const loadShedules = async (id: number) => {
    try {
      // Use the 'id' parameter, not a hardcoded '1'
      const shedules = await doctorSheduleService.getDoctorSchedulesByDoctor(id);

      const shedulesArray = shedules.map((schedule, index) => {
        const slotsAvailable = schedule.maxPatientCount - schedule.registeredPatientCount;
        
        // Format the date dynamically
        const scheduleDateObj = new Date(schedule.scheduleDate);
        const scheduleDateStr = scheduleDateObj.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });
        const dayOfMonth = scheduleDateObj.getDate();

        return {
          value: schedule || "",
          
          // 1. DYNAMIC TITLE
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
                  {dayOfMonth} {/* Use dynamic day */}
                </Typography>
              </Box>
            </Box>
          ),
          
          // 2. DYNAMIC CONTENT
          content: (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                  {scheduleDateStr} {/* Use dynamic date */}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                </Typography>                
                <Typography variant="body1" color="text.primary">
                  {"schedule. doctorName"} {/* Use dynamic doctor name */}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {doctor?.specialization.name} {/* Use specialization */}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{mt: 1}}>
                  Slots: {slotsAvailable} | Fee: {schedule.payment}
                </Typography>
              </Box>
            </Box>
          ),
          
          // 3. Only select the first item by default
          isSelected: index === 0
        };
      });
      
      setDoctorShedule(shedulesArray);

      // Automatically select the first schedule in the list
      // for now NOt USe this 
      // if (shedulesArray.length > 0) {
      //   // setSelectedSchedule(shedulesArray[0]?.value || null);
      // } else {
      //   // setSelectedSchedule();
      // }

    } catch (error: any) {
      console.log("Error loading schedules:", error);
      setDoctorShedule([]);
    }
  }

  // FIX: Corrected useEffect logic
  useEffect(() => {
    if (doctor && doctor.id) {
      loadShedules(doctor.id); // Use the selected doctor's ID
    } else {
      setDoctorShedule([]); // Clear schedules if no doctor is selected
      setSelectedSchedule(undefined); // Clear selection
      onSelectShedule(null) // after change doctro remove selected Shedule
    }
  }, [doctor]) // Dependency array is correct

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
          Select Doctor and Schedule
        </DialogTitle>
        <DialogContent className='pbs-0 sm:pli-16'>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <AsyncAutocomplete
                value={doctor ? doctor : null}
                onChange={(newValue) => setDoctor(newValue)} // Corrected onChange
                label='Search Doctor'
                fetchUrl='/api/doctor/search'
                searchParamKey='q'
                placeholder='Enter Name'
                getOptionLabel={(doctor: Doctor) => doctor.firstName + " " + doctor.lastName + " : " + doctor?.specialization?.name}
                fetchInputLenth={2}
                fullWidth
              />
            </Grid>

            {/* FIX: WRAP YOUR CARD LIST IN A GRID ITEM */}
            <Grid size={{ xs: 12 }}>
              <Grid container spacing={4} sx={{ maxHeight: '22.8rem', overflowY: 'auto' }}>
                {doctor ? (
                  doctorShedule.length > 0 ? (
                    doctorShedule.map((item, index) => (
                      <Grid size={{ xs: 12, md: 3, sm: 4 }} key={index}>
                        <CustomInputVertical
                          type='radio'
                          // FIX: Use the state variable for selection
                          selected={selectedSchedule?.id?.toString() || ""}
                          handleChange={ () => {handleOptionChange(item.value)}}
                          data={{...item, value: item.value.id?.toString() || ""}}
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
                          color: 'text.primary',
                          fontWeight: 'medium'
                        }}
                      >
                        This doctor has no available appointments.
                      </Box>
                    </Grid>
                  )
                ) : (
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
            
          </Grid>
        </DialogContent>
        <DialogActions className='pbs-0 sm:pbe-16 sm:pli-16 flex justify-center'>
          <Button
            variant='contained'
            onClick={() => {
              console.log("Selected Schedule ID:", selectedSchedule)
             
              if(selectedSchedule){
                 onSelectShedule(selectedSchedule)
                 setOpen(false)
              }else{
                console.error("No Selected Shedule")
                 onSelectShedule(null)
              }         

             
            }}
            className='capitalize'
            disabled={!selectedSchedule} // Disable button if nothing is selected
          >
            Continue
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose} className='capitalize'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DoctorSheduleSelect