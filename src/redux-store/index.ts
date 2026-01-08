// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import chatReducer from '@/redux-store/slices/chat'
import calendarReducer from '@/redux-store/slices/calendar'
import kanbanReducer from '@/redux-store/slices/kanban'
import emailReducer from '@/redux-store/slices/email'

import patientReducer from '@/redux-store/slices/patientSlice'
import doctorReducer from '@/redux-store/slices/doctorSlice'
import adminDashboardReducer from '@/redux-store/slices/adminDashboardSlice'
import doctorDashboardReducer from '@/redux-store/slices/doctorDashboardSlice'
import tableStateReducer from '@/redux-store/slices/tableStateSlice'
import patientPortalReducer from '@/redux-store/slices/patientPortalSlice'

export const store = configureStore({
  reducer: {
    chatReducer,
    calendarReducer,
    kanbanReducer,
    emailReducer,
    patientReducer,
    doctorReducer,
    adminDashboard: adminDashboardReducer,
    doctorDashboard: doctorDashboardReducer,
    tableState: tableStateReducer,
    patientPortal: patientPortalReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
