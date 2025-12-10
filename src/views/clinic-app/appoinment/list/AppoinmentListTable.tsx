'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid' // Updated Grid import
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import CustomTextField from '@core/components/mui/TextField'

import type { TextFieldProps } from '@mui/material/TextField'

// TanStack Table Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// Type Imports
import type { AppointmentListDTO } from '@/types/appoinments.types'
import type { ThemeColor } from '@core/types'
import type { Locale } from '@configs/i18n'

// Service Import
import { getAppointmentList } from '@/services/appoinment.server.service'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import { getLocalizedUrl } from '@/utils/i18n'
import tableStyles from '@core/styles/table.module.css'
import { InputAdornment } from '@mui/material'
import PatientSelectDialogBox from '@/components/dialogs/patient-select'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'

const appointmentStatusObj: { [key: string]: { color: ThemeColor; label: string } } = {
  Booked: { color: 'primary', label: 'Booked' },
  COMPLETED: { color: 'success', label: 'Completed' },
  CANCELLED: { color: 'error', label: 'Cancelled' },
  NOSHOW: { color: 'warning', label: 'No Show' }
}

const columnHelper = createColumnHelper<AppointmentListDTO>()

const AppointmentListTable = () => {
  const [data, setData] = useState<AppointmentListDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  // State for Pagination
  const [pagination, setPagination] = useState({ 
    pageIndex: 0, 
    pageSize: 10 
  })
  
  const [totalCount, setTotalCount] = useState(0)

  // State for Filters
  const [filters, setFilters] = useState({
      patientId: '',
      patientName: '',
      scheduleId: '',
      startDate: '',
      endDate: ''
  })

  // Temporary state for inputs before applying
  const [tempFilters, setTempFilters] = useState({
      patientId: '',
      patientName: '',
      scheduleId: '',
      startDate: '',
      endDate: ''
  })

  const { lang: locale } = useParams()

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
    
      try {
        // Prepare params, converting empty strings to undefined if needed
        const params = {
            page: pagination.pageIndex,
            size: pagination.pageSize,
            patientId: filters.patientId ? Number(filters.patientId) : undefined,
            scheduleId: filters.scheduleId ? Number(filters.scheduleId) : undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined
        }

        const res = await getAppointmentList(params)
        
        if (res) {
          setData(res.content)
          setTotalCount(res.totalElements)
        } else {
          setData([])
          setTotalCount(0)
        }
      } catch (error) {
        console.error("Failed to load appointments", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [pagination.pageIndex, pagination.pageSize, filters]) // Trigger fetch when filters change

  const handleApplyFilters = () => {
      setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset to page 1
      setFilters(tempFilters)
  }

  const handleResetFilters = () => {
      const reset = { patientId: '', patientName: '', scheduleId: '', startDate: '', endDate: '' }
      setTempFilters(reset)
      setFilters(reset)
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  const columns = useMemo<ColumnDef<AppointmentListDTO, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'Ref #',
        cell: ({ row }) => (
          <Link
            href={getLocalizedUrl(`/clinic/appoinment/details/${row.original.id}`, locale as Locale)}
            className='font-medium text-primary hover:underline'
          >
            #{row.original.id}
          </Link>
        )
      }),
      columnHelper.accessor('scheduleDate', {
        header: 'Date & Time',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.scheduleDate}
            </Typography>
            <Typography variant='body2' color='text.disabled'>
              {row.original.startTime}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('patientName', {
        header: 'Patient',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.patientName}
            </Typography>
            <Typography variant='caption' color='text.disabled'>
              {row.original.patientNo}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('doctorName', {
        header: 'Doctor',
        cell: ({ row }) => <Typography>{row.original.doctorName}</Typography>
      }),
      columnHelper.accessor('queuePosition', {
        header: 'Queue',
        cell: ({ row }) => (
             <div className='flex justify-center'>
                 <Chip label={row.original.queuePosition} size='small' variant='outlined' />
             </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const status = appointmentStatusObj[row.original.status] || { color: 'secondary', label: row.original.status }
        
          return <Chip label={status.label} color={status.color} variant='tonal' size='small' />
        }
      }),
      columnHelper.accessor('id', {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <OptionMenu
            iconButtonProps={{ size: 'medium' }}
            iconClassName='text-textSecondary'
            options={[
              {
                text: 'View Details',
                icon: 'tabler-eye',
                href: getLocalizedUrl(`/clinic/appoinment/details/${row.original.id}`, locale as Locale)
              }
            ]}
          />
        ),
        enableSorting: false
      })
    ],
    [locale]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    filterFns: {} as any,
  })

  // --- Handlers for MUI Pagination ---
  const handleChangePage = (event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }))
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({
      pageSize: parseInt(event.target.value, 10),
      pageIndex: 0 
    })
  }
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    label: 'Patient',
    placeholder: 'Select Patient',
    value: tempFilters.patientName,
    size:"small",
    InputProps: {
      readOnly: true,
      startAdornment: (
        <InputAdornment position='start'>
          <i className='tabler-user' />
        </InputAdornment>
      )
    },
    inputProps: { style: { cursor: 'pointer' } },
  }

  return (
    <Card>
      <CardContent>
        <div className='flex justify-between items-center gap-4 mb-4'>
            <Typography variant='h5'>Appointment List</Typography>
        </div>

        {/* --- FILTERS SECTION --- */}
        <Grid container spacing={4} className='mb-6'>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  
                    <OpenDialogOnElementClick
                      element={TextField }
                      elementProps={textFieldProps}
                      dialog={PatientSelectDialogBox}
                      dialogProps={{
                      onSelectPatient: (patient:any)=>{
                        setTempFilters({...tempFilters, patientId: patient.id, patientName:(patient.firstName + " " +patient.lastName)})
                      }
                      }}
                    />   

            </Grid>
            {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField 
                    label="Schedule ID" 
                    fullWidth 
                    size="small"
                    value={tempFilters.scheduleId}
                    onChange={(e) => setTempFilters({...tempFilters, scheduleId: e.target.value})}
                />
            </Grid> */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField 
                    label="Start Date" 
                    type="date" 
                    fullWidth 
                    size="small" 
                    InputLabelProps={{ shrink: true }}
                    value={tempFilters.startDate}
                    onChange={(e) => setTempFilters({...tempFilters, startDate: e.target.value})}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField 
                    label="End Date" 
                    type="date" 
                    fullWidth 
                    size="small" 
                    InputLabelProps={{ shrink: true }}
                    value={tempFilters.endDate}
                    onChange={(e) => setTempFilters({...tempFilters, endDate: e.target.value})}
                />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }} className="flex justify-end gap-2">
                <Button variant="outlined" color="secondary" onClick={handleResetFilters}>
                    Reset
                </Button>
                <Button variant="contained" onClick={handleApplyFilters}>
                    Apply Filters
                </Button>
            </Grid>
        </Grid>
      </CardContent>
      
      {isLoading ? (
        <div className='p-12 flex justify-center'><CircularProgress /></div>
      ) : (
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
              {table.getRowModel().rows.length === 0 ? (
                 <tr>
                    <td colSpan={columns.length} className='text-center p-4'>No appointments found</td>
                 </tr>
              ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <TablePagination
        component="div"
        count={totalCount}
        page={pagination.pageIndex}
        onPageChange={handleChangePage}
        rowsPerPage={pagination.pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Card>
  )
}

export default AppointmentListTable