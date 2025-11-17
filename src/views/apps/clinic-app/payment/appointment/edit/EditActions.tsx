// 'use client'

// // React Imports
// import { useState } from 'react'


// // MUI Imports
// import Card from '@mui/material/Card'
// import CardContent from '@mui/material/CardContent'
// import Button from '@mui/material/Button'
// import Grid from '@mui/material/Grid2'

// import MenuItem from '@mui/material/MenuItem'

// // Type Imports
// import type { Locale } from '@configs/i18n'

// import type { ButtonProps } from '@mui/material/Button'

// // Component Imports
// import AddPaymentDrawer from '@views/apps/clinic-app/payment/appointment/shared/AddPaymentDrawer'
// import CustomTextField from '@core/components/mui/TextField'

// // Util Imports
// import { getLocalizedUrl } from '@/utils/i18n'



// // Component Imports
// import PaymentFinalizer from '@/components/dialogs/payment-finalize'
// import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

// const EditActions = ({ id }: { id: string }) => {
//   // States
//   const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false)

//     const buttonProps: ButtonProps = {
//       variant: 'contained',
//       color:"success",
//       className:"capitalize",
//       children: 'Make Payment'
//     }


//   return (
//     <Grid container spacing={6}>
//       <Grid size={{ xs: 12 }}>
//         <Card>
//           <CardContent className='flex flex-col gap-4'>
//              <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialogProps = {{finalTotal:8888}} dialog={PaymentFinalizer} />
//           </CardContent>
//         </Card>
//         {/* <AddPaymentDrawer open={paymentDrawerOpen} handleClose={() => setPaymentDrawerOpen(false)} /> */}
//       </Grid>

//       <Grid size={{ xs: 12 }}>

//       </Grid>
//     </Grid>
//   )
// }

// export default EditActions
