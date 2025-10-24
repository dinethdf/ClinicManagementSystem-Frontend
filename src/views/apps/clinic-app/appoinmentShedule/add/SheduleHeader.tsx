import Typography from '@mui/material/Typography'

const SheduleHeader = () => {
  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          Doctor Appointment Scheduling
        </Typography>
        {/* <Typography>Orders placed across your store</Typography> */}
      </div>
    </div>
  )
}

export default SheduleHeader
