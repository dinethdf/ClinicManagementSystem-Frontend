import { redirect } from 'next/navigation'

import Grid from '@mui/material/Grid2'

import AppointmentPayment from '@/views/apps/clinic-app/payment/appointment/edit/AppointmentPayment'

import { getAppointmentInvoiceview } from '@/services/appoinment.server.service';

import { decodeHideValue } from '@/utils/encode'

const EditPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  const encoded = decodeHideValue(params.id);

  const result = await getAppointmentInvoiceview(Number(encoded));
  
  if (!result || (Array.isArray(result) && result.length === 0)) {
      redirect('/en/clinic/appoinment/list');
  } else{

    return (
      <Grid container spacing={6} alignItems='center'>
          {/* Pass the first item of the result if it's an array */}
          <AppointmentPayment appointmentInvDetails={result[0]} id={encoded} />
      </Grid>
    )
  }



}

export default EditPage