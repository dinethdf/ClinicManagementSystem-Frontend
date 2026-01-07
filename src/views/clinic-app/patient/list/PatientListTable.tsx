'use client'

import { useState, useMemo, useEffect } from 'react' // Removed unused imports
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Badge from '@mui/material/Badge'

// TanStack Table
import { createColumnHelper } from '@tanstack/react-table'

// Redux & Services
import type { RootState, AppDispatch } from '@/redux-store'
import { fetchPatients, setPageSize, setSearchQuery } from '@/redux-store/slices/patientSlice'

// Common Components
import CommonServerTable from '@/components/common-components/table/CommonServerTable'
import { FilterConfig, SortingState, PaginationState } from '@/components/common-components/table/TableTypes'
import TableFilterDialog from '@/components/common-components/table/TableFilterDialog'

// Custom Dialog Components
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'

// Custom Components
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import type { PatientResponceDTO } from '@/types/patient.types'

const columnHelper = createColumnHelper<PatientResponceDTO>()

const PatientListTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  // Redux State
  const { data: patients, status, currentPage, pageSize, totalItems, searchQuery } = useSelector((state: RootState) => state.patientReducer)
  const isLoading = status === 'loading'

  // --- LOCAL STATE ---
  // Initialize 'searchParam' here so the inputs are controlled
  const [filters, setFilters] = useState({ searchParam: '', patientNo: '', fullName: '', nic: '' })
  const [sorting, setSorting] = useState<SortingState>({ sortBy: 'createdDate', sortOrder: 'desc' })

  // Calculate active filters (excluding default empty ones)
  const activeFilterCount = Object.values(filters).filter(val => val !== '').length

  // --- INITIAL FETCH ---
  useEffect(() => {
    dispatch(fetchPatients({ 
        page: currentPage || 1, 
        pageSize: pageSize || 10,
        search: searchQuery // Load with current redux state (persists on back navigation)
    }))
  }, [dispatch, pageSize, currentPage]) 

  // --- CONFIGURATION ---
  const filterConfigs: FilterConfig[] = [
    { key: 'searchParam', label: 'Search', type: 'text', isSortable: true },
    // Add other filters back if needed
  ]

  // --- HANDLERS ---
  const handleApplyFilters = (newFilters: any, newSorting?: SortingState) => {
    setFilters(newFilters)
    
    // 1. Get the new search value from the dialog form
    const newSearchValue = newFilters.searchParam || ''

    // 2. Dispatch to update Redux Store (so UI stays synced)
    dispatch(setSearchQuery(newSearchValue))

    if (newSorting) setSorting(newSorting)

    // 3. Dispatch Fetch with the NEW value (not the stale 'searchQuery' variable)
    dispatch(fetchPatients({ 
      page: 1, 
      pageSize, 
      search: newSearchValue // <--- USE NEW VALUE HERE
    }))
  }

  const handlePaginationChange = (meta: PaginationState) => {
    // 1. Handle Page Size Change
    if (meta.pageSize !== pageSize) {
        dispatch(setPageSize(meta.pageSize))
        // setPageSize action might not trigger fetch automatically depending on your slice, 
        // so we can explicitly fetch page 1 with new size here if needed.
    }
    
    // 2. Handle Page Index Change
    // Only fetch if page changed OR if we just changed size (logic depends on your reducer)
    if (meta.pageIndex !== (currentPage - 1) || meta.pageSize !== pageSize) {
        dispatch(fetchPatients({ 
            page: meta.pageIndex + 1, 
            pageSize: meta.pageSize,
            search: searchQuery // Here we CAN use searchQuery because it hasn't changed in this event
        }))
    }
  }

  // --- COLUMNS ---
  const columns = useMemo(() => [
      {
        id: 'select',
        header: ({ table }: any) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }: any) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        )
      },
      columnHelper.accessor('patientNo', {
        header: 'Patient No',
        cell: ({ row }) => (
          <Typography color='primary' className='font-medium'>
            {row.original.patientNo || 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('fullName', {
        header: 'Patient Name',
        cell: ({ row }) => (
          <div 
            className='flex items-center gap-3 cursor-pointer group'
            onClick={() => router.push(`/en/clinic/patient/details/${row.original.id}`)}
          >
            <CustomAvatar skin='light' size={34} color='primary'>
              {getInitials(row.original.fullName)}
            </CustomAvatar>
            <div className='flex flex-col items-start'>
              <Typography className='font-medium group-hover:text-primary transition-colors' color='text.primary'>
                {row.original.fullName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('nic', {
        header: 'NIC',
        cell: ({ row }) => <Typography>{row.original.nic || 'N/A'}</Typography>
      }),
      columnHelper.accessor('mobileNo', {
        header: 'Mobile',
        cell: ({ row }) => <Typography>{row.original.mobileNo}</Typography>
      }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.isActive ? 'Active' : 'Inactive'}
            color={row.original.isActive ? 'success' : 'secondary'}
            size='small'
            variant='tonal'
          />
        )
      })
  ], [router])

  return (
    <CommonServerTable
      title="Patient List"
      data={patients || []}
      columns={columns}
      totalCount={totalItems}
      isLoading={isLoading}
      
      pagination={{ pageIndex: (currentPage || 1) - 1, pageSize: pageSize || 10 }}
      onPaginationChange={handlePaginationChange}

      filterComponent={
        <div className='flex flex-wrap justify-between items-center gap-4 p-5'>
           
           {/* Left: Filter & Search Trigger */}
          <div className='flex items-center gap-3'>
           
            <OpenDialogOnElementClick
                  element={Button}
                  elementProps={{
                      variant: 'tonal',
                      color: activeFilterCount > 0 ? 'primary' : 'secondary',
                      startIcon: <Badge badgeContent={activeFilterCount} color="error"><i className='tabler-filter' /></Badge>,
                      children: "Filters & Search",
                      className: "px-6"
                  }}
                  dialog={TableFilterDialog}
                  dialogProps={{
                      filtersConfig: filterConfigs,
                      appliedFilters: filters,
                      sorting: sorting,
                      onApply: handleApplyFilters
                  }}
              />
              
              <TextField 
                  select size="small" value={pageSize} 
                  onChange={(e) => {
                      // Handle Page Size change directly here if you want instant update
                      dispatch(setPageSize(Number(e.target.value)))
                      dispatch(fetchPatients({ page: 1, pageSize: Number(e.target.value), search: searchQuery }))
                  }}
                  className='w-[75px]'
              >
                  {[5, 10, 25, 50, 100].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>

           </div>

           {/* Right: Actions */}
           <div className='flex items-center gap-3'>
              <Button variant='tonal' color='secondary' startIcon={<i className='tabler-upload' />}>
                  Export
              </Button>

              <Button 
                  variant='contained' 
                  onClick={() => router.push(`/en/clinic/patient/register`)}
                  startIcon={<i className='tabler-plus' />}
              >
                  Add Patient
              </Button>
           </div>
        </div>
      }
    />
  )
}

export default PatientListTable