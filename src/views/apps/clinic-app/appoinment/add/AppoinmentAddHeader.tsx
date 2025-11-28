// MUI Imports
import Typography from '@mui/material/Typography'

const AppoinmentAddHeader = () => {
  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          Add new appoinment
        </Typography>
      </div>

    </div>
  )
}

export default AppoinmentAddHeader
