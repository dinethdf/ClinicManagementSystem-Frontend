'use client'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Divider from '@mui/material/Divider'

// Types
import { FilterConfig, SortingState } from './TableTypes'

interface Props {
  // Filter Props
  filtersConfig: FilterConfig[]
  filterState: any 
  onFilterChange: (newFilters: any) => void
  
  // Sorting Props
  sorting?: SortingState
  onSortingChange?: (newSorting: SortingState) => void

  // Search Props (Bottom Left)
  searchConfig?: {
    value: string
    onChange: (val: string) => void
    placeholder?: string
  }

  // Action Buttons (Bottom Right - Export, Add, PageSize)
  actionComponent?: React.ReactNode
}

const CommonTableFilters = ({ 
  filtersConfig, 
  filterState, 
  onFilterChange, 
  sorting,
  onSortingChange,
  searchConfig,
  actionComponent 
}: Props) => {

  // Handle value change (Instant Update)
  const handleChange = (key: string, value: any) => {
    const newFilters = { ...filterState, [key]: value }
    onFilterChange(newFilters)
  }

  // Handle clearing a specific filter
  const handleClear = (key: string) => {
    handleChange(key, '')
  }

  return (
    <CardContent className='flex flex-col gap-6 p-6'>
      
      {/* --- ROW 1: FILTERS & SORTING --- */}
      {(filtersConfig.length > 0 || sorting) && (
        <Grid container spacing={4}>
          
          {/* 1. Dynamic Filters */}
          {filtersConfig.map((filter) => (
            // FIX: Using 'size' prop for Grid v2
            <Grid 
              key={filter.key} 
              size={filter.gridSize || { xs: 12, sm: 6, md: 3 }}
            >
              {filter.type === 'select' ? (
                <TextField
                  select
                  fullWidth
                  size='small'
                  label={filter.label}
                  value={filterState[filter.key] || ''}
                  onChange={(e) => handleChange(filter.key, e.target.value)}
                  // Clear 'X' Icon
                  InputProps={{
                    endAdornment: filterState[filter.key] ? (
                      <InputAdornment position="end" className="mr-5">
                        <IconButton size="small" onClick={() => handleClear(filter.key)} onMouseDown={(e) => e.preventDefault()}>
                          <i className='tabler-x text-xs' />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }}
                >
                  {filter.options?.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : filter.type === 'date' ? (
                <TextField
                  fullWidth
                  size='small'
                  type='date'
                  label={filter.label}
                  InputLabelProps={{ shrink: true }}
                  value={filterState[filter.key] || ''}
                  onChange={(e) => handleChange(filter.key, e.target.value)}
                />
              ) : filter.type === 'custom' && filter.render ? (
                 filter.render(filterState, handleChange)
              ) : (
                 <TextField
                  fullWidth
                  size='small'
                  label={filter.label}
                  placeholder={filter.placeholder}
                  value={filterState[filter.key] || ''}
                  onChange={(e) => handleChange(filter.key, e.target.value)}
                />
              )}
            </Grid>
          ))}

          {/* 2. Sorting Controls (Optional) */}
          {sorting && onSortingChange && (
             // FIX: Using 'size' prop for Grid v2
             <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <div className="flex gap-2">
                   <TextField
                      select
                      fullWidth
                      size='small'
                      label="Sort By"
                      value={sorting.sortBy}
                      onChange={(e) => onSortingChange({ ...sorting, sortBy: e.target.value })}
                   >
                      {filtersConfig.filter(f => f.isSortable).map(f => (
                         <MenuItem key={f.key} value={f.key}>{f.label}</MenuItem>
                      ))}
                      {/* Default Sort Option */}
                      <MenuItem value="createdDate">Date Created</MenuItem>
                   </TextField>
                   <IconButton 
                      onClick={() => onSortingChange({ ...sorting, sortOrder: sorting.sortOrder === 'asc' ? 'desc' : 'asc' })}
                      className='border rounded-md'
                   >
                      <i className={sorting.sortOrder === 'asc' ? 'tabler-sort-ascending' : 'tabler-sort-descending'} />
                   </IconButton>
                </div>
             </Grid>
          )}
        </Grid>
      )}

      {/* Divider */}
      {(filtersConfig.length > 0 || sorting) && <Divider />}

      {/* --- ROW 2: TOOLBAR (Search & Actions) --- */}
      <div className='flex flex-wrap justify-between items-center gap-4'>
        
        {/* Left: Search Bar */}
        <div className='flex-1 min-w-[200px] max-w-sm'>
           {searchConfig && (
              <TextField
                fullWidth
                size='small'
                placeholder={searchConfig.placeholder || 'Search...'}
                value={searchConfig.value}
                onChange={(e) => searchConfig.onChange(e.target.value)}
                InputProps={{
                   startAdornment: (
                      <InputAdornment position="start">
                        <i className='tabler-search text-gray-500' />
                      </InputAdornment>
                   ),
                   endAdornment: searchConfig.value ? (
                      <InputAdornment position="end">
                         <IconButton size="small" onClick={() => searchConfig.onChange('')}>
                            <i className='tabler-x' />
                         </IconButton>
                      </InputAdornment>
                   ) : null
                }}
              />
           )}
        </div>

        {/* Right: Actions */}
        <div className='flex items-center gap-3'>
           {actionComponent}
        </div>
      </div>

    </CardContent>
  )
}

export default CommonTableFilters