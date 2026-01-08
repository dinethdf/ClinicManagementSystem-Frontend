'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

// Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'

// Table Tools
import { createColumnHelper } from '@tanstack/react-table'
import CommonServerTable from '@/components/common-components/table/CommonServerTable'
import { FilterConfig } from '@/components/common-components/table/TableTypes'

// Service & Types
import { patientService } from '@/services/patient.service'
import type { PatientResponceDTO } from '@/types/patient.types'
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

const columnHelper = createColumnHelper<PatientResponceDTO>()

const PatientListTable = () => {
  const router = useRouter()

  // 1. Define Filters
  const filterConfigs: FilterConfig[] = [
    { key: 'searchParam', label: 'Search', type: 'text', isSortable: true },
    { key: 'patientNo', label: 'Patient No', type: 'text', isSortable: true },
    { key: 'fullName', label: 'Name', type: 'text', isSortable: true },
    { key: 'nic', label: 'NIC', type: 'text', isSortable: false },
  ]

  // 2. Define Columns
  const columns = useMemo(() => [
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
        )
      },
      columnHelper.accessor('patientNo', {
        header: 'Patient No',
        cell: ({ row }) => <Typography color='primary'>{row.original.patientNo || 'N/A'}</Typography>
      }),
      columnHelper.accessor('fullName', {
        header: 'Patient Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3 cursor-pointer' onClick={() => router.push(`/en/clinic/patient/details/${row.original.id}`)}>
            <CustomAvatar skin='light' size={34} color='primary'>
              {getInitials(row.original.fullName)}
            </CustomAvatar>
            <Typography className='font-medium hover:text-primary transition-colors' color='text.primary'>
              {row.original.fullName}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('nic', { header: 'NIC', cell: info => info.getValue() || '--' }),
      columnHelper.accessor('mobileNo', { header: 'Mobile', cell: info => info.getValue() }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.isActive ? 'Active' : 'Inactive'}
            color={row.original.isActive ? 'success' : 'secondary'}
            size='small'
            variant='tonal'
          />
        )
      })
  ], [router])

  return (
    <CommonServerTable
      // A unique ID is required to save state in Redux
      tableId="patient-list-table-staff" // need unique
      
      title='Patient Table'
      // Pass the Service function directly
      fetchDataFunction={patientService.getPatients}
      
      columns={columns}
      filterConfig={filterConfigs}
      
      // Extra Actions
      actionComponent={
        <>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-upload' />}>
             Export
          </Button>
          <Button 
             variant='contained' 
             onClick={() => router.push(`/en/clinic/patient/register`)}
             startIcon={<i className='tabler-plus' />}
          >
             Add Patient
          </Button>
        </>
      }
    />
  )
}

export default PatientListTable