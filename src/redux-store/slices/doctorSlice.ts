// // Third-party Imports
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'


// import { doctorService } from '@/services/doctor.service'

// // import type { PatientResponceDTO, PaginatedPatientResponse } from '@/types/patient.types'

// // 1. Update Thunk Arguments
// interface FetchDoctorsArgs {
//   page: number
//   pageSize: number
//   search?: string
// }

// // 2. Update State
// interface DoctorState {
//   data: any[]
//   status: 'idle' | 'loading' | 'succeeded' | 'failed'
//   error: string | null
  
//   // Pagination State
//   currentPage: number
//   pageSize: number
//   totalItems: number
//   totalPages: number

//   // Search State
//   searchQuery: string
// }

// const initialState: DoctorState = {
//   data: [],
//   status: 'idle',
//   error: null,
//   currentPage: 1,
//   pageSize: 10,
//   totalItems: 0,
//   totalPages: 1,
//   searchQuery: ''
// }

// export const fetchDoctors = createAsyncThunk(
//   'doctors/fetchDoctors',
//   async ({ page, pageSize, search }: FetchDoctorsArgs, { rejectWithValue }) => {
//     try {
//       const response = await doctorService.getDoctorList({ page, pageSize, search })
      
//       return response 
//     } catch (err: any) {
    
//       return rejectWithValue(err.message)
//     }
//   }
// )

// export const doctorSlice = createSlice({
//   name: 'doctors',
//   initialState: initialState,
//   reducers: {
//     setPageSize: (state, action: PayloadAction<number>) => {
//       state.pageSize = action.payload
//       state.currentPage = 1
//     },
    
//     setSearchQuery: (state, action: PayloadAction<string>) => {
//       state.searchQuery = action.payload
//       state.status = "idle"
//     },
//     resetSearchQuery: (state) => {
//       state.searchQuery = ''
//     }
//   },


//   extraReducers: builder => {
//     builder
//       .addCase(fetchDoctors.pending, state => {
//         state.status = 'loading'
//       })
//       .addCase(fetchDoctors.fulfilled, (state, action: PayloadAction<any>) => {
//           state.status = 'succeeded'

//           const pageData = action.payload.data; 

//           state.data = pageData.content 
//           state.totalItems = pageData.totalElements 
//           state.totalPages = pageData.totalPages 
//           state.pageSize = pageData.size 
          
//           state.currentPage = pageData.number + 1
//       })
//       .addCase(fetchDoctors.rejected, (state, action) => {
//         state.status = 'failed'
//         state.error = action.payload as string
//       })
//   }
// })

// export const { setPageSize, setSearchQuery, resetSearchQuery } = doctorSlice.actions
// export default doctorSlice.reducer