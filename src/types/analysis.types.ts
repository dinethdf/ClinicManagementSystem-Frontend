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

// --- Admin Advanced Analytics API DTOs ---

export interface ProfitAndLossDTO {
  totalRevenue: number
  doctorPayouts: number
  opsExpenses: number
  netProfit: number
}

export interface OutstandingInvoiceDTO {
  invoiceId: number
  patientName: string
  contact: string
  totalAmount: number
  balanceRemaining: number
  dueDate: string
  status: string
}

export interface DiscountLeakageDTO {
  discountType: string
  authorizedBy: string
  totalDiscountGiven: number
  timesGiven: number
}

export interface CashierWorkstationDTO {
  cashierWorkstationId: string
  totalTransactions: number
  totalCollected: number
}

export interface CashierReconciliationDTO {
  date: string
  staffId: number
  workstations: CashierWorkstationDTO[]
}

export interface ScheduleFillRateDTO {
  scheduleId: number
  doctorName: string
  scheduleDate: string
  currentPatients: number
  maxPatients: number
  fillPercentage: number
}

export interface UtilizationHeatmapDTO {
  dayOfWeek: string
  hourOfDay: number
  appointmentCount: number
}

export interface WaitTimeAnalyticsDTO {
  dayName: string
  avgWaitTimeMinutes: number
}

export interface DoctorPunctualityDTO {
  doctorName: string
  averageDelayMinutes: number
  totalSchedules: number
}

// API Responses
export interface PnLResponse {
  success: boolean
  message: string
  data: ProfitAndLossDTO
}

export interface OutstandingInvoicesResponse {
  success: boolean
  message: string
  data: OutstandingInvoiceDTO[]
}

export interface DiscountLeakageResponse {
  success: boolean
  message: string
  data: DiscountLeakageDTO[]
}

export interface CashierReconciliationResponse {
  success: boolean
  message: string
  data: CashierReconciliationDTO
}

export interface ScheduleFillRateResponse {
  success: boolean
  message: string
  data: ScheduleFillRateDTO[]
}

export interface UtilizationHeatmapResponse {
  success: boolean
  message: string
  data: UtilizationHeatmapDTO[]
}

export interface WaitTimeAnalyticsResponse {
  success: boolean
  message: string
  data: WaitTimeAnalyticsDTO[]
}

export interface DoctorPunctualityResponse {
  success: boolean
  message: string
  data: DoctorPunctualityDTO[]
}