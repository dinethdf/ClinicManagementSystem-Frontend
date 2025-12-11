'use client'

import { useState, useEffect } from 'react'

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
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import CustomTabList from '@core/components/mui/TabList'
import type { AppointmentDetailDTO } from '@/types/appoinments.types'

// Import the new server action
import { getPrescriptionByAppointment, type PrescriptionDTO } from '@/services/prescription.server.service'

const AppointmentRight = ({ appointmentData }: { appointmentData: AppointmentDetailDTO }) => {
  const [activeTab, setActiveTab] = useState('overview')
  
  // State for Prescription Data
  const [prescription, setPrescription] = useState<PrescriptionDTO | null>(null)
  const [loadingPrescription, setLoadingPrescription] = useState(false)
  const [prescriptionError, setPrescriptionError] = useState<string | null>(null)

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
        // If 404, specific message, otherwise generic error
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
            
            {/* Appointment Specifics Card */}
            <Card className='mb-6'>
                <CardHeader title="Appointment Information" />
                <Divider />
                <CardContent>
                    <Grid container spacing={6}>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary'>Schedule Date</Typography>
                                <Typography className='font-medium'>{appointmentData.scheduleDate}</Typography>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary'>Time Slot</Typography>
                                <Typography className='font-medium'>{`${appointmentData.startTime} - ${appointmentData.endTime}`}</Typography>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary'>Queue Position</Typography>
                                <Typography className='font-medium text-primary'>No. {appointmentData.queuePosition}</Typography>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <div className='flex flex-col gap-1'>
                                <Typography color='text.secondary'>Total Fee</Typography>
                                <Typography className='font-medium text-success'>LKR {(appointmentData.doctorFee + appointmentData.clinicFee).toFixed(2)}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Financial Breakdown */}
            <Card className='mb-6'>
                <CardHeader 
                    title="Financial Breakdown" 
                    action={
                        <Chip
                            label={appointmentData.invoiceStatus} 
                            color={appointmentData.invoiceStatus === 'PAID' ? 'success' : appointmentData.invoiceStatus === 'CANCELLED' ? 'error' : 'warning'} 
                            size='small' 
                            variant='tonal'
                            className='font-bold'
                        />
                    }
                />
                <Divider />
                <CardContent>
                    <div className='flex justify-between mb-2'>
                        <Typography color='text.secondary'>Doctor Fee</Typography>
                        <Typography>LKR {appointmentData.doctorFee.toFixed(2)}</Typography>
                    </div>
                    <div className='flex justify-between mb-2'>
                        <Typography color='text.secondary'>Clinic Fee</Typography>
                        <Typography>LKR {appointmentData.clinicFee.toFixed(2)}</Typography>
                    </div>

                    <Divider className='my-2 border-dashed' />
   
                    <div className='flex justify-between mb-2'>
                        <Typography className='font-medium'>Subtotal</Typography>
                        <Typography className='font-medium'>
                            LKR {(appointmentData.doctorFee + appointmentData.clinicFee).toFixed(2)}
                        </Typography>
                    </div>

                    {appointmentData.invoiceTotalDiscount > 0 && (
                        <div className='flex justify-between mb-2 text-red-500'>
                            <Typography color='error' variant='body2'>Discount Applied</Typography>
                            <Typography color='error' variant='body2'>
                                - LKR {appointmentData.invoiceTotalDiscount.toFixed(2)}
                            </Typography>
                        </div>
                    )}

                    <Divider className='my-2' />

                    <div className='flex justify-between items-center'>
                        <div className='flex flex-col'>
                            <Typography className='font-bold text-lg text-primary'>Final Amount</Typography>
                            <Typography variant='caption' color='text.disabled'>
                                {appointmentData.invoiceStatus === 'PAID' ? 'Paid by Patient' : 'To be Paid'}
                            </Typography>
                        </div>
                        <Typography className='font-bold text-xl text-primary'>
                            LKR {appointmentData.invoiceFinalAmount.toFixed(2)}
                        </Typography>
                    </div>
                 </CardContent>
            </Card>

            {/* Audit Logs */}
            <Card>
                <CardHeader title="System Information" />
                <Divider />
                <CardContent>
                      <Grid container spacing={6}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant='caption' className='uppercase'>Created</Typography>
                            <Typography>{appointmentData.createdDate ? new Date(appointmentData.createdDate).toLocaleString() : 'N/A'}</Typography>
                            <Typography variant='caption'>by {appointmentData.createdBy}</Typography>
                        </Grid>
                        {appointmentData.updatedDate && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant='caption' className='uppercase'>Last Updated</Typography>
                                <Typography>{new Date(appointmentData.updatedDate).toLocaleString()}</Typography>
                                <Typography variant='caption'>by {appointmentData.updatedBy}</Typography>
                            </Grid>
                        )}
                      </Grid>
                </CardContent>
            </Card>
          </TabPanel>

          {/* ==========================
              TAB 2: PRESCRIPTION (NEW)
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
                    {/* Header Card */}
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
                                    <div className='bg-yellow-50 p-3 rounded border border-yellow-200 mt-1'>
                                        <Typography className='italic text-gray-700'>
                                            "{prescription.note}"
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant='caption' className='uppercase text-gray-500'>Issued By</Typography>
                                    <Typography variant='body2'>{prescription.doctorName}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant='caption' className='uppercase text-gray-500'>Issued Date</Typography>
                                    <Typography variant='body2'>{new Date(prescription.createdDate).toLocaleDateString()}</Typography>
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
                                            <TableCell className='font-semibold'>{item.medicineName}</TableCell>
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