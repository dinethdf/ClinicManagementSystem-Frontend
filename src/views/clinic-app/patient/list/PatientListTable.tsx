'use client'

import { useState, useMemo, useEffect } from 'react' // Added useEffect
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
  const [filters, setFilters] = useState({ patientNo: '', fullName: '', nic: '' })
  const [sorting, setSorting] = useState<SortingState>({ sortBy: 'createdDate', sortOrder: 'desc' })

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  // --- 1. INITIAL FETCH (FIXED) ---
  // This ensures data loads when you refresh the page
  useEffect(() => {
    dispatch(fetchPatients({ 
        page: currentPage || 1, 
        pageSize: pageSize || 10,
        search: searchQuery,
        // Pass initial local state defaults
// ASdd hear lator
        // patientNo: '',
        // name: '',
        // nic: '',
        // sort: 'createdDate,desc'

    }))
  }, [dispatch, pageSize, currentPage]) // Dependencies ensure it keeps sync if these change externally

  // --- CONFIGURATION ---
  const filterConfigs: FilterConfig[] = [
    { key: 'searchParam', label: 'Search', type: 'text', isSortable: true },
    // { key: 'fullName', label: 'Patient Name', type: 'text', isSortable: true },
    // { key: 'nic', label: 'NIC Number', type: 'text', isSortable: false },
    // {
    //   key: 'reportTrigger',
    //   label: 'Reports',
    //   type: 'custom',
    //   render: () => (
    //      <OpenDialogOnElementClick
    //         element={Button}
    //         elementProps={{
    //            variant: 'outlined', color: 'info', fullWidth: true,
    //            children: 'View Session Report',
    //            startIcon: <i className='tabler-file-analytics' />
    //         }}
    //         dialog={SessionSummaryReportDialog}
    //         dialogProps={{}}
    //      />
    //   )
    // }
  ]

  // --- HANDLERS ---
  const handleApplyFilters = (newFilters: any, newSorting?: SortingState) => {
    setFilters(newFilters)
    setSearchQuery(newFilters)
    if (newSorting) setSorting(newSorting)

      console.log(newFilters)
    dispatch(fetchPatients({ 
      page: 1, 
      pageSize, 
      search: searchQuery,
      // patientNo: newFilters.patientNo,
      // name: newFilters.fullName,
      // nic: newFilters.nic,
      // sort: newSorting ? `${newSorting.sortBy},${newSorting.sortOrder}` : undefined
    }))
  }

  const handlePaginationChange = (meta: PaginationState) => {
    if (meta.pageSize !== pageSize) {
        dispatch(setPageSize(meta.pageSize))
    }
    
    if (meta.pageIndex !== (currentPage - 1)) {
        dispatch(fetchPatients({ 
            page: meta.pageIndex + 1, 
            pageSize: meta.pageSize,
            search: searchQuery,
         
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
           
           {/* Left: Global Search */}
          <div className='flex items-center gap-3'>
           
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
              <TextField 
                  select size="small" value={pageSize} 
                  onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
                  className='w-[75px]'
              >
                  {[5, 10, 25, 50, 100].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
              {/* <TextField
                fullWidth
                size='small'
                placeholder='Search Patients...'
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                InputProps={{
                   startAdornment: <InputAdornment position="start"><i className='tabler-search' /></InputAdornment>,
                   endAdornment: searchQuery && (
                     <IconButton size="small" onClick={() => dispatch(setSearchQuery(''))}><i className='tabler-x' /></IconButton>
                   )
                }}
              /> */}

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