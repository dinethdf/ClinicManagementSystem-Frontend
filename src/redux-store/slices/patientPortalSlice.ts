import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { patientPortalService } from '@/services/patient-portal/patient.portal.service'
import type { PatientAnalysisResponse } from '@/types/patient-portal/patient.portal.types'

// --- THUNKS ---

// 1. Fetch Dashboard/Analysis Data
export const fetchPatientDashboard = createAsyncThunk(
  'patientPortal/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientPortalService.getPatientProfileAnalysis()

      
return response
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch dashboard data')
    }
  }
)

// You can add more thunks here later, e.g.:
// export const updatePatientProfile = ...


// --- STATE STRUCTURE ---
interface PatientPortalState {

  // Section 1: Dashboard Analysis
  dashboard: {
    data: PatientAnalysisResponse | null
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
  }
  
  // Section 2: Placeholder for future features (e.g., Profile)
  // profile: { ... }
}

const initialState: PatientPortalState = {
  dashboard: {
    data: null,
    status: 'idle',
    error: null
  }
}

// --- SLICE ---
export const patientPortalSlice = createSlice({
  name: 'patientPortal',
  initialState,
  reducers: {
    // specific sync reducers can go here
    resetDashboardState: (state) => {
        state.dashboard.status = 'idle'
        state.dashboard.error = null
    }
  }, 
  extraReducers: builder => {
    builder

      // Dashboard Cases
      .addCase(fetchPatientDashboard.pending, state => {
        state.dashboard.status = 'loading'
        state.dashboard.error = null
      })
      .addCase(fetchPatientDashboard.fulfilled, (state, action) => {
        state.dashboard.status = 'succeeded'
        state.dashboard.data = action.payload
      })
      .addCase(fetchPatientDashboard.rejected, (state, action) => {
        state.dashboard.status = 'failed'
        state.dashboard.error = action.payload as string
      })
  }
})

export const { resetDashboardState } = patientPortalSlice.actions
export default patientPortalSlice.reducer