import { notFound } from 'next/navigation'

import PublicQueueTrackerView from '@/views/clinic-app/public/queue/Publicqueuetrackerview'
import { decodeHideValue } from '@/utils/encode'

interface PageProps {
  params: Promise<{
    encoded: string
  }>
}

const PublicQueueTrackerPage = async ({ params }: PageProps) => {
  
  const { encoded } = await params

  try {
    // Decode the QR code data
    const decoded = decodeHideValue(encoded)
    
    // Expected format: "scheduleId:queueNo" (e.g., "102:5")
    const [scheduleIdStr, queueNoStr] = decoded.split(':')
    
    if (!scheduleIdStr || !queueNoStr) {
      console.error('Invalid decoded format:', decoded)
      notFound()
    }

    const scheduleId = parseInt(scheduleIdStr, 10)
    const queueNo = parseInt(queueNoStr, 10)

    if (isNaN(scheduleId) || isNaN(queueNo)) {
      console.error('Invalid numbers:', { scheduleIdStr, queueNoStr })
      notFound()
    }

    return (
      <PublicQueueTrackerView 
        scheduleId={scheduleId} 
        queueNo={queueNo} 
      />
    )

  } catch (error) {
    console.error('Error decoding QR data:', error)
    notFound()
  }
}

export default PublicQueueTrackerPage