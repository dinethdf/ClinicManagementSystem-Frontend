'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import type { PublicScheduleDTO } from '@/types/public-booking.types'

const ScheduleSummaryCard = ({ selectedSchedule }: { selectedSchedule: PublicScheduleDTO }) => {
  return (
    <Card className="bg-gray-50/50 border-gray-200 border h-full">
      <CardContent className="p-6">
          <Typography variant="h6" className="font-bold">{selectedSchedule.doctorName}</Typography>
          <Typography color="text.secondary">{selectedSchedule.specialization}</Typography>
          <Divider className="my-4"/>
          <div className="flex justify-between">
              <Typography>Date:</Typography>
              <Typography className="font-bold">{selectedSchedule.scheduleDate}</Typography>
          </div>
          <div className="flex justify-between mt-2">
              <Typography>Total Fee:</Typography>
              <Typography className="font-bold text-primary">LKR {(selectedSchedule.doctorFee + selectedSchedule.clinicFee).toFixed(0)}</Typography>
          </div>
      </CardContent>
    </Card>
  )
}

export default ScheduleSummaryCard