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
import IconButton from '@mui/material/IconButton' // Added
import Tooltip from '@mui/material/Tooltip'       // Added

// TanStack
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Custom Hooks & Components
import { useCommonTable } from '@/hooks/useCommonTable' 
import TableFilterDialog from './TableFilterDialog'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import tableStyles from '@core/styles/table.module.css'
import { FilterConfig } from './TableTypes'
import { CardHeader, Divider } from '@mui/material'

interface Props<T> {
  tableId: string
  title?: string
  fetchDataFunction: (params: any) => Promise<any>
  columns: any[]
  filterConfig?: FilterConfig[]
  actionComponent?: React.ReactNode 
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

  // --- LOGIC ---
  // Count how many filters have values (excluding empty strings)
  const activeFilterCount = Object.values(filters).filter(val => val !== '' && val !== null && val !== undefined).length

  // Handler: Instantly clear all filters but keep sorting
  const handleClearFilters = () => {
    onFilterChange({}, sorting)
  }

  return (
    <Card>

    {  title && <CardHeader title={title} className="pb-2" />}
      {title && <Divider />}
      {/* TOOLBAR */}
      <div className='flex flex-wrap justify-between items-center gap-4 p-5 border-b'>
         
         {/* Left Side: Filters & Page Size */}
         <div className='flex items-center gap-3'>
            
            {/* 1. FILTER BUTTON */}
            {filterConfig && (
              <OpenDialogOnElementClick
                  element={Button}
                  elementProps={{
                      variant: 'tonal',
                      // Highlight button if filters are active
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
            
            {/* 2. CLEAR BUTTON (Visible only if filters are active) */}
            {activeFilterCount > 0 && (
                <Tooltip title="Clear all filters">
                    <IconButton 
                        onClick={handleClearFilters} 
                        color="error" 
                        size="small"
                        className="border border-red-200 bg-red-50 hover:bg-red-100"
                    >
                        <i className='tabler-filter-off' />
                    </IconButton>
                </Tooltip>
            )}
            
            {/* 3. PAGE SIZE */}
            <TextField 
                select 
                size="small" 
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
                 <tr><td colSpan={columns.length} className='text-center p-8 text-gray-500'>No records found</td></tr>
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