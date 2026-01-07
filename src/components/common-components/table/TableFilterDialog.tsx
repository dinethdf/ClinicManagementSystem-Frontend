'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'

// Types
import { FilterConfig, SortingState } from './TableTypes'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  filtersConfig: FilterConfig[]
  appliedFilters: any
  onApply: (filters: any, sorting?: SortingState) => void
  
  // Sorting (Optional)
  sorting?: SortingState
}

const TableFilterDialog = ({ open, setOpen, filtersConfig, appliedFilters, onApply, sorting }: Props) => {
  
  // Local State (Temp values before applying)
  const [localFilters, setLocalFilters] = useState(appliedFilters)
  const [localSorting, setLocalSorting] = useState<SortingState | undefined>(sorting)

  // Sync state when dialog opens
  useEffect(() => {
    if (open) {
      setLocalFilters(appliedFilters)
      setLocalSorting(sorting)
    }
  }, [open, appliedFilters, sorting])

  const handleChange = (key: string, value: any) => {
    setLocalFilters((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    const resetState: any = {}
    filtersConfig.forEach(f => resetState[f.key] = '')
    setLocalFilters(resetState)
    setLocalSorting(sorting ? { sortBy: 'createdDate', sortOrder: 'desc' } : undefined)
  }

  const handleApply = () => {
    onApply(localFilters, localSorting)
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle className='flex justify-between items-center pb-2'>
        <Typography variant='h5'>Filter & Sort</Typography>
        <IconButton onClick={() => setOpen(false)} size='small'>
          <i className='tabler-x' />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers className='flex flex-col gap-6 p-6'>
        <Grid container spacing={4}>
          
          {/* --- 1. DYNAMIC FILTERS --- */}
          {filtersConfig.map((filter) => (
            <Grid key={filter.key} size={filter.gridSize || { xs: 12, sm: 6 }}>
               {/* Custom Render (e.g., your nested Dialog triggers) */}
               {filter.type === 'custom' && filter.render ? (
                  filter.render(localFilters, handleChange)
               ) : filter.type === 'select' ? (
                  <TextField
                    select
                    fullWidth
                    label={filter.label}
                    value={localFilters[filter.key] || ''}
                    onChange={(e) => handleChange(filter.key, e.target.value)}
                  >
                    {filter.options?.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </TextField>
               ) : filter.type === 'date' ? (
                  <TextField
                    fullWidth
                    type='date'
                    label={filter.label}
                    InputLabelProps={{ shrink: true }}
                    value={localFilters[filter.key] || ''}
                    onChange={(e) => handleChange(filter.key, e.target.value)}
                  />
               ) : (
                  <TextField
                    fullWidth
                    label={filter.label}
                    placeholder={filter.placeholder}
                    value={localFilters[filter.key] || ''}
                    onChange={(e) => handleChange(filter.key, e.target.value)}
                  />
               )}
            </Grid>
          ))}

          {/* --- 2. SORTING SECTION --- */}
          {localSorting && (
            <>
               <Grid size={{ xs: 12 }}>
                  <Typography variant='subtitle2' className='mt-2 mb-1 text-gray-500 uppercase text-xs font-bold'>
                      Sorting Options
                  </Typography>
               </Grid>
               
               <Grid size={{ xs: 12, sm: 8 }}>
                   <TextField
                      select
                      fullWidth
                      label="Sort By Column"
                      value={localSorting.sortBy}
                      onChange={(e) => setLocalSorting({ ...localSorting, sortBy: e.target.value })}
                   >
                      {filtersConfig.filter(f => f.isSortable).map(f => (
                         <MenuItem key={f.key} value={f.key}>{f.label}</MenuItem>
                      ))}
                      <MenuItem value="createdDate">Date Created</MenuItem>
                   </TextField>
               </Grid>
               
               <Grid size={{ xs: 12, sm: 4 }}>
                   <div className='flex items-center h-full border rounded px-3 gap-2 cursor-pointer hover:bg-gray-50'
                        onClick={() => setLocalSorting({ ...localSorting, sortOrder: localSorting.sortOrder === 'asc' ? 'desc' : 'asc' })}
                   >
                       <i className={`text-xl ${localSorting.sortOrder === 'asc' ? 'tabler-sort-ascending' : 'tabler-sort-descending'}`} />
                       <span className='text-sm font-medium'>
                          {localSorting.sortOrder === 'asc' ? 'Ascending (A-Z)' : 'Descending (Z-A)'}
                       </span>
                   </div>
               </Grid>
            </>
          )}

        </Grid>
      </DialogContent>

      <DialogActions className='p-4'>
        <Button onClick={handleReset} color='secondary' variant='outlined'>
          Reset All
        </Button>
        <Button onClick={handleApply} variant='contained' color='primary'>
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TableFilterDialog