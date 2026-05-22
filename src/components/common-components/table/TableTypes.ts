import type { ReactNode } from 'react'

import type { ColumnDef } from '@tanstack/react-table'

// --- FILTER TYPES ---
// Added 'custom' to allow you to inject your Dialog Trigger
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
  
  // Grid size for responsive layout
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number }
  
  // For 'select' type
  options?: FilterOption[]
  
  // NEW: This allows you to render ANY component (like your OpenDialogOnElementClick)
  render?: (currentValues: any, onChange: (key: string, val: any) => void) => ReactNode

  // isSortable?: boolean
}

// ✅ NEW INTERFACE
export interface SortingConfig {
  key: string
  label: string
}

export interface SortingState {
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

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
  sorting?: SortingState
  onSortingChange?: (newSorting: SortingState) => void
  filterComponent?: ReactNode
  title?: string
  actionComponent?: ReactNode
}