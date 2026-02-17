'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/ClientAuthContextProvider'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

// TanStack Table
import { createColumnHelper } from '@tanstack/react-table'

// Common Components
import CommonServerTable from '@/components/common-components/table/CommonServerTable'
import { FilterConfig, SortingConfig } from '@/components/common-components/table/TableTypes' // 1. Import SortingConfig

// Service & Types
import { doctorService } from '@/services/doctor/doctor.service' 
import type { DoctorResponseDTO } from '@/types/doctor.types' 

const columnHelper = createColumnHelper<DoctorResponseDTO>()

const DoctorsListTable = () => {
  const router = useRouter()
  const user = useAuth()

  // --- 1. CONFIGURATION: FILTERS ---
  const specializationOptions = [
    { label: 'General Practitioner', value: 'General Practitioner' },
    { label: 'Dermatologist', value: 'Dermatologist' },
    { label: 'Orthopedic Surgeon', value: 'Orthopedic Surgeon' },
    { label: 'Cardiologist', value: 'Cardiologist' },
    { label: 'Endocrinologist', value: 'Endocrinologist' },
    { label: 'Nephrologist', value: 'Nephrologist' },
    { label: 'Neurologist', value: 'Neurologist' },
    { label: 'Surgeon', value: 'Surgeon' },
    { label: 'Ophthalmologist', value: 'Ophthalmologist' },
    { label: 'Dental Surgeon', value: 'Dental Surgeon' },
  ]

  const filterConfigs: FilterConfig[] = [
    { 
      key: 'name', 
      label: 'Doctor Name', 
      type: 'text', 
      placeholder: 'Search by Name',
      gridSize: { xs: 12, sm: 6 }
    },
    { 
      key: 'specialization', 
      label: 'Specialization', 
      type: 'select', 
      options: specializationOptions,
      gridSize: { xs: 12, sm: 6 }
    }
  ]

  // --- 2. CONFIGURATION: SORTING (New) ---
  const sortingConfig: SortingConfig[] = [
    { key: 'id', label: 'ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'slmcNumber', label: 'SLMC Number' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'createdDate', label: 'Date Created' }
  ]

  // --- 3. SERVICE WRAPPER (New) ---
  // Maps generic table params -> Specific Doctor Service params
  // const fetchDoctorsWrapper = async (params: any) => {

  //   const filters = {
  //     name: params.filters?.name,
  //     specialization: params.filters?.specialization
  //   }

  //   console.log("params")
  //   console.log(params)
  //   const sort = params.sort || 'id,desc'

  //   return await doctorService.getDoctorList({
  //       page: params.page,
  //       pageSize: params.limit, // Maps 'limit' to 'pageSize'
  //       filters: filters,
  //       sort: sort
  //   })
  // }

  // --- 4. COLUMNS DEFINITION ---
  const columns = useMemo(() => [
    
    columnHelper.accessor('id', {
      header: 'Id #',
      cell: ({ row }) => <Typography variant='body2'>#{row.original.id}</Typography>
    }),

      columnHelper.accessor('nameWithInitials', {
        header: 'Doctor Name',
        cell: ({ row }) => (
          <div className='flex flex-col items-start'>
            <Typography 
                className='font-medium hover:text-primary cursor-pointer' 
                color='text.primary'
                onClick={() => router.push(`/en/clinic/doctors/view/${row.original.id}`)}
            >
              {row.original.firstName} {row.original.lastName}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {row.original.qualification}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('slmcNumber', {
        header: 'SLMC No',
        cell: ({ row }) => <Typography>{row.original.slmcNumber || 'N/A'}</Typography>
      }),
      columnHelper.accessor('specialization', {
        header: 'Specialization',
        cell: ({ row }) => (
          <Chip 
            label={row.original.specialization?.name || 'General'} 
            size='small' 
            color='primary' 
            variant='outlined' 
          />
        )
      }),
      columnHelper.accessor('mobileNo', {
        header: 'Mobile',
        cell: ({ row }) => <Typography>{row.original.mobileNo}</Typography>
      }),
      columnHelper.accessor('experienceYears', {
        header: 'Experience',
        cell: ({ row }) => <Typography>{row.original.experienceYears} Years</Typography>
      }),
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: any) => (
          <Tooltip title="View/Edit Details">
            <IconButton 
                size="small" 
                onClick={() => router.push(`/en/clinic/doctors/view/${row.original.id}`)}
                color="primary"
            >
                <i className='tabler-edit' />
            </IconButton>
          </Tooltip>
        )
      }
  ], [router])

  return (
    <CommonServerTable
      // Unique ID for Redux Persistence
      tableId="doctor-list-table"
      
      title="Doctor List"
      
      // Use Wrapper instead of direct service
      fetchDataFunction={doctorService.getDoctorList}
      
      columns={columns}
      filterConfig={filterConfigs}
      sortingConfig={sortingConfig} // Pass Sorting Config
      
      actionComponent={
        <>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-upload' />}>
              Export
          </Button>

          { user?.user?.role === "ADMIN" && (
            <Button 
                variant='contained' 
                onClick={() => router.push('/en/clinic/doctors/register')}
                startIcon={<i className='tabler-plus' />}
            >
                Add Doctor
            </Button>
          )}
        </>
      }
    />
  )
}

export default DoctorsListTable