'use client'

// MUI Imports
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

// Define the props the component will accept
interface FullScreenLoaderProps {
  open: boolean
}

/**
 * A reusable full-screen loading backdrop that matches the Vuexy theme.
 * @param {boolean} open - Controls the visibility of the backdrop.
 */
const BackDropFullScreen = ({ open }: FullScreenLoaderProps) => {
  return (
    // Backdrop provides the semi-transparent overlay. It automatically
    // adapts its darkness for both light and dark themes.
    <Backdrop
      open={open}
      sx={{
        // Sets the color for child elements (the spinner) to white.
        color: '#fff',
        // Ensures the backdrop is displayed on top of other UI elements,
        // like navigation drawers or modals.
        zIndex: theme => theme.zIndex.drawer + 1
      }}
    >
      {/* CircularProgress is the spinning indicator. 'inherit' tells it
      to take its color from the parent Backdrop's color ('#fff'). */}
      <CircularProgress color='inherit' />
    </Backdrop>
  )
}

export default BackDropFullScreen