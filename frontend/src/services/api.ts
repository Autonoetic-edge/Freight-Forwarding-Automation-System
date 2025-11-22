/**
 * API Service
 * Handles all HTTP requests to the backend API
 */
import axios, { AxiosError, AxiosInstance } from 'axios'
import toast from 'react-hot-toast'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Customer,
  Shipment,
  Document,
  DashboardStats,
  PaginatedResponse,
  ShipmentFormData,
  CustomerFormData,
  UserFormData,
} from '@/types'

// API base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { access_token } = response.data
          localStorage.setItem('access_token', access_token)

          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Show error toast for other errors
    const errorMessage =
      (error.response?.data as any)?.detail ||
      error.message ||
      'An unexpected error occurred'

    toast.error(errorMessage)

    return Promise.reject(error)
  }
)

// ============================================
// Authentication API
// ============================================

export const authAPI = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    const response = await api.post<LoginResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Store tokens
    localStorage.setItem('access_token', response.data.access_token)
    localStorage.setItem('refresh_token', response.data.refresh_token)

    return response.data
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/auth/register', data)
    return response.data
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    await api.post('/auth/logout')
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  /**
   * Update password
   */
  updatePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    })
  },
}

// ============================================
// Users API
// ============================================

export const usersAPI = {
  /**
   * Get all users
   */
  getAll: async (params?: { page?: number; size?: number }): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/users', { params })
    return response.data
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  /**
   * Create user
   */
  create: async (data: UserFormData): Promise<User> => {
    const response = await api.post<User>('/users', data)
    return response.data
  },

  /**
   * Update user
   */
  update: async (id: string, data: Partial<UserFormData>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data)
    return response.data
  },

  /**
   * Delete user
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}

// ============================================
// Customers API
// ============================================

export const customersAPI = {
  /**
   * Get all customers
   */
  getAll: async (params?: {
    page?: number
    size?: number
    search?: string
  }): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get<PaginatedResponse<Customer>>('/customers', { params })
    return response.data
  },

  /**
   * Get customer by ID
   */
  getById: async (id: string): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`)
    return response.data
  },

  /**
   * Create customer
   */
  create: async (data: CustomerFormData): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data)
    return response.data
  },

  /**
   * Update customer
   */
  update: async (id: string, data: Partial<CustomerFormData>): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}`, data)
    return response.data
  },

  /**
   * Delete customer
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`)
  },
}

// ============================================
// Shipments API
// ============================================

export const shipmentsAPI = {
  /**
   * Get all shipments
   */
  getAll: async (params?: {
    page?: number
    size?: number
    status?: string
    customer_id?: string
    search?: string
  }): Promise<PaginatedResponse<Shipment>> => {
    const response = await api.get<PaginatedResponse<Shipment>>('/shipments', { params })
    return response.data
  },

  /**
   * Get shipment by ID
   */
  getById: async (id: string): Promise<Shipment> => {
    const response = await api.get<Shipment>(`/shipments/${id}`)
    return response.data
  },

  /**
   * Create shipment
   */
  create: async (data: ShipmentFormData): Promise<Shipment> => {
    const response = await api.post<Shipment>('/shipments', data)
    return response.data
  },

  /**
   * Update shipment
   */
  update: async (id: string, data: Partial<ShipmentFormData>): Promise<Shipment> => {
    const response = await api.put<Shipment>(`/shipments/${id}`, data)
    return response.data
  },

  /**
   * Delete shipment
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/shipments/${id}`)
  },

  /**
   * Get shipment timeline
   */
  getTimeline: async (id: string): Promise<any[]> => {
    const response = await api.get(`/shipments/${id}/timeline`)
    return response.data
  },
}

// ============================================
// Documents API
// ============================================

export const documentsAPI = {
  /**
   * Upload document
   */
  upload: async (file: File, shipmentId?: string, documentType?: string): Promise<Document> => {
    const formData = new FormData()
    formData.append('file', file)
    if (shipmentId) formData.append('shipment_id', shipmentId)
    if (documentType) formData.append('document_type', documentType)

    const response = await api.post<Document>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  /**
   * Get document by ID
   */
  getById: async (id: string): Promise<Document> => {
    const response = await api.get<Document>(`/documents/${id}`)
    return response.data
  },

  /**
   * Get documents for shipment
   */
  getByShipment: async (shipmentId: string): Promise<Document[]> => {
    const response = await api.get<Document[]>(`/shipments/${shipmentId}/documents`)
    return response.data
  },

  /**
   * Delete document
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`)
  },

  /**
   * Trigger OCR processing
   */
  processOCR: async (id: string): Promise<void> => {
    await api.post(`/documents/${id}/ocr`)
  },

  /**
   * Download document
   */
  download: (id: string): string => {
    return `${API_URL}/api/v1/documents/${id}/download`
  },
}

// ============================================
// Dashboard API
// ============================================

export const dashboardAPI = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard')
    return response.data
  },
}

export default api
