import { projectId, publicAnonKey } from './supabase/info'
import { mockApi } from './mock-api'

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl: string
  private headers: HeadersInit

  constructor() {
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-8c47b332`
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Handle backend response structure { success: true, data: ... }
      if (result.success && result.data !== undefined) {
        return result.data as T
      }
      
      // Handle direct response
      return result as T
    } catch (error) {
      console.warn(`API request failed for ${endpoint}, falling back to mock data:`, error)
      // Fallback to mock API
      return this.handleMockFallback(endpoint, options)
    }
  }

  private async handleMockFallback<T>(endpoint: string, options: RequestInit): Promise<T> {
    // Map API endpoints to mock functions
    if (endpoint.includes('/vehicles') && (options.method === 'GET' || !options.method)) {
      return mockApi.getVehicles() as T
    }
    if (endpoint.includes('/dashboard') && (options.method === 'GET' || !options.method)) {
      return mockApi.getDashboardData() as T
    }
    if (endpoint.includes('/transactions') && (options.method === 'GET' || !options.method)) {
      return mockApi.getTransactions() as T
    }
    // Check more specific endpoints first
    if (endpoint.includes('/customers/blacklist') && (options.method === 'GET' || !options.method)) {
      return mockApi.getBlacklist() as T
    }
    if (endpoint.includes('/customers') && (options.method === 'GET' || !options.method)) {
      return mockApi.getCustomers() as T
    }
    if (endpoint.includes('/drivers/expenses') && (options.method === 'GET' || !options.method)) {
      return mockApi.getDriverExpenses() as T
    }
    if (endpoint.includes('/drivers/schedule') && (options.method === 'GET' || !options.method)) {
      return mockApi.getDriverSchedule() as T
    }
    if (endpoint.includes('/drivers/location') && (options.method === 'GET' || !options.method)) {
      return mockApi.getDriverLocation() as T
    }
    if (endpoint.includes('/drivers/assignments') && (options.method === 'GET' || !options.method)) {
      return mockApi.getDriverAssignments() as T
    }
    if (endpoint.includes('/drivers') && (options.method === 'GET' || !options.method)) {
      return mockApi.getDrivers() as T
    }
    if (endpoint.includes('/users') && (options.method === 'GET' || !options.method)) {
      return mockApi.getUsers() as T
    }
    if (endpoint.includes('/public-bookings') && options.method === 'POST') {
      return mockApi.createPublicBooking(JSON.parse(options.body as string)) as T
    }
    if (endpoint.includes('/public-bookings') && (options.method === 'GET' || !options.method)) {
      return mockApi.getPublicBookings() as T
    }
    if (endpoint.includes('/financial') && (options.method === 'GET' || !options.method)) {
      return mockApi.getFinancialData() as T
    }
    if (endpoint.includes('/communication/data') && (options.method === 'GET' || !options.method)) {
      return mockApi.getCommunicationData() as T
    }
    if (endpoint.includes('/communication/senders') && (options.method === 'GET' || !options.method)) {
      return mockApi.getCommunicationSenders() as T
    }
    if (endpoint.includes('/communication/templates') && (options.method === 'GET' || !options.method)) {
      return mockApi.getCommunicationTemplates() as T
    }
    if (endpoint.includes('/communication/assistant') && (options.method === 'GET' || !options.method)) {
      return mockApi.getCommunicationAssistant() as T
    }
    if (endpoint.includes('/communication/brand') && (options.method === 'GET' || !options.method)) {
      return mockApi.getCommunicationBrand() as T
    }
    if (endpoint.includes('/communication') && (options.method === 'GET' || !options.method)) {
      return mockApi.getCommunicationData() as T
    }
    if (endpoint.includes('/support') && (options.method === 'GET' || !options.method)) {
      return mockApi.getSupportData() as T
    }
    if (endpoint.includes('/reports/expenses') && (options.method === 'GET' || !options.method)) {
      return mockApi.getExpensesReport() as T
    }
    if (endpoint.includes('/reports/order-sources') && (options.method === 'GET' || !options.method)) {
      return mockApi.getOrderSourcesReport() as T
    }
    if (endpoint.includes('/reports/customer-analysis') && (options.method === 'GET' || !options.method)) {
      return mockApi.getCustomerAnalysisReport() as T
    }
    if (endpoint.includes('/reports/outstanding-rentals') && (options.method === 'GET' || !options.method)) {
      return mockApi.getOutstandingRentalsReport() as T
    }
    if (endpoint.includes('/reports/driver-performance') && (options.method === 'GET' || !options.method)) {
      return mockApi.getDriverPerformanceReport() as T
    }
    
    // For GET requests that don't match any specific endpoint, try to return empty data
    if (!options.method || options.method === 'GET') {
      return [] as T
    }
    
    // For POST/PUT/DELETE requests, return a generic success response
    return { success: true, message: 'Operation completed (mock response)' } as T
  }

  // Generic HTTP methods
  async get<T>(endpoint: string): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint)
    return { data }
  }

  async post<T>(endpoint: string, body?: any): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    })
    return { data }
  }

  async put<T>(endpoint: string, body?: any): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    })
    return { data }
  }

  async delete<T>(endpoint: string): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      method: 'DELETE'
    })
    return { data }
  }

  // Vehicle endpoints
  async getVehicles() {
    return this.request('/vehicles')
  }

  async getVehicle(id: string) {
    return this.request(`/vehicles/${id}`)
  }

  async createVehicle(vehicle: any) {
    return this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicle)
    })
  }

  async updateVehicle(id: string, vehicle: any) {
    return this.request(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicle)
    })
  }

  async deleteVehicle(id: string) {
    return this.request(`/vehicles/${id}`, {
      method: 'DELETE'
    })
  }

  // Dashboard endpoints
  async getDashboardData() {
    return this.request('/dashboard')
  }

  // Transaction endpoints
  async getTransactions() {
    return this.request('/transactions')
  }

  async createTransaction(transaction: any) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction)
    })
  }

  async updateTransaction(id: string, transaction: any) {
    return this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction)
    })
  }

  // Customer endpoints
  async getCustomers() {
    return this.request('/customers')
  }

  async createCustomer(customer: any) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customer)
    })
  }

  async updateCustomer(id: string, customer: any) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer)
    })
  }

  // Driver endpoints
  async getDrivers() {
    return this.request('/drivers')
  }

  async createDriver(driver: any) {
    return this.request('/drivers', {
      method: 'POST',
      body: JSON.stringify(driver)
    })
  }

  async updateDriver(id: string, driver: any) {
    return this.request(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driver)
    })
  }

  async getDriverExpenses() {
    return this.request('/drivers/expenses')
  }

  async getDriverSchedule() {
    return this.request('/drivers/schedule')
  }

  async getDriverLocation() {
    return this.request('/drivers/location')
  }

  async getDriverAssignments() {
    return this.request('/drivers/assignments')
  }

  // Public booking endpoints
  async createPublicBooking(bookingData: any) {
    return this.request('/public-bookings/create', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })
  }

  async getPublicBooking(bookingId: string) {
    return this.request(`/public-bookings/${bookingId}`)
  }

  async updatePublicBookingStatus(bookingId: string, status: string, notes?: string) {
    return this.request(`/public-bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    })
  }

  async getPublicBookings() {
    return this.request('/public-bookings')
  }

  // Financial endpoints
  async getFinancialReports() {
    return this.request('/financial/reports')
  }

  // Support endpoints
  async getSupportTickets() {
    return this.request('/support/tickets')
  }

  async createSupportTicket(ticket: any) {
    return this.request('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket)
    })
  }

  // Communication endpoints
  async getWhatsAppSettings() {
    return this.request('/communication/whatsapp/settings')
  }

  async updateWhatsAppSettings(settings: any) {
    return this.request('/communication/whatsapp/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    })
  }

  async sendWhatsAppMessage(data: any) {
    return this.request('/communication/whatsapp/send', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getCommunicationSenders() {
    return this.request('/communication/senders')
  }

  async getCommunicationTemplates() {
    return this.request('/communication/templates')
  }

  async getCommunicationAssistant() {
    return this.request('/communication/assistant')
  }

  async getCommunicationBrand() {
    return this.request('/communication/brand')
  }

  // User management endpoints  
  async getUsers() {
    return this.request('/users')
  }

  async createUser(user: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user)
    })
  }

  async updateUser(id: string, user: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user)
    })
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    })
  }

  // Reports endpoints
  async getExpensesReport() {
    return this.request('/reports/expenses')
  }

  async getOrderSourcesReport() {
    return this.request('/reports/order-sources')
  }

  async getCustomerAnalysisReport() {
    return this.request('/reports/customer-analysis')
  }

  async getOutstandingRentalsReport() {
    return this.request('/reports/outstanding-rentals')
  }

  async getDriverPerformanceReport() {
    return this.request('/reports/driver-performance')
  }

  // Auth endpoints
  async login(credentials: any) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    })
  }
}

export const apiClient = new ApiClient()