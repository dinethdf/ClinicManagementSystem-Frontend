'use client'

import { useState, useMemo, useEffect } from 'react'

import { useRouter } from 'next/navigation'

// Imports
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'

// TanStack
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Custom Hooks & Components
import { useCommonTable } from '@/hooks/useCommonTable' 
import TableFilterDialog from './TableFilterDialog'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import tableStyles from '@core/styles/table.module.css'

// Types
import { FilterConfig, SortingConfig } from './TableTypes'

interface Props<T> {
  tableId: string
  title?: string
  fetchDataFunction: (params: any) => Promise<any>
  columns: any[]
  
  // Filter & Sort Props
  filterConfig?: FilterConfig[]
  sortingConfig?: SortingConfig[] // ✅ NEW PROP
  
  actionComponent?: React.ReactNode
  
  // --- SELECTION PROPS ---
  enableRowSelection?: boolean
  onSelectionChange?: (selectedRows: T[]) => void
  renderSelectionActions?: (selectedRows: T[]) => React.ReactNode

  // --- ROW CLICK PROPS ---
  baseRowUrl?: string
  getRowUrlParam?: (row: T) => string | number
  onRowClick?: (row: T) => void
}

const CommonServerTable = <T extends object>({ 
  tableId, 
  title, 
  fetchDataFunction, 
  columns, 
  filterConfig, 
  sortingConfig, // ✅ Destructure
  actionComponent,
  enableRowSelection = false,
  onSelectionChange,
  renderSelectionActions,
  baseRowUrl,
  getRowUrlParam,
  onRowClick
}: Props<T>) => {

  const router = useRouter()

  // ... [Keep Selection State & Redux Connection exactly the same] ...
  const [rowSelection, setRowSelection] = useState({})
  const { 
    data, totalItems, isLoading, pagination, filters, sorting, 
    onPageChange, onFilterChange 
  } = useCommonTable(tableId, fetchDataFunction, {})

  // ... [Keep Column Config & TanStack Setup exactly the same] ...
  const tableColumns = useMemo(() => {
    if (!enableRowSelection) return columns;
    return [
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
        ),
      },
      ...columns
    ]
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: { pagination, rowSelection },
    pageCount: Math.ceil(totalItems / pagination.pageSize),
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    getRowId: (row: any) => row.id?.toString() || JSON.stringify(row),
    filterFns: {} as any
  })

  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
  const hasSelection = selectedRows.length > 0

  useEffect(() => {
    if (onSelectionChange) onSelectionChange(selectedRows);
  }, [rowSelection, data, onSelectionChange]);

  const activeFilterCount = Object.values(filters).filter(val => val !== '' && val !== null && val !== undefined).length

  return (
    <Card>
      {title && <CardHeader title={title} className="pb-2" />}
      {title && <Divider />}
      
      <div className='flex flex-wrap justify-between items-center gap-4 p-5'>
          <div className='flex items-center gap-3'>
              {/* Filter Button */}
              {(filterConfig || sortingConfig) && (
              <OpenDialogOnElementClick
                  element={Button}
                  elementProps={{
                      variant: 'tonal',
                      color: activeFilterCount > 0 ? 'primary' : 'secondary',
                      startIcon: <Badge badgeContent={activeFilterCount} color="error"><i className='tabler-filter' /></Badge>,
                      children: "Filters & Sort",
                      className: "px-6"
                  }}
                  dialog={TableFilterDialog}
                  dialogProps={{
                      filtersConfig: filterConfig || [],
                      sortingConfig: sortingConfig || [], // ✅ Pass Sorting Config
                      appliedFilters: filters,
                      sorting: sorting,
                      onApply: onFilterChange
                  }}
              />
              )}
              
              {/* Clear Button */}
              {activeFilterCount > 0 && (
                  <Tooltip title="Clear all filters">
                      <IconButton 
                          onClick={() => onFilterChange({}, sorting)} 
                          color="error" size="small" className="border border-red-200 bg-red-50 hover:bg-red-100"
                      >
                          <i className='tabler-filter-off' />
                      </IconButton>
                  </Tooltip>
              )}
              
              <TextField 
                  select size="small" value={pagination.pageSize} 
                  onChange={(e) => onPageChange({ pageIndex: 0, pageSize: Number(e.target.value) })}
                  className='w-[75px]'
              >
                  {[5, 10, 25, 50].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
          </div>

          <div className='flex items-center gap-3'>
              {actionComponent}
          </div>
      </div>

      <Divider />

      {/* ... [Keep Selection Toolbar & Table Content exactly the same] ... */}
       <Collapse in={hasSelection && !!renderSelectionActions}>
        <div className='flex flex-wrap justify-between items-center gap-4 p-3 px-5 bg-primary/10 border-b border-primary/20'>
            <div className='flex items-center gap-3'>
                <Typography variant='subtitle1' color='primary' className='font-bold flex items-center gap-2'>
                    <i className='tabler-checkbox text-xl' />
                    {selectedRows.length} Selected
                </Typography>
                <Tooltip title="Clear Selection">
                    <IconButton size='small' onClick={() => setRowSelection({})} className='text-primary/70 hover:text-primary'>
                        <i className='tabler-x' />
                    </IconButton>
                </Tooltip>
            </div>
            <div className='flex items-center gap-3'>
                {renderSelectionActions && renderSelectionActions(selectedRows)}
            </div>
        </div>
      </Collapse>

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
                 <tr><td colSpan={tableColumns.length} className='text-center p-8 text-gray-500'>No records found</td></tr>
              ) : (
                 table.getRowModel().rows.map(row => (
                    <tr 
                      key={row.id} 
                      className={`${row.getIsSelected() ? 'bg-primary/5' : ''} ${(baseRowUrl || onRowClick) ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors' : 'transition-colors'}`}
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
        count={totalItems}
        page={pagination.pageIndex} 
        onPageChange={(_, page) => onPageChange({ ...pagination, pageIndex: page })}
        rowsPerPage={pagination.pageSize}
        onRowsPerPageChange={(e) => onPageChange({ pageIndex: 0, pageSize: parseInt(e.target.value, 10) })}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Card>
  )
}

export default CommonServerTable