'use client'

import { useState, useEffect } from 'react'

import { toast } from 'react-toastify'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'

// Custom Components
import CustomTabList from '@core/components/mui/TabList'

// Services
import { 
  getAccountStatus, 

  // createAccount, 
  sendResetLink, 
  disableTwoFactor, 

  // revokeAllSessions, 
  toggleSuspension,
  type SystemAccountStatusDTO 
} from '@/services/staff/staffSecurity.server.service'

// We need the staffId to make the API calls
interface StaffRightProps {
  staffId: number;
}

const StaffRight = ({ staffId }: StaffRightProps) => {
  const [activeTab, setActiveTab] = useState('overview')
  
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [securityData, setSecurityData] = useState<SystemAccountStatusDTO | null>(null)

  // Fetch security status on mount
  const fetchSecurityStatus = async () => {
    setLoading(true)
    const data : any = await getAccountStatus(staffId)

    if (data?.success) {
        setSecurityData(data.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchSecurityStatus()
  }, [staffId])

  // --- ACTION HANDLERS ---
  const handleCreateAccount = async () => {
    // setActionLoading('create')
    // try {
    //   const res = await createAccount(staffId)
    //   if (res.success) {
    //       toast.success(res.message || "System account created successfully.")
    //       fetchSecurityStatus() 
    //   } else {
    //       toast.error(res.error || "Failed to create account.")
    //   }
    // } catch (error) {
    //   toast.error("Failed to create account.")
    // } finally {
    //   setActionLoading(null)
    // }
  }

  const handleSendResetLink = async () => {
    setActionLoading('resetLink')

    try {
      const res = await sendResetLink(staffId)

      if (res.success) {
          toast.success(res.message || "Password reset link sent.")
      } else {
          toast.error(res.message || "Failed to send reset link.")
      }
    } catch (error) {
      toast.error("Failed to send reset link.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDisable2FA = async () => {
      // In a real app, add a confirmation dialog here before calling API
      setActionLoading('disable2FA')

      try {
        const res = await disableTwoFactor(staffId)

        if (res.success) {
            toast.success(res.message || "Two-Factor Authentication disabled.")
            fetchSecurityStatus() 
        } else {
            toast.error(res.message || "Failed to disable 2FA.")
        }
      } catch (error) {
        toast.error("Failed to disable 2FA.")
      } finally {
        setActionLoading(null)
      }
  }

  const handleRevokeSessions = async () => {
      setActionLoading('revoke')

      try {
        // const res = await revokeAllSessions(staffId)
        // if (res.success) {
        //     toast.success(res.message || "All active sessions revoked.")
        // } else {
        //     toast.error(res.error || "Failed to revoke sessions.")
        // }
      } catch (error) {
        toast.error("Failed to revoke sessions.")
      } finally {
        setActionLoading(null)
      }
  }

  const handleToggleSuspension = async (isCurrentlySuspended: boolean) => {
      setActionLoading('suspend')

      try {
        const res = await toggleSuspension(staffId, !isCurrentlySuspended)

        if (res.success) {
            toast.success(res.message || (isCurrentlySuspended ? "Account reactivated." : "Account suspended."))
            fetchSecurityStatus()
        } else {
            toast.error(res.message || "Failed to change account status.")
        }
      } catch (error) {
        toast.error("Failed to change account status.")
      } finally {
        setActionLoading(null)
      }
  }


  if (loading) {
      return (
          <Box className="flex justify-center p-10">
              <CircularProgress />
          </Box>
      )
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={(_, val) => setActiveTab(val)} variant='scrollable' pill='true'>
            <Tab icon={<i className='tabler-info-circle' />} value='overview' label='Overview' iconPosition='start' />
            <Tab icon={<i className='tabler-shield-lock' />} value='security' label='Security' iconPosition='start' />
          </CustomTabList>
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          {/* TAB 1: OVERVIEW */}
          <TabPanel value='overview' className='p-0'>
             <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardHeader title="Account Information" />
                        <CardContent>
                            <Typography color="text.secondary">
                                This staff member has access to the administrative panel based on their assigned role permissions. Ensure their role aligns with their actual responsibilities to maintain system security.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Alert severity="info" variant='filled' icon={<i className='tabler-clock' />}>
                        <AlertTitle>Last Login Activity</AlertTitle>
                        There is no recent login activity recorded for this user.
                    </Alert>
                </Grid>
             </Grid>
          </TabPanel>

          {/* TAB 2: SECURITY */}
          <TabPanel value='security' className='p-0'>
             <Grid container spacing={6}>
                
                {/* Check state from API */}
                {!securityData?.hasAccount ? (

                    // --- STATE 1: NO ACCOUNT YET ---
                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardHeader title="System Access" />
                            <Divider />
                            <CardContent className="pt-6">
                                <Box className="flex flex-col gap-4">
                                    <Alert severity="warning" icon={<i className='tabler-alert-triangle' />}>
                                        <AlertTitle>No System Account Found</AlertTitle>
                                        This staff member does not currently have login credentials. They cannot access the clinic management system until an account is created.
                                    </Alert>
                                    
                                    <Typography variant="body2" color="text.secondary" className="mb-2">
                                        Click the button below to generate login credentials for this staff member. You will need to provide them with a temporary password.
                                    </Typography>

                                    <div>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            startIcon={actionLoading === 'create' ? <CircularProgress size={20} color="inherit" /> : <i className='tabler-user-plus' />}
                                            onClick={handleCreateAccount}
                                            disabled={actionLoading !== null}
                                        >
                                            Create System Account
                                        </Button>
                                    </div>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (

                    // --- STATE 2: HAS ACCOUNT ---
                    <>
                        {/* SECTION A: CREDENTIALS */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardHeader title="Login Credentials" />
                                <Divider />
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-success/10 p-3 rounded-full text-success hidden sm:flex">
                                                <i className='tabler-mail text-2xl' />
                                            </div>
                                            <div>
                                                <Typography variant="subtitle2" className="font-bold">System Email / Username</Typography>
                                                <Typography variant="body1" color="text.primary">
                                                    {securityData.username || 'Not Set'}
                                                </Typography>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="outlined" 
                                            color="secondary" 
                                            size="small"
                                            startIcon={<i className='tabler-edit' />}
                                        >
                                            Change Email
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* SECTION B: PASSWORD MANAGEMENT */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardHeader title="Password Management" />
                                <Divider />
                                <CardContent className="pt-6 flex flex-col gap-6">
                                    
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="max-w-xl">
                                            <Typography variant="subtitle2" className="font-bold mb-1">Send Password Reset Link</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Send an email with a secure link allowing the staff member to choose a new password themselves.
                                            </Typography>
                                        </div>
                                        <Button 
                                            variant="tonal" 
                                            color="primary" 
                                            startIcon={actionLoading === 'resetLink' ? <CircularProgress size={20} color="inherit" /> : <i className='tabler-mail-forward' />}
                                            onClick={handleSendResetLink}
                                            disabled={actionLoading !== null}
                                        >
                                            Send Reset Link
                                        </Button>
                                    </div>

                                    <Divider className="border-dashed" />

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="max-w-xl">
                                            <Typography variant="subtitle2" className="font-bold mb-1">Manual Password Reset</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Manually set a new temporary password for this user.
                                            </Typography>
                                        </div>
                                        <Button variant="outlined" color="secondary" startIcon={<i className='tabler-key' />}>
                                            Manual Reset
                                        </Button>
                                    </div>

                                </CardContent>
                            </Card>
                        </Grid>

                        {/* SECTION C: ADVANCED SECURITY */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardHeader title="Advanced Security" />
                                <Divider />
                                <CardContent className="pt-6 flex flex-col gap-6">
                                    
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Typography variant="subtitle2" className="font-bold">Two-Factor Authentication (2FA)</Typography>
                                                <Chip 
                                                    label={securityData.twoFactorEnabled ? 'Enabled' : 'Disabled'} 
                                                    color={securityData.twoFactorEnabled ? 'success' : 'default'} 
                                                    size="small" 
                                                    variant="tonal" 
                                                />
                                            </div>
                                            <Typography variant="body2" color="text.secondary" className="max-w-xl">
                                                If the staff member has lost their authenticator device, you can disable 2FA to allow them to log in using just their password.
                                            </Typography>
                                        </div>
                                        <Button 
                                            variant="outlined" 
                                            color={securityData.twoFactorEnabled ? "warning" : "secondary"} 
                                            disabled={!securityData.twoFactorEnabled || actionLoading !== null}
                                            startIcon={actionLoading === 'disable2FA' ? <CircularProgress size={20} color="inherit" /> : <i className='tabler-device-mobile-off' />}
                                            onClick={handleDisable2FA}
                                        >
                                            Disable 2FA
                                        </Button>
                                    </div>

                                    <Divider className="border-dashed" />

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="max-w-xl">
                                            <Typography variant="subtitle2" className="font-bold mb-1">Active Sessions</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Log this user out of all active web and mobile sessions immediately.
                                            </Typography>
                                        </div>
                                        <Button 
                                            variant="outlined" 
                                            color="error" 
                                            startIcon={actionLoading === 'revoke' ? <CircularProgress size={20} color="inherit" /> : <i className='tabler-logout' />}
                                            onClick={handleRevokeSessions}
                                            disabled={actionLoading !== null}
                                        >
                                            Revoke All Sessions
                                        </Button>
                                    </div>

                                </CardContent>
                            </Card>
                        </Grid>

                        {/* SECTION D: DANGER ZONE */}
                        <Grid size={{ xs: 12 }}>
                            <Card className="border border-error/50 shadow-sm">
                                <CardHeader 
                                    title={<Typography variant="h6" color="error">Danger Zone</Typography>} 
                                    className="bg-error/5 pb-4" 
                                />
                                <Divider />
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="max-w-xl">
                                            <Typography variant="subtitle2" className="font-bold mb-1">
                                                {securityData.isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {securityData.isSuspended 
                                                    ? 'Reactivating allows the staff member to log in and use the system again.' 
                                                    : "Suspending an account immediately revokes the staff member's access to the system."}
                                            </Typography>
                                        </div>
                                        <Button 
                                            variant="contained" 
                                            color={securityData.isSuspended ? 'success' : 'error'} 
                                            startIcon={actionLoading === 'suspend' ? <CircularProgress size={20} color="inherit" /> : <i className={securityData.isSuspended ? 'tabler-user-check' : 'tabler-user-off'} />}
                                            onClick={() => handleToggleSuspension(securityData.isSuspended)}
                                            disabled={actionLoading !== null}
                                        >
                                            {securityData.isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </>
                )}

             </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default StaffRight