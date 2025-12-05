// Third-party Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Service Imports (Assuming your service is exported as 'appointmentService')
import { appointmentService } from '@/services/analysis.admin.service'

// Type Imports
import type { 
  DashboardSummaryDTO, 
  MonthlyRevenueDTO, 
  SpecializationSummaryResponse,
  FetchRevenueArgs 
} from '@/types/analysis.types'

import type { RootState } from '@/redux-store'

interface AdminDashboardState {

  summaryStats: DashboardSummaryDTO | null
  revenueData: MonthlyRevenueDTO[]
  specializationData: SpecializationSummaryResponse | null


  selectedYear: number
  lastUpdated: string | null
  summaryStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  revenueStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  specializationStatus: 'idle' | 'loading' | 'succeeded' | 'failed'

  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AdminDashboardState = {
  summaryStats: null,
  revenueData: [],
  specializationData: null,
  selectedYear: new Date().getFullYear(),
  lastUpdated: null,
  
  summaryStatus: 'idle',
  revenueStatus: 'idle',
  specializationStatus: 'idle',

  status: 'idle',
  error: null
}

export const fetchDashboardSummary = createAsyncThunk(
  'admin/fetchSummary',
 
  async (_, { rejectWithValue }) => {
    
    try {
      const response = await appointmentService.getDashboardSummary()
      
      return response
    } catch (err: any) {
     
      return rejectWithValue(err.message || 'Failed to fetch summary')
    }
  }
)

export const fetchRevenueData = createAsyncThunk(
  'admin/fetchRevenue',
 
  async ({ year }: FetchRevenueArgs, { rejectWithValue }) => {
   
    try {
      const response = await appointmentService.getMonthlyRevenue(year)
    
      return response
    } catch (err: any) {
     
      return rejectWithValue(err.message || 'Failed to fetch revenue')
    }
  }
)

export const fetchSpecializationData = createAsyncThunk(
  'admin/fetchSpecialization',
 
  async (_, { rejectWithValue }) => {
  
    try {
      const response = await appointmentService.getSpecializationSummary()
      
      return response
    } catch (err: any) {
    
      return rejectWithValue(err.message || 'Failed to fetch specialization')
    }
  }
)


export const refreshDashboard = createAsyncThunk(
  'admin/refreshAll',

  async (_, { dispatch, getState }) => {
    const state = getState() as RootState
    const year = state.adminDashboard.selectedYear

    await Promise.allSettled([
      dispatch(fetchDashboardSummary()),
      dispatch(fetchRevenueData({ year })),
      dispatch(fetchSpecializationData())
    ])
    
    return new Date().toLocaleTimeString()
  }
)

export const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(refreshDashboard.pending, state => {
        state.status = 'loading'
      })
      .addCase(refreshDashboard.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded'
        state.lastUpdated = action.payload 
      })
      .addCase(refreshDashboard.rejected, state => {
        state.status = 'failed'
      })


      .addCase(fetchDashboardSummary.pending, state => {
        state.summaryStatus = 'loading'
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.summaryStatus = 'succeeded'
        state.summaryStats = action.payload
      })
      .addCase(fetchDashboardSummary.rejected, state => {
        state.summaryStatus = 'failed'
      })


      .addCase(fetchRevenueData.pending, state => {
        state.revenueStatus = 'loading'
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.revenueStatus = 'succeeded'
        state.revenueData = action.payload
      })
      .addCase(fetchRevenueData.rejected, state => {
        state.revenueStatus = 'failed'
      })

      .addCase(fetchSpecializationData.pending, state => {
        state.specializationStatus = 'loading'
      })
      .addCase(fetchSpecializationData.fulfilled, (state, action) => {
        state.specializationStatus = 'succeeded'
        state.specializationData = action.payload
      })
      .addCase(fetchSpecializationData.rejected, state => {
        state.specializationStatus = 'failed'
      })
  }
})

export const { setSelectedYear } = adminDashboardSlice.actions
export default adminDashboardSlice.reducer