import { mockSupportTickets, mockSupportFAQs } from './support-data'

export function handleSupportEndpoints(endpoint: string) {
  // Support endpoints
  if (endpoint === '/support/tickets') {
    return { success: true, tickets: mockSupportTickets }
  }
  
  if (endpoint.startsWith('/support/tickets/user/')) {
    const userId = endpoint.split('/').pop()
    const userTickets = mockSupportTickets.filter(ticket => ticket.userId === userId)
    return { success: true, tickets: userTickets }
  }
  
  if (endpoint === '/support/faq') {
    return { success: true, faqs: mockSupportFAQs }
  }
  
  if (endpoint.startsWith('/support/faq/search')) {
    // Mock search - in real implementation would parse query params
    return { success: true, faqs: mockSupportFAQs }
  }
  
  if (endpoint === '/support/stats') {
    const stats = {
      totalTickets: mockSupportTickets.length,
      openTickets: mockSupportTickets.filter(t => t.status === 'open').length,
      inProgressTickets: mockSupportTickets.filter(t => t.status === 'in_progress').length,
      resolvedTickets: mockSupportTickets.filter(t => t.status === 'resolved').length,
      closedTickets: mockSupportTickets.filter(t => t.status === 'closed').length,
      totalFAQs: mockSupportFAQs.length,
      avgResponseTime: '2.5 hours',
      satisfactionScore: 4.7,
      whatsappIntegration: true,
      supportContacts: {
        whatsapp: '+628123456789',
        phone: '+628123456789',
        email: 'support@rental-abc.com'
      }
    }
    return { success: true, stats }
  }

  return null
}

export function handleSupportPosts(endpoint: string, body: any) {
  // Support endpoints
  if (endpoint === '/support/tickets') {
    const newTicket = {
      id: `TCK-${String(mockSupportTickets.length + 1).padStart(3, '0')}`,
      ...body,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      whatsappSent: true
    }
    return { success: true, ticket: newTicket, message: 'Support ticket created successfully' }
  }
  
  if (endpoint === '/support/whatsapp/send') {
    const whatsappResponse = {
      messageId: `msg_${Date.now()}`,
      status: 'sent',
      timestamp: new Date().toISOString()
    }
    return { success: true, whatsappResponse, message: 'WhatsApp message sent successfully' }
  }
  
  if (endpoint.startsWith('/support/faq/') && endpoint.endsWith('/helpful')) {
    const faqId = endpoint.split('/')[3]
    return { success: true, message: 'Thank you for your feedback!' }
  }

  return null
}