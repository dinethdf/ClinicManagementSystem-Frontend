'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'

import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'

import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/redux-store'
import { fetchDoctorSchedules } from '@/redux-store/slices/doctorDashboardSlice'

import OptionMenu from '@core/components/option-menu'
import SimpleCommonTable from '@/components/common-components/table/simpleDataTable/SimpleCommonTable'
import { getLocalizedUrl } from '@/utils/i18n'
import { encodeHideValue } from '@/utils/encode'
import type { Locale } from '@/configs/i18n'
import { ScheduleDTO } from '@/types/doctor.types'

const columnHelper = createColumnHelper<ScheduleDTO>()

const ShedulesByDoctorListTable = ({ doctorId }: { doctorId: number }) => {
  // -- Hooks --
  const dispatch = useDispatch<AppDispatch>()
  const { lang: locale } = useParams()
  
  // -- Redux State --
  const { schedules, scheduleStatus, totalSchedules } = useSelector((state: RootState) => state.doctorDashboard)

  // -- Local State --
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6 
  })

  // -- Fetch Data --
  useEffect(() => {
    if (doctorId) {
        dispatch(fetchDoctorSchedules({ 
            doctorId, 
            page: pagination.pageIndex, 
            size: pagination.pageSize 
        }))
    }
  }, [dispatch, doctorId, pagination.pageIndex, pagination.pageSize])

  // -- Column Definitions --
  const columns = useMemo<ColumnDef<ScheduleDTO, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => (
          <Typography
            color='primary.main'
            className='font-medium'
          >{`#${row.original.id}`}</Typography>
        )
      }),
      columnHelper.accessor('scheduleDate', {
        header: 'Date & Time',
        cell: ({ row }) => (
            <div className='flex flex-col'>
                <Typography className='font-medium' color='text.primary'>
                    {row.original.scheduleDate}
                </Typography>
                <Typography variant='caption' color='text.disabled'>
                   {row.original.startTime.substring(0, 5)} - {row.original.endTime.substring(0, 5)}
                </Typography>
            </div>
        )
      }),
      columnHelper.accessor('doctorFee', {
        header: 'Fees',
        cell: ({ row }) => (
            <div className='flex flex-col'>
                <Typography variant='body2' className='font-medium'>
                    LKR {(row.original.doctorFee + row.original.clinicFee).toLocaleString()}
                </Typography>
                {row.original.payoutStatus && (
                     <div className='flex items-center gap-1 mt-0.5'>
                        <span className='h-2 w-2 rounded-full' style={{ backgroundColor: row.original.payoutStatus.colorCode }}></span>
                        <Typography variant='caption' className='text-[10px] uppercase'>
                            {row.original.payoutStatus.displayName}
                        </Typography>
                     </div>
                )}
            </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
            const statusObj = row.original.status as any; 
            
            return (
                <div className='flex flex-col items-start gap-1'>
                    <Chip 
                        label={statusObj?.displayName || statusObj?.code} 
                        sx={{ 
                            backgroundColor: statusObj?.colorCode || '#eee', 
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.70rem',
                            height: 24
                        }} 
                        size='small' 
                    />
                     <Typography 
                        variant='caption' 
                        className={`font-bold text-[10px] ${row.original.isBookingOpen ? 'text-success' : 'text-error'}`}
                     >
                        {row.original.isBookingOpen ? '● BOOKING OPEN' : '● BOOKING CLOSED'}
                     </Typography>
                </div>
            )
        }
      }),
      columnHelper.accessor('registeredPatientCount', {
        header: 'Capacity',
        cell: ({ row }) => (
          <div className='flex flex-col w-[100px]'>
             <div className='flex justify-between items-center'>
                 <Typography variant="caption" className='font-bold'>
                    {row.original.registeredPatientCount}/{row.original.maxPatientCount}
                 </Typography>
                 <Typography variant="caption" color='text.disabled'>
                    {Math.round((row.original.registeredPatientCount / row.original.maxPatientCount) * 100)}%
                 </Typography>
             </div>
             <div className='w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden'>
                <div 
                    className='h-full bg-primary' 
                    style={{ width: `${(row.original.registeredPatientCount / row.original.maxPatientCount) * 100}%` }}
                />
             </div>
          </div>
        )
      }),
      columnHelper.accessor('id', { 
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center' onClick={(e) => e.stopPropagation()}>
            <Tooltip title="Finish Schedule">
                <IconButton size='small'>
                <Link
                    href={`/doctor/schedule/${row.original.id}/finish`} 
                    className='flex'
                >
                    <i className='tabler-check text-textSecondary' />
                </Link>
                </IconButton>
            </Tooltip>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Complete Schedule',
                  icon: 'tabler-users',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                },
                {
                  text: 'Cancel Schedule',
                  icon: 'tabler-ban',
                  menuItemProps: { className: 'flex items-center gap-2 text-error' } 
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    [locale]
  )

  return (
    <Card>
      <SimpleCommonTable<ScheduleDTO>
        data={schedules || []}
        columns={columns}
        isLoading={scheduleStatus === 'loading'}
        baseRowUrl={getLocalizedUrl('clinic/financial/doctor-payment/details', locale as Locale)}
        getRowUrlParam={(row) => encodeHideValue(row.id)}
        manualPagination={true}
        totalItems={totalSchedules || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </Card>
  )
}

export default ShedulesByDoctorListTable