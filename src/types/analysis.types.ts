export interface MonthlyRevenueDTO {
  month: string
  monthIndex: number
  totalRevenue: number
  invoiceCount: number
}

export interface RevenueAnalysisResponse {
  success: boolean
  message: string
  data: MonthlyRevenueDTO[]
}

export interface DashboardSummaryDTO {
  todayRevenue: number
  todayAppointments: number
  activePatients: number
  pendingPayments: number
}

export interface SpecializationStatDTO {
  specialization: string
  appointmentCount: number
}


export interface SpecializationSummaryResponse {
  week: SpecializationStatDTO[]
  month: SpecializationStatDTO[]
  year: SpecializationStatDTO[]
}


export interface FetchRevenueArgs {
  year: number
}


export interface ScheduleDTO {
  id: number
  doctorName: string
  specialization: string
  scheduleDate: string
  startTime: string
  endTime: string
  isActive: 'ACTIVE' | 'NOT ACTIVE'
  status:string
  maxPatientCount: number
  registeredPatientCount: number
}


export interface DoctorScheduleApiResponse {
  success: boolean
  message: string
  data: {
    content: ScheduleDTO[]
    totalElements: number
    totalPages: number
    size: number
    number: number 
  }
}

export interface PatientAnalysisData {
  attendance: {
    total: number
    completed: number
    cancelled: number
    noshow: number
    lastVisit: string
  }
  financials: {
    totalBilled: number
    totalPaid: number
    totalDue: number
  }
  nextAppointment: {
    scheduleDate: string
    startTime: string
    doctorName: string
  } | null
  preferredDoctor: {
    doctorName: string
    visitCount: number
  } | null
  recentHistory: Array<{
    scheduleDate: string
    status: string
    doctorName: string
  }>
}

export interface PatientAnalysisResponse {
  success: boolean
  message: string
  data: PatientAnalysisData
}