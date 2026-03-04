'use client'

// React Imports
import { useState } from 'react'
import type { RefObject } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, minLength, regex, optional } from 'valibot'
import { toast } from 'react-toastify'

// Custom Imports
import CustomTextField from '@core/components/mui/TextField'
import { patientService } from '@/services/patient/patient.service' 
import DialogCloseButton from '../DialogCloseButton'
import type { Guardian } from '@/types/patient.types'
import { Card } from '@mui/material'

type DialogBoxProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onSelectGuardian: (guardian: Guardian) => void
  triggerRef: RefObject<HTMLElement | null>
}

type SearchFormValues = {
  nicNo: string
  guardianName: string
}

type CreateGuardianFormValues = {
  firstName: string
  lastName: string
  mobileNo: string
  nic: string
  gender: string
}

// Validation Schema for creating a new guardian (NIC is optional)
const createGuardianSchema = object({
  firstName: pipe(string(), minLength(1, 'First Name is required')),
  lastName: pipe(string(), minLength(1, 'Last Name is required')),
  mobileNo: pipe(string(), minLength(1, 'Mobile Number is required'), regex(/^(?:0)?(7[0-9]{8})$/, 'Valid 10-digit mobile number required')),
  gender: pipe(string(), minLength(1, 'Gender is required')),
  nic: optional(string())
})

const GuardianSelectDialogBox = ({ open, setOpen, onSelectGuardian, triggerRef }: DialogBoxProps) => {
  // States
  const [tabValue, setTabValue] = useState<number>(0)
  const [guardianList, setGuardianList] = useState<Guardian[]>([])
  const [searchedBoxMessage, setSearchedBoxMessage] = useState('Please enter NIC no or Guardian Name to search.')
  const [isCreating, setIsCreating] = useState(false)

  // ─── SEARCH FORM HOOKS ───
  const {
    control: searchControl,
    reset: resetSearch,
    handleSubmit: handleSearchSubmit,
    getValues: getSearchValues,
    trigger: triggerSearch,
    formState: { errors: searchErrors }
  } = useForm<SearchFormValues>({
    defaultValues: { nicNo: '', guardianName: '' }
  })

  // ─── CREATE FORM HOOKS ───
  const {
    control: createControl,
    reset: resetCreate,
    handleSubmit: handleCreateSubmit,
    formState: { errors: createErrors }
  } = useForm<CreateGuardianFormValues>({
    resolver: valibotResolver(createGuardianSchema) as any,
    defaultValues: { firstName: '', lastName: '', mobileNo: '', nic: '', gender: '' }
  })

  const handleCloseDialog = () => {
    setOpen(false)
    triggerRef.current?.focus()
    // Small delay to allow dialog close animation before resetting
    setTimeout(() => {
      setTabValue(0)
      resetSearch()
      resetCreate()
      setGuardianList([])
      setSearchedBoxMessage('Please enter NIC no or Guardian Name to search.')
    }, 300)
  }

  // ─── HANDLERS FOR TAB 0: SEARCH ───
  const onSearch = async (data: SearchFormValues) => {
    try {
      const response = await patientService.getGuardianForChildPatient(data.nicNo, data.guardianName)
      setGuardianList(response)
    } catch (error) {
      setGuardianList([])
      setSearchedBoxMessage('No guardians found matching your search.')
    }
  }

  const handleSelect = (guardian: Guardian) => {
    onSelectGuardian(guardian)
    handleCloseDialog()
  }

  const handleResetSearch = () => {
    resetSearch()
    setSearchedBoxMessage('Please enter NIC no or Guardian Name to search.')
    setGuardianList([])
  }

  // ─── HANDLERS FOR TAB 1: CREATE NEW ───
  const onCreateNewGuardian = async (data: CreateGuardianFormValues) => {
    setIsCreating(true)
    try {
      // 1. Build payload (same format used for temp patients)
      const payload = {
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
      }

      // 2. Call the Temp Patient API to register this new guardian
      const response = await patientService.createTempPatientDetails(payload)
      
      toast.success('Guardian created successfully!', { className: 'custom-toast' })
      
      // 3. Immediately select the newly created guardian and close dialog
      onSelectGuardian(response.data)
      handleCloseDialog()

    } catch (error: any) {
      toast.error(error.message || 'Failed to create guardian', { className: 'custom-toast' })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      scroll='body'
      open={open}
      onClose={handleCloseDialog}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleCloseDialog} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      {/* Changed to component="div" to prevent hydration nesting errors */}
      <DialogTitle component="div" className='flex gap-2 flex-col text-center sm:pbs-10 sm:pbe-2 sm:pli-16'>
        <Typography variant='h4'>Guardian Selection</Typography>
      </DialogTitle>

      {/* Tabs for toggling between Search and Create */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 6, mb: 4 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} centered>
          <Tab label="Search Existing" />
          <Tab label="Register New" />
        </Tabs>
      </Box>

      <DialogContent className='flex flex-col gap-6 pbs-0 sm:pli-16 sm:pbe-16'>
        
        {/* ========================================== */}
        {/* TAB 0: SEARCH EXISTING GUARDIAN            */}
        {/* ========================================== */}
        {tabValue === 0 && (
          <>
            <form onSubmit={handleSearchSubmit(onSearch)}>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='nicNo'
                    control={searchControl}
                    rules={{
                      validate: value => {
                        const guardianName = getSearchValues('guardianName')
                        if (!value && !guardianName) return 'NIC or Name is required.'
                        if (value && value.length < 3) return 'Must be at least 3 characters.'
                        return true
                      }
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        onChange={e => {
                          const value = e.target.value
                          const guardianName = getSearchValues('guardianName')
                          field.onChange(e)
                          triggerSearch('guardianName')
                          if (value.length >= 3 || (guardianName && guardianName.length >= 3)) {
                            handleSearchSubmit(onSearch)()
                          }
                        }}
                        fullWidth
                        label='NIC No'
                        placeholder='Search by NIC'
                        {...(searchErrors.nicNo && { error: true, helperText: searchErrors.nicNo.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='guardianName'
                    control={searchControl}
                    rules={{
                      validate: value => {
                        const nicNo = getSearchValues('nicNo')
                        if (!value && !nicNo) return 'NIC or Name is required.'
                        if (value && value.length < 3) return 'Must be at least 3 characters.'
                        return true
                      }
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        onChange={e => {
                          const value = e.target.value
                          const nicNo = getSearchValues('nicNo')
                          field.onChange(e)
                          triggerSearch('nicNo')
                          if (value.length >= 3 || (nicNo && nicNo.length >= 3)) {
                            handleSearchSubmit(onSearch)()
                          }
                        }}
                        fullWidth
                        label='Guardian Name'
                        placeholder='Search by Name'
                        {...(searchErrors.guardianName && { error: true, helperText: searchErrors.guardianName.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }} className='flex gap-4'>
                  <Button variant='tonal' color='secondary' type='reset' onClick={handleResetSearch}>
                    Reset Search
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Divider />

            <div className='flex flex-col gap-4'>
              <Typography variant='h6'>{`${guardianList.length} Members Found`}</Typography>

              <Box className='flex flex-col gap-4' sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                {guardianList.length === 0 ? (
                  <Typography color='text.secondary' className='text-center py-4'>
                    {searchedBoxMessage}
                  </Typography>
                ) : (
                  guardianList.map(member => (
                    <Card key={member.id} variant="outlined" className='flex items-center w-full p-3 gap-4'>
                      <Avatar src={`/images/avatars/common.png`} alt={member.firstName} sx={{ width: 48, height: 48 }} />
                      <div className='flex justify-between items-center w-full overflow-hidden'>
                        <div className='flex flex-col items-start overflow-hidden'>
                          <Typography className='truncate w-full font-bold' color='text.primary'>
                            {member.firstName} {member.lastName}
                          </Typography>
                          <Typography variant='body2' className='truncate w-full text-textSecondary'>
                            NIC: {member.nic || 'N/A'} | Mobile: {member.mobileNo}
                          </Typography>
                        </div>
                        <Button
                          variant='contained'
                          size="small"
                          startIcon={<i className='tabler-link text-base' />}
                          onClick={() => handleSelect(member)}
                        >
                          Select
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </Box>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 1: REGISTER NEW GUARDIAN               */}
        {/* ========================================== */}
        {tabValue === 1 && (
          <form onSubmit={handleCreateSubmit(onCreateNewGuardian)}>
            <Grid container spacing={4}>
              
              <Grid size={{ xs: 12 }}>
                <Typography variant='body2' color='text.secondary' className='mb-2'>
                  Register a new guardian. They will be added to the system and automatically selected.
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='firstName'
                  control={createControl}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='First Name *' placeholder='John' error={!!createErrors.firstName} helperText={createErrors.firstName?.message} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='lastName'
                  control={createControl}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Last Name *' placeholder='Doe' error={!!createErrors.lastName} helperText={createErrors.lastName?.message} />
                  )}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='mobileNo'
                  control={createControl}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Mobile Number *' placeholder='07XXXXXXXX' error={!!createErrors.mobileNo} helperText={createErrors.mobileNo?.message} />
                  )}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='gender'
                  control={createControl}
                  render={({ field }) => (
                    <CustomTextField {...field} select fullWidth label='Gender *' error={!!createErrors.gender} helperText={createErrors.gender?.message}>
                      <MenuItem value='1'>Male</MenuItem>
                      <MenuItem value='2'>Female</MenuItem>
                      <MenuItem value='3'>Other</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name='nic'
                  control={createControl}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='NIC Number (Optional)' placeholder='****V/****' error={!!createErrors.nic} helperText={createErrors.nic?.message} />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }} className='flex gap-4 mt-2 justify-end'>
                <Button variant='tonal' color='secondary' onClick={() => setTabValue(0)} disabled={isCreating}>
                  Cancel
                </Button>
                <Button variant='contained' type='submit' disabled={isCreating}>
                  {isCreating ? <CircularProgress size={24} color="inherit" /> : 'Register & Select'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

      </DialogContent>
    </Dialog>
  )
}

export default GuardianSelectDialogBox