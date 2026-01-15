'use client'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// Types
import { FilterConfig } from './TableTypes'

interface Props {
  // Filter Props (For inline filters - usually optional if using the Dialog)
  filtersConfig: FilterConfig[]
  filterState: any 
  onFilterChange: (newFilters: any) => void
  
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
      
      {/* --- ROW 1: INLINE FILTERS (If any are meant to be shown directly) --- */}
      {/* Note: If you moved all filters to the Dialog, this section might be empty or removed */}
      {filtersConfig.length > 0 && (
        <Grid container spacing={4}>
          {filtersConfig.map((filter) => (
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
        </Grid>
      )}

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