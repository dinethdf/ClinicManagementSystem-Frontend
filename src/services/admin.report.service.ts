import { apiClient } from './api.config' // Ensure this path matches your project structure

class ReportService {

  async downloadRevenueReport(
    startDate: string,
    endDate: string,
    type: string = 'ALL',
    lang: string = 'en'
  ): Promise<boolean> {
    try {
      // We pass 'responseType: blob' to tell Axios/apiClient to handle the binary PDF data
      const response = await apiClient.get(
        '/api/report/admin/v1.0/revenue',
        {
          params: {
            clinicId : 1,
            startDate,
            endDate,
            type,
            lang
          },
          responseType: 'blob' 
        }
      )

      // The backend returns the raw PDF bytes, so response.data IS the blob.
      // We do not check for response.data.success because standard files don't have JSON wrappers.
      
      // --- Handle Browser Download ---
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      link.href = url
      link.setAttribute('download', `Revenue_Report_${startDate}_${endDate}.pdf`)
      
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)

      return true

    } catch (error) {
      console.error('Failed to download revenue report:', error)
      // Optional: You can re-throw the error if you want to show specific messages in the UI
      return false
    }
  }

async downloadSessionSummaryReport(
    startDate: string,
    endDate: string,
    lang: string = 'en'
  ): Promise<boolean> {
    try {
      const response = await apiClient.get(
        '/api/report/admin/v1.0/reports/session-summary',
        {
          params: {
            clinicId : 1,
            startDate,
            endDate,
            lang
          },
          responseType: 'blob'
        }
      )

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      link.href = url
      link.setAttribute('download', `Session_Summary_${startDate}_${endDate}.pdf`)
      
      document.body.appendChild(link)
      link.click()
      
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)

      return true

    } catch (error) {
      console.error('Failed to download session summary report:', error)
      return false
    }
  }  

}

export const reportService = new ReportService()