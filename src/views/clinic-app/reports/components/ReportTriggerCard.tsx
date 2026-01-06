'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

// This matches the props signature OpenDialogOnElementClick expects for its 'element'
type ReportTriggerCardProps = {
  onClick?: () => void
  title: string
  subtitle: string
  icon: string
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
}

const ReportTriggerCard = (props: ReportTriggerCardProps) => {
  const { onClick, title, subtitle, icon, color } = props

  return (
    <Card 
      onClick={onClick} 
      className='cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-primary'
    >
      <CardContent className='flex flex-col items-center text-center gap-4 p-6'>
        <Avatar variant='rounded' className={`bg-${color}/10 text-${color} w-16 h-16`}>
            <i className={`${icon} text-3xl`} />
        </Avatar>
        <div>
            <Typography variant='h5' className='mb-2'>{title}</Typography>
            <Typography variant='body2' color='text.secondary'>
                {subtitle}
            </Typography>
        </div>
        <div className='mt-2 text-primary font-medium flex items-center gap-1'>
            <span>Generate Report</span>
            <i className='tabler-arrow-right' />
        </div>
      </CardContent>
    </Card>
  )
}

export default ReportTriggerCard