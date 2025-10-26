'use client'

import { apiClient } from '@/services/api.config'
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
  fetchUrl: string
  label: string
  value: T | null   // These make it a "Controlled Component"
  onChange: (newValue: T | null) => void
  searchQueryParam?: string
  otherPrams?: string
  debounceDelay?: number
  error?: boolean
  helperText?: string
  placeholder?: string
} & Omit<
  AutocompleteProps<T, false, false, false, 'div'>,
  'options' | 'renderInput' | 'loading' | 'value' | 'onChange' | 'onInputChange'
>

// Set default values for optional props
const defaultProps = {
  searchQueryParam: 'q',
  debounceDelay: 500,
  otherPrams: 'param',
  getOptionLabel: (option: any) => option.firstName + " " + option.lastName  || '',
  isOptionEqualToValue: (option: any, value: any) => option.id === value.id
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

         const response = await apiClient.get(url);

        const data =  (response.data.data as T[])

        setOptions(data)
      } catch (error) {
        console.error('Failed to fetch autocomplete data:', error)
      }

      setLoading(false)
    }, debounceDelay)

    // Cleanup
    return () => clearTimeout(timer)
  }, [inputValue, fetchUrl, searchQueryParam, debounceDelay, otherPrams, value])

  return (
    <CustomAutocomplete
      {...restProps} // Pass props like fullWidth, openOnFocus
      value={value}
      onChange={(event: any, newValue: T | null) => {
        onChange(newValue)
      }}
      onInputChange={(event: ChangeEvent<{}>, newValue: string) => {
        setInputValue(newValue)
      }}
      options={options}
      loading={loading}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
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
