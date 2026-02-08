'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

// Auth Context
import { useAuth } from '@/contexts/ClientAuthContextProvider'

// MUI Components
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party
import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// Custom Components
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'

// --- IMPORT THE SERVER ACTION ---
import { getStaffList, ClinicStaffResponseDTO } from '@/services/staff/staff.server.service'

// --- DEBOUNCED INPUT ---
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

// --- STATUS COLOR HELPER ---
const getStatusColor = (status: string) => {
    switch (status) {
        case 'ACTIVE': return 'success';
        case 'INACTIVE': return 'secondary';
        case 'SUSPENDED': return 'error';
        default: return 'primary';
    }
}

const columnHelper = createColumnHelper<ClinicStaffResponseDTO>()

const StaffListTable = () => {
  const router = useRouter();
  const user = useAuth()

  // --- LOCAL STATE (Replaces Redux) ---
  const [data, setData] = useState<ClinicStaffResponseDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    pageIndex: 0, // 0-based for API
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  })
  
  // Note: Backend API provided earlier didn't have search yet, 
  // but we keep the state here for when you add it.
  const [searchQuery, setSearchQuery] = useState('') 
  const [rowSelection, setRowSelection] = useState({})

  // --- FETCH DATA FUNCTION ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call the Server Action
      const result: any = await getStaffList(pagination.pageIndex, pagination.pageSize);

      // Update State
      setData(result.content || []);
      setPagination(prev => ({
        ...prev,
        totalItems: result.totalElements,
        totalPages: result.totalPages
      }));
    } catch (error) {
      console.error("Failed to load staff list", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, searchQuery]);

  // --- USE EFFECT ---
  useEffect(() => {
    fetchData();
  }, [fetchData]);


  // --- HANDLERS ---
  const handleSearch = useCallback((value: string | number) => {
    const query = String(value);
    if (query.length >= 3 || query.length === 0) {
        setSearchQuery(query);
        // Reset to first page on search
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }
  }, []);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }));
  }

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPagination(prev => ({ ...prev, pageSize: Number(e.target.value), pageIndex: 0 }));
  }

  // --- TABLE COLUMNS ---
  const columns = useMemo<ColumnDef<ClinicStaffResponseDTO, any>[]>(
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
        header: 'Staff Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col items-start'>
              <Typography className='font-medium hover:text-primary cursor-pointer' color='text.primary'>
                {row.original.firstName} {row.original.lastName}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {row.original.email}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('designation', {
        header: 'Designation',
        cell: ({ row }) => (
            <Typography className='font-medium' color='text.primary'>
                {row.original.designation || 'N/A'}
            </Typography>
        )
      }),
      columnHelper.accessor('mobileNo', {
        header: 'Mobile',
        cell: ({ row }) => <Typography>{row.original.mobileNo}</Typography>
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: ({ row }) => <Typography>{row.original.city || '-'}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip 
            label={row.original.status} 
            size='small' 
            color={getStatusColor(row.original.status)} 
            variant='tonal' 
          />
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data: data,
    columns,
    pageCount: pagination.totalPages, 
    rowCount: pagination.totalItems,
    state: {
      rowSelection,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize
      }
    },
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    filterFns:{} as any
  })

  return (
    <>
      <Typography variant='h3' gutterBottom>
        Clinic Staff List
      </Typography>
      <Card>
        <CardContent className='flex justify-between flex-wrap max-sm:flex-col sm:items-center gap-4'>
          <DebouncedInput
            value={searchQuery}
            onChange={handleSearch}
            placeholder='Search Staff (min 3 chars)'
            className='max-sm:is-full'
          />
          
          <div className='flex max-sm:flex-col items-start sm:items-center gap-4 max-sm:is-full'>
            <CustomTextField
              select
              value={pagination.pageSize} 
              onChange={handlePageSizeChange}
              className='is-full sm:is-[90px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem> 
            </CustomTextField>

            {user?.role === "ADMIN" && (
                <Button
                variant='contained'
                color='primary'
                className='max-sm:is-full'
                startIcon={<i className='tabler-plus' />}
                onClick={() => router.push('/en/clinic/staff/register')}
                >
                Add Staff
                </Button>
            )}
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
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className='text-center p-4'>
                    Loading...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='text-center p-4'>
                    No staff found
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
                          router.push(`/en/clinic/staff/view/${row.original.id}`);
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
          count={pagination.totalItems} 
          rowsPerPage={pagination.pageSize} 
          page={pagination.pageIndex} 
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange} 
        />
      </Card>
    </>
  )
}

export default StaffListTable