import { redirect } from 'next/navigation'

import Grid from '@mui/material/Grid'

import AppointmentPayment from '@/views/clinic-app/payment/appointment/edit/AppointmentPayment'

import { decodeHideValue } from '@/utils/encode'
import { getInvoiceDetails } from '@/services/financial/invoice.server.service';

const EditPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  const encoded = decodeHideValue(params.id);

  const result = await getInvoiceDetails(Number(encoded));
  

  // Update: Check if result exists and has an invoiceId (since it returns a single object)
  if (!result || !result.invoiceId) {
      redirect('/en/clinic/appoinment/list');
  } else {

    return (
      <Grid container spacing={6} alignItems='center'>
          <AppointmentPayment appointmentInvDetails={result} id={encoded} />
      </Grid>
    )
  }

}

export default EditPage