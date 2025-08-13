import { useState, useEffect } from "react"
import { MessageSquare, Phone, Settings, Upload, Eye, Send, Bot, Palette, Globe, Camera, TestTube, Save, RefreshCw, Copy, Edit, Trash2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Switch } from "./ui/switch"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Alert, AlertDescription } from "./ui/alert"
import { Separator } from "./ui/separator"
import { toast } from "sonner@2.0.3"
import { apiClient } from "../utils/api-client"
import { ImageWithFallback } from "./figma/ImageWithFallback"

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

export function CommunicationSettings() {
  const [activeTab, setActiveTab] = useState("whatsapp")
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  // WhatsApp States
  const [senders, setSenders] = useState<WhatsAppSender[]>([])
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [assistantResponses, setAssistantResponses] = useState<AssistantResponse[]>([])
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    companyName: 'Rental Kendaraan ABC',
    logo: '',
    favicon: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    domain: 'rental-abc.com',
    subdomain: 'admin',
    tagline: 'Solusi Rental Terpercaya',
    address: 'Jl. Contoh No. 123, Jakarta',
    phone: '+62812345678',
    email: 'info@rental-abc.com',
    socialMedia: {
      whatsapp: '+62812345678',
      instagram: '@rental_abc',
      facebook: 'Rental ABC',
      website: 'https://rental-abc.com'
    }
  })

  // Form states
  const [selectedSender, setSelectedSender] = useState<WhatsAppSender | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null)
  const [selectedResponse, setSelectedResponse] = useState<AssistantResponse | null>(null)
  const [testMessage, setTestMessage] = useState({ phone: '', message: '' })
  const [previewTemplate, setPreviewTemplate] = useState('')

  useEffect(() => {
    loadCommunicationData()
  }, [])

  const loadCommunicationData = async () => {
    setIsLoading(true)
    try {
      const [sendersRes, templatesRes, responsesRes, brandRes] = await Promise.all([
        apiClient.get('/communication/senders'),
        apiClient.get('/communication/templates'),
        apiClient.get('/communication/assistant'),
        apiClient.get('/communication/brand')
      ])

      setSenders(sendersRes.data || [])
      setTemplates(templatesRes.data || [])
      setAssistantResponses(responsesRes.data || [])
      if (brandRes.data) {
        // Ensure socialMedia object exists with all required properties
        const mergedBrandSettings = {
          ...brandSettings,
          ...brandRes.data,
          socialMedia: {
            whatsapp: '',
            instagram: '',
            facebook: '',
            website: '',
            ...brandSettings.socialMedia,
            ...(brandRes.data.socialMedia || {})
          }
        }
        setBrandSettings(mergedBrandSettings)
      }
    } catch (error) {
      console.error('Error loading communication data:', error)
      toast.error('Failed to load communication settings')
    } finally {
      setIsLoading(false)
    }
  }

  // WhatsApp Sender Management (FR-KOM-002)
  const handleSaveSender = async (senderData: Partial<WhatsAppSender>) => {
    try {
      if (selectedSender) {
        const response = await apiClient.put(`/communication/senders/${selectedSender.id}`, senderData)
        setSenders(prev => prev.map(s => s.id === selectedSender.id ? response.data : s))
        toast.success('WhatsApp sender updated successfully')
      } else {
        const response = await apiClient.post('/communication/senders', senderData)
        setSenders(prev => [...prev, response.data])
        toast.success('WhatsApp sender added successfully')
      }
      setSelectedSender(null)
    } catch (error) {
      console.error('Error saving sender:', error)
      toast.error('Failed to save WhatsApp sender')
    }
  }

  const handleTestSender = async (senderId: string) => {
    try {
      await apiClient.post(`/communication/senders/${senderId}/test`, {
        phone: testMessage.phone,
        message: testMessage.message || 'Test message dari sistem rental'
      })
      toast.success('Test message sent successfully')
    } catch (error) {
      console.error('Error testing sender:', error)
      toast.error('Failed to send test message')
    }
  }

  const handleSetDefaultSender = async (senderId: string) => {
    try {
      await apiClient.post(`/communication/senders/${senderId}/set-default`)
      setSenders(prev => prev.map(s => ({ ...s, isDefault: s.id === senderId })))
      toast.success('Default sender updated')
    } catch (error) {
      console.error('Error setting default sender:', error)
      toast.error('Failed to set default sender')
    }
  }

  // Message Template Management (FR-KOM-001)
  const handleSaveTemplate = async (templateData: Partial<MessageTemplate>) => {
    try {
      if (selectedTemplate) {
        const response = await apiClient.put(`/communication/templates/${selectedTemplate.id}`, templateData)
        setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? response.data : t))
        toast.success('Message template updated successfully')
      } else {
        const response = await apiClient.post('/communication/templates', templateData)
        setTemplates(prev => [...prev, response.data])
        toast.success('Message template created successfully')
      }
      setSelectedTemplate(null)
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save message template')
    }
  }

  const generateTemplatePreview = (template: string) => {
    const sampleData = {
      customerName: 'Budi Santoso',
      vehicleName: 'Toyota Avanza Silver',
      rentalDate: '15 Januari 2025',
      returnDate: '17 Januari 2025',
      totalAmount: 'Rp 750.000',
      dueDate: '16 Januari 2025',
      remainingAmount: 'Rp 250.000',
      companyName: brandSettings.companyName || 'Rental Kendaraan ABC',
      phone: brandSettings.phone || '+62812345678',
      email: brandSettings.email || 'info@rental-abc.com',
      address: brandSettings.address || 'Jl. Merdeka No. 123, Jakarta',
      maintenanceDate: '20 Januari 2025'
    }

    let preview = template
    Object.entries(sampleData).forEach(([key, value]) => {
      if (value) {
        preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
      }
    })
    return preview
  }

  // Assistant Response Management (FR-KOM-003)
  const handleSaveResponse = async (responseData: Partial<AssistantResponse>) => {
    try {
      if (selectedResponse) {
        const response = await apiClient.put(`/communication/assistant/${selectedResponse.id}`, responseData)
        setAssistantResponses(prev => prev.map(r => r.id === selectedResponse.id ? response.data : r))
        toast.success('Assistant response updated successfully')
      } else {
        const response = await apiClient.post('/communication/assistant', responseData)
        setAssistantResponses(prev => [...prev, response.data])
        toast.success('Assistant response created successfully')
      }
      setSelectedResponse(null)
    } catch (error) {
      console.error('Error saving response:', error)
      toast.error('Failed to save assistant response')
    }
  }

  // Brand Customization (FR-KOM-004)
  const handleLogoUpload = async (file: File, type: 'logo' | 'favicon') => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await apiClient.post('/communication/brand/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setBrandSettings(prev => ({
        ...prev,
        [type]: response.data.url
      }))

      toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully`)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveBrandSettings = async () => {
    try {
      await apiClient.put('/communication/brand', brandSettings)
      toast.success('Brand settings saved successfully')
    } catch (error) {
      console.error('Error saving brand settings:', error)
      toast.error('Failed to save brand settings')
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'reminder': return 'bg-orange-100 text-orange-800'
      case 'confirmation': return 'bg-green-100 text-green-800'
      case 'payment': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-blue-100 text-blue-800'
      case 'greeting': return 'bg-purple-100 text-purple-800'
      case 'booking': return 'bg-cyan-100 text-cyan-800'
      case 'support': return 'bg-yellow-100 text-yellow-800'
      case 'faq': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Manajemen Komunikasi & Kustomisasi</h1>
          <p className="text-muted-foreground">
            Kelola WhatsApp, template pesan, asisten virtual, dan branding aplikasi
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="whatsapp">WhatsApp Settings</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="assistant">Virtual Assistant</TabsTrigger>
          <TabsTrigger value="branding">Brand Customization</TabsTrigger>
        </TabsList>

        {/* WhatsApp Settings Tab (FR-KOM-002) */}
        <TabsContent value="whatsapp" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  WhatsApp Senders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {senders.map((sender) => (
                    <div key={sender.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4>{sender.name}</h4>
                          {sender.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                          <Badge 
                            variant={sender.status === 'active' ? 'secondary' : 'outline'}
                            className={`text-xs ${
                              sender.status === 'active' ? 'bg-green-100 text-green-800' :
                              sender.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {sender.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {sender.phoneNumber}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          Usage: {sender.usedToday}/{sender.dailyLimit} messages today
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefaultSender(sender.id)}
                          disabled={sender.isDefault}
                        >
                          Set Default
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSender(sender)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={() => setSelectedSender({
                      id: '',
                      name: '',
                      phoneNumber: '',
                      apiKey: '',
                      status: 'inactive',
                      dailyLimit: 1000,
                      usedToday: 0,
                      isDefault: false,
                      createdAt: ''
                    } as WhatsAppSender)}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Sender
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Test WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="test-phone">Phone Number</Label>
                    <Input
                      id="test-phone"
                      placeholder="+628123456789"
                      value={testMessage.phone}
                      onChange={(e) => setTestMessage(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="test-message">Test Message</Label>
                    <Textarea
                      id="test-message"
                      placeholder="Enter test message..."
                      value={testMessage.message}
                      onChange={(e) => setTestMessage(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={() => senders.length > 0 && handleTestSender(senders[0].id)}
                    className="w-full"
                    disabled={!testMessage.phone}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Test Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Message Templates Tab (FR-KOM-001) */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Message Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4>{template.name}</h4>
                          <Badge className={getCategoryBadgeColor(template.category)} variant="secondary">
                            {template.category}
                          </Badge>
                          {template.isActive && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {template.subject}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          Variables: {template.variables.join(', ')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const preview = generateTemplatePreview(template.content)
                            setPreviewTemplate(preview)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={() => setSelectedTemplate({
                      id: '',
                      name: '',
                      category: 'general',
                      subject: '',
                      content: '',
                      variables: [],
                      isActive: true,
                      createdAt: ''
                    } as MessageTemplate)}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Template Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {previewTemplate ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">WhatsApp Preview</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{previewTemplate}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPreviewTemplate('')}
                    >
                      Clear Preview
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a template to preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <strong>Available Variables:</strong><br />
              {'{'}customerName{'}'}, {'{'}vehicleName{'}'}, {'{'}rentalDate{'}'}, {'{'}returnDate{'}'}, {'{'}totalAmount{'}'}, {'{'}dueDate{'}'}, {'{'}remainingAmount{'}'}, {'{'}companyName{'}'}, {'{'}phone{'}'}
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Virtual Assistant Tab (FR-KOM-003) */}
        <TabsContent value="assistant" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Assistant Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assistantResponses
                    .sort((a, b) => a.priority - b.priority)
                    .map((response) => (
                    <div key={response.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4>"{response.trigger}"</h4>
                          <Badge className={getCategoryBadgeColor(response.category)} variant="secondary">
                            {response.category}
                          </Badge>
                          {response.isActive && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {response.response}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          Priority: {response.priority}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedResponse(response)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={() => setSelectedResponse({
                      id: '',
                      trigger: '',
                      response: '',
                      category: 'greeting',
                      isActive: true,
                      priority: 5
                    } as AssistantResponse)}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Response
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Assistant Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertDescription>
                      <strong>How it works:</strong><br />
                      The virtual assistant automatically responds to customer messages based on triggers. Higher priority responses are checked first.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <h4>Response Categories:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• <span>Greeting:</span> Hello, hi, good morning</div>
                      <div>• <span>Booking:</span> Rental, book, available</div>
                      <div>• <span>Payment:</span> Pay, invoice, bill</div>
                      <div>• <span>Support:</span> Help, problem, issue</div>
                      <div>• <span>FAQ:</span> Price, location, hours</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4>Best Practices:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Use friendly and professional tone</li>
                      <li>• Include company contact information</li>
                      <li>• Provide clear next steps</li>
                      <li>• Keep responses concise but helpful</li>
                      <li>• Use variables for personalization</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Brand Customization Tab (FR-KOM-004) */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Brand Identity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={brandSettings.companyName}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, companyName: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={brandSettings.tagline}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <Input
                        id="primary-color"
                        type="color"
                        value={brandSettings.primaryColor}
                        onChange={(e) => setBrandSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <Input
                        id="secondary-color"
                        type="color"
                        value={brandSettings.secondaryColor}
                        onChange={(e) => setBrandSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={brandSettings.address}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={brandSettings.phone}
                        onChange={(e) => setBrandSettings(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={brandSettings.email}
                        onChange={(e) => setBrandSettings(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Media & Web
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={brandSettings.socialMedia.whatsapp}
                      onChange={(e) => setBrandSettings(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, whatsapp: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={brandSettings.socialMedia.instagram}
                      onChange={(e) => setBrandSettings(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={brandSettings.socialMedia.facebook}
                      onChange={(e) => setBrandSettings(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={brandSettings.socialMedia.website}
                      onChange={(e) => setBrandSettings(prev => ({ 
                        ...prev, 
                        socialMedia: { ...prev.socialMedia, website: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSaveBrandSettings}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Dialog Components */}
        {selectedSender && (
          <Dialog open={!!selectedSender} onOpenChange={() => setSelectedSender(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedSender.id ? 'Edit WhatsApp Sender' : 'Add New WhatsApp Sender'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sender-name">Sender Name</Label>
                  <Input
                    id="sender-name"
                    value={selectedSender.name}
                    onChange={(e) => setSelectedSender({ ...selectedSender, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sender-phone">Phone Number</Label>
                  <Input
                    id="sender-phone"
                    value={selectedSender.phoneNumber}
                    onChange={(e) => setSelectedSender({ ...selectedSender, phoneNumber: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sender-status">Status</Label>
                  <Select 
                    value={selectedSender.status} 
                    onValueChange={(value: any) => setSelectedSender({ ...selectedSender, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedSender(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSaveSender(selectedSender)}>
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Tabs>
    </div>
  )
}