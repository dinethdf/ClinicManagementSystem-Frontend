// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import calendarReducer from '@/libs/redux-store/slices/calendar'
import patientReducer from '@/libs/redux-store/slices/patientSlice'
import doctorReducer from '@/libs/redux-store/slices/doctorSlice'
import adminDashboardReducer from '@/libs/redux-store/slices/adminDashboardSlice'
import doctorDashboardReducer from '@/libs/redux-store/slices/doctorDashboardSlice'

export const store = configureStore({
  reducer: {
    calendarReducer,
    patientReducer,
    doctorReducer,
    adminDashboard: adminDashboardReducer,
    doctorDashboard: doctorDashboardReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
