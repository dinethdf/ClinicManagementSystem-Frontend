// Third-party Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


import { patientService } from '@/services/patient.service'

import type { PatientResponceDTO, PaginatedPatientResponse } from '@/types/patient.types'

// 1. Update Thunk Arguments
interface FetchPatientsArgs {
  page: number
  pageSize: number
  search?: string
}

// 2. Update State
interface PatientState {
  data: PatientResponceDTO[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  
  // Pagination State
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number

  // Search State
  searchQuery: string
}

const initialState: PatientState = {
  data: [],
  status: 'idle',
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
  searchQuery: ''
}

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async ({ page, pageSize, search }: FetchPatientsArgs, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatients({ page, pageSize, search })
      console.log(response.content)
      return response 
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

// 4. Update the Slice
export const patientSlice = createSlice({
  name: 'patients',
  initialState: initialState,
  reducers: {
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.currentPage = 1
    },
    
    // Reducer to update the search query from a text field
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.status = "idle"
    },
    resetSearchQuery: (state) => {
      state.searchQuery = ''
    }
  },


  extraReducers: builder => {
    builder
      .addCase(fetchPatients.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchPatients.fulfilled, (state, action: PayloadAction<PaginatedPatientResponse<PatientResponceDTO>>) => {
        state.status = 'succeeded'
        
        state.data = action.payload.content 
        state.totalItems = action.payload.totalElements 
        state.totalPages = action.payload.totalPages 
        state.pageSize = action.payload.size 
        
        // KEY CHANGE: Convert backend 0-indexed page to our 1-indexed state
        state.currentPage = action.payload.number + 1
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  }
})

export const { setPageSize, setSearchQuery, resetSearchQuery } = patientSlice.actions
export default patientSlice.reducer