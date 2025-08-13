import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'

const driverRoutes = new Hono()

// Data structures
interface DriverData {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  dateOfBirth?: string
  idNumber?: string
  drivingLicense: string
  licenseExpiryDate: string
  emergencyContact?: string
  emergencyPhone?: string
  status: 'available' | 'on_duty' | 'off_duty' | 'on_leave' | 'suspended'
  currentVehicleId?: string
  currentVehicleName?: string
  currentBookingId?: string
  joinDate: string
  lastActive?: string
  rating?: number
  totalTrips: number
  totalEarnings: number
  totalExpenses: number
  notes?: string
  location?: {
    lat: number
    lng: number
    address: string
    lastUpdated: string
  }
  createdAt: string
  updatedAt: string
}

interface DriverExpense {
  id: string
  driverId: string
  driverName: string
  type: 'fuel' | 'toll' | 'parking' | 'meal' | 'maintenance' | 'other'
  amount: number
  description: string
  location?: string
  date: string
  receiptPhoto?: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewNotes?: string
  submittedAt: string
  reviewedAt?: string
}

interface DriverAssignment {
  id: string
  driverId: string
  vehicleId: string
  vehicleName: string
  bookingId?: string
  customerName?: string
  startTime: string
  endTime?: string
  status: 'active' | 'completed' | 'cancelled'
  startLocation?: string
  endLocation?: string
  distance?: number
  earnings?: number
}

// Get all drivers
driverRoutes.get('/', async (c) => {
  try {
    const drivers = await kv.getByPrefix('driver_') || []
    
    // Sort by creation date, newest first
    const sortedDrivers = drivers.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return c.json({ 
      success: true, 
      data: sortedDrivers
    })
  } catch (error) {
    console.log('Error fetching drivers:', error)
    return c.json({ success: false, error: 'Failed to fetch drivers' }, 500)
  }
})

// Get driver by ID
driverRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const driver = await kv.get(`driver_${id}`)
    
    if (!driver) {
      return c.json({ success: false, error: 'Driver not found' }, 404)
    }
    
    return c.json({ 
      success: true, 
      data: driver
    })
  } catch (error) {
    console.log('Error fetching driver:', error)
    return c.json({ success: false, error: 'Failed to fetch driver' }, 500)
  }
})

// Create new driver
driverRoutes.post('/', async (c) => {
  try {
    const driverData = await c.req.json()
    const driverId = `driver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newDriver: DriverData = {
      id: driverId.replace('driver_', ''),
      ...driverData,
      status: 'available',
      totalTrips: 0,
      totalEarnings: 0,
      totalExpenses: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(driverId, newDriver)
    
    return c.json({ 
      success: true, 
      data: newDriver,
      message: 'Driver created successfully'
    })
  } catch (error) {
    console.log('Error creating driver:', error)
    return c.json({ success: false, error: 'Failed to create driver' }, 500)
  }
})

// Update driver
driverRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    const driverKey = `driver_${id}`
    
    const existingDriver = await kv.get(driverKey)
    if (!existingDriver) {
      return c.json({ success: false, error: 'Driver not found' }, 404)
    }
    
    const updatedDriver = {
      ...existingDriver,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(driverKey, updatedDriver)
    
    return c.json({ 
      success: true, 
      data: updatedDriver,
      message: 'Driver updated successfully'
    })
  } catch (error) {
    console.log('Error updating driver:', error)
    return c.json({ success: false, error: 'Failed to update driver' }, 500)
  }
})

// Update driver status
driverRoutes.put('/:id/status', async (c) => {
  try {
    const id = c.req.param('id')
    const { status } = await c.req.json()
    const driverKey = `driver_${id}`
    
    const existingDriver = await kv.get(driverKey)
    if (!existingDriver) {
      return c.json({ success: false, error: 'Driver not found' }, 404)
    }
    
    const updatedDriver = {
      ...existingDriver,
      status,
      lastActive: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(driverKey, updatedDriver)
    
    return c.json({ 
      success: true, 
      data: updatedDriver,
      message: 'Driver status updated successfully'
    })
  } catch (error) {
    console.log('Error updating driver status:', error)
    return c.json({ success: false, error: 'Failed to update driver status' }, 500)
  }
})

// Update driver location
driverRoutes.put('/:id/location', async (c) => {
  try {
    const id = c.req.param('id')
    const locationData = await c.req.json()
    const driverKey = `driver_${id}`
    
    const existingDriver = await kv.get(driverKey)
    if (!existingDriver) {
      return c.json({ success: false, error: 'Driver not found' }, 404)
    }
    
    const updatedDriver = {
      ...existingDriver,
      location: {
        ...locationData,
        lastUpdated: new Date().toISOString()
      },
      lastActive: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(driverKey, updatedDriver)
    
    return c.json({ 
      success: true, 
      data: updatedDriver,
      message: 'Driver location updated successfully'
    })
  } catch (error) {
    console.log('Error updating driver location:', error)
    return c.json({ success: false, error: 'Failed to update driver location' }, 500)
  }
})

// Get driver expenses
driverRoutes.get('/expenses', async (c) => {
  try {
    const expenses = await kv.getByPrefix('driver_expense_') || []
    
    // Sort by submission date, newest first
    const sortedExpenses = expenses.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    
    return c.json({ 
      success: true, 
      data: sortedExpenses
    })
  } catch (error) {
    console.log('Error fetching driver expenses:', error)
    return c.json({ success: false, error: 'Failed to fetch driver expenses' }, 500)
  }
})

// Submit driver expense
driverRoutes.post('/expenses', async (c) => {
  try {
    const expenseData = await c.req.json()
    const expenseId = `driver_expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Get driver data
    const driver = await kv.get(`driver_${expenseData.driverId}`)
    if (!driver) {
      return c.json({ success: false, error: 'Driver not found' }, 404)
    }
    
    const newExpense: DriverExpense = {
      id: expenseId.replace('driver_expense_', ''),
      driverId: expenseData.driverId,
      driverName: driver.name,
      type: expenseData.type,
      amount: expenseData.amount,
      description: expenseData.description,
      location: expenseData.location,
      date: expenseData.date,
      receiptPhoto: expenseData.receiptPhoto,
      status: 'pending',
      submittedAt: new Date().toISOString()
    }
    
    await kv.set(expenseId, newExpense)
    
    return c.json({ 
      success: true, 
      data: newExpense,
      message: 'Driver expense submitted successfully'
    })
  } catch (error) {
    console.log('Error submitting driver expense:', error)
    return c.json({ success: false, error: 'Failed to submit driver expense' }, 500)
  }
})

// Update expense status (for cashier approval)
driverRoutes.put('/expenses/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    const expenseKey = `driver_expense_${id}`
    
    const existingExpense = await kv.get(expenseKey)
    if (!existingExpense) {
      return c.json({ success: false, error: 'Expense not found' }, 404)
    }
    
    const updatedExpense = {
      ...existingExpense,
      ...updates,
      reviewedAt: new Date().toISOString()
    }
    
    await kv.set(expenseKey, updatedExpense)
    
    // Update driver's total expenses if approved
    if (updates.status === 'approved') {
      const driver = await kv.get(`driver_${existingExpense.driverId}`)
      if (driver) {
        const updatedDriver = {
          ...driver,
          totalExpenses: (driver.totalExpenses || 0) + existingExpense.amount,
          updatedAt: new Date().toISOString()
        }
        await kv.set(`driver_${existingExpense.driverId}`, updatedDriver)
      }
    }
    
    return c.json({ 
      success: true, 
      data: updatedExpense,
      message: 'Expense status updated successfully'
    })
  } catch (error) {
    console.log('Error updating expense status:', error)
    return c.json({ success: false, error: 'Failed to update expense status' }, 500)
  }
})

// Get driver assignments
driverRoutes.get('/assignments', async (c) => {
  try {
    const assignments = await kv.getByPrefix('driver_assignment_') || []
    
    // Sort by start time, newest first
    const sortedAssignments = assignments.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )
    
    return c.json({ 
      success: true, 
      data: sortedAssignments
    })
  } catch (error) {
    console.log('Error fetching driver assignments:', error)
    return c.json({ success: false, error: 'Failed to fetch driver assignments' }, 500)
  }
})

// Create driver assignment
driverRoutes.post('/assignments', async (c) => {
  try {
    const assignmentData = await c.req.json()
    const assignmentId = `driver_assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newAssignment: DriverAssignment = {
      id: assignmentId.replace('driver_assignment_', ''),
      ...assignmentData,
      startTime: assignmentData.startTime || new Date().toISOString(),
      status: 'active'
    }
    
    await kv.set(assignmentId, newAssignment)
    
    // Update driver status to on_duty and assign vehicle
    const driver = await kv.get(`driver_${assignmentData.driverId}`)
    if (driver) {
      const updatedDriver = {
        ...driver,
        status: 'on_duty',
        currentVehicleId: assignmentData.vehicleId,
        currentVehicleName: assignmentData.vehicleName,
        currentBookingId: assignmentData.bookingId,
        lastActive: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await kv.set(`driver_${assignmentData.driverId}`, updatedDriver)
    }
    
    return c.json({ 
      success: true, 
      data: newAssignment,
      message: 'Driver assignment created successfully'
    })
  } catch (error) {
    console.log('Error creating driver assignment:', error)
    return c.json({ success: false, error: 'Failed to create driver assignment' }, 500)
  }
})

// Complete driver assignment
driverRoutes.put('/assignments/:id/complete', async (c) => {
  try {
    const id = c.req.param('id')
    const completionData = await c.req.json()
    const assignmentKey = `driver_assignment_${id}`
    
    const existingAssignment = await kv.get(assignmentKey)
    if (!existingAssignment) {
      return c.json({ success: false, error: 'Assignment not found' }, 404)
    }
    
    const updatedAssignment = {
      ...existingAssignment,
      status: 'completed',
      endTime: new Date().toISOString(),
      ...completionData
    }
    
    await kv.set(assignmentKey, updatedAssignment)
    
    // Update driver status and stats
    const driver = await kv.get(`driver_${existingAssignment.driverId}`)
    if (driver) {
      const updatedDriver = {
        ...driver,
        status: 'available',
        currentVehicleId: undefined,
        currentVehicleName: undefined,
        currentBookingId: undefined,
        totalTrips: (driver.totalTrips || 0) + 1,
        totalEarnings: (driver.totalEarnings || 0) + (completionData.earnings || 0),
        lastActive: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await kv.set(`driver_${existingAssignment.driverId}`, updatedDriver)
    }
    
    return c.json({ 
      success: true, 
      data: updatedAssignment,
      message: 'Driver assignment completed successfully'
    })
  } catch (error) {
    console.log('Error completing driver assignment:', error)
    return c.json({ success: false, error: 'Failed to complete driver assignment' }, 500)
  }
})

// Get available drivers
driverRoutes.get('/available', async (c) => {
  try {
    const drivers = await kv.getByPrefix('driver_') || []
    const availableDrivers = drivers.filter(driver => driver.status === 'available')
    
    return c.json({ 
      success: true, 
      data: availableDrivers
    })
  } catch (error) {
    console.log('Error fetching available drivers:', error)
    return c.json({ success: false, error: 'Failed to fetch available drivers' }, 500)
  }
})

// Get driver statistics
driverRoutes.get('/stats', async (c) => {
  try {
    const drivers = await kv.getByPrefix('driver_') || []
    const expenses = await kv.getByPrefix('driver_expense_') || []
    const assignments = await kv.getByPrefix('driver_assignment_') || []
    
    const stats = {
      totalDrivers: drivers.length,
      availableDrivers: drivers.filter(d => d.status === 'available').length,
      onDutyDrivers: drivers.filter(d => d.status === 'on_duty').length,
      offDutyDrivers: drivers.filter(d => d.status === 'off_duty').length,
      onLeaveDrivers: drivers.filter(d => d.status === 'on_leave').length,
      suspendedDrivers: drivers.filter(d => d.status === 'suspended').length,
      totalTrips: drivers.reduce((sum, d) => sum + (d.totalTrips || 0), 0),
      totalEarnings: drivers.reduce((sum, d) => sum + (d.totalEarnings || 0), 0),
      totalExpenses: drivers.reduce((sum, d) => sum + (d.totalExpenses || 0), 0),
      averageRating: drivers.length > 0 ? 
        drivers.reduce((sum, d) => sum + (d.rating || 0), 0) / drivers.filter(d => d.rating).length : 0,
      expenseStats: {
        total: expenses.length,
        pending: expenses.filter(e => e.status === 'pending').length,
        approved: expenses.filter(e => e.status === 'approved').length,
        rejected: expenses.filter(e => e.status === 'rejected').length,
        totalAmount: expenses.filter(e => e.status === 'approved')
          .reduce((sum, e) => sum + e.amount, 0)
      },
      assignmentStats: {
        total: assignments.length,
        active: assignments.filter(a => a.status === 'active').length,
        completed: assignments.filter(a => a.status === 'completed').length,
        cancelled: assignments.filter(a => a.status === 'cancelled').length
      }
    }
    
    return c.json({ 
      success: true, 
      data: stats
    })
  } catch (error) {
    console.log('Error fetching driver stats:', error)
    return c.json({ success: false, error: 'Failed to fetch driver statistics' }, 500)
  }
})

// Search drivers
driverRoutes.get('/search/:query', async (c) => {
  try {
    const query = c.req.param('query').toLowerCase()
    const drivers = await kv.getByPrefix('driver_') || []
    
    const filteredDrivers = drivers.filter(driver => 
      driver.name.toLowerCase().includes(query) ||
      driver.phone.includes(query) ||
      (driver.email && driver.email.toLowerCase().includes(query)) ||
      driver.drivingLicense.toLowerCase().includes(query)
    )
    
    return c.json({ 
      success: true, 
      data: filteredDrivers
    })
  } catch (error) {
    console.log('Error searching drivers:', error)
    return c.json({ success: false, error: 'Failed to search drivers' }, 500)
  }
})

export default driverRoutes