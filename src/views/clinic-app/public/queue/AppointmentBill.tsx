// 'use client'

// import { useMemo } from 'react'
// import Box from '@mui/material/Box'
// import Paper from '@mui/material/Paper'
// import Typography from '@mui/material/Typography'
// import Divider from '@mui/material/Divider'
// import Button from '@mui/material/Button'
// import { generateQueueTrackingUrl } from '@/utils/qrcode'

// interface AppointmentBillProps {
//   scheduleId: number
//   queueNo: number
//   patientName: string
//   doctorName: string
//   date: string
//   time: string
// }

// const AppointmentBill = ({ 
//   scheduleId, 
//   queueNo, 
//   patientName, 
//   doctorName, 
//   date, 
//   time 
// }: AppointmentBillProps) => {
  
//   // Generate QR code URL
//   const qrCodeUrl = useMemo(() => {
//     return generateQueueTrackingUrl(scheduleId, queueNo)
//   }, [scheduleId, queueNo])

//   // Generate QR code using Google Charts API
// const qrCodeImageUrl = useMemo(() => {
//   const encodedUrl = encodeURIComponent(qrCodeUrl)
//   return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUrl}`
// }, [qrCodeUrl])

//   const handlePrint = () => {
//     window.print()
//   }

//   return (
//     <Box className='max-w-md mx-auto p-4'>
//       <Paper elevation={3} className='p-6'>
        
//         {/* Header */}
//         <Box className='text-center mb-4'>
//           <Typography variant='h5' fontWeight={700} gutterBottom>
//             Appointment Token
//           </Typography>
//           <Typography variant='body2' color='text.secondary'>
//             Please keep this for queue tracking
//           </Typography>
//         </Box>

//         <Divider className='my-4' />

//         {/* Appointment Details */}
//         <Box className='space-y-3 mb-4'>
//           <Box className='flex justify-between'>
//             <Typography variant='body2' color='text.secondary'>Patient Name:</Typography>
//             <Typography variant='body2' fontWeight={600}>{patientName}</Typography>
//           </Box>
//           <Box className='flex justify-between'>
//             <Typography variant='body2' color='text.secondary'>Doctor:</Typography>
//             <Typography variant='body2' fontWeight={600}>{doctorName}</Typography>
//           </Box>
//           <Box className='flex justify-between'>
//             <Typography variant='body2' color='text.secondary'>Date:</Typography>
//             <Typography variant='body2' fontWeight={600}>{date}</Typography>
//           </Box>
//           <Box className='flex justify-between'>
//             <Typography variant='body2' color='text.secondary'>Time:</Typography>
//             <Typography variant='body2' fontWeight={600}>{time}</Typography>
//           </Box>
//         </Box>

//         <Divider className='my-4' />

//         {/* Token Number - Large Display */}
//         <Box className='text-center my-6 p-4 bg-primary-50 rounded-lg'>
//           <Typography variant='caption' color='text.secondary' className='block mb-1'>
//             Your Token Number
//           </Typography>
//           <Typography variant='h2' fontWeight={900} color='primary'>
//             {queueNo}
//           </Typography>
//         </Box>

//         {/* QR Code */}
//         <Box className='text-center my-6'>
//           <Typography variant='subtitle2' fontWeight={700} gutterBottom>
//             Scan to Track Queue
//           </Typography>
//           <Typography variant='caption' color='text.secondary' className='block mb-3'>
//             Scan this QR code with your phone to view real-time queue status
//           </Typography>
          
//           <Box className='flex justify-center p-4 bg-gray-50 rounded-lg'>
// <img
//   src={qrCodeImageUrl}
//   alt="Queue Tracking QR Code"
//   width={250}
//   height={250}
// />
//           </Box>
//         </Box>

//         {/* Instructions */}
//         <Box className='bg-blue-50 p-3 rounded-lg mb-4'>
//           <Typography variant='caption' fontWeight={600} color='primary' className='block mb-1'>
//             📱 How to use:
//           </Typography>
//           <Typography variant='caption' color='text.secondary' className='block'>
//             1. Scan the QR code with your phone camera<br />
//             2. Track your queue position in real-time<br />
//             3. Arrive at the clinic when you're almost up
//           </Typography>
//         </Box>

//         <Divider className='my-4' />

//         {/* Footer */}
//         <Box className='text-center'>
//           <Typography variant='caption' color='text.secondary'>
//             Please arrive 10 minutes before your estimated time
//           </Typography>
//         </Box>

//         {/* Print Button (hidden on print) */}
//         <Box className='mt-4 no-print'>
//           <Button 
//             variant='contained' 
//             fullWidth 
//             onClick={handlePrint}
//             startIcon={<i className='tabler-printer' />}
//           >
//             Print Token
//           </Button>
//         </Box>

//       </Paper>

//       {/* Print Styles */}
//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           .max-w-md, .max-w-md * {
//             visibility: visible;
//           }
//           .max-w-md {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </Box>
//   )
// }

// export default AppointmentBill