import { ReactNode } from 'react'

// --- FILTER TYPES ---
export type FilterType = 'text' | 'select' | 'date' | 'custom'

export interface FilterConfig {
  key: string           // The state key (e.g., 'patientId', 'startDate')
  label?: string
  type: FilterType
  placeholder?: string
  gridSize?: { xs?: number; sm?: number; md?: number } // Responsive width
  
  // For 'select' type
  options?: { label: string; value: string | number }[]
  
  // For 'custom' type (like your Dialog trigger)
  render?: (currentValues: any, onChange: (key: string, val: any) => void) => ReactNode
}

// --- TABLE TYPES ---
export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface CommonTableProps<T> {
  data: T[]
  columns: any[] // TanStack ColumnDefs
  totalCount: number
  isLoading: boolean
  pagination: PaginationState
  onPaginationChange: (newPagination: PaginationState) => void
  
  // Optional: Sorting
  sorting?: any[]
  onSortingChange?: (newSorting: any) => void
  
  // Optional: The Filters Component to render at top
  filterComponent?: ReactNode
  
  // Optional: Title/Header Actions
  title?: string
  actionComponent?: ReactNode
}