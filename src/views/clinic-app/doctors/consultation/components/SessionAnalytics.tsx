import { memo } from 'react' // ADDED: memo
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import type { ThemeColor } from '@core/types'

interface AnalyticsData {
  total: number; completed: number; booked: number; pendingPayment: number; cancelled: number;
}

interface Props {
  stats: AnalyticsData;
  loading: boolean;
}

// ADDED: Memoized sub-component
const StatCard = memo(({ title, count, icon, color }: { title: string, count: number, icon: string, color: ThemeColor }) => (
  <Card className='h-full border-b-4 border-b-transparent hover:border-b-primary transition-all shadow-sm'>
    <CardContent className='flex flex-col items-center justify-center gap-1 p-3 text-center'>
        <Avatar variant='rounded' className={`bg-${color}/10 text-${color} w-9 h-9`}>
            <i className={`${icon} text-lg`} />
        </Avatar>
        <div className='flex flex-col'>
            <Typography variant='h5' className={`font-bold text-${color}`}>{count}</Typography>
            <Typography variant='caption' color='text.secondary'>{title}</Typography>
        </div>
    </CardContent>
  </Card>
))

StatCard.displayName = 'StatCard' // ADDED

const SessionAnalytics = ({ stats, loading }: Props) => {
  if (loading) return <div className='flex justify-center p-2'><CircularProgress size={24} /></div>

  return (
    <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><StatCard title='Total' count={stats.total} icon='tabler-users' color='primary' /></Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><StatCard title='Done' count={stats.completed} icon='tabler-circle-check' color='success' /></Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><StatCard title='Waiting' count={stats.booked} icon='tabler-clock' color='warning' /></Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><StatCard title='Payment' count={stats.pendingPayment} icon='tabler-currency-dollar' color='info' /></Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><StatCard title='Cancelled' count={stats.cancelled} icon='tabler-circle-x' color='error' /></Grid>
    </Grid>
  )
}

SessionAnalytics.displayName = 'SessionAnalytics' // ADDED
export default memo(SessionAnalytics) // MODIFIED: Wrapped in memo