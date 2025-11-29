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

// 2. Define the response structure containing all timeframes
export interface SpecializationSummaryResponse {
  week: SpecializationStatDTO[]
  month: SpecializationStatDTO[]
  year: SpecializationStatDTO[]
}

// Define the arguments for the Thunks
export interface FetchRevenueArgs {
  year: number
}