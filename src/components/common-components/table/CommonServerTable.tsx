'use client'

// MUI
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'

// TanStack Table
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

// Utils
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
  title,
  actionComponent
}: CommonTableProps<T>) => {

  // Initialize TanStack Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    
    manualPagination: true, 
    manualFiltering: true, // Add this: Tells table we handle filtering outside (API)
    manualSorting: true,   // Add this: Tells table we handle sorting outside (API)

    state: {
      pagination
    },
    filterFns: {} as any, 
  })

  // Handlers for MUI Pagination
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
      {/* Header Section */}
      {(title || actionComponent) && (
         <CardHeader 
            title={title} 
            action={actionComponent} 
         />
      )}
      
      {/* Dynamic Filters Section */}
      {filterComponent && (
         <>
           {filterComponent}
           <Divider />
         </>
      )}

      {/* Table Section */}
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
                    <td colSpan={columns.length} className='text-center p-6'>
                       <Typography color="textSecondary">No records found</Typography>
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

      {/* Pagination Section */}
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