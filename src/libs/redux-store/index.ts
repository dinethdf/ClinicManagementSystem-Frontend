// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import calendarReducer from '@/libs/redux-store/slices/calendar'
import patientReducer from '@/libs/redux-store/slices/patientSlice'
import doctorReducer from '@/libs/redux-store/slices/doctorSlice'

export const store = configureStore({
  reducer: {
    calendarReducer,
    patientReducer,
    doctorReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
