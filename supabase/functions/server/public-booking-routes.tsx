import { Hono } from 'npm:hono'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Types
interface PublicBookingData {
  bookingId: string
  vehicleId: string
  customerData: {
    fullName: string
    email: string
    phone: string
    idNumber: string
    address: string
    emergencyContact?: string
    emergencyPhone?: string
    notes?: string
  }
  bookingDetails: {
    serviceType: 'with_driver' | 'without_driver'
    startDate: string
    duration: number
    pickupTime: string
    location: string
  }
  locationDetails: {
    pickupLocation: string
    returnLocation: string
    pickupType: 'office' | 'custom'
    returnType: 'office' | 'custom'
  }
  pricing: {
    baseRate: number
    subtotal: number
    deliveryFee: number
    returnFee: number
    driverFee: number
    insuranceFee: number
    serviceFee: number
    totalBeforeTax: number
    tax: number
    total: number
  }
  status: 'pending_verification' | 'verified' | 'confirmed' | 'cancelled'
  source: 'public_portal'
  createdAt: string
}

// Create new public booking
app.post('/create', async (c) => {
  try {
    const bookingData: PublicBookingData = await c.req.json()
    
    console.log('Creating public booking:', bookingData.bookingId)
    
    // Validate required fields
    if (!bookingData.bookingId || !bookingData.vehicleId || !bookingData.customerData.fullName) {
      return c.json({ error: 'Missing required booking data' }, 400)
    }
    
    // Store booking in KV store with public booking prefix
    const bookingKey = `public_booking:${bookingData.bookingId}`
    await kv.set(bookingKey, bookingData)
    
    // Also store in transactions list for admin visibility
    const transactionData = {
      id: bookingData.bookingId,
      customer_name: bookingData.customerData.fullName,
      customer_email: bookingData.customerData.email,
      customer_phone: bookingData.customerData.phone,
      vehicle_id: bookingData.vehicleId,
      service_type: bookingData.bookingDetails.serviceType,
      rental_start: bookingData.bookingDetails.startDate,
      rental_duration: bookingData.bookingDetails.duration,
      pickup_time: bookingData.bookingDetails.pickupTime,
      pickup_location: bookingData.locationDetails.pickupLocation,
      return_location: bookingData.locationDetails.returnLocation,
      total_amount: bookingData.pricing.total,
      status: bookingData.status,
      payment_status: 'pending',
      payment_method: null,
      source: 'public_portal',
      created_at: bookingData.createdAt,
      updated_at: bookingData.createdAt,
      notes: bookingData.customerData.notes || '',
      pricing_breakdown: bookingData.pricing
    }
    
    // Store in transactions for admin system
    const transactionKey = `transaction:${bookingData.bookingId}`
    await kv.set(transactionKey, transactionData)
    
    // Add to customer database if new customer
    await createOrUpdateCustomer(bookingData.customerData)
    
    // Send confirmation notifications
    await sendBookingConfirmation(bookingData)
    
    // Update vehicle availability if needed
    await updateVehicleStatus(bookingData.vehicleId, 'reserved')
    
    console.log('Public booking created successfully:', bookingData.bookingId)
    
    return c.json({ 
      success: true, 
      bookingId: bookingData.bookingId,
      message: 'Booking created successfully' 
    })
  } catch (error) {
    console.error('Error creating public booking:', error)
    return c.json({ error: 'Failed to create booking' }, 500)
  }
})

// Get public booking by ID
app.get('/:bookingId', async (c) => {
  try {
    const bookingId = c.req.param('bookingId')
    const bookingKey = `public_booking:${bookingId}`
    const booking = await kv.get(bookingKey)
    
    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404)
    }
    
    return c.json({ booking })
  } catch (error) {
    console.error('Error fetching public booking:', error)
    return c.json({ error: 'Failed to fetch booking' }, 500)
  }
})

// Update booking status
app.put('/:bookingId/status', async (c) => {
  try {
    const bookingId = c.req.param('bookingId')
    const { status, notes } = await c.req.json()
    
    const bookingKey = `public_booking:${bookingId}`
    const booking = await kv.get(bookingKey)
    
    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404)
    }
    
    // Update booking status
    booking.status = status
    booking.updatedAt = new Date().toISOString()
    if (notes) booking.adminNotes = notes
    
    await kv.set(bookingKey, booking)
    
    // Also update transaction record
    const transactionKey = `transaction:${bookingId}`
    const transaction = await kv.get(transactionKey)
    if (transaction) {
      transaction.status = status
      transaction.updated_at = booking.updatedAt
      if (notes) transaction.admin_notes = notes
      await kv.set(transactionKey, transaction)
    }
    
    // Send status update notification
    await sendStatusUpdateNotification(booking, status)
    
    return c.json({ success: true, message: 'Booking status updated' })
  } catch (error) {
    console.error('Error updating booking status:', error)
    return c.json({ error: 'Failed to update booking status' }, 500)
  }
})

// Get all public bookings (for admin)
app.get('/', async (c) => {
  try {
    const bookings = await kv.getByPrefix('public_booking:')
    const sortedBookings = bookings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return c.json({ bookings: sortedBookings })
  } catch (error) {
    console.error('Error fetching public bookings:', error)
    return c.json({ error: 'Failed to fetch bookings' }, 500)
  }
})

// Helper function to create or update customer
async function createOrUpdateCustomer(customerData: any) {
  try {
    const customerKey = `customer:${customerData.phone}`
    let customer = await kv.get(customerKey)
    
    if (!customer) {
      // Create new customer
      customer = {
        id: `CUST-${Date.now()}`,
        name: customerData.fullName,
        email: customerData.email,
        phone: customerData.phone,
        id_number: customerData.idNumber,
        address: customerData.address,
        emergency_contact: customerData.emergencyContact || '',
        emergency_phone: customerData.emergencyPhone || '',
        status: 'active',
        source: 'public_portal',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_bookings: 1,
        notes: customerData.notes || ''
      }
      
      await kv.set(customerKey, customer)
      await kv.set(`customer:id:${customer.id}`, customer)
    } else {
      // Update existing customer
      customer.updated_at = new Date().toISOString()
      customer.total_bookings = (customer.total_bookings || 0) + 1
      customer.name = customerData.fullName // Update name if changed
      customer.email = customerData.email // Update email if changed
      
      await kv.set(customerKey, customer)
      await kv.set(`customer:id:${customer.id}`, customer)
    }
    
    return customer
  } catch (error) {
    console.error('Error creating/updating customer:', error)
    throw error
  }
}

// Helper function to send booking confirmation
async function sendBookingConfirmation(bookingData: PublicBookingData) {
  try {
    // Get WhatsApp settings
    const whatsappSettings = await kv.get('whatsapp_settings') || {
      enabled: true,
      business_phone: '+6281234567890',
      api_token: 'demo_token'
    }
    
    if (whatsappSettings.enabled) {
      const message = generateConfirmationMessage(bookingData)
      
      // In a real implementation, you would call WhatsApp Business API here
      console.log('Sending WhatsApp confirmation to:', bookingData.customerData.phone)
      console.log('Message:', message)
      
      // Store notification record
      const notificationKey = `notification:${bookingData.bookingId}:confirmation`
      await kv.set(notificationKey, {
        bookingId: bookingData.bookingId,
        type: 'whatsapp_confirmation',
        recipient: bookingData.customerData.phone,
        message: message,
        status: 'sent',
        sentAt: new Date().toISOString()
      })
    }
    
    // Send email confirmation (if email service is configured)
    console.log('Email confirmation would be sent to:', bookingData.customerData.email)
    
  } catch (error) {
    console.error('Error sending booking confirmation:', error)
    // Don't throw error as booking should still be created even if notification fails
  }
}

// Helper function to send status update notification
async function sendStatusUpdateNotification(booking: PublicBookingData, newStatus: string) {
  try {
    const statusMessages = {
      'verified': 'Dokumen Anda telah diverifikasi. Silakan lakukan pembayaran untuk konfirmasi booking.',
      'confirmed': 'Booking Anda telah dikonfirmasi! Kami akan menghubungi Anda untuk koordinasi pengambilan kendaraan.',
      'cancelled': 'Booking Anda telah dibatalkan. Jika ada pertanyaan, silakan hubungi customer service kami.'
    }
    
    const message = `Update Booking ${booking.bookingId}:\n\n${statusMessages[newStatus] || `Status booking Anda telah diubah menjadi ${newStatus}.`}\n\nTerima kasih.`
    
    console.log('Sending status update to:', booking.customerData.phone)
    console.log('Message:', message)
    
    // Store notification record
    const notificationKey = `notification:${booking.bookingId}:status_${newStatus}`
    await kv.set(notificationKey, {
      bookingId: booking.bookingId,
      type: 'status_update',
      recipient: booking.customerData.phone,
      message: message,
      status: 'sent',
      sentAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error sending status update notification:', error)
  }
}

// Helper function to update vehicle status
async function updateVehicleStatus(vehicleId: string, status: string) {
  try {
    const vehicleKey = `vehicle:${vehicleId}`
    const vehicle = await kv.get(vehicleKey)
    
    if (vehicle) {
      vehicle.status = status
      vehicle.updated_at = new Date().toISOString()
      await kv.set(vehicleKey, vehicle)
    }
  } catch (error) {
    console.error('Error updating vehicle status:', error)
  }
}

// Helper function to generate confirmation message
function generateConfirmationMessage(bookingData: PublicBookingData): string {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount)
  }
  
  return `🚗 KONFIRMASI BOOKING RENTAL MOBIL

ID Booking: ${bookingData.bookingId}

📋 DETAIL BOOKING:
• Nama: ${bookingData.customerData.fullName}
• Kendaraan: ${bookingData.vehicleId}
• Layanan: ${bookingData.bookingDetails.serviceType === 'with_driver' ? 'Dengan Sopir' : 'Tanpa Sopir'}
• Tanggal: ${new Date(bookingData.bookingDetails.startDate).toLocaleDateString('id-ID')}
• Durasi: ${bookingData.bookingDetails.duration} hari
• Waktu Jemput: ${bookingData.bookingDetails.pickupTime}

📍 LOKASI:
• Jemput: ${bookingData.locationDetails.pickupLocation}
• Kembali: ${bookingData.locationDetails.returnLocation}

💰 TOTAL PEMBAYARAN: ${formatCurrency(bookingData.pricing.total)}

✅ LANGKAH SELANJUTNYA:
1. Tim kami akan menghubungi Anda dalam 15-30 menit
2. Siapkan dokumen KTP dan SIM untuk verifikasi
3. Setelah verifikasi, lakukan pembayaran sesuai instruksi

Terima kasih telah memilih layanan kami! 🙏

Butuh bantuan? Balas pesan ini atau hubungi:
📞 Customer Service: (021) 1234-5678`
}

export default app