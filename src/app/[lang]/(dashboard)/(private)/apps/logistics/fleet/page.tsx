// Component Imports
import Fleet from '@/other/views/apps/logistics/fleet'

const FleetPage = () => {
  return <Fleet mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN!} />
}

export default FleetPage
