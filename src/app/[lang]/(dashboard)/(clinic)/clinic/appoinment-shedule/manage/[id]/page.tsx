import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

import AuthGuard from '@/hocs/AuthGuard'
import { Roles } from '@/configs/roleConfig'
import type { Locale } from '@/configs/i18n'
import QRScanner from '@/views/clinic-app/appoinment/manege/QRScanner'

const ScanPage = async (props: { params: Promise<{ id: string, lang: Locale }> }) => {
  const params = await props.params

  if (!params.id || isNaN(Number(params.id) || 0)) {
      return (
        <Grid container justifyContent="center" className="mt-10">
             <Alert severity="error">Invalid Schedule ID Provided.</Alert>
        </Grid>
      )
  }

  return (
    <AuthGuard locale={params.lang} allowedRoles={[Roles.ADMIN, Roles.RECEPTIONIST, Roles.DOCTOR]}>
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