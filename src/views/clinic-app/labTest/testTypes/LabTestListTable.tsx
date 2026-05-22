'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid' 
import Alert from '@mui/material/Alert'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party
import classnames from 'classnames'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// Custom Components
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'

// Services & Types
import { getLabTestList, createLabTest, updateLabTest, toggleLabTestStatus } from '@/services/lab.server.service'
import type { LabTestTypeDTO } from '@/types/lab.types'

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }: any) => {
  const [value, setValue] = useState(initialValue)
  const isInitialMount = useRef(true)

  useEffect(() => { setValue(initialValue) }, [initialValue])
  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; 

return; }

    const timeout = setTimeout(() => { onChange(value) }, debounce)

    
return () => clearTimeout(timeout)
  }, [value, onChange, debounce])
  
return <CustomTextField {...props} value={value} onChange={(e: any) => setValue(e.target.value)} />
}

const columnHelper = createColumnHelper<LabTestTypeDTO>()

const LabTestListTable = () => {
  const [data, setData] = useState<LabTestTypeDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10, totalItems: 0, totalPages: 0 })
  const [searchQuery, setSearchQuery] = useState('') 
  
  // Dialog
  const [openDialog, setOpenDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [editingTest, setEditingTest] = useState<LabTestTypeDTO | null>(null)
  
  const [formData, setFormData] = useState({ name: '', code: '', description: '', testFee: '', clinicFee: '', isActive: true })

  // Fetch Data
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await getLabTestList(pagination.pageIndex, pagination.pageSize, searchQuery);

      setData(result.content || []);
      setPagination(prev => ({ ...prev, totalItems: result.totalElements, totalPages: result.totalPages }));
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  }, [pagination.pageIndex, pagination.pageSize, searchQuery]);

  useEffect(() => { fetchData() }, [fetchData]);

  const handleSearch = useCallback((value: string | number) => {
    setSearchQuery(String(value));
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleOpenCreate = () => {
      setEditingTest(null)
      setFormData({ name: '', code: '', description: '', testFee: '', clinicFee: '', isActive: true })
      setSubmitError(null)
      setOpenDialog(true)
  }

  const handleOpenEdit = (test: LabTestTypeDTO) => {
      setEditingTest(test)
      setFormData({
          name: test.name, code: test.code, description: test.description,
          testFee: String(test.testFee), clinicFee: String(test.clinicFee), isActive: test.isActive
      })
      setSubmitError(null)
      setOpenDialog(true)
  }

  const handleSubmit = async () => {
      if(!formData.name || !formData.code || !formData.testFee) { setSubmitError("Fill required fields"); 

return; }

      setIsSubmitting(true); setSubmitError(null);

      const payload = {
          name: formData.name, code: formData.code, description: formData.description,
          testFee: Number(formData.testFee), clinicFee: Number(formData.clinicFee), isActive: formData.isActive
      }

      const res = editingTest ? await updateLabTest(editingTest.id, payload) : await createLabTest(payload);

      if (res.success) {
          setOpenDialog(false); fetchData();
      } else {
          setSubmitError(res.error || "Failed");
      }

      setIsSubmitting(false);
  }

  const handleToggleStatus = async (id: number) => { await toggleLabTestStatus(id); fetchData(); }

  const columns = useMemo<ColumnDef<LabTestTypeDTO, any>[]>(() => [
      columnHelper.accessor('code', { header: 'Code', cell: ({ row }) => <Typography className='font-mono text-sm text-primary'>{row.original.code}</Typography> }),
      columnHelper.accessor('name', { header: 'Test Name', cell: ({ row }) => (
          <div><Typography className='font-medium'>{row.original.name}</Typography></div>
      )}),
      columnHelper.accessor('totalPrice', { header: 'Price (LKR)', cell: ({ row }) => (
          <Typography className='font-bold'>{(row.original.testFee + row.original.clinicFee).toFixed(2)}</Typography>
      )}),
      columnHelper.accessor('isActive', { header: 'Status', cell: ({ row }) => (
          <Chip label={row.original.isActive ? 'Active' : 'Inactive'} size='small' color={row.original.isActive ? 'success' : 'error'} variant='tonal' />
      )}),
      columnHelper.display({ id: 'actions', header: 'Actions', cell: ({ row }) => (
          <div className='flex items-center gap-2'>
              <Tooltip title="Edit"><IconButton size='small' onClick={() => handleOpenEdit(row.original)}><i className='tabler-edit' /></IconButton></Tooltip>
              <Tooltip title="Toggle Status"><IconButton size='small' onClick={() => handleToggleStatus(row.original.id)} color={row.original.isActive ? 'error' : 'success'}><i className={row.original.isActive ? 'tabler-circle-x' : 'tabler-circle-check'} /></IconButton></Tooltip>
          </div>
      )})
  ], [])

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), manualPagination: true, rowCount: pagination.totalItems, filterFns:{} as any })

  return (
    <>
      <Typography variant='h3' gutterBottom>Lab Test Management</Typography>
      <Card>
        <CardContent className='flex justify-between flex-wrap gap-4'>
          <DebouncedInput value={searchQuery} onChange={handleSearch} placeholder='Search Tests...' className='max-sm:is-full' />
          <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={handleOpenCreate}>Add Test</Button>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>{table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>{headerGroup.headers.map(header => <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>
            ))}</thead>
            <tbody>{isLoading ? <tr><td colSpan={columns.length} className='text-center p-4'>Loading...</td></tr> : 
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className='hover:bg-gray-50'>{row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>
                ))
            }</tbody>
          </table>
        </div>
        <TablePagination component='div' count={pagination.totalItems} rowsPerPage={pagination.pageSize} page={pagination.pageIndex} onPageChange={(_, p) => setPagination(prev => ({ ...prev, pageIndex: p }))} onRowsPerPageChange={e => setPagination(prev => ({ ...prev, pageSize: Number(e.target.value), pageIndex: 0 }))} />
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTest ? 'Edit Lab Test' : 'Add New Lab Test'}</DialogTitle>
        <DialogContent dividers>
            {submitError && <Alert severity="error" className="mb-4">{submitError}</Alert>}
            <Grid container spacing={3} className='mt-1'>
                <Grid size={{ xs: 6 }}><CustomTextField fullWidth label="Code" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} /></Grid>
                <Grid size={{ xs: 6 }}><CustomTextField fullWidth label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></Grid>
                <Grid size={{ xs: 6 }}><CustomTextField fullWidth label="Description" multiline rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></Grid>
                <Grid size={{ xs: 6 }}><CustomTextField fullWidth label="Test Fee" type="number" value={formData.testFee} onChange={e => setFormData({...formData, testFee: e.target.value})} /></Grid>
                <Grid size={{ xs: 6 }}><CustomTextField fullWidth label="Clinic Fee" type="number" value={formData.clinicFee} onChange={e => setFormData({...formData, clinicFee: e.target.value})} /></Grid>
                {editingTest && <Grid size={{ xs: 12 }}><FormControlLabel control={<Switch checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />} label="Active" /></Grid>}
            </Grid>
        </DialogContent>
        <DialogActions className='p-4'><Button onClick={() => setOpenDialog(false)}>Cancel</Button><Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button></DialogActions>
      </Dialog>
    </>
  )
}

export default LabTestListTable