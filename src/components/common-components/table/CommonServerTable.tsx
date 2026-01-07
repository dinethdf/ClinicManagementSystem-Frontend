'use client'

import { useState } from 'react'

// Imports
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'

// TanStack
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Custom Hooks & Components
import { useCommonTable } from '@/hooks/useCommonTable' // Import the hook we made
import TableFilterDialog from './TableFilterDialog'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import tableStyles from '@core/styles/table.module.css'
import { FilterConfig } from './TableTypes'
import { CardHeader, Divider } from '@mui/material'

interface Props<T> {
  tableId: string
  title?: string
  fetchDataFunction: (params: any) => Promise<any> // Service function
  columns: any[]
  filterConfig?: FilterConfig[]
  actionComponent?: React.ReactNode // Export/Add buttons
}

const CommonServerTable = <T extends object>({ 
  tableId, 
  title, 
  fetchDataFunction, 
  columns, 
  filterConfig, 
  actionComponent 
}: Props<T>) => {

  // --- CONNECT TO REDUX VIA HOOK ---
  const { 
    data, 
    totalItems, 
    isLoading, 
    pagination, 
    filters, 
    sorting, 
    onPageChange, 
    onFilterChange 
  } = useCommonTable(tableId, fetchDataFunction, { 
  })

  // --- TANSTACK SETUP ---
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: { pagination },
    pageCount: Math.ceil(totalItems / pagination.pageSize),
    filterFns: {} as any
  })

  // --- HANDLERS ---
  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <Card>

    {  title && <CardHeader title={title} className="pb-2" />}
      {title && <Divider />}
      {/* TOOLBAR */}
      <div className='flex flex-wrap justify-between items-center gap-4 p-5 border-b'>
         {/* Left: Filters */}
         <div className='flex items-center gap-3'>
            {filterConfig && (
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
                      filtersConfig: filterConfig,
                      appliedFilters: filters,
                      sorting: sorting,
                      onApply: onFilterChange // Hook handles the dispatch
                  }}
              />
            )}
            
            {/* Page Size */}
            <TextField 
                select size="small" 
                value={pagination.pageSize} 
                onChange={(e) => onPageChange({ pageIndex: 0, pageSize: Number(e.target.value) })}
                className='w-[75px]'
            >
                {[5, 10, 25, 50, 100].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
         </div>

         {/* Right: Actions (passed from parent) */}
         <div className='flex items-center gap-3'>
            {actionComponent}
         </div>
      </div>

      {/* TABLE */}
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
                 <tr><td colSpan={columns.length} className='text-center p-4'>No records found</td></tr>
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

      {/* PAGINATION */}
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