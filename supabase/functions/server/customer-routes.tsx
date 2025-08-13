import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'

const customerRoutes = new Hono()

// Data structures
interface CustomerData {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  dateOfBirth?: string
  idNumber?: string
  drivingLicense?: string
  emergencyContact?: string
  emergencyPhone?: string
  customerType: 'individual' | 'corporate'
  companyName?: string
  status: 'active' | 'blacklisted' | 'suspended'
  blacklistReason?: string
  blacklistDate?: string
  blacklistedBy?: string
  createdAt: string
  updatedAt: string
  totalRentals: number
  totalSpent: number
  lastRental?: string
  averageRating?: number
  notes?: string
}

interface BlacklistEntry {
  id: string
  customerId: string
  customerName: string
  reason: string
  description?: string
  blacklistedBy: string
  blacklistDate: string
  severity: 'low' | 'medium' | 'high'
  canAppeal: boolean
  appealDeadline?: string
}

interface CustomerHistory {
  transactionId: string
  vehicleName: string
  vehicleId: string
  startDate: string
  endDate: string
  amount: number
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue'
  rating?: number
  feedback?: string
  damages?: string[]
  invoiceNumber: string
}

// Get all customers
customerRoutes.get('/', async (c) => {
  try {
    const customers = await kv.getByPrefix('customer_') || []
    
    // Sort by creation date, newest first
    const sortedCustomers = customers.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return c.json({ 
      success: true, 
      data: sortedCustomers
    })
  } catch (error) {
    console.log('Error fetching customers:', error)
    return c.json({ success: false, error: 'Failed to fetch customers' }, 500)
  }
})

// Get customer by ID
customerRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const customer = await kv.get(`customer_${id}`)
    
    if (!customer) {
      return c.json({ success: false, error: 'Customer not found' }, 404)
    }
    
    return c.json({ 
      success: true, 
      data: customer
    })
  } catch (error) {
    console.log('Error fetching customer:', error)
    return c.json({ success: false, error: 'Failed to fetch customer' }, 500)
  }
})

// Create new customer
customerRoutes.post('/', async (c) => {
  try {
    const customerData = await c.req.json()
    const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newCustomer: CustomerData = {
      id: customerId.replace('customer_', ''),
      ...customerData,
      status: 'active',
      totalRentals: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(customerId, newCustomer)
    
    return c.json({ 
      success: true, 
      data: newCustomer,
      message: 'Customer created successfully'
    })
  } catch (error) {
    console.log('Error creating customer:', error)
    return c.json({ success: false, error: 'Failed to create customer' }, 500)
  }
})

// Update customer
customerRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    const customerKey = `customer_${id}`
    
    const existingCustomer = await kv.get(customerKey)
    if (!existingCustomer) {
      return c.json({ success: false, error: 'Customer not found' }, 404)
    }
    
    const updatedCustomer = {
      ...existingCustomer,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(customerKey, updatedCustomer)
    
    return c.json({ 
      success: true, 
      data: updatedCustomer,
      message: 'Customer updated successfully'
    })
  } catch (error) {
    console.log('Error updating customer:', error)
    return c.json({ success: false, error: 'Failed to update customer' }, 500)
  }
})

// Get customer rental history
customerRoutes.get('/:id/history', async (c) => {
  try {
    const customerId = c.req.param('id')
    
    // Get all transactions and filter by customer
    const transactions = await kv.getByPrefix('transaction_') || []
    const customer = await kv.get(`customer_${customerId}`)
    
    if (!customer) {
      return c.json({ success: false, error: 'Customer not found' }, 404)
    }
    
    // Filter transactions for this customer
    const customerTransactions = transactions.filter((transaction: any) => 
      transaction.customerName === customer.name || 
      transaction.customerPhone === customer.phone
    )
    
    // Transform to history format
    const history: CustomerHistory[] = customerTransactions.map((transaction: any) => ({
      transactionId: transaction.id,
      vehicleName: transaction.vehicleName,
      vehicleId: transaction.vehicleId,
      startDate: transaction.createdAt, // In real app, this would be rental start date
      endDate: transaction.dueDate || transaction.createdAt,
      amount: transaction.amount,
      paymentStatus: transaction.paymentStatus,
      rating: transaction.rating,
      feedback: transaction.feedback,
      damages: transaction.damages || [],
      invoiceNumber: transaction.invoiceNumber
    }))
    
    // Sort by date, newest first
    const sortedHistory = history.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
    
    return c.json({ 
      success: true, 
      data: sortedHistory
    })
  } catch (error) {
    console.log('Error fetching customer history:', error)
    return c.json({ success: false, error: 'Failed to fetch customer history' }, 500)
  }
})

// Get all blacklisted customers
customerRoutes.get('/blacklist', async (c) => {
  try {
    const blacklistEntries = await kv.getByPrefix('blacklist_') || []
    
    // Sort by blacklist date, newest first
    const sortedBlacklist = blacklistEntries.sort((a, b) => 
      new Date(b.blacklistDate).getTime() - new Date(a.blacklistDate).getTime()
    )
    
    return c.json({ 
      success: true, 
      data: sortedBlacklist
    })
  } catch (error) {
    console.log('Error fetching blacklist:', error)
    return c.json({ success: false, error: 'Failed to fetch blacklist' }, 500)
  }
})

// Add customer to blacklist
customerRoutes.post('/blacklist', async (c) => {
  try {
    const blacklistData = await c.req.json()
    const blacklistId = `blacklist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Get customer data
    const customer = await kv.get(`customer_${blacklistData.customerId}`)
    if (!customer) {
      return c.json({ success: false, error: 'Customer not found' }, 404)
    }
    
    // Create blacklist entry
    const blacklistEntry: BlacklistEntry = {
      id: blacklistId.replace('blacklist_', ''),
      customerId: blacklistData.customerId,
      customerName: customer.name,
      reason: blacklistData.reason,
      description: blacklistData.description,
      blacklistedBy: blacklistData.blacklistedBy,
      blacklistDate: new Date().toISOString(),
      severity: blacklistData.severity,
      canAppeal: blacklistData.canAppeal,
      appealDeadline: blacklistData.canAppeal ? 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
    }
    
    await kv.set(blacklistId, blacklistEntry)
    
    // Update customer status
    const updatedCustomer = {
      ...customer,
      status: 'blacklisted',
      blacklistReason: blacklistData.reason,
      blacklistDate: blacklistEntry.blacklistDate,
      blacklistedBy: blacklistData.blacklistedBy,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`customer_${blacklistData.customerId}`, updatedCustomer)
    
    return c.json({ 
      success: true, 
      data: blacklistEntry,
      message: 'Customer added to blacklist successfully'
    })
  } catch (error) {
    console.log('Error adding to blacklist:', error)
    return c.json({ success: false, error: 'Failed to add customer to blacklist' }, 500)
  }
})

// Remove customer from blacklist
customerRoutes.delete('/blacklist/:customerId', async (c) => {
  try {
    const customerId = c.req.param('customerId')
    
    // Find and remove blacklist entry
    const blacklistEntries = await kv.getByPrefix('blacklist_') || []
    const blacklistEntry = blacklistEntries.find((entry: any) => entry.customerId === customerId)
    
    if (blacklistEntry) {
      await kv.del(`blacklist_${blacklistEntry.id}`)
    }
    
    // Update customer status
    const customer = await kv.get(`customer_${customerId}`)
    if (customer) {
      const updatedCustomer = {
        ...customer,
        status: 'active',
        blacklistReason: undefined,
        blacklistDate: undefined,
        blacklistedBy: undefined,
        updatedAt: new Date().toISOString()
      }
      
      await kv.set(`customer_${customerId}`, updatedCustomer)
    }
    
    return c.json({ 
      success: true, 
      message: 'Customer removed from blacklist successfully'
    })
  } catch (error) {
    console.log('Error removing from blacklist:', error)
    return c.json({ success: false, error: 'Failed to remove customer from blacklist' }, 500)
  }
})

// Update customer statistics (called when transactions are completed)
customerRoutes.post('/:id/update-stats', async (c) => {
  try {
    const customerId = c.req.param('id')
    const { rentalCount, totalSpent, lastRental, averageRating } = await c.req.json()
    
    const customer = await kv.get(`customer_${customerId}`)
    if (!customer) {
      return c.json({ success: false, error: 'Customer not found' }, 404)
    }
    
    const updatedCustomer = {
      ...customer,
      totalRentals: (customer.totalRentals || 0) + (rentalCount || 0),
      totalSpent: (customer.totalSpent || 0) + (totalSpent || 0),
      lastRental: lastRental || customer.lastRental,
      averageRating: averageRating || customer.averageRating,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`customer_${customerId}`, updatedCustomer)
    
    return c.json({ 
      success: true, 
      data: updatedCustomer,
      message: 'Customer statistics updated successfully'
    })
  } catch (error) {
    console.log('Error updating customer stats:', error)
    return c.json({ success: false, error: 'Failed to update customer statistics' }, 500)
  }
})

// Search customers
customerRoutes.get('/search/:query', async (c) => {
  try {
    const query = c.req.param('query').toLowerCase()
    const customers = await kv.getByPrefix('customer_') || []
    
    const filteredCustomers = customers.filter((customer: any) => 
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      (customer.email && customer.email.toLowerCase().includes(query)) ||
      (customer.companyName && customer.companyName.toLowerCase().includes(query))
    )
    
    return c.json({ 
      success: true, 
      data: filteredCustomers
    })
  } catch (error) {
    console.log('Error searching customers:', error)
    return c.json({ success: false, error: 'Failed to search customers' }, 500)
  }
})

// Get customer statistics
customerRoutes.get('/stats', async (c) => {
  try {
    const customers = await kv.getByPrefix('customer_') || []
    const blacklistEntries = await kv.getByPrefix('blacklist_') || []
    
    const stats = {
      totalCustomers: customers.length,
      activeCustomers: customers.filter((c: any) => c.status === 'active').length,
      blacklistedCustomers: customers.filter((c: any) => c.status === 'blacklisted').length,
      suspendedCustomers: customers.filter((c: any) => c.status === 'suspended').length,
      corporateCustomers: customers.filter((c: any) => c.customerType === 'corporate').length,
      individualCustomers: customers.filter((c: any) => c.customerType === 'individual').length,
      totalRevenue: customers.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0),
      totalRentals: customers.reduce((sum: number, c: any) => sum + (c.totalRentals || 0), 0),
      averageCustomerValue: customers.length > 0 ? 
        customers.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0) / customers.length : 0,
      customerDistribution: {
        vip: customers.filter((c: any) => (c.totalSpent || 0) > 5000000).length,
        premium: customers.filter((c: any) => (c.totalSpent || 0) > 2000000 && (c.totalSpent || 0) <= 5000000).length,
        loyal: customers.filter((c: any) => (c.totalRentals || 0) > 5 && (c.totalSpent || 0) <= 2000000).length,
        regular: customers.filter((c: any) => (c.totalRentals || 0) > 0 && (c.totalRentals || 0) <= 5).length,
        new: customers.filter((c: any) => (c.totalRentals || 0) === 0).length
      },
      blacklistStats: {
        total: blacklistEntries.length,
        canAppeal: blacklistEntries.filter((b: any) => b.canAppeal).length,
        highSeverity: blacklistEntries.filter((b: any) => b.severity === 'high').length,
        mediumSeverity: blacklistEntries.filter((b: any) => b.severity === 'medium').length,
        lowSeverity: blacklistEntries.filter((b: any) => b.severity === 'low').length
      }
    }
    
    return c.json({ 
      success: true, 
      data: stats
    })
  } catch (error) {
    console.log('Error fetching customer stats:', error)
    return c.json({ success: false, error: 'Failed to fetch customer statistics' }, 500)
  }
})

export default customerRoutes