import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'

const scheduleRoutes = new Hono()

// Data structure untuk bookings
interface BookingData {
  id: string
  vehicleId: string
  vehicleName: string
  customerName: string
  customerPhone: string
  driverId?: string
  driverName?: string
  startDate: string
  endDate: string
  pickupLocation: string
  dropoffLocation: string
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'overdue'
  totalPrice: number
  notes?: string
  deliveryScheduled?: boolean
  deliveryTime?: string
  pickupScheduled?: boolean
  pickupTime?: string
  createdAt: string
  updatedAt: string
}

interface ReminderData {
  id: string
  bookingId: string
  type: 'due_soon' | 'overdue' | 'delivery' | 'pickup'
  message: string
  dueDate: string
  acknowledged: boolean
}

// Get all bookings
scheduleRoutes.get('/bookings', async (c) => {
  try {
    const bookings = await kv.getByPrefix('booking_') || []
    
    // Sort by creation date, newest first
    const sortedBookings = bookings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return c.json({ 
      success: true, 
      data: sortedBookings
    })
  } catch (error) {
    console.log('Error fetching bookings:', error)
    return c.json({ success: false, error: 'Failed to fetch bookings' }, 500)
  }
})

// Get booking by ID
scheduleRoutes.get('/bookings/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const booking = await kv.get(`booking_${id}`)
    
    if (!booking) {
      return c.json({ success: false, error: 'Booking not found' }, 404)
    }
    
    return c.json({ 
      success: true, 
      data: booking
    })
  } catch (error) {
    console.log('Error fetching booking:', error)
    return c.json({ success: false, error: 'Failed to fetch booking' }, 500)
  }
})

// Create new booking
scheduleRoutes.post('/bookings', async (c) => {
  try {
    const bookingData = await c.req.json()
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Get vehicle details
    const vehicle = await kv.get(`vehicle_${bookingData.vehicleId}`)
    if (!vehicle) {
      return c.json({ success: false, error: 'Vehicle not found' }, 404)
    }
    
    // Check vehicle availability
    if (vehicle.status !== 'available') {
      return c.json({ success: false, error: 'Vehicle not available' }, 400)
    }
    
    const newBooking: BookingData = {
      id: bookingId.replace('booking_', ''),
      vehicleName: vehicle.name,
      ...bookingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(bookingId, newBooking)
    
    // Update vehicle status
    await kv.set(`vehicle_${bookingData.vehicleId}`, {
      ...vehicle,
      status: 'booked',
      lastBooking: bookingId,
      updatedAt: new Date().toISOString()
    })
    
    // Create reminders
    await createBookingReminders(newBooking)
    
    return c.json({ 
      success: true, 
      data: newBooking,
      message: 'Booking created successfully'
    })
  } catch (error) {
    console.log('Error creating booking:', error)
    return c.json({ success: false, error: 'Failed to create booking' }, 500)
  }
})

// Update booking
scheduleRoutes.put('/bookings/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    const bookingKey = `booking_${id}`
    
    const existingBooking = await kv.get(bookingKey)
    if (!existingBooking) {
      return c.json({ success: false, error: 'Booking not found' }, 404)
    }
    
    const updatedBooking = {
      ...existingBooking,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(bookingKey, updatedBooking)
    
    // If status changed to completed or cancelled, update vehicle status
    if (updates.status === 'completed' || updates.status === 'cancelled') {
      const vehicle = await kv.get(`vehicle_${existingBooking.vehicleId}`)
      if (vehicle) {
        await kv.set(`vehicle_${existingBooking.vehicleId}`, {
          ...vehicle,
          status: 'available',
          updatedAt: new Date().toISOString()
        })
      }
    }
    
    return c.json({ 
      success: true, 
      data: updatedBooking,
      message: 'Booking updated successfully'
    })
  } catch (error) {
    console.log('Error updating booking:', error)
    return c.json({ success: false, error: 'Failed to update booking' }, 500)
  }
})

// Delete booking
scheduleRoutes.delete('/bookings/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const bookingKey = `booking_${id}`
    
    const booking = await kv.get(bookingKey)
    if (!booking) {
      return c.json({ success: false, error: 'Booking not found' }, 404)
    }
    
    // Update vehicle status back to available
    const vehicle = await kv.get(`vehicle_${booking.vehicleId}`)
    if (vehicle) {
      await kv.set(`vehicle_${booking.vehicleId}`, {
        ...vehicle,
        status: 'available',
        updatedAt: new Date().toISOString()
      })
    }
    
    await kv.del(bookingKey)
    
    // Delete related reminders
    const reminders = await kv.getByPrefix('reminder_') || []
    for (const reminder of reminders) {
      if (reminder.bookingId === id) {
        await kv.del(`reminder_${reminder.id}`)
      }
    }
    
    return c.json({ 
      success: true, 
      message: 'Booking deleted successfully'
    })
  } catch (error) {
    console.log('Error deleting booking:', error)
    return c.json({ success: false, error: 'Failed to delete booking' }, 500)
  }
})

// Get reminders
scheduleRoutes.get('/reminders', async (c) => {
  try {
    const reminders = await kv.getByPrefix('reminder_') || []
    
    // Check for overdue bookings and create reminders
    const bookings = await kv.getByPrefix('booking_') || []
    const currentDate = new Date().toISOString().split('T')[0]
    
    for (const booking of bookings) {
      if (booking.status === 'active' && booking.endDate < currentDate) {
        // Create overdue reminder if not exists
        const overdueReminderId = `reminder_overdue_${booking.id}`
        const existingReminder = await kv.get(overdueReminderId)
        
        if (!existingReminder) {
          const overdueReminder: ReminderData = {
            id: overdueReminderId.replace('reminder_', ''),
            bookingId: booking.id,
            type: 'overdue',
            message: `Sewa kendaraan ${booking.vehicleName} untuk ${booking.customerName} sudah melewati batas waktu`,
            dueDate: booking.endDate,
            acknowledged: false
          }
          
          await kv.set(overdueReminderId, overdueReminder)
          reminders.push(overdueReminder)
        }
      }
    }
    
    return c.json({ 
      success: true, 
      data: reminders
    })
  } catch (error) {
    console.log('Error fetching reminders:', error)
    return c.json({ success: false, error: 'Failed to fetch reminders' }, 500)
  }
})

// Update reminder
scheduleRoutes.put('/reminders/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    const reminderKey = `reminder_${id}`
    
    const existingReminder = await kv.get(reminderKey)
    if (!existingReminder) {
      return c.json({ success: false, error: 'Reminder not found' }, 404)
    }
    
    const updatedReminder = {
      ...existingReminder,
      ...updates
    }
    
    await kv.set(reminderKey, updatedReminder)
    
    return c.json({ 
      success: true, 
      data: updatedReminder,
      message: 'Reminder updated successfully'
    })
  } catch (error) {
    console.log('Error updating reminder:', error)
    return c.json({ success: false, error: 'Failed to update reminder' }, 500)
  }
})

// Get booking statistics
scheduleRoutes.get('/stats', async (c) => {
  try {
    const bookings = await kv.getByPrefix('booking_') || []
    
    const stats = {
      total: bookings.length,
      active: bookings.filter(b => b.status === 'active').length,
      pending: bookings.filter(b => b.status === 'pending').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      overdue: bookings.filter(b => b.status === 'overdue').length,
      revenue: bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      monthlyBookings: getMonthlyBookings(bookings)
    }
    
    return c.json({ 
      success: true, 
      data: stats
    })
  } catch (error) {
    console.log('Error fetching booking stats:', error)
    return c.json({ success: false, error: 'Failed to fetch booking statistics' }, 500)
  }
})

// Helper function to create booking reminders
async function createBookingReminders(booking: BookingData) {
  const currentDate = new Date()
  const endDate = new Date(booking.endDate)
  const daysBefore = 3 // Remind 3 days before due date
  
  const reminderDate = new Date(endDate)
  reminderDate.setDate(reminderDate.getDate() - daysBefore)
  
  if (reminderDate > currentDate) {
    const reminder: ReminderData = {
      id: `due_soon_${booking.id}`,
      bookingId: booking.id,
      type: 'due_soon',
      message: `Sewa kendaraan ${booking.vehicleName} untuk ${booking.customerName} akan berakhir pada ${booking.endDate}`,
      dueDate: booking.endDate,
      acknowledged: false
    }
    
    await kv.set(`reminder_due_soon_${booking.id}`, reminder)
  }
  
  // Create delivery reminder if needed
  if (booking.deliveryScheduled && booking.deliveryTime) {
    const deliveryReminder: ReminderData = {
      id: `delivery_${booking.id}`,
      bookingId: booking.id,
      type: 'delivery',
      message: `Jadwal pengantaran kendaraan ${booking.vehicleName} ke ${booking.pickupLocation} pada ${booking.deliveryTime}`,
      dueDate: booking.startDate,
      acknowledged: false
    }
    
    await kv.set(`reminder_delivery_${booking.id}`, deliveryReminder)
  }
  
  // Create pickup reminder if needed
  if (booking.pickupScheduled && booking.pickupTime) {
    const pickupReminder: ReminderData = {
      id: `pickup_${booking.id}`,
      bookingId: booking.id,
      type: 'pickup',
      message: `Jadwal penjemputan kendaraan ${booking.vehicleName} dari ${booking.dropoffLocation} pada ${booking.pickupTime}`,
      dueDate: booking.endDate,
      acknowledged: false
    }
    
    await kv.set(`reminder_pickup_${booking.id}`, pickupReminder)
  }
}

// Helper function to get monthly booking statistics
function getMonthlyBookings(bookings: BookingData[]) {
  const monthlyStats = {}
  
  bookings.forEach(booking => {
    const month = booking.createdAt.substring(0, 7) // YYYY-MM format
    if (!monthlyStats[month]) {
      monthlyStats[month] = 0
    }
    monthlyStats[month]++
  })
  
  return monthlyStats
}

export default scheduleRoutes