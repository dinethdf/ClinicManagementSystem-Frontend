'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '@/contexts/ClientAuthContextProvider'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'

// TanStack Table
import { createColumnHelper } from '@tanstack/react-table'

// Redux & Services
import type { RootState, AppDispatch } from '@/redux-store'
import { fetchDoctors, setPageSize, setSearchQuery } from '@/redux-store/slices/doctorSlice'

// Common Components
import CommonServerTable from '@/components/common-components/table/CommonServerTable'
import { FilterConfig, SortingState, PaginationState } from '@/components/common-components/table/TableTypes'
import TableFilterDialog from '@/components/common-components/table/TableFilterDialog'

// Custom Dialog Helper
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'

// Type Imports
// Assuming DoctorResponseDTO is in your types folder as referenced in your original code
// If not, keep the interface definition here.
import type { DoctorResponseDTO } from '@/types/doctor.types' 

const columnHelper = createColumnHelper<DoctorResponseDTO>()

const DoctorsListTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const user = useAuth()

  // 1. SELECT FROM DOCTOR REDUCER
  const {
    data: doctors, 
    status,
    currentPage = 1, 
    pageSize = 10,
    totalItems = 0,
    searchQuery = ''
  } = useSelector((state: RootState) => state.doctorReducer)

  const isLoading = status === 'loading'

  // --- LOCAL STATE ---
  const [filters, setFilters] = useState({ name: '', specialization: '' })
  const [sorting, setSorting] = useState<SortingState>({ sortBy: 'createdDate', sortOrder: 'desc' })

  // Calculate active filters count
  const activeFilterCount = Object.values(filters).filter(Boolean).length

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    dispatch(fetchDoctors({ 
        page: currentPage || 1, 
        pageSize: pageSize || 10,
        search: searchQuery,
        // Pass initial local state defaults if your API supports them
        // name: '',
        // specialization: '',
        // sort: 'createdDate,desc'
    }))
  }, [dispatch, pageSize, currentPage])

  // --- CONFIGURATION ---
  
  // Specialization Options
  const specializationOptions = [
    { label: 'General Practitioner', value: 'General Practitioner' },
    { label: 'Dermatologist', value: 'Dermatologist' },
    { label: 'Orthopedic Surgeon', value: 'Orthopedic Surgeon' },
    { label: 'Cardiologist', value: 'Cardiologist' },
    { label: 'Endocrinologist', value: 'Endocrinologist' },
    { label: 'Nephrologist', value: 'Nephrologist' },
    { label: 'Neurologist', value: 'Neurologist' },
    { label: 'Surgeon', value: 'Surgeon' },
    { label: 'Ophthalmologist', value: 'Ophthalmologist' },
    { label: 'Dental Surgeon', value: 'Dental Surgeon' },
  ]

  const filterConfigs: FilterConfig[] = [
    { 
      key: 'name', 
      label: 'Doctor Name', 
      type: 'text', 
      placeholder: 'Search by Name',
      isSortable: true,
      gridSize: { xs: 12, sm: 6 }
    },
    { 
      key: 'specialization', 
      label: 'Specialization', 
      type: 'select', 
      options: specializationOptions,
      isSortable: true,
      gridSize: { xs: 12, sm: 6 }
    }
  ]

  // --- HANDLERS ---
  const handleApplyFilters = (newFilters: any, newSorting?: SortingState) => {
    setFilters(newFilters)
    if (newSorting) setSorting(newSorting)

    dispatch(fetchDoctors({ 
      page: 1, 
      pageSize, 
      search: searchQuery,
      // Map filters to API params (Ensure your thunk/service handles these)
      // name: newFilters.name,
      // specialization: newFilters.specialization,
      // sort: newSorting ? `${newSorting.sortBy},${newSorting.sortOrder}` : undefined
    }))
  }

  const handlePaginationChange = (meta: PaginationState) => {
    if (meta.pageSize !== pageSize) {
        dispatch(setPageSize(meta.pageSize))
    }
    
    if (meta.pageIndex !== (currentPage - 1)) {
        dispatch(fetchDoctors({ 
            page: meta.pageIndex + 1, 
            pageSize: meta.pageSize,
            search: searchQuery,
            // name: filters.name,
            // specialization: filters.specialization,
            // sort: `${sorting.sortBy},${sorting.sortOrder}`
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
      columnHelper.accessor('nameWithInitials', {
        header: 'Doctor Name',
        cell: ({ row }) => (
          <div className='flex flex-col items-start'>
            <Typography 
                className='font-medium hover:text-primary cursor-pointer' 
                color='text.primary'
                onClick={() => router.push(`/en/clinic/doctors/view/${row.original.id}`)}
            >
              {row.original.firstName} {row.original.lastName}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {row.original.qualification}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('slmcNumber', {
        header: 'SLMC No',
        cell: ({ row }) => <Typography>{row.original.slmcNumber || 'N/A'}</Typography>
      }),
      columnHelper.accessor('specialization', {
        header: 'Specialization',
        cell: ({ row }) => (
          <Chip 
            label={row.original.specialization?.name || 'General'} 
            size='small' 
            color='primary' 
            variant='outlined' 
          />
        )
      }),
      columnHelper.accessor('mobileNo', {
        header: 'Mobile',
        cell: ({ row }) => <Typography>{row.original.mobileNo}</Typography>
      }),
      columnHelper.accessor('experienceYears', {
        header: 'Experience',
        cell: ({ row }) => <Typography>{row.original.experienceYears} Years</Typography>
      }),
      // --- EDIT ACTION COLUMN ---
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: any) => (
          <Tooltip title="View/Edit Details">
            <IconButton 
                size="small" 
                onClick={() => router.push(`/en/clinic/doctors/view/${row.original.id}`)}
                color="primary"
            >
                <i className='tabler-edit' />
            </IconButton>
          </Tooltip>
        )
      }
  ], [router])

  return (
    <CommonServerTable
      title="Doctor List"
      data={doctors || []}
      columns={columns}
      totalCount={totalItems}
      isLoading={isLoading}
      
      pagination={{ pageIndex: (currentPage || 1) - 1, pageSize: pageSize || 10 }}
      onPaginationChange={handlePaginationChange}

      // --- TOOLBAR ---
      filterComponent={
        <div className='flex flex-wrap justify-between items-center gap-4 p-5'>
           
           {/* Left: Global Search */}
           <div className='flex-1 min-w-[200px] max-w-sm'>
              <TextField
                fullWidth
                size='small'
                placeholder='Search Doctors...'
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                InputProps={{
                   startAdornment: <InputAdornment position="start"><i className='tabler-search' /></InputAdornment>,
                   endAdornment: searchQuery && (
                     <IconButton size="small" onClick={() => dispatch(setSearchQuery(''))}><i className='tabler-x' /></IconButton>
                   )
                }}
              />
           </div>

           {/* Right: Actions */}
           <div className='flex items-center gap-3'>
              
              {/* Filter Popup Trigger */}
              <OpenDialogOnElementClick
                  element={Button}
                  elementProps={{
                      variant: 'tonal',
                      color: activeFilterCount > 0 ? 'primary' : 'secondary',
                      startIcon: <Badge badgeContent={activeFilterCount} color="error"><i className='tabler-filter' /></Badge>,
                      children: "Filters",
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

              {/* Page Size Selector */}
              <TextField 
                  select size="small" value={pageSize} 
                  onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
                  className='w-[75px]'
              >
                  {[10, 25, 50, 100].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>

              {/* Add Doctor Button (Admin Only) */}
              {user?.role === "ADMIN" && (
                <Button 
                    variant='contained' 
                    onClick={() => router.push('/en/clinic/doctors/register')}
                    startIcon={<i className='tabler-plus' />}
                >
                    Add Doctor
                </Button>
              )}
           </div>
        </div>
      }
    />
  )
}

export default DoctorsListTable