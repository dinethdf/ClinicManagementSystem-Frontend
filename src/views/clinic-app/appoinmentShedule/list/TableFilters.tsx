// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// --- Hardcoded Values ---
const DOCTORS = [
    { id: '1', name: 'Dr. Kamal Perera' },
    { id: '2', name: 'Dr. Amara Silva' },
    { id: '3', name: 'Dr. Nimal Rajapakshe' }
]

const SPECIALIZATIONS = [
    'Cardiology',
    'General Practitioner',
    'Dermatologist',
    'Pediatrics',
    'Neurology'
]

interface FilterProps {
    onFilterChange: (filters: { doctorId: string; specialization: string; date: string }) => void
}

const TableFilters = ({ onFilterChange }: FilterProps) => {
  // States
  const [doctorId, setDoctorId] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [date, setDate] = useState('')

  // Trigger Parent Update when any filter changes
  useEffect(() => {
    onFilterChange({
        doctorId,
        specialization,
        date
    })
  }, [doctorId, specialization, date, onFilterChange])

  return (
    <CardContent>
      <Grid container spacing={6}>
        
        {/* Filter: Doctor */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-doctor'
            label="Doctor"
            value={doctorId}
            onChange={e => setDoctorId(e.target.value)}
            disabled
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>All Doctors</MenuItem>
            {DOCTORS.map(doc => (
                <MenuItem key={doc.id} value={doc.id}>{doc.name}</MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        {/* Filter: Specialization */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-spec'
            label="Specialization"
            value={specialization}
            onChange={e => setSpecialization(e.target.value)}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>All Specializations</MenuItem>
            {SPECIALIZATIONS.map(spec => (
                <MenuItem key={spec} value={spec}>{spec}</MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        {/* Filter: Date */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            fullWidth
            type="date"
            id='select-date'
            label="Schedule Date"
            value={date}
            onChange={e => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

      </Grid>
    </CardContent>
  )
}

export default TableFilters
