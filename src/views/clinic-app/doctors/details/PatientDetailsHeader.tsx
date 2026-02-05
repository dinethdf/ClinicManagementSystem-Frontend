// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import ConfirmationDialog from '@/components/dialogs/cancel-appointment-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

const PatientDetailHeader = ({ patientNo, patientRegDate }: { patientNo: string; patientRegDate: string }) => {
  // Vars
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  return (
    <div className='flex flex-wrap justify-between max-sm:flex-col sm:items-center gap-x-6 gap-y-4'>
      <div className='flex flex-col items-start gap-1'>
        <Typography variant='h4'>{`Patient No #${patientNo}`}</Typography>
        <Typography>{patientRegDate}</Typography>
      </div>
      <OpenDialogOnElementClick
        element={Button}
        elementProps={buttonProps('Delete Patient', 'error', 'tonal')}
        dialog={ConfirmationDialog}
        dialogProps={{ type: 'delete-customer' }}
      />
    </div>
  )
}

export default PatientDetailHeader
