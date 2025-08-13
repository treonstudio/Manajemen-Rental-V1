import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'

const communicationRoutes = new Hono()

interface WhatsAppSender {
  id: string
  name: string
  phoneNumber: string
  apiKey: string
  status: 'active' | 'inactive' | 'testing'
  dailyLimit: number
  usedToday: number
  isDefault: boolean
  createdAt: string
}

interface MessageTemplate {
  id: string
  name: string
  category: 'reminder' | 'confirmation' | 'payment' | 'maintenance' | 'general'
  subject: string
  content: string
  variables: string[]
  isActive: boolean
  senderId?: string
  createdAt: string
}

interface AssistantResponse {
  id: string
  trigger: string
  response: string
  category: 'greeting' | 'booking' | 'payment' | 'support' | 'faq'
  isActive: boolean
  priority: number
}

interface BrandSettings {
  companyName: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  domain: string
  subdomain: string
  tagline: string
  address: string
  phone: string
  email: string
  socialMedia: {
    whatsapp: string
    instagram: string
    facebook: string
    website: string
  }
}

// WhatsApp Senders Management (FR-KOM-002)
communicationRoutes.get('/senders', async (c) => {
  try {
    const senders = await kv.getByPrefix('whatsapp_sender_') || []
    return c.json({ success: true, data: senders })
  } catch (error) {
    console.log('Error getting WhatsApp senders:', error)
    return c.json({ success: false, error: 'Failed to get WhatsApp senders' }, 500)
  }
})

communicationRoutes.post('/senders', async (c) => {
  try {
    const senderData = await c.req.json()
    const senderId = `whatsapp_sender_${Date.now()}`
    
    const newSender: WhatsAppSender = {
      id: senderId,
      name: senderData.name,
      phoneNumber: senderData.phoneNumber,
      apiKey: senderData.apiKey,
      status: senderData.status || 'inactive',
      dailyLimit: senderData.dailyLimit || 1000,
      usedToday: 0,
      isDefault: false,
      createdAt: new Date().toISOString()
    }

    // If this is the first sender, make it default
    const existingSenders = await kv.getByPrefix('whatsapp_sender_') || []
    if (existingSenders.length === 0) {
      newSender.isDefault = true
    }

    await kv.set(senderId, newSender)
    return c.json({ success: true, data: newSender })
  } catch (error) {
    console.log('Error creating WhatsApp sender:', error)
    return c.json({ success: false, error: 'Failed to create WhatsApp sender' }, 500)
  }
})

communicationRoutes.put('/senders/:id', async (c) => {
  try {
    const senderId = c.req.param('id')
    const updateData = await c.req.json()
    
    const sender = await kv.get(senderId)
    if (!sender) {
      return c.json({ success: false, error: 'Sender not found' }, 404)
    }

    const updatedSender = { ...sender, ...updateData }
    await kv.set(senderId, updatedSender)
    
    return c.json({ success: true, data: updatedSender })
  } catch (error) {
    console.log('Error updating WhatsApp sender:', error)
    return c.json({ success: false, error: 'Failed to update WhatsApp sender' }, 500)
  }
})

communicationRoutes.post('/senders/:id/set-default', async (c) => {
  try {
    const senderId = c.req.param('id')
    
    // Get all senders and update their default status
    const senders = await kv.getByPrefix('whatsapp_sender_') || []
    
    for (const sender of senders) {
      sender.isDefault = sender.id === senderId
      await kv.set(sender.id, sender)
    }
    
    return c.json({ success: true, message: 'Default sender updated' })
  } catch (error) {
    console.log('Error setting default sender:', error)
    return c.json({ success: false, error: 'Failed to set default sender' }, 500)
  }
})

communicationRoutes.post('/senders/:id/test', async (c) => {
  try {
    const senderId = c.req.param('id')
    const { phone, message } = await c.req.json()
    
    const sender = await kv.get(senderId)
    if (!sender || sender.status !== 'active') {
      return c.json({ success: false, error: 'Sender not available' }, 400)
    }

    // Mock WhatsApp API call
    // In production, integrate with actual WhatsApp Business API
    console.log(`Sending WhatsApp message via ${sender.phoneNumber} to ${phone}: ${message}`)
    
    // Update usage counter
    sender.usedToday += 1
    await kv.set(senderId, sender)
    
    return c.json({ success: true, message: 'Test message sent successfully' })
  } catch (error) {
    console.log('Error sending test message:', error)
    return c.json({ success: false, error: 'Failed to send test message' }, 500)
  }
})

// Message Templates Management (FR-KOM-001)
communicationRoutes.get('/templates', async (c) => {
  try {
    const templates = await kv.getByPrefix('message_template_') || []
    return c.json({ success: true, data: templates })
  } catch (error) {
    console.log('Error getting message templates:', error)
    return c.json({ success: false, error: 'Failed to get message templates' }, 500)
  }
})

communicationRoutes.post('/templates', async (c) => {
  try {
    const templateData = await c.req.json()
    const templateId = `message_template_${Date.now()}`
    
    const newTemplate: MessageTemplate = {
      id: templateId,
      name: templateData.name,
      category: templateData.category,
      subject: templateData.subject,
      content: templateData.content,
      variables: templateData.variables || [],
      isActive: templateData.isActive ?? true,
      senderId: templateData.senderId,
      createdAt: new Date().toISOString()
    }

    await kv.set(templateId, newTemplate)
    return c.json({ success: true, data: newTemplate })
  } catch (error) {
    console.log('Error creating message template:', error)
    return c.json({ success: false, error: 'Failed to create message template' }, 500)
  }
})

communicationRoutes.put('/templates/:id', async (c) => {
  try {
    const templateId = c.req.param('id')
    const updateData = await c.req.json()
    
    const template = await kv.get(templateId)
    if (!template) {
      return c.json({ success: false, error: 'Template not found' }, 404)
    }

    const updatedTemplate = { ...template, ...updateData }
    await kv.set(templateId, updatedTemplate)
    
    return c.json({ success: true, data: updatedTemplate })
  } catch (error) {
    console.log('Error updating message template:', error)
    return c.json({ success: false, error: 'Failed to update message template' }, 500)
  }
})

// WhatsApp Assistant Management (FR-KOM-003)
communicationRoutes.get('/assistant', async (c) => {
  try {
    const responses = await kv.getByPrefix('assistant_response_') || []
    return c.json({ success: true, data: responses })
  } catch (error) {
    console.log('Error getting assistant responses:', error)
    return c.json({ success: false, error: 'Failed to get assistant responses' }, 500)
  }
})

communicationRoutes.post('/assistant', async (c) => {
  try {
    const responseData = await c.req.json()
    const responseId = `assistant_response_${Date.now()}`
    
    const newResponse: AssistantResponse = {
      id: responseId,
      trigger: responseData.trigger,
      response: responseData.response,
      category: responseData.category,
      isActive: responseData.isActive ?? true,
      priority: responseData.priority || 5
    }

    await kv.set(responseId, newResponse)
    return c.json({ success: true, data: newResponse })
  } catch (error) {
    console.log('Error creating assistant response:', error)
    return c.json({ success: false, error: 'Failed to create assistant response' }, 500)
  }
})

communicationRoutes.put('/assistant/:id', async (c) => {
  try {
    const responseId = c.req.param('id')
    const updateData = await c.req.json()
    
    const response = await kv.get(responseId)
    if (!response) {
      return c.json({ success: false, error: 'Response not found' }, 404)
    }

    const updatedResponse = { ...response, ...updateData }
    await kv.set(responseId, updatedResponse)
    
    return c.json({ success: true, data: updatedResponse })
  } catch (error) {
    console.log('Error updating assistant response:', error)
    return c.json({ success: false, error: 'Failed to update assistant response' }, 500)
  }
})

// Brand Settings Management (FR-KOM-004)
communicationRoutes.get('/brand', async (c) => {
  try {
    const brandSettings = await kv.get('brand_settings')
    return c.json({ success: true, data: brandSettings })
  } catch (error) {
    console.log('Error getting brand settings:', error)
    return c.json({ success: false, error: 'Failed to get brand settings' }, 500)
  }
})

communicationRoutes.put('/brand', async (c) => {
  try {
    const brandData = await c.req.json()
    await kv.set('brand_settings', brandData)
    return c.json({ success: true, data: brandData })
  } catch (error) {
    console.log('Error updating brand settings:', error)
    return c.json({ success: false, error: 'Failed to update brand settings' }, 500)
  }
})

communicationRoutes.post('/brand/upload', async (c) => {
  try {
    // Mock file upload - in production, use Supabase Storage
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    
    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, 400)
    }

    // Mock URL generation
    const mockUrl = `https://example.com/uploads/${type}_${Date.now()}.${file.name.split('.').pop()}`
    
    return c.json({ success: true, data: { url: mockUrl } })
  } catch (error) {
    console.log('Error uploading brand asset:', error)
    return c.json({ success: false, error: 'Failed to upload brand asset' }, 500)
  }
})

// Send WhatsApp Message (Utility for other modules)
communicationRoutes.post('/send-message', async (c) => {
  try {
    const { phone, templateId, variables, senderId } = await c.req.json()
    
    // Get template
    const template = await kv.get(templateId)
    if (!template || !template.isActive) {
      return c.json({ success: false, error: 'Template not found or inactive' }, 400)
    }

    // Get sender
    let sender
    if (senderId) {
      sender = await kv.get(senderId)
    } else {
      // Use default sender
      const senders = await kv.getByPrefix('whatsapp_sender_') || []
      sender = senders.find(s => s.isDefault && s.status === 'active')
    }

    if (!sender) {
      return c.json({ success: false, error: 'No active sender available' }, 400)
    }

    // Replace variables in template
    let message = template.content
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), value as string)
      })
    }

    // Mock WhatsApp API call
    console.log(`Sending WhatsApp message via ${sender.phoneNumber} to ${phone}: ${message}`)
    
    // Update usage counter
    sender.usedToday += 1
    await kv.set(sender.id, sender)

    // Log message
    const messageLog = {
      id: `message_log_${Date.now()}`,
      senderId: sender.id,
      templateId,
      recipientPhone: phone,
      message,
      status: 'sent',
      sentAt: new Date().toISOString()
    }
    await kv.set(messageLog.id, messageLog)
    
    return c.json({ success: true, data: { messageId: messageLog.id, status: 'sent' } })
  } catch (error) {
    console.log('Error sending WhatsApp message:', error)
    return c.json({ success: false, error: 'Failed to send WhatsApp message' }, 500)
  }
})

// Process Incoming WhatsApp Message (for Assistant)
communicationRoutes.post('/webhook/whatsapp', async (c) => {
  try {
    const { phone, message } = await c.req.json()
    
    // Get all active assistant responses
    const responses = await kv.getByPrefix('assistant_response_') || []
    const activeResponses = responses
      .filter(r => r.isActive)
      .sort((a, b) => a.priority - b.priority)

    // Find matching response
    const messageLower = message.toLowerCase()
    let matchedResponse = null
    
    for (const response of activeResponses) {
      const triggers = response.trigger.toLowerCase().split(',').map(t => t.trim())
      if (triggers.some(trigger => messageLower.includes(trigger))) {
        matchedResponse = response
        break
      }
    }

    if (matchedResponse) {
      // Get brand settings for variable replacement
      const brandSettings = await kv.get('brand_settings')
      let reply = matchedResponse.response
      
      if (brandSettings) {
        reply = reply.replace(/{{companyName}}/g, brandSettings.companyName)
        reply = reply.replace(/{{phone}}/g, brandSettings.phone)
        reply = reply.replace(/{{email}}/g, brandSettings.email)
      }

      // Send reply using default sender
      const senders = await kv.getByPrefix('whatsapp_sender_') || []
      const defaultSender = senders.find(s => s.isDefault && s.status === 'active')
      
      if (defaultSender) {
        console.log(`Auto-replying to ${phone}: ${reply}`)
        
        // Log auto response
        const responseLog = {
          id: `auto_response_${Date.now()}`,
          phone,
          incomingMessage: message,
          response: reply,
          responseId: matchedResponse.id,
          sentAt: new Date().toISOString()
        }
        await kv.set(responseLog.id, responseLog)
        
        return c.json({ success: true, data: { reply, responded: true } })
      }
    }
    
    return c.json({ success: true, data: { responded: false } })
  } catch (error) {
    console.log('Error processing WhatsApp webhook:', error)
    return c.json({ success: false, error: 'Failed to process webhook' }, 500)
  }
})

export default communicationRoutes