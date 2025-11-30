import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


import { doctorAnalysisService } from '@/services/analysis.doctor.service'


import type { ScheduleDTO } from '@/types/analysis.types'
import type { RootState } from '@/libs/redux-store'


interface DoctorDashboardState {
  schedules: ScheduleDTO[]
  totalSchedules: number
  currentDoctorId: number | null
  lastUpdated: string | null

  scheduleStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: DoctorDashboardState = {
  schedules: [],
  totalSchedules: 0,
  currentDoctorId: 1,
  lastUpdated: null,
  
  scheduleStatus: 'idle',
  status: 'idle',
  error: null
}

export const fetchDoctorSchedules = createAsyncThunk(
  'doctor/fetchSchedules',
  async (doctorId: number, { rejectWithValue }) => {
    try {
      const response = await doctorAnalysisService.getDoctorSchedules(doctorId)
      return response
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch schedules')
    }
  }
)

export const refreshDoctorDashboard = createAsyncThunk(
  'doctor/refreshAll',
  async (_, { dispatch, getState }) => {
   
    const state = getState() as RootState

    const doctorId = state.doctorDashboard.currentDoctorId || 1 

    await Promise.allSettled([
      dispatch(fetchDoctorSchedules(doctorId))
    ])
    
    return new Date().toLocaleTimeString()
  }
)


export const doctorDashboardSlice = createSlice({
  name: 'doctorDashboard',
  initialState,
  reducers: {
    setDoctorId: (state, action: PayloadAction<number>) => {
      state.currentDoctorId = action.payload
    }
  },
  extraReducers: builder => {
    builder

      .addCase(refreshDoctorDashboard.pending, state => {
        state.status = 'loading'
      })
      .addCase(refreshDoctorDashboard.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded'
        state.lastUpdated = action.payload 
      })
      .addCase(refreshDoctorDashboard.rejected, state => {
        state.status = 'failed'
      })

      .addCase(fetchDoctorSchedules.pending, state => {
        state.scheduleStatus = 'loading'
      })
      .addCase(fetchDoctorSchedules.fulfilled, (state, action) => {
        state.scheduleStatus = 'succeeded'
        if (action.payload) {
          state.schedules = action.payload as any
          state.totalSchedules = action.payload.totalElements
          console.log(action.payload)
        }
      })
      .addCase(fetchDoctorSchedules.rejected, (state, action) => {
        state.scheduleStatus = 'failed'
        state.error = action.payload as string
      })
  }
})

export const { setDoctorId } = doctorDashboardSlice.actions
export default doctorDashboardSlice.reducer