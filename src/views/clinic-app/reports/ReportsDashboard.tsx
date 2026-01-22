'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import ReportTriggerCard from './components/ReportTriggerCard' // Use the one from previous answer

// Dialog Imports
import RevenueReportDialog from '@/components/dialogs/report-dialog/admin-report/RevenueReportDialog'
import PatientHealthReportDialog from '@/components/dialogs/report-dialog/admin-report/PatientHealthReportDialog'
import SessionSummaryReportDialog from '@/components/dialogs/report-dialog/admin-report/SessionSummaryReportDialog'
import DoctorWiseSessionSummaryReportDialog from '@/components/dialogs/report-dialog/admin-report/DoctorWiseSessionSummaryReportDialog'

const ReportsDashboard = () => {
  return (
    <div className='flex flex-col gap-6'>
       <div className='mb-4'>
          <Typography variant='h4' fontWeight={700} color='primary'>Reports & Analytics | Administrator</Typography>
          <Typography variant='body2' color='text.secondary'>Select a category to generate detailed reports.</Typography>
       </div>

       <Grid container spacing={6}>
          
          {/* 1. Revenue Report */}
          <Grid size={{ xs: 12, md: 4 }}>
             <OpenDialogOnElementClick
                element={ReportTriggerCard}
                elementProps={{
                  title: 'Revenue & Earnings',
                  subtitle: 'Total revenue, doctor earnings, and service breakdown.',
                  icon: 'tabler-chart-pie',
                  color: 'success'
                }}
                dialog={RevenueReportDialog}
                dialogProps={{}} // No props needed for this specific dialog
             />
          </Grid>

      {/* 2. Session Financials Report */}
       <Grid size={{ xs: 12, md: 4 }}>
             <OpenDialogOnElementClick
                element={ReportTriggerCard}
                elementProps={{
                  title: 'Doctor Session Financials',
                  subtitle: 'Doctor schedule earnings and session summary.',
                  icon: 'tabler-report-money',
                  color: 'info'
                }}
                 dialog={SessionSummaryReportDialog}
                dialogProps={{}}
             />
          </Grid>

          {/* 3. Appointment Report */}
          <Grid size={{ xs: 12, md: 4 }}>
             <OpenDialogOnElementClick
                element={ReportTriggerCard}
                elementProps={{
                  title: 'Doctor Appointments',
                  subtitle: 'Load analysis, cancellation rates, and visit stats.',
                  icon: 'tabler-calendar-stats',
                  color: 'info'
                }}
                dialog={DoctorWiseSessionSummaryReportDialog}
                dialogProps={{}}
             />
          </Grid>

          {/* 4. Patient Health Report */}
          {/* <Grid size={{ xs: 12, md: 4 }}>
             <OpenDialogOnElementClick
                element={ReportTriggerCard}
                elementProps={{
                  title: 'Patient Health',
                  subtitle: 'Visit history, lab results, and treatment progress.',
                  icon: 'tabler-heart-rate-monitor',
                  color: 'warning'
                }}
                dialog={PatientHealthReportDialog}
                dialogProps={{}}
             />
          </Grid> */}

       </Grid>
    </div>
  )
}

export default ReportsDashboard