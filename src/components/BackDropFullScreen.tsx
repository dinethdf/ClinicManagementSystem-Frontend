'use client'

import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

interface FullScreenLoaderProps {
  open: boolean
}


const BackDropFullScreen = ({ open }: FullScreenLoaderProps) => {
  return (

    <Backdrop
      open={open}
      sx={{
        color: '#fff',
        zIndex: theme => theme.zIndex.drawer + 1
      }}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
  )
}

export default BackDropFullScreen