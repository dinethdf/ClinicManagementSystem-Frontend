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
  searchParamKey?: string 
  otherParams?: Record<string, string | number | boolean> 
  fetchInputLenth?: number
  debounceDelay?: number
  error?: boolean
  helperText?: string
  placeholder?: string

  // --- NEW OPTIONAL PROPS ---
  fetchAllOnEmpty?: boolean     // Set to true to fetch data without typing
  defaultNoOptionsText?: string // Text to show before user types enough
  notFoundText?: string         // Text to show if API returns 0 results
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
  otherParams = {}, 
  debounceDelay = 800,
  getOptionLabel = (option: any) => `${option.firstName} ${option.lastName}` || '',
  fetchInputLenth = 1,
  isOptionEqualToValue = (option: any, value: any) => option.id === value.id,
  error,
  helperText,
  placeholder,

  // --- DEFAULT VALUES FOR NEW PROPS ---
  fetchAllOnEmpty = false,
  defaultNoOptionsText = 'Type to search...',
  notFoundText = 'No results found',
  ...restProps 
}: AsyncAutocompleteProps<T>) => {
  // 1. Internal state
  const [options, setOptions] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const otherParamsString = JSON.stringify(otherParams)

  // Determine what message to show when the dropdown is empty
  const currentNoOptionsText = 
    (inputValue.trim().length <= fetchInputLenth && !fetchAllOnEmpty)
      ? defaultNoOptionsText 
      : notFoundText

  // 2. The debouncing and fetching logic
  useEffect(() => {
    const trimmedInput = inputValue.trim()

    // Prevent re-fetching when an item is explicitly selected
    if (value && getOptionLabel(value) === inputValue && trimmedInput !== '') {
      setLoading(false)
      
return 
    }

    // Determine if we should skip the fetch based on input length and fetchAllOnEmpty flag
    const isEmptyAndShouldNotFetch = trimmedInput === '' && !fetchAllOnEmpty
    const isTooShort = trimmedInput !== '' && trimmedInput.length <= fetchInputLenth

    if (isEmptyAndShouldNotFetch || isTooShort) {
      setOptions(value ? [value] : []) // Clear options (but keep value if present)
      setLoading(false)
      
return
    }

    setLoading(true)

    const timer = setTimeout(async () => {
        try {
            const params = new URLSearchParams()
            
            // Only append the search param if there's actually text, 
            // so we don't send `?query=` when fetching all
            if (trimmedInput) {
                params.append(searchParamKey, trimmedInput) 
            }

            const parsedOtherParams = JSON.parse(otherParamsString)

            for (const key in parsedOtherParams) {
              if (Object.prototype.hasOwnProperty.call(parsedOtherParams, key)) {
                params.append(key, String(parsedOtherParams[key]))
              }
            }

            const url = `${fetchUrl}?${params.toString()}`
            const response = await apiClient.get(url)

            const data = (response.data.data as T[])
 
            setOptions(data)
          } catch (err) {
            setOptions([]) 
          } finally {
            setLoading(false)
          }
    }, debounceDelay)

    return () => clearTimeout(timer)
  }, [inputValue, fetchUrl, searchParamKey, debounceDelay, otherParamsString, value, fetchAllOnEmpty, fetchInputLenth])

  return (
    <CustomAutocomplete
      {...restProps}
      value={value}
      onChange={(_, newValue: T | null) => {
        onChange(newValue)
      }}
      onInputChange={(_, newValue: string) => {
        setInputValue(newValue)
      }}
      options={options}
      loading={loading}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      noOptionsText={currentNoOptionsText} // <-- Pass the dynamic text here
      filterOptions={x => x}
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