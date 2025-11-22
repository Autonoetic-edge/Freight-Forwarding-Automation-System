/**
 * TypeScript type definitions for the application
 */

// User types
export enum UserRole {
  ADMIN = 'admin',
  OPERATIONS_MANAGER = 'operations_manager',
  OPERATIONS_STAFF = 'operations_staff',
  DOCUMENTATION = 'documentation',
  FINANCE = 'finance',
  CUSTOMER_SERVICE = 'customer_service',
}

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  is_active: boolean
  two_factor_enabled: boolean
  created_at: string
  updated_at: string
}

// Authentication types
export interface LoginRequest {
  username: string
  password: string
  otp?: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: UserRole
}

// Customer types
export interface Customer {
  id: string
  name: string
  code: string
  email?: string
  phone?: string
  address?: string
  contact_person?: string
  communication_preferences: Record<string, any>
  created_at: string
  updated_at: string
}

// Shipment types
export enum ShipmentMode {
  SEA = 'sea',
  AIR = 'air',
  ROAD = 'road',
  RAIL = 'rail',
}

export enum ShipmentType {
  IMPORT = 'import',
  EXPORT = 'export',
}

export enum ShipmentStatus {
  BOOKED = 'booked',
  CONFIRMED = 'confirmed',
  IN_TRANSIT = 'in_transit',
  CUSTOMS_CLEARANCE = 'customs_clearance',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface Shipment {
  id: string
  shipment_number: string
  customer_id: string
  customer?: Customer
  booking_date?: string
  mode: ShipmentMode
  type: ShipmentType
  origin_port?: string
  destination_port?: string
  carrier?: string
  etd?: string // Estimated Time of Departure
  eta?: string // Estimated Time of Arrival
  actual_departure_date?: string
  actual_arrival_date?: string
  status: ShipmentStatus
  assigned_to?: string
  assigned_user?: User
  created_by: string
  creator?: User
  remarks?: string
  created_at: string
  updated_at: string
  containers?: Container[]
  documents?: Document[]
  tracking_events?: TrackingEvent[]
}

// Container types
export enum ContainerType {
  DRY = 'dry',
  REEFER = 'reefer',
  TANK = 'tank',
  OPEN_TOP = 'open_top',
  FLAT_RACK = 'flat_rack',
}

export interface Container {
  id: string
  shipment_id: string
  container_number: string
  size?: string
  type: ContainerType
  seal_number?: string
  weight_kg?: number
  created_at: string
}

// Tracking types
export interface TrackingEvent {
  id: string
  shipment_id: string
  container_id?: string
  event_date: string
  location?: string
  status: string
  description?: string
  source: string // MANUAL, AUTOMATED, API
  created_at: string
}

// Document types
export interface Document {
  id: string
  shipment_id?: string
  filename: string
  original_filename: string
  file_path: string
  file_size: number
  mime_type: string
  document_type: string // BL, INVOICE, PACKING_LIST, etc.
  uploaded_by: string
  uploader?: User
  ocr_processed: boolean
  created_at: string
  ocr_result?: OCRResult
}

export interface OCRResult {
  id: string
  document_id: string
  extracted_text?: string
  extracted_fields: Record<string, any>
  confidence_score: number
  manual_review_needed: boolean
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
}

// Communication types
export enum CommunicationChannel {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
}

export interface Communication {
  id: string
  shipment_id?: string
  customer_id?: string
  channel: CommunicationChannel
  recipient: string
  subject?: string
  body: string
  sent_at?: string
  delivery_status: string
  created_by: string
  created_at: string
}

// Dashboard types
export interface DashboardStats {
  total_shipments: number
  active_shipments: number
  delivered_shipments: number
  pending_documents: number
  recent_activities: ActivityLog[]
  shipments_by_status: Record<string, number>
  shipments_by_mode: Record<string, number>
}

// Activity Log types
export interface ActivityLog {
  id: string
  user_id: string
  user?: User
  action: string
  resource_type?: string
  resource_id?: string
  details: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface ApiError {
  detail: string
  status_code?: number
}

// Form types
export interface ShipmentFormData {
  customer_id: string
  booking_date?: string
  mode: ShipmentMode
  type: ShipmentType
  origin_port?: string
  destination_port?: string
  carrier?: string
  etd?: string
  eta?: string
  status: ShipmentStatus
  assigned_to?: string
  remarks?: string
}

export interface CustomerFormData {
  name: string
  code: string
  email?: string
  phone?: string
  address?: string
  contact_person?: string
}

export interface UserFormData {
  email: string
  password?: string
  first_name: string
  last_name: string
  role: UserRole
  is_active: boolean
}
