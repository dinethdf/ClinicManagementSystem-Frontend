'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CircularProgress from '@mui/material/CircularProgress'
import type { AutocompleteProps } from '@mui/material/Autocomplete'

import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'

import { apiClient } from '@/services/api.config'


type AsyncAutocompleteProps<T extends object> = {
  fetchUrl: string
  label: string
  value: T | null  // These make it a "Controlled Component"
  onChange: (newValue: T | null) => void
  searchParamKey?: string // Renamed from searchQueryParam for clarity
  otherParams?: Record<string, string | number | boolean> // Changed from string to object for flexibility
  fetchInputLenth?:number
  debounceDelay?: number
  error?: boolean
  helperText?: string
  placeholder?: string
} & Omit<
  AutocompleteProps<T, false, false, false, 'div'>,
  'options' | 'renderInput' | 'loading' | 'value' | 'onChange' | 'onInputChange'
>

// --- The Reusable Component ---
const AsyncAutocomplete = <T extends object>({
  // Required props
  fetchUrl,
  label,
  value,
  onChange,
  searchParamKey = 'q',
  otherParams = {}, // Default to an empty object
  debounceDelay = 500,
  getOptionLabel = (option: any) => `${option.firstName} ${option.lastName}` || '',
  fetchInputLenth = 1,
  isOptionEqualToValue = (option: any, value: any) => option.id === value.id,
  error,
  helperText,
  placeholder,
  ...restProps // Pass other props like fullWidth, openOnFocus
}: AsyncAutocompleteProps<T>) => {
  // 1. Internal state
  const [options, setOptions] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  // passes an object literal like otherParams={{ isActive: true }}
  const otherParamsString = JSON.stringify(otherParams)

  // 2. The debouncing and fetching logic
  useEffect(() => {
    const trimmedInput = inputValue.trim()

    // If input is empty, reset options to show only the current value (if any)
    if (trimmedInput === '') {
      setOptions(value ? [value] : [])
      setLoading(false) // Ensure loading is off

      return
    }


    // If the input is 1 characters or less, do not start a search.
    // We set loading to false and clear any previous search options.
    if (trimmedInput.length <= fetchInputLenth) {
      setOptions(value ? [value] : []) // Clear options (but keep value if present)
      setLoading(false)
      
      return 
    }


    // Only set loading to true if we are actually going to search (length > 3)
    setLoading(true)

    // Set up the timer
    const timer = setTimeout(async () => {
        try {
            // --- Improved URL Building ---
            const params = new URLSearchParams()
            
            // Use the trimmed input for the search
            params.append(searchParamKey, trimmedInput) 

            // Add all other params from the object
            const parsedOtherParams = JSON.parse(otherParamsString)

            for (const key in parsedOtherParams) {
              if (Object.prototype.hasOwnProperty.call(parsedOtherParams, key)) {
                params.append(key, String(parsedOtherParams[key]))
              }
            }

            const url = `${fetchUrl}?${params.toString()}`
            const response = await apiClient.get(url)

            // --- Your Corrected Data Handling ---
            // You are right, the data is nested in response.data.data
            const data = (response.data.data as T[]) 
            
            setOptions(data)
          } catch (err) {
            
            setOptions([]) // Clear options on failure
          } finally {
            setLoading(false)
          }
    }, debounceDelay)

    // Cleanup
    return () => clearTimeout(timer)
  }, [inputValue, fetchUrl, searchParamKey, debounceDelay, otherParamsString, value])

  return (
    <CustomAutocomplete
      {...restProps}
      value={value}
      onChange={(_, newValue: T | null) => {
        // Use `_` for unused event parameter
        onChange(newValue)
      }}
      onInputChange={(_, newValue: string) => {
        // Use `_` for unused event parameter
        setInputValue(newValue)
      }}
      options={options}
      loading={loading}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}

      // The server is already doing the filtering.
      filterOptions={x => x}
      renderInput={params => (
        <CustomTextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          placeholder={placeholder} // <-- This prop was missing from renderInput
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}

export default AsyncAutocomplete