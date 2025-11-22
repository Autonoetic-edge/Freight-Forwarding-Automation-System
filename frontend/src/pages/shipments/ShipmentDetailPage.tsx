/**
 * Shipment Detail Page
 */
import { useParams } from 'react-router-dom'

const ShipmentDetailPage = () => {
  const { id } = useParams()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Shipment Details</h1>
      <p className="text-gray-600">Shipment ID: {id}</p>
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <p className="text-gray-500">Shipment details will be displayed here.</p>
      </div>
    </div>
  )
}

export default ShipmentDetailPage
