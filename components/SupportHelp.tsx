import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { MessageCircle, Phone, Mail, Book, Search, Send, Clock, CheckCircle, AlertCircle, HelpCircle } from "lucide-react"
import { useAuth } from "./AuthContext"

interface SupportTicket {
  id: string
  subject: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  description: string
  createdAt: string
  updatedAt: string
  response?: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpfulCount: number
}

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'Bagaimana cara menambah kendaraan baru ke sistem?',
    answer: 'Untuk menambah kendaraan baru: \n1. Masuk ke menu "Inventaris Kendaraan" \n2. Klik tombol "Tambah Kendaraan" \n3. Isi semua informasi yang diperlukan (nama, plat nomor, kategori, tarif harian) \n4. Upload foto kendaraan \n5. Klik "Simpan" untuk menyelesaikan.',
    category: 'vehicle_management',
    helpfulCount: 25
  },
  {
    id: '2',
    question: 'Bagaimana cara memproses pembayaran pelanggan?',
    answer: 'Untuk memproses pembayaran: \n1. Buka menu "Transaksi" \n2. Pilih transaksi yang ingin diproses \n3. Klik "Tambah Pembayaran" \n4. Masukkan jumlah pembayaran dan metode \n5. Upload bukti transfer jika diperlukan \n6. Klik "Verifikasi Pembayaran"',
    category: 'transaction_management',
    helpfulCount: 18
  },
  {
    id: '3',
    question: 'Bagaimana cara mengirim reminder WhatsApp ke pelanggan?',
    answer: 'Untuk mengirim reminder WhatsApp: \n1. Masuk ke menu "Pengaturan Komunikasi" \n2. Pilih template pesan yang sesuai \n3. Atau gunakan fitur reminder otomatis di menu "Jadwal Sewa" \n4. Sistem akan mengirim reminder sesuai jadwal yang ditentukan',
    category: 'communication',
    helpfulCount: 32
  },
  {
    id: '4',
    question: 'Bagaimana cara melihat laporan keuangan?',
    answer: 'Untuk melihat laporan keuangan: \n1. Buka menu "Laporan Keuangan" \n2. Pilih jenis laporan (Ringkasan, Penjualan Rental, dll) \n3. Tentukan periode laporan \n4. Klik "Generate Laporan" \n5. Laporan dapat di-export ke PDF atau Excel',
    category: 'financial_reports',
    helpfulCount: 15
  },
  {
    id: '5',
    question: 'Bagaimana cara menambah user baru ke sistem?',
    answer: 'Untuk menambah user baru (khusus Owner/Admin): \n1. Masuk ke menu "Manajemen Pengguna" \n2. Klik "Tambah Pengguna" \n3. Isi data lengkap dan pilih peran (role) \n4. Tentukan hak akses sesuai kebutuhan \n5. Klik "Simpan" untuk membuat akun',
    category: 'user_management',
    helpfulCount: 12
  }
]

const mockTickets: SupportTicket[] = [
  {
    id: 'TCK-001',
    subject: 'Error saat upload foto kendaraan',
    category: 'technical_issue',
    priority: 'medium',
    status: 'in_progress',
    description: 'Tidak bisa upload foto kendaraan, muncul error "File too large"',
    createdAt: '2025-01-11T09:30:00Z',
    updatedAt: '2025-01-11T14:15:00Z',
    response: 'Tim support sedang menangani masalah ini. Pastikan ukuran file foto maksimal 5MB.'
  },
  {
    id: 'TCK-002',
    subject: 'Permintaan training untuk fitur baru',
    category: 'training_request',
    priority: 'low',
    status: 'open',
    description: 'Butuh training untuk penggunaan fitur manajemen pengguna yang baru',
    createdAt: '2025-01-10T16:20:00Z',
    updatedAt: '2025-01-10T16:20:00Z'
  }
]

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

const statusColors = {
  open: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
}

export function SupportHelp() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [supportForm, setSupportForm] = useState({
    subject: "",
    category: "",
    priority: "medium" as const,
    description: "",
    contactPreference: "whatsapp"
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  const categories = [
    { value: "all", label: "Semua Kategori" },
    { value: "vehicle_management", label: "Manajemen Kendaraan" },
    { value: "transaction_management", label: "Manajemen Transaksi" },
    { value: "customer_management", label: "Manajemen Pelanggan" },
    { value: "communication", label: "Komunikasi & WhatsApp" },
    { value: "financial_reports", label: "Laporan Keuangan" },
    { value: "user_management", label: "Manajemen Pengguna" },
    { value: "technical_issue", label: "Masalah Teknis" },
    { value: "training_request", label: "Permintaan Training" }
  ]

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleWhatsAppSupport = (category?: string) => {
    const supportNumber = "+628123456789" // Nomor WhatsApp support
    const message = category 
      ? `Halo, saya ${user?.name} dari sistem rental membutuhkan bantuan terkait ${category}. Mohon bantuannya.`
      : `Halo, saya ${user?.name} dari sistem rental membutuhkan bantuan. Mohon bantuannya.`
    
    const whatsappUrl = `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSubmitTicket = () => {
    // In real implementation, this would submit to API
    console.log('Support ticket submitted:', supportForm)
    
    // Send WhatsApp message with ticket details
    const supportNumber = "+628123456789"
    const message = `🎫 TIKET SUPPORT BARU

👤 Dari: ${user?.name}
📧 Email: ${user?.email}
🏷️ Kategori: ${supportForm.category}
⚡ Prioritas: ${supportForm.priority.toUpperCase()}
📝 Subjek: ${supportForm.subject}

Detail Masalah:
${supportForm.description}

Mohon ditindaklanjuti segera. Terima kasih.`

    const whatsappUrl = `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    setDialogOpen(false)
    setSupportForm({
      subject: "",
      category: "",
      priority: "medium",
      description: "",
      contactPreference: "whatsapp"
    })
  }

  const getRoleBasedHelp = () => {
    const roleHelp = {
      owner: [
        "Manajemen lengkap semua fitur sistem",
        "Analisis bisnis dan laporan komprehensif",
        "Pengaturan pengguna dan hak akses",
        "Konfigurasi sistem dan integrasi"
      ],
      manager: [
        "Monitoring operasional harian",
        "Laporan performa dan analisis",
        "Koordinasi tim dan driver",
        "Pengawasan transaksi"
      ],
      admin: [
        "Manajemen kendaraan dan jadwal",
        "Proses booking dan transaksi",
        "Koordinasi dengan pelanggan",
        "Update status kendaraan"
      ],
      cashier: [
        "Verifikasi dan proses pembayaran",
        "Generate invoice",
        "Laporan keuangan",
        "Monitoring piutang"
      ],
      customer_service: [
        "Layani pelanggan dan booking",
        "Kirim notifikasi WhatsApp",
        "Handle komplain pelanggan",
        "Update informasi sewa"
      ],
      financial_staff: [
        "Generate laporan keuangan",
        "Monitor cash flow",
        "Analisis profitabilitas",
        "Rekonsiliasi pembayaran"
      ]
    }

    return roleHelp[user?.role || 'admin'] || roleHelp.admin
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            Dukungan & Bantuan
          </h1>
          <p className="text-muted-foreground">
            Dapatkan bantuan langsung melalui WhatsApp dan akses dokumentasi sistem
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={() => handleWhatsAppSupport()} className="bg-green-600 hover:bg-green-700">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat WhatsApp
          </Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Buat Tiket Support
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Buat Tiket Support Baru</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Kategori Masalah</Label>
                    <Select value={supportForm.category} onValueChange={(value) => setSupportForm({...supportForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat.value !== "all").map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Tingkat Prioritas</Label>
                    <Select value={supportForm.priority} onValueChange={(value: any) => setSupportForm({...supportForm, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Rendah</SelectItem>
                        <SelectItem value="medium">Sedang</SelectItem>
                        <SelectItem value="high">Tinggi</SelectItem>
                        <SelectItem value="urgent">Mendesak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject">Subjek</Label>
                  <Input
                    id="subject"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                    placeholder="Ringkasan singkat masalah Anda"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Deskripsi Detail</Label>
                  <Textarea
                    id="description"
                    value={supportForm.description}
                    onChange={(e) => setSupportForm({...supportForm, description: e.target.value})}
                    placeholder="Jelaskan masalah secara detail..."
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSubmitTicket}>
                    Kirim via WhatsApp
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Support Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Kontak Support Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleWhatsAppSupport("technical")}
            >
              <MessageCircle className="h-6 w-6 text-green-600" />
              <div className="text-center">
                <div>WhatsApp Support</div>
                <div className="text-xs text-muted-foreground">Bantuan Teknis</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.open('tel:+628123456789')}
            >
              <Phone className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <div>Telepon</div>
                <div className="text-xs text-muted-foreground">08:00 - 20:00 WIB</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.open('mailto:support@rental-abc.com')}
            >
              <Mail className="h-6 w-6 text-purple-600" />
              <div className="text-center">
                <div>Email Support</div>
                <div className="text-xs text-muted-foreground">support@rental-abc.com</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guide">Panduan Peran</TabsTrigger>
          <TabsTrigger value="tickets">Tiket Saya</TabsTrigger>
          <TabsTrigger value="contact">Kontak</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pertanyaan yang Sering Diajukan (FAQ)</CardTitle>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari pertanyaan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span>{faq.question}</span>
                        <Badge variant="secondary" className="text-xs">
                          {faq.helpfulCount} helpful
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="whitespace-pre-line">{faq.answer}</div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              👍 Berguna
                            </Button>
                            <Button variant="outline" size="sm">
                              👎 Tidak Berguna
                            </Button>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleWhatsAppSupport(faq.category)}
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Tanya via WhatsApp
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3>Tidak ada FAQ yang ditemukan</h3>
                  <p className="text-muted-foreground mb-4">
                    Coba gunakan kata kunci yang berbeda atau hubungi support langsung
                  </p>
                  <Button onClick={() => handleWhatsAppSupport()}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat WhatsApp Support
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guide" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Panduan untuk {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ') : 'User'}</CardTitle>
              <p className="text-muted-foreground">
                Panduan khusus sesuai dengan peran Anda dalam sistem
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-3">Fitur Utama yang Tersedia:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getRoleBasedHelp().map((help, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{help}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="mb-3">Butuh Bantuan Spesifik?</h3>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleWhatsAppSupport(`training-${user?.role}`)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Request Training
                    </Button>
                    <Button variant="outline" onClick={() => handleWhatsAppSupport(`demo-${user?.role}`)}>
                      <Book className="h-4 w-4 mr-2" />
                      Demo Fitur
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tiket Support Saya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4>{ticket.subject}</h4>
                        <p className="text-sm text-muted-foreground">ID: {ticket.id}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={priorityColors[ticket.priority]}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                        <Badge className={statusColors[ticket.status]}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3">{ticket.description}</p>
                    
                    {ticket.response && (
                      <div className="bg-muted p-3 rounded-lg mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Response dari Support:</span>
                        </div>
                        <p className="text-sm">{ticket.response}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span>Dibuat: {new Date(ticket.createdAt).toLocaleDateString('id-ID')}</span>
                        <span>Update: {new Date(ticket.updatedAt).toLocaleDateString('id-ID')}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWhatsAppSupport(`followup-${ticket.id}`)}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Follow Up
                      </Button>
                    </div>
                  </div>
                ))}
                
                {mockTickets.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3>Belum ada tiket support</h3>
                    <p className="text-muted-foreground mb-4">
                      Ketika Anda mengajukan pertanyaan, tiket akan muncul di sini
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="mb-4">Kontak Langsung</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div>WhatsApp Support</div>
                        <div className="text-sm text-muted-foreground">+62 812-3456-789</div>
                        <div className="text-xs text-muted-foreground">24/7 Available</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <div>Telepon</div>
                        <div className="text-sm text-muted-foreground">+62 812-3456-789</div>
                        <div className="text-xs text-muted-foreground">08:00 - 20:00 WIB</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <div>
                        <div>Email</div>
                        <div className="text-sm text-muted-foreground">support@rental-abc.com</div>
                        <div className="text-xs text-muted-foreground">Response dalam 2-4 jam</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-4">Jam Operasional Support</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>WhatsApp Chat:</span>
                      <span>24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Telepon:</span>
                      <span>08:00 - 20:00 WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email Support:</span>
                      <span>08:00 - 17:00 WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technical Support:</span>
                      <span>24/7</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="mb-2">Response Time</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• WhatsApp: Langsung - 15 menit</div>
                      <div>• Masalah Urgent: &lt; 1 jam</div>
                      <div>• Masalah Teknis: 2-4 jam</div>
                      <div>• Pertanyaan Umum: 4-8 jam</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}