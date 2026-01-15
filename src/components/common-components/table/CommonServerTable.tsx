'use client'

import { useState, useMemo, useEffect } from 'react'

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
import Collapse from '@mui/material/Collapse' // Added for smooth transition

// TanStack
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Custom Hooks & Components
import { useCommonTable } from '@/hooks/useCommonTable' 
import TableFilterDialog from './TableFilterDialog'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import tableStyles from '@core/styles/table.module.css'
import { FilterConfig } from './TableTypes'

interface Props<T> {
  tableId: string
  title?: string
  fetchDataFunction: (params: any) => Promise<any>
  columns: any[]
  filterConfig?: FilterConfig[]
  actionComponent?: React.ReactNode
  
  // --- SELECTION PROPS ---
  enableRowSelection?: boolean
  onSelectionChange?: (selectedRows: T[]) => void
  renderSelectionActions?: (selectedRows: T[]) => React.ReactNode
}

const CommonServerTable = <T extends object>({ 
  tableId, 
  title, 
  fetchDataFunction, 
  columns, 
  filterConfig, 
  actionComponent,
  enableRowSelection = false,
  onSelectionChange,
  renderSelectionActions
}: Props<T>) => {

  // --- SELECTION STATE ---
  const [rowSelection, setRowSelection] = useState({})

  // --- CONNECT TO REDUX ---
  const { 
    data, 
    totalItems, 
    isLoading, 
    pagination, 
    filters, 
    sorting, 
    onPageChange, 
    onFilterChange 
  } = useCommonTable(tableId, fetchDataFunction, {})

  // --- COLUMN CONFIGURATION ---
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

  // --- TANSTACK SETUP ---
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: { 
      pagination,
      rowSelection 
    },
    pageCount: Math.ceil(totalItems / pagination.pageSize),
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    getRowId: (row: any) => row.id?.toString() || row.payoutId?.toString() || JSON.stringify(row),
    filterFns: {} as any
  })

  // Get currently selected row objects
  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
  const hasSelection = selectedRows.length > 0

  // --- NOTIFY PARENT ---
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, data, onSelectionChange]);

  // --- LOGIC ---
  const activeFilterCount = Object.values(filters).filter(val => val !== '' && val !== null && val !== undefined).length

  return (
    <Card>
      
      {/* ------------------------------------------
          1. HEADER & STANDARD TOOLBAR (Always Visible)
      ------------------------------------------- */}
      {title && <CardHeader title={title} className="pb-2" />}
      {title && <Divider />}
      
      <div className='flex flex-wrap justify-between items-center gap-4 p-5'>
          
          {/* Left: Filters & Page Size */}
          <div className='flex items-center gap-3'>
              {filterConfig && (
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
                      filtersConfig: filterConfig,
                      appliedFilters: filters,
                      sorting: sorting,
                      onApply: onFilterChange
                  }}
              />
              )}
              
              {activeFilterCount > 0 && (
                  <Tooltip title="Clear all filters">
                      <IconButton 
                          onClick={() => onFilterChange({}, sorting)} 
                          color="error" 
                          size="small"
                          className="border border-red-200 bg-red-50 hover:bg-red-100"
                      >
                          <i className='tabler-filter-off' />
                      </IconButton>
                  </Tooltip>
              )}
              
              <TextField 
                  select 
                  size="small" 
                  value={pagination.pageSize} 
                  onChange={(e) => onPageChange({ pageIndex: 0, pageSize: Number(e.target.value) })}
                  className='w-[75px]'
              >
                  {[5, 10, 25, 50].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
          </div>

          {/* Right: Standard Actions (Add, Export, etc.) */}
          <div className='flex items-center gap-3'>
              {actionComponent}
          </div>
      </div>

      <Divider />

      {/* ------------------------------------------
          2. SELECTION TOOLBAR (Conditional)
      ------------------------------------------- */}
      <Collapse in={hasSelection && !!renderSelectionActions}>
        <div className='flex flex-wrap justify-between items-center gap-4 p-3 px-5 bg-primary/10 border-b border-primary/20'>
            {/* Left: Count + Clear */}
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

            {/* Right: Selection Actions (Delete, etc.) */}
            <div className='flex items-center gap-3'>
                {renderSelectionActions && renderSelectionActions(selectedRows)}
            </div>
        </div>
      </Collapse>

      {/* ------------------------------------------
          3. TABLE CONTENT
      ------------------------------------------- */}
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
                    <tr key={row.id} className={row.getIsSelected() ? 'bg-primary/5 transition-colors' : ''}>
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

      {/* ------------------------------------------
          4. PAGINATION
      ------------------------------------------- */}
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