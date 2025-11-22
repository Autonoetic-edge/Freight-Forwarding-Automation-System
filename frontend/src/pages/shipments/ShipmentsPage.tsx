/**
 * Shipments List Page
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { shipmentsAPI } from '@/services/api'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import { Plus } from 'lucide-react'
import { formatDate, getStatusColor } from '@/lib/utils'

const ShipmentsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['shipments'],
    queryFn: () => shipmentsAPI.getAll(),
  })

  if (isLoading) {
    return <LoadingSpinner className="mt-20" size="lg" />
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
          <p className="text-gray-600">Manage your freight shipments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Shipment
        </Button>
      </div>

      {/* Shipments Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Shipment #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ETA
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data?.items?.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {shipment.shipment_number}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {shipment.customer?.name || 'N/A'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {shipment.origin_port} → {shipment.destination_port}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {shipment.eta ? formatDate(shipment.eta, 'PP') : 'N/A'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    to={`/shipments/${shipment.id}`}
                    className="text-primary hover:text-primary/80"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data?.items?.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No shipments found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShipmentsPage
