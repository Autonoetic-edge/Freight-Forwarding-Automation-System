/**
 * Main App Component
 * Handles routing and authentication
 */
import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Pages
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import ShipmentsPage from '@/pages/shipments/ShipmentsPage'
import ShipmentDetailPage from '@/pages/shipments/ShipmentDetailPage'
import CustomersPage from '@/pages/customers/CustomersPage'
import DocumentsPage from '@/pages/documents/DocumentsPage'
import UsersPage from '@/pages/users/UsersPage'
import ProfilePage from '@/pages/ProfilePage'

// Layout
import MainLayout from '@/components/layout/MainLayout'
import LoadingSpinner from '@/components/common/LoadingSpinner'

/**
 * Protected Route Component
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

/**
 * Public Route Component (redirects to dashboard if authenticated)
 */
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
  const { fetchCurrentUser } = useAuthStore()

  // Fetch current user on app load
  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/shipments" element={<ShipmentsPage />} />
        <Route path="/shipments/:id" element={<ShipmentDetailPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
