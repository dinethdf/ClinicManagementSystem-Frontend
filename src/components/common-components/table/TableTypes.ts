import { ReactNode } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

// --- FILTER TYPES ---
export type FilterType = 'text' | 'select' | 'date' | 'custom'

export interface FilterOption {
  label: string
  value: string | number
}

export interface FilterConfig {
  key: string
  label?: string
  type: FilterType
  placeholder?: string
  
  // Grid size for responsive layout (e.g., xs: 12, md: 4)
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number }
  
  // For 'select' type
  options?: FilterOption[]
  
  // Render custom component (like DateRange or Dialog Trigger)
  render?: (currentValues: any, onChange: (key: string, val: any) => void) => ReactNode

  // NEW: Allow this field to be used for sorting?
  isSortable?: boolean
}

// --- SORTING TYPES ---
export interface SortingState {
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

// --- TABLE TYPES ---
export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface CommonTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  totalCount: number
  isLoading: boolean
  pagination: PaginationState
  onPaginationChange: (newPagination: PaginationState) => void
  
  // Sorting Props
  sorting?: SortingState
  onSortingChange?: (newSorting: SortingState) => void

  // The Filter Component (We will pass CommonTableFilters here)
  filterComponent?: ReactNode
  
  // Header Actions
  title?: string
  actionComponent?: ReactNode
}