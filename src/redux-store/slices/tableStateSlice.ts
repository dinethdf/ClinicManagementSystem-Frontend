import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TableState {
  data: any[]
  totalItems: number
  isLoading: boolean
  error: string | null
  
  // State to persist
  pagination: {
    pageIndex: number
    pageSize: number
  }
  filters: Record<string, any>
  sorting: {
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  
  // To track if we have loaded this table before
  isInitialized: boolean
}

interface GlobalTableState {
  [tableId: string]: TableState
}

const initialState: GlobalTableState = {}

export const tableStateSlice = createSlice({
  name: 'tableState',
  initialState,
  reducers: {
    // 1. Initialize Table (Only if not already present)
    initTable: (state, action: PayloadAction<{ tableId: string; defaultValues: Partial<TableState> }>) => {
      const { tableId, defaultValues } = action.payload
      if (!state[tableId]) {
        state[tableId] = {
          data: [],
          totalItems: 0,
          isLoading: false,
          error: null,
          pagination: defaultValues.pagination || { pageIndex: 0, pageSize: 10 },
          filters: defaultValues.filters || {},
          sorting: defaultValues.sorting || { sortBy: 'createdDate', sortOrder: 'desc' },
          isInitialized: true
        }
      }
    },
    
    // 2. Set Loading State
    setTableLoading: (state, action: PayloadAction<{ tableId: string; isLoading: boolean }>) => {
      const { tableId, isLoading } = action.payload
      if (state[tableId]) state[tableId].isLoading = isLoading
    },

    // 3. Set Data (Success)
    setTableData: (state, action: PayloadAction<{ tableId: string; data: any[]; totalItems: number }>) => {
      const { tableId, data, totalItems } = action.payload
      if (state[tableId]) {
        state[tableId].data = data
        state[tableId].totalItems = totalItems
        state[tableId].isLoading = false
        state[tableId].error = null
      }
    },

    // 4. Set Error
    setTableError: (state, action: PayloadAction<{ tableId: string; error: string }>) => {
      const { tableId, error } = action.payload
      if (state[tableId]) {
        state[tableId].isLoading = false
        state[tableId].error = error
      }
    },

    // 5. Update Params (Filters/Sort/Page) - Triggers Fetch in Hook
    updateTableParams: (state, action: PayloadAction<{ 
      tableId: string, 
      filters?: Record<string, any>, 
      sorting?: { sortBy: string; sortOrder: 'asc' | 'desc' },
      pagination?: { pageIndex: number; pageSize: number }
    }>) => {
      const { tableId, filters, sorting, pagination } = action.payload
      if (state[tableId]) {
        if (filters) {
          state[tableId].filters = filters
          state[tableId].pagination.pageIndex = 0 // Reset page on filter change
        }
        if (sorting) state[tableId].sorting = sorting
        if (pagination) state[tableId].pagination = pagination
      }
    },

    // 6. Reset (Optional: Clear state when leaving module)
    resetTableState: (state, action: PayloadAction<string>) => {
      delete state[action.payload]
    }
  }
})

export const { initTable, setTableLoading, setTableData, setTableError, updateTableParams, resetTableState } = tableStateSlice.actions
export default tableStateSlice.reducer