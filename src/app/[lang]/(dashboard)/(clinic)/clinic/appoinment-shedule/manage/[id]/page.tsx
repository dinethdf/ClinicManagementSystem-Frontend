import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

import AuthGuard from '@/hocs/AuthGuard'
import { AccessControlConfig } from '@/configs/accessControlConfig'
import type { Locale } from '@/configs/i18n'
import QRScanner from '@/views/clinic-app/appoinment/manege/QRScanner'

interface PageProps {
  params: Promise<{ 
    lang: Locale
    id: string 
  }>
}

const ScanPage = async (props: PageProps) => {
  const params = await props.params

  if (!params.id || isNaN(Number(params.id) || 0)) {
      return (
        <Grid container justifyContent="center" className="mt-10">
             <Alert severity="error">Invalid Schedule ID Provided.</Alert>
        </Grid>
      )
  }

  return (
    <AuthGuard locale={params.lang} allowedRoles={AccessControlConfig.manageSchedule}>
      <Grid container spacing={6} justifyContent="center">
        <Grid size={{ xs: 12, md: 8, lg: 6 }} >
          <div className="mb-6 text-center">
              <Typography variant="h4" className="font-bold text-primary mb-1">Queue Scanner</Typography>
              <Typography variant="body1" color="text.secondary">Scan patient tokens for Schedule #{params.id}</Typography>
          </div>

          <QRScanner requiredScheduleId={Number(params.id)} />
        </Grid>
      </Grid>
    </AuthGuard>
  )
}

export default ScanPage
