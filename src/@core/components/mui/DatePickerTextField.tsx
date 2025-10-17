'use client'

// React Imports
import { forwardRef } from 'react'
import type { ForwardedRef } from 'react'

// Third-party Imports
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import type { DatePickerProps } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// MUI Imports
import { styled } from '@mui/material/styles'
import type { TextFieldProps } from '@mui/material/TextField'

const DatePickerStyled = styled(DatePicker)(({ theme }) => ({
  width: '100%',

  // Styles from your CustomTextField are applied here, targeting the inner elements.
  '& .MuiInputLabel-root': {
    transform: 'none',
    width: 'fit-content',
    maxWidth: '100%',
    lineHeight: 1.153,
    position: 'relative',
    fontSize: theme.typography.body2.fontSize,
    marginBottom: theme.spacing(1),
    color: 'var(--mui-palette-text-primary)',
    '&:not(.Mui-error).MuiFormLabel-colorPrimary.Mui-focused': {
      color: 'var(--mui-palette-primary-main) !important'
    },
    '&.Mui-disabled': {
      color: 'var(--mui-palette-text-disabled)'
    },
    '&.Mui-error': {
      color: 'var(--mui-palette-error-main)'
    }
  },
  '& .MuiInputBase-root': {
    backgroundColor: 'transparent !important',
    border: `1px solid var(--mui-palette-customColors-inputBorder, rgba(0, 0, 0, 0.23))`, // Fallback color
    '&:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error):hover': {
      borderColor: 'var(--mui-palette-action-active, rgba(0, 0, 0, 0.87))' // Fallback color
    },
    '&:before, &:after': {
      display: 'none'
    },
    '&.MuiInputBase-sizeSmall': {
      borderRadius: 'var(--mui-shape-borderRadius, 4px)' // Fallback value
    },
    '&.Mui-error': {
      borderColor: 'var(--mui-palette-error-main, #f44336)' // Fallback color
    },
    '&.Mui-focused': {
      borderWidth: 2,
      '& .MuiInputBase-input:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
        transform: 'translateX(4px)'
      },
      '& :not(textarea).MuiFilledInput-input': {
        padding: '6.25px 13px'
      },
      '&:not(.Mui-error).MuiInputBase-colorPrimary': {
        borderColor: 'var(--mui-palette-primary-main, #1976d2)', // Fallback color
        boxShadow: 'var(--mui-customShadows-primary-sm, 0 2px 4px rgba(0,0,0,0.2))' // Fallback value
      },
      '&.MuiInputBase-colorSecondary': {
        borderColor: 'var(--mui-palette-secondary-main, #9c27b0)'
      },
      '&.MuiInputBase-colorInfo': {
        borderColor: 'var(--mui-palette-info-main, #0288d1)'
      },
      '&.MuiInputBase-colorSuccess': {
        borderColor: 'var(--mui-palette-success-main, #2e7d32)'
      },
      '&.MuiInputBase-colorWarning': {
        borderColor: 'var(--mui-palette-warning-main, #ed6c02)'
      },
      '&.MuiInputBase-colorError, &.Mui-error': {
        borderColor: 'var(--mui-palette-error-main, #f44336)'
      }
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--mui-palette-action-hover, rgba(0, 0, 0, 0.04)) !important' // Fallback color
    }
  },

  // Adornments and Input styles
  '& .MuiInputAdornment-root': {
    marginBlockStart: '0px !important'
  },
  '& .MuiInputBase-input': {
    '&:not(textarea).MuiInputBase-inputSizeSmall': {
      padding: '7.25px 14px'
    },
    '&:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
      transition: theme.transitions.create(['opacity', 'transform'], {
        duration: theme.transitions.duration.shorter
      })
    }
  },

  // Helper Text
  '& .MuiFormHelperText-root': {
    lineHeight: 1.154,
    margin: theme.spacing(1, 0, 0),
    fontSize: theme.typography.body2.fontSize,
    '&.Mui-error': {
      color: 'var(--mui-palette-error-main, #f44336)'
    },
    '&.Mui-disabled': {
      color: 'var(--mui-palette-text-disabled, rgba(0, 0, 0, 0.38))'
    }
  }
}))

// type CustomDatePickerProps = Omit<DatePickerProps<any>, 'slotProps'> & {
//     textFieldProps?: TextFieldProps
//   // You can add any custom props here if needed in the future
// }

type CustomDatePickerProps = DatePickerProps<any> & {
  // any additional custom props
}

const CustomDatePicker = forwardRef((props: CustomDatePickerProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { slotProps: incomingSlotProps, ...otherProps } = props

  return (
    // LocalizationProvider is essential for date-picker components to work

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePickerStyled
        ref={ref}
        {...otherProps}
        slotProps={{
          textField: {
            size: 'small',
            InputLabelProps: { shrink: true }, // This ensures the label is always in the top position
            ...(incomingSlotProps?.textField || {})
          } as TextFieldProps
        }}
      />
    </LocalizationProvider>
  )
})

export default CustomDatePicker
