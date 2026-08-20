import type { 
  DashboardSummaryDTO, 
  MonthlyRevenueDTO, 
  RevenueAnalysisResponse, 
  SpecializationSummaryResponse,
  PnLResponse,
  OutstandingInvoicesResponse,
  DiscountLeakageResponse,
  CashierReconciliationResponse,
  ScheduleFillRateResponse,
  UtilizationHeatmapResponse,
  WaitTimeAnalyticsResponse,
  DoctorPunctualityResponse
} from '@/types/analysis.types'

import { apiClient } from '../api.config'



class AdminAnalysisService {

  async getMonthlyRevenue(year: number): Promise<MonthlyRevenueDTO[]> {
    try {
      console.log("Call API getMonthlyRevenue")

      const response = await apiClient.get<RevenueAnalysisResponse>(
        `/api/admin-analysis/revenue-monthly`, 
        {
          params: { year }
        }
      )
     
        return response.data.data
    } catch (error) {
      console.error('Failed to fetch monthly revenue:', error)
     
      return []
    }
  }

async getDashboardSummary(): Promise<DashboardSummaryDTO | null> {
    try {
          console.log("Call API getDashboardSummary")

      const response = await apiClient.get<{ success: boolean; data: DashboardSummaryDTO }>(
        '/api/admin-analysis/summary'
      )

      // await new Promise(resolve => setTimeout(resolve, 2000))
     
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error)
      
      return null
    }
  }  

async getSpecializationSummary(): Promise<SpecializationSummaryResponse | null> {

    try {
         console.log("Call API getSpecializationSummary")

      const response = await apiClient.get<{ success: boolean; data: SpecializationSummaryResponse }>(
        '/api/admin-analysis/appointments/specialization-summary'
      )

      // await new Promise(resolve => setTimeout(resolve, 1000))
    
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch specialization summary:', error)
    
      return null
    }
  }

  // --- Advanced Analytics APIs ---

  async getProfitAndLoss(startDate: string, endDate: string) {
    try {
      const response = await apiClient.get<PnLResponse>('/api/admin-analysis/pnl', {
        params: { startDate, endDate }
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch P&L:', error)
      return null
    }
  }

  async getOutstandingInvoices() {
    try {
      const response = await apiClient.get<OutstandingInvoicesResponse>('/api/admin-analysis/outstanding-invoices')
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch outstanding invoices:', error)
      return []
    }
  }

  async getDiscountLeakageReport() {
    try {
      const response = await apiClient.get<DiscountLeakageResponse>('/api/admin-analysis/discount-leakage')
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch discount leakage report:', error)
      return []
    }
  }

  async getCashierReconciliation(date: string, staffId: number) {
    try {
      const response = await apiClient.get<CashierReconciliationResponse>('/api/admin-analysis/cashier-reconciliation', {
        params: { date, staffId }
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch cashier reconciliation:', error)
      return null
    }
  }

  async getScheduleFillRate() {
    try {
      const response = await apiClient.get<ScheduleFillRateResponse>('/api/admin-analysis/schedule-fill-rate')
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch schedule fill rate:', error)
      return []
    }
  }

  async getUtilizationHeatmap() {
    try {
      const response = await apiClient.get<UtilizationHeatmapResponse>('/api/admin-analysis/utilization-heatmap')
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch utilization heatmap:', error)
      return []
    }
  }

  async getWaitTimeAnalytics() {
    try {
      const response = await apiClient.get<WaitTimeAnalyticsResponse>('/api/admin-analysis/wait-time')
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch wait time analytics:', error)
      return []
    }
  }

  async getDoctorPunctualityStats() {
    try {
      const response = await apiClient.get<DoctorPunctualityResponse>('/api/admin-analysis/punctuality')
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch doctor punctuality stats:', error)
      return []
    }
  }
}

export const appointmentService = new AdminAnalysisService()