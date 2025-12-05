'use client'

import { useEffect, useState, useRef } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'

// React Hook Form
import { useForm, Controller, useWatch } from 'react-hook-form'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'

import type { PatientResponceDTO } from '@/types/patient.types'
import { patientService } from '@/services/patient.service'

type DialogBoxProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onSelectPatient: (patient: PatientResponceDTO) => void
}

type FormValues = {
  patientNo: string
  nicNo: string
  mobileNo: string
  patientName: string
}

const PatientSelectDialogBox = ({ open, setOpen, onSelectPatient }: DialogBoxProps) => {
  // States
  const [patientList, setPatientList] = useState<PatientResponceDTO[]>([])
  const [searchedBoxMessage, setSearchedBoxMessage] = useState('Start typing to search...')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const patientNoInputRef = useRef<HTMLInputElement>(null)

  const {
    control,
    reset,
    formState: {}
  } = useForm<FormValues>({
    defaultValues: {
      patientNo: '',
      nicNo: '',
      mobileNo: '',
      patientName: ''
    },
    mode: 'onChange'
  })

  // Watch fields
  const formValues = useWatch({ control })

  const handleCloseDialog = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (open) {
        const timeout = setTimeout(() => {
            if (patientNoInputRef.current) {
                patientNoInputRef.current.focus();
            }
        }, 100);
        
        return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      // 1. Get values safely
      const pNo = formValues.patientNo?.trim() || ''
      const nic = formValues.nicNo?.trim() || ''
      const name = formValues.patientName?.trim() || ''
      const mobile = formValues.mobileNo?.trim() || ''

      // 2. Validate Length
      const shouldSearch = 
        pNo.length >= 2 || 
        nic.length >= 3 || 
        name.length >= 3 || 
        mobile.length >= 3;

      if (shouldSearch) {
        setIsLoading(true)
        setSearchedBoxMessage('')
        setIsError(false)

        try {
          const response = await patientService.getPatientBySearch(
             pNo || undefined, 
             nic || undefined, 
             name || undefined, 
             mobile || undefined
          )

          setPatientList(response || [])
          
          if (!response || response.length === 0) {
            setSearchedBoxMessage('No patients found matching your criteria.')
            setIsError(false)
          }

        } catch (err: any) {

          setPatientList([])
          setSearchedBoxMessage(err.message || 'An unexpected error occurred.')
          setIsError(true)
        } finally {
          setIsLoading(false)
        }
      } else {
        if(pNo === '' && nic === '' && name === '' && mobile === '') {
            setPatientList([])
            setSearchedBoxMessage('Start typing to search...')
            setIsError(false)
        }
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [formValues])

  const handleSelect = (patient: PatientResponceDTO) => {
    onSelectPatient(patient)
    handleCloseDialog()
  }

  const handleReset = () => {
    reset({
      patientNo: '',
      nicNo: '',
      mobileNo: '',
      patientName: ''
    })
    setSearchedBoxMessage('Start typing to search...')
    setPatientList([])
    setIsError(false)
    
    // Re-focus after reset
    if (patientNoInputRef.current) {
        patientNoInputRef.current.focus();
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      scroll='paper'
      open={open}
      onClose={handleCloseDialog}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleCloseDialog} disableRipple>
        <i className='bi bi-x-lg' style={{ fontSize: '1.2rem' }} />
      </DialogCloseButton>
      
      <DialogTitle variant='h4' className='text-center sm:pbs-8 sm:pbe-6'>
        Find Patient
        <Typography variant="subtitle2" component="span" color="text.secondary" className='block mt-1'>
          Search by ID, Name, NIC, or Mobile Number
        </Typography>
      </DialogTitle>

      <DialogContent className='sm:pli-16'>
        
        {/* 1. SEARCH & CREATE BAR */}
        <Box 
            sx={{ 
                p: 2, 
                borderRadius: 2, 
                mb: 4,
                bgcolor: 'var(--mui-palette-action-hover)', 
                border: '1px solid var(--mui-palette-divider)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <Grid container spacing={2} alignItems="center">
                
                {/* Patient No (2 Cols) */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                        name='patientNo'
                        control={control}
                        render={({ field }) => (
                        <CustomTextField
                            {...field}
                            inputRef={patientNoInputRef} 
                            fullWidth
                            size="small"
                            placeholder='No (P..)'
                            autoComplete="off"
                            sx={{ bgcolor: 'background.paper' }}
                            InputProps={{
                            startAdornment: <InputAdornment position="start"><i className="bi bi-hash text-gray-500"/></InputAdornment>
                            }}
                        />
                        )}
                    />
                </Grid>

                {/* Name (3 Cols) */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                        name='patientName'
                        control={control}
                        render={({ field }) => (
                        <CustomTextField
                            {...field}
                            fullWidth
                            size="small"
                            placeholder='Patient Name'
                            sx={{ bgcolor: 'background.paper' }}
                            InputProps={{
                            startAdornment: <InputAdornment position="start"><i className="bi bi-person text-gray-500"/></InputAdornment>
                            }}
                        />
                        )}
                    />
                </Grid>

                {/* NIC (2 Cols) */}
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Controller
                        name='nicNo'
                        control={control}
                        render={({ field }) => (
                        <CustomTextField
                            {...field}
                            fullWidth
                            size="small"
                            placeholder='NIC No'
                            sx={{ bgcolor: 'background.paper' }}
                            InputProps={{
                            startAdornment: <InputAdornment position="start"><i className="bi bi-person-vcard text-gray-500"/></InputAdornment>
                            }}
                        />
                        )}
                    />
                </Grid>

                {/* Mobile (3 Cols) */}
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Controller
                        name='mobileNo'
                        control={control}
                        render={({ field }) => (
                        <CustomTextField
                            {...field}
                            fullWidth
                            size="small"
                            placeholder='Mobile No'
                            sx={{ bgcolor: 'background.paper' }}
                            InputProps={{
                            startAdornment: <InputAdornment position="start"><i className="bi bi-phone text-gray-500"/></InputAdornment>
                            }}
                        />
                        )}
                    />
                </Grid>

                {/* CREATE BUTTON (2 Cols) */}
                <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                     <Button 
                        size="small" 
                        variant="contained" 
                        color="secondary" 
                        onClick={handleReset}
                        startIcon={<i className="bi bi-plus-lg"/>}
                        sx={{ height: '36px', fontWeight: 600 }} 
                     >
                        Reset
                    </Button>
                </Grid>
            </Grid>
            
        </Box>


        <Paper variant="outlined" sx={{ maxHeight: 350, overflowY: 'auto', border: '1px solid var(--mui-palette-divider)' }}>
            
            {isLoading ? (
                <Box className="flex justify-center items-center py-10">
                    <CircularProgress size={30} />
                </Box>
            ) : patientList.length === 0 ? (
                <Box className="flex flex-col items-center justify-center py-10 opacity-70">
                    <i 
                      className={`bi ${isError ? 'bi-exclamation-circle' : 'bi-search'}`} 
                      style={{ 
                        fontSize: '2rem', 
                        marginBottom: '0.5rem',
                        color: isError ? 'var(--mui-palette-error-main)' : 'inherit' 
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      color={isError ? 'error' : 'text.secondary'}
                      fontWeight={isError ? 600 : 400}
                    >
                      {searchedBoxMessage}
                    </Typography>
                </Box>
            ) : (
                <List disablePadding>
                    {patientList.map((member, index) => (
                        <Box key={member.id || index}>
                            <ListItem disablePadding>
                                <ListItemButton 
                                    onClick={() => handleSelect(member)}
                                    sx={{ py: 2 }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 600 }}>
                                            {member.firstName ? member.firstName.charAt(0).toUpperCase() : '?'}
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText 
                                        primary={
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {member.firstName || 'Unknown'} {member.lastName || ''}
                                                </Typography>
                                                {member.patientNo && (
                                                    <Chip 
                                                        label={member.patientNo} 
                                                        size="small" 
                                                        color="primary" 
                                                        variant="tonal"
                                                        sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                                                    />
                                                )}
                                            </Stack>
                                        }
                                        secondaryTypographyProps={{ component: 'div' }} 
                                        secondary={
                                            <Stack 
                                                direction={{ xs: 'column', sm: 'row' }} 
                                                spacing={{ xs: 0, sm: 2 }} 
                                                sx={{ mt: 0.5, fontSize: '0.85rem' }}
                                            >
                                                <span className="flex items-center gap-1">
                                                    <i className="bi bi-person-vcard text-gray-400"/> {member.nic || 'No NIC'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <i className="bi bi-phone text-gray-400"/> {member.mobileNo || 'No Mobile'}
                                                </span>
                                            </Stack>
                                        }
                                    />
                                    <i className="bi bi-chevron-right text-gray-400" />
                                </ListItemButton>
                            </ListItem>
                            {index < patientList.length - 1 && <Divider component="li" />}
                        </Box>
                    ))}
                </List>
            )}
        </Paper>

      </DialogContent>
    </Dialog>
  )
}

export default PatientSelectDialogBox
