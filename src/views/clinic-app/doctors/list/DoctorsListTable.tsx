'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { useDispatch, useSelector } from 'react-redux'


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

import type { RootState, AppDispatch } from '@/redux-store'
import { fetchDoctors, setPageSize, setSearchQuery, resetSearchQuery } from '@/redux-store/slices/doctorSlice'

import CustomTextField from '@core/components/mui/TextField'

// Define your Doctor Type here based on your JSON response
// You likely have this in a separate file like '@/types/doctor.types'
export interface DoctorResponseDTO {
  id: number
  firstName: string
  lastName: string
  email: string
  mobileNo: string
  city: string | null
  nic: string
  dob: string
  nameWithInitials: string
  slmcNumber: string
  specialization: {
    id: number
    name: string
    note: string
  }
  qualification: string
  experienceYears: number
  profileImg: string | null
}

import tableStyles from '@core/styles/table.module.css'

// Helper for debounced input
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

const columnHelper = createColumnHelper<DoctorResponseDTO>()

const DoctorsListTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // 1. SELECT FROM DOCTOR REDUCER
  const {
    data: doctors, 
    status,
    currentPage = 1, 
    pageSize = 10,
    totalItems = 0,
    totalPages = 1,
    searchQuery = ''
  } = useSelector((state: RootState) => state.doctorReducer) // Changed to doctorReducer

  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    const promise = dispatch(fetchDoctors({ 
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
    dispatch(fetchDoctors({ page: newPage + 1, pageSize, search: searchQuery }))
  }

  // 2. UPDATE COLUMNS FOR DOCTOR DATA
  const columns = useMemo<ColumnDef<DoctorResponseDTO, any>[]>(
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
      columnHelper.accessor('nameWithInitials', {
        header: 'Doctor Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <CustomAvatar src={row.original.profileImg} skin='light' size={34} color='primary'>
              {getInitials(row.original.firstName + ' ' + row.original.lastName)}
            </CustomAvatar> */}
            <div className='flex flex-col items-start'>
              <Typography className='font-medium hover:text-primary cursor-pointer' color='text.primary'>
                {row.original.firstName} {row.original.lastName}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {row.original.qualification}
              </Typography>
            </div>
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
      })
    ],
    []
  )

  const table = useReactTable({
    data: (doctors as DoctorResponseDTO[]) || [],
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
        Doctor List
      </Typography>
      <Card>
        <CardContent className='flex justify-between flex-wrap max-sm:flex-col sm:items-center gap-4'>
          <DebouncedInput
            value={searchQuery}
            onChange={handleSearch}
            placeholder='Search Doctors (min 3 chars)'
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
              onClick={() => router.push('/en/clinic/doctors/register')}
            >
              Add Doctor
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
                    No doctors found
                  </td>
                </tr>
              ) : (
               
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })} style={{ cursor: 'pointer' }}
                      onClick={(e) => {

                        const target = e.target as HTMLElement;

                        if (target.closest('.MuiCheckbox-root') || target.closest('button') || target.closest('input')) {
                          
                            return;
                          }
                          
                          router.push(`/en/clinic/doctors/view/${row.original.id}`);
                  }}>
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

export default DoctorsListTable
