import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'

const supportRoutes = new Hono()

// Mock data for support tickets
const mockTickets = [
  {
    id: 'TCK-001',
    userId: '1',
    userName: 'Super Admin',
    userEmail: 'owner@demo.com',
    subject: 'Error saat upload foto kendaraan',
    category: 'technical_issue',
    priority: 'medium',
    status: 'in_progress',
    description: 'Tidak bisa upload foto kendaraan, muncul error "File too large"',
    createdAt: '2025-01-11T09:30:00Z',
    updatedAt: '2025-01-11T14:15:00Z',
    response: 'Tim support sedang menangani masalah ini. Pastikan ukuran file foto maksimal 5MB.',
    assignedTo: 'Support Team',
    whatsappSent: true
  },
  {
    id: 'TCK-002',
    userId: '2',
    userName: 'Admin Utama',
    userEmail: 'admin@demo.com',
    subject: 'Permintaan training untuk fitur baru',
    category: 'training_request',
    priority: 'low',
    status: 'open',
    description: 'Butuh training untuk penggunaan fitur manajemen pengguna yang baru',
    createdAt: '2025-01-10T16:20:00Z',
    updatedAt: '2025-01-10T16:20:00Z',
    assignedTo: 'Training Team',
    whatsappSent: true
  }
]

const mockFAQs = [
  {
    id: '1',
    question: 'Bagaimana cara menambah kendaraan baru ke sistem?',
    answer: 'Untuk menambah kendaraan baru: \n1. Masuk ke menu "Inventaris Kendaraan" \n2. Klik tombol "Tambah Kendaraan" \n3. Isi semua informasi yang diperlukan (nama, plat nomor, kategori, tarif harian) \n4. Upload foto kendaraan \n5. Klik "Simpan" untuk menyelesaikan.',
    category: 'vehicle_management',
    helpfulCount: 25,
    tags: ['kendaraan', 'tambah', 'inventaris'],
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z'
  },
  {
    id: '2',
    question: 'Bagaimana cara memproses pembayaran pelanggan?',
    answer: 'Untuk memproses pembayaran: \n1. Buka menu "Transaksi" \n2. Pilih transaksi yang ingin diproses \n3. Klik "Tambah Pembayaran" \n4. Masukkan jumlah pembayaran dan metode \n5. Upload bukti transfer jika diperlukan \n6. Klik "Verifikasi Pembayaran"',
    category: 'transaction_management',
    helpfulCount: 18,
    tags: ['pembayaran', 'transaksi', 'verifikasi'],
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-01-09T14:30:00Z'
  },
  {
    id: '3',
    question: 'Bagaimana cara mengirim reminder WhatsApp ke pelanggan?',
    answer: 'Untuk mengirim reminder WhatsApp: \n1. Masuk ke menu "Pengaturan Komunikasi" \n2. Pilih template pesan yang sesuai \n3. Atau gunakan fitur reminder otomatis di menu "Jadwal Sewa" \n4. Sistem akan mengirim reminder sesuai jadwal yang ditentukan',
    category: 'communication',
    helpfulCount: 32,
    tags: ['whatsapp', 'reminder', 'komunikasi', 'pelanggan'],
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-01-11T08:45:00Z'
  }
]

// Get all support tickets
supportRoutes.get('/tickets', async (c) => {
  try {
    let tickets = await kv.get('support_tickets')
    
    if (!tickets) {
      tickets = mockTickets
      await kv.set('support_tickets', tickets)
    }

    return c.json({ tickets, success: true })
  } catch (error) {
    console.log('Error fetching support tickets:', error)
    return c.json({ tickets: mockTickets, success: true })
  }
})

// Get tickets by user ID
supportRoutes.get('/tickets/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    let tickets = await kv.get('support_tickets') || mockTickets
    
    const userTickets = tickets.filter((ticket: any) => ticket.userId === userId)
    
    return c.json({ tickets: userTickets, success: true })
  } catch (error) {
    console.log('Error fetching user tickets:', error)
    return c.json({ tickets: [], success: true })
  }
})

// Create new support ticket
supportRoutes.post('/tickets', async (c) => {
  try {
    const ticketData = await c.req.json()
    let tickets = await kv.get('support_tickets') || mockTickets
    
    const newTicket = {
      id: `TCK-${String(tickets.length + 1).padStart(3, '0')}`,
      ...ticketData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      whatsappSent: true // Assuming WhatsApp integration
    }
    
    tickets.push(newTicket)
    await kv.set('support_tickets', tickets)
    
    return c.json({ ticket: newTicket, success: true, message: 'Support ticket created successfully' })
  } catch (error) {
    console.log('Error creating support ticket:', error)
    return c.json({ error: 'Failed to create support ticket', success: false }, 500)
  }
})

// Update support ticket
supportRoutes.put('/tickets/:id', async (c) => {
  try {
    const ticketId = c.req.param('id')
    const updateData = await c.req.json()
    let tickets = await kv.get('support_tickets') || mockTickets
    
    const ticketIndex = tickets.findIndex((ticket: any) => ticket.id === ticketId)
    if (ticketIndex === -1) {
      return c.json({ error: 'Ticket not found', success: false }, 404)
    }
    
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set('support_tickets', tickets)
    
    return c.json({ ticket: tickets[ticketIndex], success: true, message: 'Ticket updated successfully' })
  } catch (error) {
    console.log('Error updating support ticket:', error)
    return c.json({ error: 'Failed to update support ticket', success: false }, 500)
  }
})

// Get all FAQs
supportRoutes.get('/faq', async (c) => {
  try {
    let faqs = await kv.get('support_faqs')
    
    if (!faqs) {
      faqs = mockFAQs
      await kv.set('support_faqs', faqs)
    }

    return c.json({ faqs, success: true })
  } catch (error) {
    console.log('Error fetching FAQs:', error)
    return c.json({ faqs: mockFAQs, success: true })
  }
})

// Search FAQs
supportRoutes.get('/faq/search', async (c) => {
  try {
    const query = c.req.query('q') || ''
    const category = c.req.query('category') || 'all'
    
    let faqs = await kv.get('support_faqs') || mockFAQs
    
    let filteredFAQs = faqs.filter((faq: any) => {
      const matchesSearch = faq.question.toLowerCase().includes(query.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(query.toLowerCase()) ||
                           faq.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
      
      const matchesCategory = category === 'all' || faq.category === category
      
      return matchesSearch && matchesCategory
    })
    
    return c.json({ faqs: filteredFAQs, success: true })
  } catch (error) {
    console.log('Error searching FAQs:', error)
    return c.json({ faqs: [], success: true })
  }
})

// Mark FAQ as helpful
supportRoutes.post('/faq/:id/helpful', async (c) => {
  try {
    const faqId = c.req.param('id')
    let faqs = await kv.get('support_faqs') || mockFAQs
    
    const faqIndex = faqs.findIndex((faq: any) => faq.id === faqId)
    if (faqIndex === -1) {
      return c.json({ error: 'FAQ not found', success: false }, 404)
    }
    
    faqs[faqIndex].helpfulCount += 1
    faqs[faqIndex].updatedAt = new Date().toISOString()
    
    await kv.set('support_faqs', faqs)
    
    return c.json({ faq: faqs[faqIndex], success: true, message: 'Thank you for your feedback!' })
  } catch (error) {
    console.log('Error updating FAQ helpful count:', error)
    return c.json({ error: 'Failed to update FAQ', success: false }, 500)
  }
})

// Get support statistics
supportRoutes.get('/stats', async (c) => {
  try {
    let tickets = await kv.get('support_tickets') || mockTickets
    let faqs = await kv.get('support_faqs') || mockFAQs
    
    const stats = {
      totalTickets: tickets.length,
      openTickets: tickets.filter((t: any) => t.status === 'open').length,
      inProgressTickets: tickets.filter((t: any) => t.status === 'in_progress').length,
      resolvedTickets: tickets.filter((t: any) => t.status === 'resolved').length,
      closedTickets: tickets.filter((t: any) => t.status === 'closed').length,
      totalFAQs: faqs.length,
      avgResponseTime: '2.5 hours', // Mock data
      satisfactionScore: 4.7, // Mock data
      whatsappIntegration: true,
      supportContacts: {
        whatsapp: '+628123456789',
        phone: '+628123456789',
        email: 'support@rental-abc.com'
      }
    }
    
    return c.json({ stats, success: true })
  } catch (error) {
    console.log('Error fetching support stats:', error)
    return c.json({ error: 'Failed to fetch support stats', success: false }, 500)
  }
})

// Send WhatsApp message (mock implementation)
supportRoutes.post('/whatsapp/send', async (c) => {
  try {
    const { phoneNumber, message, ticketId } = await c.req.json()
    
    // Mock WhatsApp API integration
    // In real implementation, this would integrate with WhatsApp Business API
    const whatsappResponse = {
      messageId: `msg_${Date.now()}`,
      status: 'sent',
      timestamp: new Date().toISOString()
    }
    
    // If this is for a ticket, update the ticket
    if (ticketId) {
      let tickets = await kv.get('support_tickets') || mockTickets
      const ticketIndex = tickets.findIndex((t: any) => t.id === ticketId)
      
      if (ticketIndex !== -1) {
        tickets[ticketIndex].whatsappSent = true
        tickets[ticketIndex].updatedAt = new Date().toISOString()
        await kv.set('support_tickets', tickets)
      }
    }
    
    return c.json({ 
      whatsappResponse, 
      success: true, 
      message: 'WhatsApp message sent successfully' 
    })
  } catch (error) {
    console.log('Error sending WhatsApp message:', error)
    return c.json({ error: 'Failed to send WhatsApp message', success: false }, 500)
  }
})

export default supportRoutes