export interface Financials {
  totalBilled: number
  totalPaid: number
  totalDue: number
}

export interface HistoryItem {
  scheduleDate: string
  status: string
  doctorName: string
}

export interface NextAppointment {
  scheduleDate: string
  startTime: string
  doctorName: string
}

export interface Attendance {
  total: number
  completed: number
  cancelled: number
  noshow: number
  lastVisit: string
}

export interface PreferredDoctor {
  doctorName: string
  visitCount: number
}

// The main response object
export interface PatientAnalysisResponse {
  financials: Financials
  recentHistory: HistoryItem[]
  nextAppointment: NextAppointment | null
  attendance: Attendance
  preferredDoctor: PreferredDoctor
}