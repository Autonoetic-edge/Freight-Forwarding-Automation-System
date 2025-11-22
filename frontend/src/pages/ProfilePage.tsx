/**
 * Profile Page
 */
import { useAuthStore } from '@/store/authStore'

const ProfilePage = () => {
  const { user } = useAuthStore()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <p className="text-gray-600">Manage your profile and settings</p>

      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-gray-900">
              {user?.first_name} {user?.last_name}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-gray-900">{user?.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="mt-1 text-gray-900">{user?.role}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">2FA Status</label>
            <p className="mt-1 text-gray-900">
              {user?.two_factor_enabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
