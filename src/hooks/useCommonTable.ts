import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux-store'
import { 
  initTable, 
  setTableLoading, 
  setTableData, 
  setTableError, 
  updateTableParams 
} from '@/redux-store/slices/tableStateSlice'

// Type for the service function (matches your PatientService structure)
type FetchFunction = (params: { page: number; pageSize: number; search?: string, [key: string]: any }) => Promise<any>

export const useCommonTable = (
  tableId: string,
  fetchFunction: FetchFunction,
  initialConfig?: { filters?: any; sorting?: any; pageSize?: number }
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
    // Only fetch if state is initialized and we are not already loading
    if (tableState && tableState.isInitialized) {
      
      const fetchData = async () => {
        dispatch(setTableLoading({ tableId, isLoading: true }))
        
        try {
          // Prepare params for your Service
          const params = {
            page: tableState.pagination.pageIndex + 1, // API is 1-based
            pageSize: tableState.pagination.pageSize,
            // We map the generic 'filters' object to your service params
            // If your filter input name is 'searchParam', we map it to 'search'
            search: tableState.filters['searchParam'] || tableState.filters['search'] || '',
            ...tableState.filters, // Pass other filters (nic, name) directly
            sort: `${tableState.sorting.sortBy},${tableState.sorting.sortOrder}`
          }

          const response = await fetchFunction(params)
          
          dispatch(setTableData({
            tableId,
            data: response.content, // Assuming your API returns 'content'
            totalItems: response.totalElements // Assuming your API returns 'totalElements'
          }))

        } catch (error: any) {
          dispatch(setTableError({ tableId, error: error.message || 'Failed to fetch data' }))
        }
      }

      // Debounce or immediate call? For simplicity, we call immediately here.
      // You can add a check to avoid double-fetching if needed.
      fetchData()
    }
  }, [
    // Dependencies: Whenever these change in Redux, we refetch
    tableState?.pagination.pageIndex, 
    tableState?.pagination.pageSize, 
    tableState?.filters, 
    tableState?.sorting,
    dispatch, 
    tableId, 
    fetchFunction
  ])

  // 3. Helper Functions for UI
  const onPageChange = useCallback((newPagination: { pageIndex: number; pageSize: number }) => {
    dispatch(updateTableParams({ tableId, pagination: newPagination }))
  }, [dispatch, tableId])

  const onFilterChange = useCallback((newFilters: any, newSorting: any) => {
    dispatch(updateTableParams({ tableId, filters: newFilters, sorting: newSorting }))
  }, [dispatch, tableId])

  return {
    ...tableState, // contains data, loading, pagination, filters, sorting
    onPageChange,
    onFilterChange,
    // Return safe defaults if state is null (first render)
    isLoading: tableState?.isLoading ?? true,
    data: tableState?.data || [],
    totalItems: tableState?.totalItems || 0,
    pagination: tableState?.pagination || { pageIndex: 0, pageSize: 10 },
    filters: tableState?.filters || {},
    sorting: tableState?.sorting || { sortBy: 'createdDate', sortOrder: 'desc' }
  }
}