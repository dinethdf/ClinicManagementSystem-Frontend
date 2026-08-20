'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'

import CustomTabList from '@core/components/mui/TabList'
import type { AppointmentDetailDTO } from '@/types/appoinments.types'

// Import the server action
import { getPrescriptionByAppointment, type PrescriptionDTO } from '@/services/appointment/prescription.server.service'

const AppointmentRight = ({ appointmentData }: { appointmentData: AppointmentDetailDTO }) => {
  const [activeTab, setActiveTab] = useState('overview')
  
  // State for Prescription Data
  const [prescription, setPrescription] = useState<PrescriptionDTO | null>(null)
  const [loadingPrescription, setLoadingPrescription] = useState(false)
  const [prescriptionError, setPrescriptionError] = useState<string | null>(null)

  // Helper for Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 2 }).format(amount);
  };

  // Fetch Prescription on Mount
  useEffect(() => {
    const fetchPrescription = async () => {
      if (!appointmentData.id) return
      
      setLoadingPrescription(true)
      const res = await getPrescriptionByAppointment(appointmentData.id)
      
      if (res.success && res.data) {
        setPrescription(res.data)
        setPrescriptionError(null)
      } else {
        if (res.error?.status === 404) {
             setPrescriptionError("No prescription has been issued for this appointment yet.")
        } else {
             setPrescriptionError(res.error?.message || "Failed to load prescription.")
        }

        setPrescription(null)
      }

      setLoadingPrescription(false)
    }

    fetchPrescription()
  }, [appointmentData.id])

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={(_, val) => setActiveTab(val)} variant='scrollable' pill='true'>
            <Tab icon={<i className='tabler-info-circle' />} value='overview' label='Overview' iconPosition='start' />
            <Tab icon={<i className='tabler-prescription' />} value='prescription' label='Prescription' iconPosition='start' />
          </CustomTabList>
        </Grid>

        <Grid size={{ xs: 12 }}>
          
          {/* ==========================
              TAB 1: OVERVIEW
             ========================== */}
          <TabPanel value='overview' className='p-0'>
            
            {/* 1. Appointment Specifics Card */}
            <Card className='mb-6'>
                <CardHeader 
                    title="Appointment Information" 
                    action={
                        <Chip 
                            label={appointmentData.statusDisplayName || appointmentData.status} 
                            sx={{ backgroundColor: appointmentData.statusColor, color: '#fff' }}
                            size='small' 
                        />
                    }
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={6}>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary' variant="caption" className="uppercase font-bold">Schedule Date</Typography>
                                <div className="flex items-center gap-2">
                                    <i className="tabler-calendar text-gray-500" />
                                    <Typography className='font-medium'>{appointmentData.scheduleDate}</Typography>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary' variant="caption" className="uppercase font-bold">Time Slot</Typography>
                                <div className="flex items-center gap-2">
                                    <i className="tabler-clock text-gray-500" />
                                    <Typography className='font-medium'>{`${appointmentData.startTime} - ${appointmentData.endTime}`}</Typography>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary' variant="caption" className="uppercase font-bold">Queue Position</Typography>
                                <div className="flex items-center gap-2">
                                    <i className="tabler-list-numbers text-primary" />
                                    <Typography className='font-bold text-lg text-primary'>No. {appointmentData.queuePosition}</Typography>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary' variant="caption" className="uppercase font-bold">Doctor</Typography>
                                <div className="flex items-center gap-2">
                                    <i className="tabler-stethoscope text-gray-500" />
                                    <Typography className='font-medium'>{appointmentData.doctorName}</Typography>
                                </div>
                                <Typography variant="caption" className="ml-6 text-gray-400">{appointmentData.specialization}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* 2. Financial Breakdown Card */}
            <Card className='mb-6'>
                <CardHeader 
                    title="Financial Breakdown" 
                    subheader="Detailed breakdown of fees and discounts"
                    action={
                        <Chip
                            label={appointmentData.invoiceStatusDisplayName || appointmentData.invoiceStatus} 
                            sx={{ backgroundColor: appointmentData.invoiceStatusColor, color: '#fff' }}
                            size='small' 
                            variant='filled'
                            className='font-bold'
                        />
                    }
                />
                <Divider />
                <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {/* Fee Rows */}
                        <div className='flex justify-between mb-2'>
                            <Typography color='text.secondary'>Doctor Fee</Typography>
                            <Typography className="font-medium">{formatCurrency(appointmentData.doctorFee)}</Typography>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <Typography color='text.secondary'>Clinic Fee</Typography>
                            <Typography className="font-medium">{formatCurrency(appointmentData.clinicFee)}</Typography>
                        </div>

                        <Divider className='my-3 border-dashed' />
   
                        {/* Subtotal */}
                        <div className='flex justify-between mb-2'>
                            <Typography className='font-semibold text-gray-700'>Subtotal</Typography>
                            <Typography className='font-semibold text-gray-700'>
                                {formatCurrency(appointmentData.doctorFee + appointmentData.clinicFee)}
                            </Typography>
                        </div>

                        {/* Discounts */}
                        {appointmentData.invoiceTotalDiscount > 0 && (
                            <div className='flex justify-between mb-2 text-red-500 bg-red-50 p-1 rounded px-2'>
                                <div className="flex items-center gap-1">
                                    <i className="tabler-discount-2" />
                                    <Typography color='error' variant='body2' className="font-medium">Discount Applied</Typography>
                                </div>
                                <Typography color='error' variant='body2' className="font-bold">
                                    - {formatCurrency(appointmentData.invoiceTotalDiscount)}
                                </Typography>
                            </div>
                        )}

                        <Divider className='my-3' />

                        {/* Final Total */}
                        <div className='flex justify-between items-center'>
                            <div className='flex flex-col'>
                                <Typography variant="h6" className='font-bold text-primary'>Total Paid</Typography>
                                <Typography variant='caption' color='text.disabled'>
                                    Final invoice amount
                                </Typography>
                            </div>
                            <Typography variant="h5" className='font-bold text-primary'>
                                {formatCurrency(appointmentData.invoiceFinalAmount)}
                            </Typography>
                        </div>
                    </div>
                 </CardContent>
            </Card>

            {/* 3. System / Audit Logs */}
            <Card>
                <CardHeader title="System Information" />
                <Divider />
                <CardContent>
                      <Grid container spacing={6}>
                        {/* Created By */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box className="flex flex-col gap-1">
                                <Typography variant='caption' className='uppercase text-gray-400 font-bold'>Created</Typography>
                                <div className="flex items-center gap-2">
                                    <i className="tabler-calendar-plus text-gray-500" />
                                    <Typography>{appointmentData.createdDate ? new Date(appointmentData.createdDate).toLocaleString() : 'N/A'}</Typography>
                                </div>
                                <Typography variant='caption' className="text-gray-500">by {appointmentData.createdBy}</Typography>
                            </Box>
                        </Grid>

                        {/* Updated By */}
                        {appointmentData.updatedDate && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box className="flex flex-col gap-1">
                                    <Typography variant='caption' className='uppercase text-gray-400 font-bold'>Last Updated</Typography>
                                    <div className="flex items-center gap-2">
                                        <i className="tabler-edit text-gray-500" />
                                        <Typography>{new Date(appointmentData.updatedDate).toLocaleString()}</Typography>
                                    </div>
                                    <Typography variant='caption' className="text-gray-500">by {appointmentData.updatedBy}</Typography>
                                </Box>
                            </Grid>
                        )}

                        {/* Notes */}
                        {appointmentData.note && (
                            <Grid size={{ xs: 12 }}>
                                <Divider className="my-2" />
                                <Typography variant='caption' className='uppercase text-gray-400 font-bold'>System Note</Typography>
                                <div className="bg-yellow-50 border border-yellow-100 p-3 rounded mt-2">
                                    <Typography variant="body2" className="whitespace-pre-line text-gray-700">
                                        {appointmentData.note}
                                    </Typography>
                                </div>
                            </Grid>
                        )}
                      </Grid>
                </CardContent>
            </Card>
          </TabPanel>

          {/* ==========================
              TAB 2: PRESCRIPTION
             ========================== */}
          <TabPanel value='prescription' className='p-0'>
            {loadingPrescription ? (
                <Card className='h-[300px] flex items-center justify-center'>
                    <CircularProgress />
                </Card>
            ) : prescriptionError ? (
                <Card className='h-[200px] flex flex-col items-center justify-center p-6 text-center border-dashed border-2'>
                    <div className='bg-gray-100 p-3 rounded-full mb-3'>
                        <i className='tabler-file-off text-2xl text-gray-500' />
                    </div>
                    <Typography variant='h6' className='text-gray-600 mb-1'>No Prescription Found</Typography>
                    <Typography variant='body2' color='text.secondary'>{prescriptionError}</Typography>
                </Card>
            ) : prescription ? (
                <div className='flex flex-col gap-6'>
                    {/* Prescription Header */}
                    <Card>
                        <CardHeader 
                            title={`Prescription #${prescription.id}`}
                            action={<Chip label={prescription.status} color='success' variant='tonal' />}
                        />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant='caption' className='uppercase text-gray-500'>Doctor's Note</Typography>
                                    <div className='bg-blue-50 p-3 rounded border border-blue-100 mt-1'>
                                        <Typography className='italic text-gray-700'>
                                            "{prescription.note}"
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant='caption' className='uppercase text-gray-500'>Issued By</Typography>
                                    <div className="flex items-center gap-1">
                                        <i className="tabler-user-md text-gray-500" />
                                        <Typography variant='body2' className="font-medium">{prescription.doctorName}</Typography>
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant='caption' className='uppercase text-gray-500'>Issued Date</Typography>
                                    <div className="flex items-center gap-1">
                                        <i className="tabler-calendar text-gray-500" />
                                        <Typography variant='body2'>{new Date(prescription.createdDate).toLocaleDateString()}</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Medicines List */}
                    <Card>
                         <CardHeader title="Medicines & Dosage" />
                         <TableContainer>
                            <Table>
                                <TableHead className='bg-gray-50'>
                                    <TableRow>
                                        <TableCell>Medicine</TableCell>
                                        <TableCell>Dosage</TableCell>
                                        <TableCell>Duration</TableCell>
                                        <TableCell>Instructions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prescription.items.map((item, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell className='font-semibold text-primary'>{item.medicineName}</TableCell>
                                            <TableCell>
                                                <Chip label={item.dosage} size='small' color='primary' variant='outlined' />
                                            </TableCell>
                                            <TableCell>{item.duration || '-'}</TableCell>
                                            <TableCell className='text-gray-600 italic'>{item.instructions || 'As directed'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </TableContainer>
                    </Card>
                </div>
            ) : null}
          </TabPanel>

        </Grid>
      </Grid>
    </TabContext>
  )
}

export default AppointmentRight