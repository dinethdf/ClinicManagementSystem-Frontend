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

import type { RootState } from '@/libs/redux-store'

// -- 1. Define State Interface --
interface AdminDashboardState {
  // Data Sections
  summaryStats: DashboardSummaryDTO | null
  revenueData: MonthlyRevenueDTO[]
  specializationData: SpecializationSummaryResponse | null

  // UI State
  selectedYear: number // We store the active year here
  lastUpdated: string | null // Stores the timestamp string
  
  // API Status
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AdminDashboardState = {
  summaryStats: null,
  revenueData: [],
  specializationData: null,
  selectedYear: new Date().getFullYear(),
  lastUpdated: null,
  status: 'idle',
  error: null
}

// -- 2. Define Async Thunks --

// A. Fetch Top Cards Summary
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

// B. Fetch Revenue Chart Data
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

// C. Fetch Specialization Chart Data
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

// D. MASTER REFRESH THUNK
// This is what your "Refresh Button" will dispatch.
// It triggers all 3 API calls in parallel.
export const refreshDashboard = createAsyncThunk(
  'admin/refreshAll',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState
    const year = state.adminDashboard.selectedYear // Use the year currently in Redux

    // Dispatch all individual thunks
    await Promise.all([
      dispatch(fetchDashboardSummary()),
      dispatch(fetchRevenueData({ year })),
      dispatch(fetchSpecializationData())
    ])
    
    // Return a timestamp to update "lastUpdated"
    return new Date().toLocaleTimeString()
  }
)

// -- 3. Create the Slice --
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

      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.summaryStats = action.payload
      })

      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.revenueData = action.payload
      })


      .addCase(fetchSpecializationData.fulfilled, (state, action) => {
        state.specializationData = action.payload
      })
  }
})

export const { setSelectedYear } = adminDashboardSlice.actions
export default adminDashboardSlice.reducer