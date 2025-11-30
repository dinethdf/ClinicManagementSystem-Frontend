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
  maxPatients: number
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