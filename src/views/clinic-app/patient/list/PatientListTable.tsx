'use client'

import { useMemo } from 'react'

import { useRouter } from 'next/navigation'

// Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Table Tools
import { createColumnHelper } from '@tanstack/react-table'

import CommonServerTable from '@/components/common-components/table/CommonServerTable'
import type { FilterConfig, SortingConfig } from '@/components/common-components/table/TableTypes'

// Service & Types
import { patientService } from '@/services/patient/patient.service'
import type { PatientResponceDTO } from '@/types/patient.types' // ✅ Correct Import

// Utils
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

// 1. Initialize Column Helper with Correct Type
const columnHelper = createColumnHelper<PatientResponceDTO>()

const PatientListTable = () => {
  const router = useRouter()

  // --- 2. CONFIGURATION: FILTERS ---
  const filterConfigs: FilterConfig[] = [
    { key: 'patientNo', label: 'Patient No', type: 'text', gridSize: { xs: 12, sm: 3 } },
    { key: 'name', label: 'Name', type: 'text', gridSize: { xs: 12, sm: 3 } },
    { key: 'nic', label: 'NIC', type: 'text', gridSize: { xs: 12, sm: 3 } },
    { key: 'mobile', label: 'Mobile No', type: 'text', gridSize: { xs: 12, sm: 3 } },
  ]

  // --- 3. CONFIGURATION: SORTING ---
  const sortingConfig: SortingConfig[] = [
    { key: 'id', label: 'ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'patientNo', label: 'Patient No' },
    { key: 'createdDate', label: 'Date Created' }
  ]

  // --- 5. COLUMNS DEFINITION ---
  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'Id #',
      cell: ({ row }) => <Typography variant='body2'>#{row.original.id}</Typography>
    }),

    columnHelper.accessor('patientNo', {
      header: 'Patient No',
      cell: ({ row }) => <Typography color='primary' className='font-medium'>{row.original.patientNo || 'N/A'}</Typography>
    }),

    // Combine First & Last Name
    columnHelper.accessor('firstName', {
      header: 'Patient Name',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <CustomAvatar skin='light' size={34} color='primary'>
            {getInitials(row.original.firstName + " " + row.original.lastName)}
          </CustomAvatar>
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.firstName} {row.original.lastName}
            </Typography>
            <Typography variant='caption'>{row.original.city}</Typography>
          </div>
        </div>
      )
    }),

    columnHelper.accessor('nic', { 
        header: 'NIC', 
        cell: info => info.getValue() || '--' 
    }),

    columnHelper.accessor('mobileNo', { 
        header: 'Mobile', 
        cell: info => info.getValue() || '--' 
    }),

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
    <CommonServerTable<PatientResponceDTO>
      tableId="patient-list-table-staff"
      title='Patient Registry'
      fetchDataFunction={patientService.getPatients}
      columns={columns}
      filterConfig={filterConfigs}
      sortingConfig={sortingConfig}
      baseRowUrl='/en/clinic/patient/clinical-profile'
      getRowUrlParam={(row: PatientResponceDTO) => row.id ?? 0}
      actionComponent={
        <>
          {/* <Button variant='tonal' color='secondary' startIcon={<i className='tabler-upload' />}>
             Export
          </Button> */}
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