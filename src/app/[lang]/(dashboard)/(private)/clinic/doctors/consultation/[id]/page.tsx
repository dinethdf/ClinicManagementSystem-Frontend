

// Component Imports
import ConsultationView from '@/views/apps/clinic-app/doctors/consultation'


const ConsultationPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  return <ConsultationView scheduleId={params.id} />
}

export default ConsultationPage