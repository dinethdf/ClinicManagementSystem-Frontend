"use client"

// React Imports
import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import CircularProgress from '@mui/material/CircularProgress'
import type { AutocompleteProps } from '@mui/material/Autocomplete'


import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'

// Data Imports
import { db } from './../../fake-db/apps/userList'


type AsyncAutocompleteProps<T> = {
  fetchUrl: string // The base API endpoint (e.g., '/api/doctors')
  label: string
  
  // These make it a "Controlled Component"
  value: T | null
  onChange: (newValue: T | null) => void

  searchQueryParam?: string 
  otherPrams?: string
  debounceDelay?: number // Delay in ms (e.g., 500)
  
  // Props for react-hook-form's Controller to pass down
  error?: boolean
  helperText?: string
  placeholder?:string

} & Omit<
  AutocompleteProps<T, false, false, false, 'div'>,
  'options' | 'renderInput' | 'loading' | 'value' | 'onChange' | 'onInputChange'
>

// Set default values for optional props
const defaultProps = {
  searchQueryParam: 'q',
  debounceDelay: 500,
  otherPrams: '',
  getOptionLabel: (option: any) => option.fullName || '',
  isOptionEqualToValue: (option: any, value: any) => option.id === value.id,
}

// --- The Reusable Component ---
const AsyncAutocomplete = <T extends {}>({
  fetchUrl,
  label,
  value,
  onChange,
  searchQueryParam = defaultProps.searchQueryParam,
  otherPrams = defaultProps.otherPrams,
  debounceDelay = defaultProps.debounceDelay,
  getOptionLabel = defaultProps.getOptionLabel,
  isOptionEqualToValue = defaultProps.isOptionEqualToValue,
  error,
  helperText,
  placeholder,
  ...restProps // Pass other props like fullWidth, openOnFocus
}: AsyncAutocompleteProps<T>) => {
  
  // 1. Internal state for this component
  const [options, setOptions] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  // 2. The debouncing and fetching logic
  useEffect(() => {
    // Don't fetch if the input is empty
    if (inputValue === '') {
      setOptions(value ? [value] : [])
      return
    }

    setLoading(true)

    // Set up the timer
    const timer = setTimeout(async () => {
      try {
        const url = `${fetchUrl}?${searchQueryParam}=${inputValue}&${otherPrams}`
       
       
        // const response = await fetch(url)
        // const data = (await response.json()) as T[]

       const response = new Response(
            JSON.stringify({
              success: true,
              message: "Fetched dummy data successfully",
              data: 
                db
              ,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          )
        const data = (await response.json()).data as T[]

        setOptions(data)
      } catch (error) {
        console.error('Failed to fetch autocomplete data:', error)
      }
      setLoading(false)
    }, debounceDelay)

    // Cleanup
    return () => clearTimeout(timer)
  }, [inputValue, fetchUrl, searchQueryParam, debounceDelay, value])

  return (
    <CustomAutocomplete
      {...restProps} // Pass props like fullWidth, openOnFocus
      
      // Controlled props
      value={value}
      onChange={(event: any, newValue: T | null) => {
        onChange(newValue)
      }}
      
      // Internal state props
      onInputChange={(event: ChangeEvent<{}>, newValue: string) => {
        setInputValue(newValue)
      }}
      options={options}
      loading={loading}
      
      // Label and comparison props
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      
      // Render the input field
      renderInput={params => (
        <CustomTextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}

export default AsyncAutocomplete