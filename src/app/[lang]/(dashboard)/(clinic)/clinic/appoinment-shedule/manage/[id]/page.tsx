import { redirect } from 'next/navigation'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { verifyToken } from '@/libs/verifyToken'
import QRScanner from '@/views/clinic-app/appoinment/manege/QRScanner'

const ScanPage = async (props: { params: Promise<{ id: string }> }) => {
  const { valid, payload } = await verifyToken()

  if (!valid || !payload) {
    redirect('/login')
  }

  const allowedRoles = ['ADMIN', 'STAFF', 'DOCTOR']
  const userRole = payload.role || 'GUEST'

  console.log('User Role:', userRole) 

  if (!allowedRoles.includes(userRole)) {
    return (
        <Grid container justifyContent="center" className="mt-10">
            <Alert severity="error">Access Denied. You do not have permission to access this page.</Alert>
        </Grid>
    )
  }
  
  const params = await props.params

  if (!params.id || isNaN(Number(params.id) || 0)) {
      return (
        <Grid container justifyContent="center" className="mt-10">
             <Alert severity="error">Invalid Schedule ID Provided.</Alert>
        </Grid>
      )
  }

  return (
    <Grid container spacing={6} justifyContent="center">
      <Grid size={{ xs: 12, md: 8, lg: 6 }} >
        <div className="mb-6 text-center">
            <Typography variant="h4" className="font-bold text-primary mb-1">Queue Scanner</Typography>
            <Typography variant="body1" color="text.secondary">Scan patient tokens for Schedule #{params.id}</Typography>
        </div>

        {/* 1. PASS ROLE HERE */}
        <QRScanner requiredScheduleId={Number(params.id)} userRole={userRole} />
      </Grid>
    </Grid>
  )
}

export default ScanPage