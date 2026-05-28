import AuthGuard from '@/hocs/AuthGuard'
import { AccessControlConfig } from '@/configs/accessControlConfig'
import type { Locale } from '@/configs/i18n'
import Grid from '@mui/material/Grid'
import QRScanner from '@/views/clinic-app/appoinment/manege/QRScanner'

interface PageProps {
  params: Promise<{ 
    lang: Locale
    id: string 
  }>
}

const ScanPage = async (props: PageProps) => {
  const params = await props.params

  return (
    <AuthGuard locale={params.lang} allowedRoles={AccessControlConfig.manageSchedule}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <QRScanner requiredScheduleId={Number(params.id)} />
        </Grid>
      </Grid>
    </AuthGuard>
  )
}

export default ScanPage
