import { redirect } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

// Auth & Utils
import { verifyToken } from '@/libs/verifyToken'
// Check this import path, ensure it points to where your component actually resides
import QRScanner from '@/views/clinic-app/appoinment/manege/QRScanner'



const ScanPage =async (props: { params: Promise<{ id: string }> }) => {
  // 1. Verify Auth
  const { valid, payload } = await verifyToken()

  if (!valid || !payload) {
    redirect('/login')
  }

  // 2. Role Check (Admin, Staff, Doctor)
  const allowedRoles = ['ADMIN', 'STAFF', 'DOCTOR']
  const userRole = payload.role || 'GUEST'

  if (!allowedRoles.includes(userRole)) {
    return (
        <Grid container justifyContent="center" className="mt-10">
            <Alert severity="error">
                Access Denied. You do not have permission to access this page.
            </Alert>
        </Grid>
    )
  }

  
    const params = await props.params


  // Validation
  if (!params.id || isNaN(Number(params.id) || 0)) {
      return (
        <Grid container justifyContent="center" className="mt-10">
             <Alert severity="error">Invalid Schedule ID Provided.</Alert>
        </Grid>
      )
  }

  return (
    <Grid container spacing={6} justifyContent="center">
      {/* Note: If you are using MUI v5, use <Grid item xs={12}>. 
         If you are using MUI v6 (Grid2), <Grid size={12}> is correct.
      */}
      <Grid size={{ xs: 12, md: 8, lg: 6 }} >
        <div className="mb-6 text-center">
            <Typography variant="h4" className="font-bold text-primary mb-1">
                Queue Scanner
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Scan patient tokens for Schedule #{1}
            </Typography>
        </div>

        {/* Pass the ID to the Scanner for validation */}
        <QRScanner requiredScheduleId={Number(params.id)} />
      </Grid>
    </Grid>
  )
}

export default ScanPage