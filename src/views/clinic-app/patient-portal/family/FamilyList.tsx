'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Skeleton from '@mui/material/Skeleton'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Services & Types
import { getFamilyMembers, switchActiveProfile } from '@/services/patient-portal/patient.family.service'
import type { FamilyMemberDTO } from '@/types/patient-portal/patient.family.types'

// Component Import (Dialog defined below)
import AddDependentDialog from './AddDependentDialog'

const FamilyList = () => {
  const [members, setMembers] = useState<FamilyMemberDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [activeProfileId, setActiveProfileId] = useState<number>(101) // Default to Primary
  const [switching, setSwitching] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
      const data = await getFamilyMembers()

      setMembers(data)
      setLoading(false)
  }

  const handleSwitch = async (id: number) => {
      setSwitching(id)
      const res = await switchActiveProfile(id)

      if (res.success) {
          setActiveProfileId(id)

          // In real app: window.location.reload() or Router.refresh() to update global context
      }

      setSwitching(null)
  }

  if (loading) return (
      <Grid container spacing={3}>
          {[1,2,3].map(i => <Grid key={i} size={{ xs: 12, md: 4 }}><Skeleton variant="rectangular" height={180} className='rounded-xl' /></Grid>)}
      </Grid>
  )

  return (
    <>
        {/* Active Profile Indicator */}
        <Alert severity="info" icon={false} className="mb-6 border border-blue-200 bg-blue-50">
            <div className="flex items-center gap-3">
                <Avatar className="bg-blue-600 text-white w-8 h-8">
                    <i className="tabler-user-check" />
                </Avatar>
                <div>
                    <Typography variant="body2" className="text-blue-900">
                        You are currently viewing <strong>{members.find(m => m.id === activeProfileId)?.fullName}</strong>'s portal.
                    </Typography>
                </div>
            </div>
        </Alert>

        <Grid container spacing={3}>
            {/* Add New Card */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Card 
                    className='h-full border-2 border-dashed border-gray-300 shadow-none bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]'
                    onClick={() => setDialogOpen(true)}
                >
                    <div className='bg-white p-4 rounded-full shadow-sm mb-3 text-primary'>
                        <i className='tabler-plus text-2xl' />
                    </div>
                    <Typography fontWeight={600} color="text.secondary">Add Dependent</Typography>
                </Card>
            </Grid>

            {/* Member Cards */}
            {members.map((member) => {
                const isActive = member.id === activeProfileId;

                
return (
                    <Grid key={member.id} size={{ xs: 12, md: 4 }}>
                        <Card className={`h-full relative overflow-hidden transition-all ${isActive ? 'border-2 border-primary shadow-lg' : 'border border-gray-100 hover:shadow-md'}`}>
                            
                            {isActive && (
                                <div className='absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg'>
                                    ACTIVE PROFILE
                                </div>
                            )}

                            <CardContent className='p-6 flex flex-col items-center text-center h-full'>
                                <Avatar 
                                    src={member.avatarUrl} 
                                    className={`w-20 h-20 mb-4 text-2xl ${isActive ? 'ring-4 ring-primary/20' : ''}`}
                                >
                                    {member.fullName.charAt(0)}
                                </Avatar>
                                
                                <Typography variant='h6' fontWeight={700}>{member.fullName}</Typography>
                                
                                <div className='flex gap-2 mt-2 mb-6'>
                                    <Chip 
                                        label={member.isPrimary ? 'Primary' : member.relation} 
                                        size='small' 
                                        color={member.isPrimary ? 'primary' : 'secondary'} 
                                        variant='tonal'
                                        className='uppercase text-[10px] font-bold' 
                                    />
                                    <Chip 
                                        label={`${new Date().getFullYear() - new Date(member.dob).getFullYear()} Yrs`} 
                                        size='small' 
                                        className='bg-gray-100 text-gray-600 text-[10px] font-bold' 
                                    />
                                </div>

                                <div className='mt-auto w-full'>
                                    <Button 
                                        fullWidth 
                                        variant={isActive ? 'outlined' : 'contained'} 
                                        color={isActive ? 'primary' : 'inherit'}
                                        disabled={isActive || switching !== null}
                                        onClick={() => handleSwitch(member.id)}
                                        className={!isActive ? 'bg-gray-800 text-white hover:bg-gray-900' : ''}
                                    >
                                        {switching === member.id ? <CircularProgress size={20} color="inherit" /> : (isActive ? 'Currently Active' : 'Switch Profile')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                )
            })}
        </Grid>

        <AddDependentDialog 
            open={dialogOpen} 
            onClose={() => setDialogOpen(false)} 
            onSuccess={() => { setDialogOpen(false); fetchMembers(); }}
        />
    </>
  )
}

export default FamilyList