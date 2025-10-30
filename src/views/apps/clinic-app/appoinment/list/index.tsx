'use client'

// MUI Imports
import { useState } from 'react'

import Grid from '@mui/material/Grid2'

// Type Imports
import type { OrderType } from '@/types/apps/ecommerceTypes'

// Component Imports
import AppoinmentCard from './AppoinmentCard'

import AppoinmentListTable from './AppoinmentListTable'

import { getAppointmentsPagable } from '@/services/appoinment.server.service'

const OrderList = ({ orderData, initialData }: { orderData?: OrderType[]; initialData:string }) => {

  const [appointments, setAppointments] = useState(initialData)
  const [page, setPage] = useState(1)

  const loadNext = async () => {

    const nextPageData = await getAppointmentsPagable(page)

    setAppointments(nextPageData)
    setPage(page + 1)
  }

  console.log("Server load")
  console.log(appointments)
  
  return (
    <Grid container spacing={6}>
          <button onClick={loadNext}>Next</button>
      <Grid size={{ xs: 12 }}>
        <AppoinmentCard />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <AppoinmentListTable orderData={orderData} />
      </Grid>
    </Grid>
  )
}

export default OrderList
