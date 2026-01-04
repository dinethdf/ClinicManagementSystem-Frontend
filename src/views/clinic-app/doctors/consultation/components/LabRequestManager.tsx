'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

// Services & Types
import { 
    searchActiveLabTests, 
    createLabRequest, 
    getPatientLabRequests, 
    deleteLabRequest // <--- IMPORT THIS
} from '@/services/lab.server.service'
import type { LabTestTypeDTO, LabRequestDTO } from '@/types/lab.types'

interface Props {
  patientId: number
  appointmentId: number
}

const LabRequestManager = ({ patientId, appointmentId }: Props) => {
  // --- STATE ---
  const [requestList, setRequestList] = useState<LabRequestDTO[]>([])
  const [loadingList, setLoadingList] = useState(false)
  
  // Search State
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<LabTestTypeDTO[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedTest, setSelectedTest] = useState<LabTestTypeDTO | null>(null)
  
  // Action State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null) // Track which ID is deleting

  // --- INITIAL LOAD ---
  useEffect(() => {
    if (patientId) {
        fetchHistory()
    }
  }, [patientId])

  const fetchHistory = async () => {
      setLoadingList(true)
      const res = await getPatientLabRequests(patientId)
      setRequestList(res.content || [])
      setLoadingList(false)
  }

  // --- HANDLE SEARCH ---
  const handleSearchChange = async (event: any, value: string) => {
      if (value.length < 2) {
          setOptions([])
          return
      }
      setSearchLoading(true)
      const res = await searchActiveLabTests(value)
      setOptions(res.content || [])
      setSearchLoading(false)
  }

  // --- HANDLE ADD ---
  const handleAddRequest = async () => {
      if (!selectedTest || !patientId || !appointmentId) return

      setIsSubmitting(true)
      setErrorMsg(null)

      const res = await createLabRequest(patientId, selectedTest.id, appointmentId)

      if (res.success) {
          setSelectedTest(null) // Clear selection
          fetchHistory() // Refresh list
      } else {
          setErrorMsg(res.error || "Failed to add test")
      }
      setIsSubmitting(false)
  }

  // --- HANDLE DELETE ---
  const handleDeleteRequest = async (id: number) => {
      if(!confirm("Are you sure you want to remove this test request?")) return;

      setDeletingId(id)
      setErrorMsg(null)

      const res = await deleteLabRequest(id)
      if (res.success) {
          // Remove from local list immediately for better UX
          setRequestList(prev => prev.filter(item => item.id !== id))
      } else {
          setErrorMsg(res.error || "Failed to delete request")
      }
      setDeletingId(null)
  }

  // --- RENDER ---
  return (
    <Card className='h-full'>
      <CardHeader 
        title="Lab Investigations" 
        action={<Chip label={`${requestList.length} Requests`} size='small' color='primary' variant='tonal' />} 
      />
      <Divider />
      <CardContent>
        {errorMsg && <Alert severity='error' className='mb-4'>{errorMsg}</Alert>}

        {/* --- 1. ADD SECTION --- */}
        <div className='flex gap-3 mb-6 items-start'>
            <Autocomplete
                fullWidth
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                options={options}
                loading={searchLoading}
                value={selectedTest}
                onChange={(_, newValue) => setSelectedTest(newValue)}
                onInputChange={handleSearchChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Lab Test"
                        placeholder="Type test name or code..."
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        <div className='flex flex-col'>
                            <Typography variant='body2' fontWeight={600}>{option.name}</Typography>
                            <div className='flex gap-2 text-xs text-gray-500'>
                                <span className='text-primary'>{option.code}</span>
                                <span>•</span>
                                <span>LKR {option.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </li>
                )}
            />
            <Button 
                variant='contained' 
                onClick={handleAddRequest} 
                disabled={!selectedTest || isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color='inherit'/> : <i className='tabler-plus' />}
                className='whitespace-nowrap h-10'
            >
                Add Test
            </Button>
        </div>

        {/* --- 2. LIST SECTION --- */}
        <TableContainer component={Paper} variant='outlined'>
            <Table size='small'>
                <TableHead>
                    <TableRow className='bg-gray-50'>
                        <TableCell>Test Details</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align='right'>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loadingList ? (
                        <TableRow>
                            <TableCell colSpan={4} align='center' className='p-4'>Loading...</TableCell>
                        </TableRow>
                    ) : requestList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align='center' className='p-8 text-gray-400'>
                                No lab requests for this patient.
                            </TableCell>
                        </TableRow>
                    ) : (
                        requestList.map((req) => (
                            <TableRow key={req.id}>
                                <TableCell>
                                    <div className='flex flex-col'>
                                        <Typography variant='body2' fontWeight={600}>{req.testName}</Typography>
                                        <Typography variant='caption' className='text-gray-500'>{req.testCode}</Typography>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Typography variant='caption'>
                                        {new Date(req.createdDate).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={req.status.replace('_', ' ')} 
                                        size='small' 
                                        color={req.status === 'COMPLETED' ? 'success' : req.status === 'PENDING' ? 'warning' : 'default'} 
                                        variant='tonal'
                                        className='text-[10px] font-bold'
                                    />
                                </TableCell>
                                <TableCell align='right'>
                                    <Tooltip title="Delete Request">
                                        <span className='inline-block'>
                                            <IconButton 
                                                size='small' 
                                                color='error' 
                                                onClick={() => handleDeleteRequest(req.id)}
                                                // Only allow delete if PENDING (optional business rule)
                                                disabled={deletingId === req.id || req.status !== 'PENDING'}
                                            >
                                                {deletingId === req.id ? (
                                                    <CircularProgress size={18} color="inherit" />
                                                ) : (
                                                    <i className='tabler-trash' />
                                                )}
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>

      </CardContent>
    </Card>
  )
}

export default LabRequestManager