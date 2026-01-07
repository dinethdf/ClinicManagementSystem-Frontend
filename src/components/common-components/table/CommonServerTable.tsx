'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import tableStyles from '@core/styles/table.module.css'
import { CommonTableProps } from './TableTypes'

const CommonServerTable = <T extends object>({
  data,
  columns,
  totalCount,
  isLoading,
  pagination,
  onPaginationChange,
  filterComponent,
  title
}: CommonTableProps<T>) => {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, 
    manualFiltering: true,
    manualSorting: true,
    state: { pagination },
    filterFns: {} as any, 
  })

  const handleChangePage = (_: unknown, newPage: number) => {
    onPaginationChange({ ...pagination, pageIndex: newPage })
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPaginationChange({
      pageSize: parseInt(event.target.value, 10),
      pageIndex: 0
    })
  }

  return (
    <Card>
      {/* Title only (Actions are now inside filterComponent) */}
      {title && <CardHeader title={title} className="pb-2" />}
      {title && <Divider />}

      {/* Filters & Toolbar */}
      {filterComponent}
      
      {/* Table */}
      {isLoading ? (
        <div className='p-12 flex justify-center'><CircularProgress /></div>
      ) : (
        <div className='overflow-x-auto border-t'>
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
                    <td colSpan={columns.length} className='text-center p-8'>
                       <div className="flex flex-col items-center gap-2 opacity-50">
                          <i className="tabler-database-off text-3xl"/>
                          <Typography>No records found</Typography>
                       </div>
                    </td>
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

export default CommonServerTable