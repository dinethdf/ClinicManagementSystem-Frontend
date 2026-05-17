'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type FilterFn
} from '@tanstack/react-table'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// --- Types ---
// FIX: Use 'any' for itemRank to avoid import errors from @tanstack/react-table
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
//   interface FilterMeta {
//     itemRank: any
//   }
}

// --- Helper: Fuzzy Filter ---
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// --- Helper: Debounced Input ---
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

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)
    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return (
    <TextField 
      {...props} 
      value={value} 
      onChange={e => setValue(e.target.value)} 
      size="small" 
    />
  )
}

// --- Main Component Props ---
interface SimpleCommonTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  isLoading?: boolean
  error?: string | null
  
  // Customization
  searchPlaceholder?: string
  
  // Slots for Buttons/Filters
  actions?: React.ReactNode // Left side (e.g. Create Button)
  filters?: React.ReactNode // Right side (e.g. Status Dropdown)
// --- ROW CLICK PROPS ---
baseRowUrl?: string
getRowUrlParam?: (row: T) => string | number
onRowClick?: (row: T) => void
}

// --- The Component ---
const SimpleCommonTable = <T,>({
data,
columns,
isLoading = false,
error = null,
searchPlaceholder = 'Search...',
actions,
filters,
baseRowUrl,
getRowUrlParam,
onRowClick
}: SimpleCommonTableProps<T>) => {
  
  const router = useRouter()

  // States
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})

  // TanStack Table Instance
  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Loading State
  if (isLoading) {
    return (
      <Card className='h-[400px] flex items-center justify-center'>
        <CircularProgress />
      </Card>
    )
  }

  // Error State
  if (error) {
    return (
      <Card className='p-6'>
        <Alert severity="error">{error}</Alert>
      </Card>
    )
  }

  return (
    <Card>
      {/* --- HEADER AREA --- */}
      <CardContent className='flex justify-between flex-wrap items-start gap-4'>
        
        {/* LEFT SIDE: Page Size + Actions */}
        <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
                <Typography className='hidden sm:block'>Show</Typography>
                <TextField
                    select
                    value={table.getState().pagination.pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                    className='is-[70px]'
                    size='small'
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </TextField>
            </div>
            {/* Custom Action Buttons (Passed via Props) */}
            {actions}
        </div>

        {/* RIGHT SIDE: Search + Custom Filters */}
        <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder={searchPlaceholder}
            className='max-sm:is-full sm:is-[250px]'
          />
          {/* Custom Dropdowns (Passed via Props) */}
          {filters}
        </div>

      </CardContent>

      {/* --- TABLE AREA --- */}
      <div className='overflow-x-auto border-t'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="uppercase text-xs font-semibold">
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'flex items-center cursor-pointer select-none': header.column.getCanSort(),
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className='tabler-chevron-up text-lg ml-1' />,
                          desc: <i className='tabler-chevron-down text-lg ml-1' />
                        }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center p-10 text-gray-500'>
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id} 
                  className={classnames(
                    { selected: row.getIsSelected() },
                    (baseRowUrl || onRowClick) ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors' : 'transition-colors'
                  )}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row.original as T);
                    } else if (baseRowUrl) {
                      const param = getRowUrlParam ? getRowUrlParam(row.original as T) : '';
                      const url = param ? `${baseRowUrl}/${param}` : baseRowUrl;
                      router.push(url);
                    }
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION AREA (Standard MUI) --- */}
      <TablePagination
        component="div"
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Card>
  )
}

export default SimpleCommonTable