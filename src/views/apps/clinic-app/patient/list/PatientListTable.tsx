'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'


import { useDispatch, useSelector } from 'react-redux'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'


import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import type { RootState, AppDispatch } from '@/libs/redux-store'

import { fetchPatients, setPageSize, setSearchQuery, resetSearchQuery } from '@/libs/redux-store/slices/patientSlice'


import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'


import { getInitials } from '@/utils/getInitials'


import type { PatientResponceDTO } from '@/types/patient.types'

import tableStyles from '@core/styles/table.module.css'


const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
  
    return 'N/A'
  }
  
  try {
   
    const date = new Date(dateString)
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }

    return date.toLocaleDateString('en-US', options)
  } catch (error) {

    return 'Invalid Date'
  }
}
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)
  const isInitialMount = useRef(true);

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    
    if (isInitialMount.current) {
   
      isInitialMount.current = false;
    
      return;
    }

    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, onChange, debounce])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const columnHelper = createColumnHelper<PatientResponceDTO>()

const PatientListTable = () => {

  const dispatch = useDispatch<AppDispatch>()
 
  const {
    data: patients, 
    status,
    currentPage = 1, 
    pageSize = 10,
    totalItems = 0,
    totalPages = 1,
    searchQuery = ''
  } = useSelector((state: RootState) => state.patientReducer)

  const isInitialUpdate = useRef(true);

  // --- Local State ---
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    const promise = dispatch(fetchPatients({ 
        page: currentPage, 
        pageSize, 
        search: searchQuery 
    }));
    return () => {
        promise.abort(); 
    };
  }, [dispatch, pageSize, currentPage, searchQuery]);


  const handleSearch = useCallback((value: string | number) => {
   
    const query = String(value)
    
    console.log("Search query changed, dispatching to Redux...")
    
    if (query.length >= 3) {
      dispatch(setSearchQuery(query))
    
    } else {
    
      if (searchQuery !== '') {
    
        dispatch(resetSearchQuery())
      }
    }
  }, [dispatch, searchQuery])

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
   
    const newPageSize = Number(e.target.value)
    
    dispatch(setPageSize(newPageSize)) 
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    dispatch(fetchPatients({ page: newPage + 1, pageSize, search: searchQuery }))
  }

  const columns = useMemo<ColumnDef<PatientResponceDTO, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
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
          <div className='flex items-center gap-3'>
            <CustomAvatar skin='light' size={34} color='primary'>
              {getInitials(row.original.fullName)}
            </CustomAvatar>
            <div className='flex flex-col items-start'>
              <Typography className='font-medium hover:text-primary cursor-pointer' color='text.primary'>
                {row.original.fullName}
              </Typography>
              <Typography variant='body2'>
                DOB: {formatDate(row.original.dob)}
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
          />
        )
      })
    ],
    []
  )

  // --- Table Instance ---
  const table = useReactTable({
    data: (patients as PatientResponceDTO[]) || [],
    columns,
    pageCount: totalPages || 1, 
    rowCount: totalItems || 0,
    state: {
      rowSelection,
      pagination: {
        pageIndex: (currentPage || 1) - 1, 
        pageSize: pageSize || 10 
      }
    },
    manualPagination: true,
    manualFiltering: true, 
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {} as any,
  })

  return (
    <>
      <Typography variant='h3' gutterBottom>
        Patient List
      </Typography>
      <Card>
        <CardContent className='flex justify-between flex-wrap max-sm:flex-col sm:items-center gap-4'>
          <DebouncedInput
            value={searchQuery}
            onChange={handleSearch}
            placeholder='Search Patients (min 3 chars)'
            className='max-sm:is-full'
          />
          <div className='flex max-sm:flex-col items-start sm:items-center gap-4 max-sm:is-full'>
            <CustomTextField
              select
              value={pageSize || 10} 
              onChange={handlePageSizeChange}
              className='is-full sm:is-[90px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem> 
              <MenuItem value='100'>100</MenuItem>
            </CustomTextField>
            <Button
              variant='contained'
              color='primary'
              className='max-sm:is-full'
              startIcon={<i className='tabler-plus' />}
            >
              Add Patient
            </Button>
          </div>
        </CardContent>
        
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {status === 'loading' ? (
                <tr>
                  <td colSpan={columns.length} className='text-center p-4'>
                    Loading...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='text-center p-4'>
                    No patients found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          component='div'
          count={totalItems || 0} 
          rowsPerPage={pageSize || 10} 
          page={(currentPage || 1) - 1} 
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange} 
        />
      </Card>
    </>
  )
}

export default PatientListTable