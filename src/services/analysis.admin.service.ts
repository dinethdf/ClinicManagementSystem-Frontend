import type { DashboardSummaryDTO, MonthlyRevenueDTO, RevenueAnalysisResponse, SpecializationSummaryResponse } from '@/types/analysis.types'

import { apiClient } from './api.config'



class AdminAnalysisService {

  async getMonthlyRevenue(year: number): Promise<MonthlyRevenueDTO[]> {
    try {
      const response = await apiClient.get<RevenueAnalysisResponse>(
        `/api/admin-analysis/revenue-monthly`, 
        {
          params: { year }
        }
      )
      
        // await new Promise(resolve => setTimeout(resolve, 5000))
     
        return response.data.data
    } catch (error) {
      console.error('Failed to fetch monthly revenue:', error)
     
      return []
    }
  }

async getDashboardSummary(): Promise<DashboardSummaryDTO | null> {
    try {
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
}

export const appointmentService = new AdminAnalysisService()