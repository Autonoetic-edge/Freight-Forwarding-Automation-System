/**
 * Dashboard Page
 * Shows overview statistics and recent activity
 */
import { useQuery } from '@tanstack/react-query'
import { dashboardAPI } from '@/services/api'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Package, TruckIcon, CheckCircle2, Clock } from 'lucide-react'

const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardAPI.getStats(),
  })

  if (isLoading) {
    return <LoadingSpinner className="mt-20" size="lg" />
  }

  const statCards = [
    {
      title: 'Total Shipments',
      value: stats?.total_shipments || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Shipments',
      value: stats?.active_shipments || 0,
      icon: TruckIcon,
      color: 'bg-yellow-500',
    },
    {
      title: 'Delivered',
      value: stats?.delivered_shipments || 0,
      icon: CheckCircle2,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Documents',
      value: stats?.pending_documents || 0,
      icon: Clock,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your freight forwarding operations</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`rounded-lg ${stat.color} p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts and tables would go here */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Shipments by Status */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Shipments by Status</h2>
          <div className="space-y-3">
            {stats?.shipments_by_status &&
              Object.entries(stats.shipments_by_status).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-gray-700">{status.replace('_', ' ')}</span>
                  <span className="font-semibold text-gray-900">{count as number}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Shipments by Mode */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Shipments by Mode</h2>
          <div className="space-y-3">
            {stats?.shipments_by_mode &&
              Object.entries(stats.shipments_by_mode).map(([mode, count]) => (
                <div key={mode} className="flex items-center justify-between">
                  <span className="capitalize text-gray-700">{mode}</span>
                  <span className="font-semibold text-gray-900">{count as number}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
        <div className="space-y-4">
          {stats?.recent_activities?.length === 0 ? (
            <p className="text-center text-gray-500">No recent activity</p>
          ) : (
            stats?.recent_activities?.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
