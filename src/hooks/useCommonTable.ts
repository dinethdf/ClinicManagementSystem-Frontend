import { useEffect, useCallback } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import type { RootState } from '@/redux-store'
import { 
  initTable, 
  setTableLoading, 
  setTableData, 
  setTableError, 
  updateTableParams 
} from '@/redux-store/slices/tableStateSlice'

// Updated type to include 'sort'
type FetchFunction = (params: { page: number; pageSize: number; sort?: string; search?: string, [key: string]: any }) => Promise<any>

export const useCommonTable = (
  tableId: string,
  fetchFunction: FetchFunction,
  initialConfig?: { filters?: any; sorting?: any; pageSize?: number },

  // 1. New Optional Argument for Custom Sorting Logic
  customSortFormatter?: (sortBy: string, sortOrder: string) => string
) => {
  const dispatch = useDispatch()
  
  // Select specific table state
  const tableState = useSelector((state: RootState) => state.tableState[tableId])

  // 1. Initialize State on Mount
  useEffect(() => {
    if (!tableState) {
      dispatch(initTable({
        tableId,
        defaultValues: {
          filters: initialConfig?.filters,
          sorting: initialConfig?.sorting,
          pagination: { pageIndex: 0, pageSize: initialConfig?.pageSize || 10 }
        }
      }))
    }
  }, [dispatch, tableId, initialConfig, tableState])

  // 2. Fetch Data when Params Change
  useEffect(() => {
    // (Removed !isLoading check to allow refetching on filter changes even if strictly "loading" wasn't reset perfectly)
    if (tableState && tableState.isInitialized) {
      
      const fetchData = async () => {
        dispatch(setTableLoading({ tableId, isLoading: true }))
        
        try {
          // --- 2. SORTING LOGIC START ---
          let sortParam = 'id,asc' // Default fallback

          if (tableState.sorting?.sortBy) {
             if (customSortFormatter) {
                 // Use custom formatter if provided (e.g. for legacy APIs)
                 sortParam = customSortFormatter(tableState.sorting.sortBy, tableState.sorting.sortOrder)
             } else {
                 // Standard Format: "field,direction"
                 sortParam = `${tableState.sorting.sortBy},${tableState.sorting.sortOrder || 'asc'}`
             }
          }

          // --- SORTING LOGIC END ---

          // Prepare params for your Service
          const params = {
            page: tableState.pagination.pageIndex, 
            pageSize: tableState.pagination.pageSize,
            ...tableState.filters, 
            sort: sortParam 
          }

          const response = await fetchFunction(params)
          
          dispatch(setTableData({
            tableId,
            data: response.content || [], // Handle potential null content
            totalItems: response.totalElements || 0
          }))

        } catch (error: any) {
          dispatch(setTableError({ tableId, error: error.message || 'Failed to fetch data' }))
        }
      }

      fetchData()
    }
  }, [
    // Dependencies
    tableState?.pagination.pageIndex, 
    tableState?.pagination.pageSize, 
    tableState?.filters, 
    tableState?.sorting,
    dispatch, 
    tableId, 
    fetchFunction,
    customSortFormatter // Added dependency
  ])

  // 3. Helper Functions for UI
  const onPageChange = useCallback((newPagination: { pageIndex: number; pageSize: number }) => {
    dispatch(updateTableParams({ tableId, pagination: newPagination }))
  }, [dispatch, tableId])

  const onFilterChange = useCallback((newFilters: any, newSorting: any) => {
    dispatch(updateTableParams({ tableId, filters: newFilters, sorting: newSorting }))
  }, [dispatch, tableId])

  return {
    ...tableState,
    onPageChange,
    onFilterChange,

    // Safe defaults
    isLoading: tableState?.isLoading ?? true,
    data: tableState?.data || [],
    totalItems: tableState?.totalItems || 0,
    pagination: tableState?.pagination || { pageIndex: 0, pageSize: 10 },
    filters: tableState?.filters || {},
    sorting: tableState?.sorting || { sortBy: 'createdDate', sortOrder: 'desc' }
  }
}