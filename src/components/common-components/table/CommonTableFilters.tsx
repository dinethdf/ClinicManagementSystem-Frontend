'use client'

import { useState } from 'react'

// MUI
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid' // Using Grid v2
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Types
import { FilterConfig } from './TableTypes'

interface Props {
  filtersConfig: FilterConfig[]
  filterState: any // The values currently applied
  onApply: (newFilters: any) => void
  onReset: () => void
}

const CommonTableFilters = ({ filtersConfig, filterState, onApply, onReset }: Props) => {
  // Local state for inputs before clicking "Apply"
  const [tempValues, setTempValues] = useState<any>({ ...filterState })

  const handleChange = (key: string, value: any) => {
    setTempValues((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    // Reset local state
    const emptyState: any = {}
    filtersConfig.forEach(f => emptyState[f.key] = '')
    setTempValues(emptyState)
    
    // Notify parent
    onReset()
  }

  return (
    <CardContent>
      <Grid container spacing={4}>
        {filtersConfig.map((filter) => (
          <Grid key={filter.key} size={filter.gridSize || { xs: 12, sm: 6, md: 3 }}>
            
            {/* TEXT INPUT */}
            {filter.type === 'text' && (
              <TextField
                fullWidth
                size='small'
                label={filter.label}
                placeholder={filter.placeholder}
                value={tempValues[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
              />
            )}

            {/* SELECT INPUT */}
            {filter.type === 'select' && (
              <TextField
                select
                fullWidth
                size='small'
                label={filter.label}
                value={tempValues[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
              >
                {filter.options?.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* DATE INPUT */}
            {filter.type === 'date' && (
              <TextField
                fullWidth
                size='small'
                type='date'
                label={filter.label}
                InputLabelProps={{ shrink: true }}
                value={tempValues[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
              />
            )}

            {/* CUSTOM COMPONENT (e.g. Patient Select Dialog) */}
            {filter.type === 'custom' && filter.render && (
               filter.render(tempValues, handleChange)
            )}

          </Grid>
        ))}

        {/* ACTIONS */}
        <Grid size={{ xs: 12, md: 3 }} className="flex justify-end gap-2 ml-auto items-end">
           <Button variant="outlined" color="secondary" onClick={handleReset}>
              Reset
           </Button>
           <Button variant="contained" onClick={() => onApply(tempValues)}>
              Apply
           </Button>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default CommonTableFilters