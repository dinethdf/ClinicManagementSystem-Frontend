// Component Imports
import StaffDetails from '@/views/clinic-app/staff/details/StaffDetails'

// Service Imports
import { getStaffById } from '@/services/staff/staff.server.service'

const StaffDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  // Fetch Staff Profile (Server Side)
  const staff : any = await getStaffById(params.id)

  if (!staff) {
    return <div className="p-5">Staff member not found</div>
  }

  return <StaffDetails staffData={staff} />
}

export default StaffDetailsPage