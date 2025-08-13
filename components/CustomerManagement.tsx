import { useState, useEffect } from "react"
import { User, UserCheck, UserX, Search, Plus, Eye, Edit, AlertTriangle, CheckCircle, XCircle, Phone, Mail, Calendar, Car, DollarSign, Filter, MoreHorizontal, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Alert, AlertDescription } from "./ui/alert"
import { Separator } from "./ui/separator"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Switch } from "./ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { apiClient } from "../utils/api-client"

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

export function CustomerManagement() {
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null)
  const [customerHistory, setCustomerHistory] = useState<CustomerHistory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>("all")
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null)

  // Form states
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    dateOfBirth: "",
    idNumber: "",
    drivingLicense: "",
    emergencyContact: "",
    emergencyPhone: "",
    customerType: "individual" as const,
    companyName: "",
    notes: ""
  })

  const [blacklistForm, setBlacklistForm] = useState({
    customerId: "",
    reason: "",
    description: "",
    severity: "medium" as const,
    canAppeal: true
  })

  useEffect(() => {
    loadCustomers()
    loadBlacklist()
  }, [])

  const loadCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get('/customers')
      const customersData = Array.isArray(response.data) ? response.data : []
      // Ensure all customers have required properties
      const validCustomers = customersData.filter(customer => 
        customer && 
        typeof customer.name === 'string' && 
        customer.name.length > 0
      )
      setCustomers(validCustomers)
    } catch (error) {
      console.error('Error loading customers:', error)
      // Set mock data as fallback
      setCustomers([
        {
          id: "CUST001",
          name: "John Doe",
          email: "john@example.com",
          phone: "08123456789",
          address: "Jl. Sudirman No. 123, Jakarta",
          dateOfBirth: "1985-06-15",
          idNumber: "3201234567890123",
          drivingLicense: "12345678901234",
          emergencyContact: "Jane Doe",
          emergencyPhone: "08987654321",
          customerType: "individual" as const,
          companyName: "",
          status: "active" as const,
          blacklistReason: "",
          blacklistDate: "",
          blacklistedBy: "",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-20T14:30:00Z",
          totalRentals: 3,
          totalSpent: 2500000,
          lastRental: "2024-01-18T00:00:00Z",
          averageRating: 4.8,
          notes: "Pelanggan VIP"
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const loadBlacklist = async () => {
    try {
      const response = await apiClient.get('/customers/blacklist')
      setBlacklist(response.data || [])
    } catch (error) {
      console.error('Error loading blacklist:', error)
      // Set empty array as fallback
      setBlacklist([])
    }
  }

  const loadCustomerHistory = async (customerId: string) => {
    try {
      const response = await apiClient.get(`/customers/${customerId}/history`)
      setCustomerHistory(response.data || [])
    } catch (error) {
      console.error('Error loading customer history:', error)
    }
  }

  const handleCreateCustomer = async () => {
    try {
      const newCustomer = {
        ...customerForm,
        status: 'active',
        totalRentals: 0,
        totalSpent: 0
      }

      const response = await apiClient.post('/customers', newCustomer)
      
      if (response.success) {
        setCustomers([...customers, response.data])
        setIsCustomerDialogOpen(false)
        resetCustomerForm()
      }
    } catch (error) {
      console.error('Error creating customer:', error)
    }
  }

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return

    try {
      const response = await apiClient.put(`/customers/${editingCustomer.id}`, customerForm)
      
      if (response.success) {
        setCustomers(customers.map(c => 
          c.id === editingCustomer.id ? response.data : c
        ))
        setIsCustomerDialogOpen(false)
        setEditingCustomer(null)
        resetCustomerForm()
      }
    } catch (error) {
      console.error('Error updating customer:', error)
    }
  }

  const handleBlacklistCustomer = async () => {
    try {
      const blacklistData = {
        ...blacklistForm,
        blacklistedBy: 'Current User',
        blacklistDate: new Date().toISOString()
      }

      const response = await apiClient.post('/customers/blacklist', blacklistData)
      
      if (response.success) {
        // Update customer status
        setCustomers(customers.map(c => 
          c.id === blacklistForm.customerId 
            ? { ...c, status: 'blacklisted', blacklistReason: blacklistForm.reason }
            : c
        ))
        
        setBlacklist([...blacklist, response.data])
        setIsBlacklistDialogOpen(false)
        resetBlacklistForm()
      }
    } catch (error) {
      console.error('Error blacklisting customer:', error)
    }
  }

  const handleRemoveFromBlacklist = async (customerId: string) => {
    try {
      const response = await apiClient.delete(`/customers/blacklist/${customerId}`)
      
      if (response.success) {
        setCustomers(customers.map(c => 
          c.id === customerId ? { ...c, status: 'active', blacklistReason: undefined } : c
        ))
        
        setBlacklist(blacklist.filter(b => b.customerId !== customerId))
      }
    } catch (error) {
      console.error('Error removing from blacklist:', error)
    }
  }

  const handleViewHistory = async (customer: CustomerData) => {
    setSelectedCustomer(customer)
    await loadCustomerHistory(customer.id)
    setIsHistoryDialogOpen(true)
  }

  const handleEditCustomer = (customer: CustomerData) => {
    setEditingCustomer(customer)
    setCustomerForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "",
      dateOfBirth: customer.dateOfBirth || "",
      idNumber: customer.idNumber || "",
      drivingLicense: customer.drivingLicense || "",
      emergencyContact: customer.emergencyContact || "",
      emergencyPhone: customer.emergencyPhone || "",
      customerType: customer.customerType,
      companyName: customer.companyName || "",
      notes: customer.notes || ""
    })
    setIsCustomerDialogOpen(true)
  }

  const resetCustomerForm = () => {
    setCustomerForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      dateOfBirth: "",
      idNumber: "",
      drivingLicense: "",
      emergencyContact: "",
      emergencyPhone: "",
      customerType: "individual",
      companyName: "",
      notes: ""
    })
  }

  const resetBlacklistForm = () => {
    setBlacklistForm({
      customerId: "",
      reason: "",
      description: "",
      severity: "medium",
      canAppeal: true
    })
  }

  const filteredCustomers = customers.filter(customer => {
    if (!customer || !customer.name) return false
    
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.phone && customer.phone.includes(searchTerm)) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    const matchesType = customerTypeFilter === "all" || customer.customerType === customerTypeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: CustomerData['status']) => {
    const statusConfig = {
      active: { label: 'Aktif', variant: 'default' as const, icon: UserCheck },
      blacklisted: { label: 'Blacklist', variant: 'destructive' as const, icon: UserX },
      suspended: { label: 'Suspended', variant: 'secondary' as const, icon: Clock }
    }
    
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getSeverityBadge = (severity: BlacklistEntry['severity']) => {
    const severityConfig = {
      low: { label: 'Ringan', variant: 'secondary' as const },
      medium: { label: 'Sedang', variant: 'default' as const },
      high: { label: 'Tinggi', variant: 'destructive' as const }
    }
    
    const config = severityConfig[severity]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const calculateCustomerValue = (customer: CustomerData) => {
    if (customer.totalRentals === 0) return 'New'
    if (customer.totalSpent > 5000000) return 'VIP'
    if (customer.totalSpent > 2000000) return 'Premium'
    if (customer.totalRentals > 5) return 'Loyal'
    return 'Regular'
  }

  const getCustomerValueColor = (value: string) => {
    const colors = {
      'VIP': 'text-yellow-600',
      'Premium': 'text-purple-600',
      'Loyal': 'text-blue-600',
      'Regular': 'text-green-600',
      'New': 'text-gray-600'
    }
    return colors[value as keyof typeof colors] || 'text-gray-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen Pelanggan</h1>
          <p className="text-muted-foreground">
            Kelola data pelanggan, histori rental, dan blacklist
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Pelanggan Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
                </DialogTitle>
                <DialogDescription>
                  {editingCustomer ? 'Perbarui informasi pelanggan' : 'Masukkan data pelanggan baru'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerType">Tipe Pelanggan</Label>
                    <Select 
                      value={customerForm.customerType} 
                      onValueChange={(value: any) => setCustomerForm({...customerForm, customerType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama {customerForm.customerType === 'corporate' ? 'PIC' : 'Lengkap'}</Label>
                    <Input
                      id="name"
                      value={customerForm.name}
                      onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                      placeholder="Nama lengkap"
                    />
                  </div>
                </div>

                {customerForm.customerType === 'corporate' && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nama Perusahaan</Label>
                    <Input
                      id="companyName"
                      value={customerForm.companyName}
                      onChange={(e) => setCustomerForm({...customerForm, companyName: e.target.value})}
                      placeholder="Nama perusahaan"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                      id="phone"
                      value={customerForm.phone}
                      onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                      placeholder="081234567890"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerForm.email}
                      onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    value={customerForm.address}
                    onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
                    placeholder="Alamat lengkap"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={customerForm.dateOfBirth}
                      onChange={(e) => setCustomerForm({...customerForm, dateOfBirth: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">No. KTP/ID</Label>
                    <Input
                      id="idNumber"
                      value={customerForm.idNumber}
                      onChange={(e) => setCustomerForm({...customerForm, idNumber: e.target.value})}
                      placeholder="Nomor identitas"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drivingLicense">No. SIM</Label>
                  <Input
                    id="drivingLicense"
                    value={customerForm.drivingLicense}
                    onChange={(e) => setCustomerForm({...customerForm, drivingLicense: e.target.value})}
                    placeholder="Nomor SIM"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Kontak Darurat</Label>
                    <Input
                      id="emergencyContact"
                      value={customerForm.emergencyContact}
                      onChange={(e) => setCustomerForm({...customerForm, emergencyContact: e.target.value})}
                      placeholder="Nama kontak darurat"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">No. Kontak Darurat</Label>
                    <Input
                      id="emergencyPhone"
                      value={customerForm.emergencyPhone}
                      onChange={(e) => setCustomerForm({...customerForm, emergencyPhone: e.target.value})}
                      placeholder="081234567890"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    value={customerForm.notes}
                    onChange={(e) => setCustomerForm({...customerForm, notes: e.target.value})}
                    placeholder="Catatan tambahan..."
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCustomerDialogOpen(false)
                  setEditingCustomer(null)
                  resetCustomerForm()
                }}>
                  Batal
                </Button>
                <Button onClick={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}>
                  {editingCustomer ? 'Update' : 'Simpan'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Daftar Pelanggan</TabsTrigger>
          <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari nama, telepon, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="blacklisted">Blacklist</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer List */}
          <div className="space-y-4">
            {filteredCustomers.map(customer => {
              const customerValue = calculateCustomerValue(customer)
              return (
                <Card key={customer.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {customer.name ? customer.name.split(' ').map(n => n[0]).join('') : 'N/A'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{customer.name}</h3>
                            {customer.customerType === 'corporate' && (
                              <Badge variant="outline">Corporate</Badge>
                            )}
                            <span className={`text-sm ${getCustomerValueColor(customerValue)}`}>
                              {customerValue}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </span>
                            {customer.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {customer.email}
                              </span>
                            )}
                          </div>
                          {customer.companyName && (
                            <p className="text-sm text-muted-foreground">{customer.companyName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(customer.status)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleViewHistory(customer)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Histori
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Data
                            </DropdownMenuItem>
                            {customer.status === 'active' && (
                              <DropdownMenuItem 
                                onClick={() => {
                                  setBlacklistForm({...blacklistForm, customerId: customer.id})
                                  setIsBlacklistDialogOpen(true)
                                }}
                                className="text-destructive"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Blacklist
                              </DropdownMenuItem>
                            )}
                            {customer.status === 'blacklisted' && (
                              <DropdownMenuItem 
                                onClick={() => handleRemoveFromBlacklist(customer.id)}
                                className="text-green-600"
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Hapus dari Blacklist
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Rental</p>
                        <p className="font-medium">{customer.totalRentals}x</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Spent</p>
                        <p className="font-medium">Rp {customer.totalSpent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Rental</p>
                        <p className="font-medium">
                          {customer.lastRental ? new Date(customer.lastRental).toLocaleDateString('id-ID') : 'Belum pernah'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <p className="font-medium">
                          {customer.averageRating ? `${customer.averageRating.toFixed(1)}/5` : 'Belum ada'}
                        </p>
                      </div>
                    </div>

                    {customer.status === 'blacklisted' && customer.blacklistReason && (
                      <Alert className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Blacklisted:</strong> {customer.blacklistReason}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="blacklist" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isBlacklistDialogOpen} onOpenChange={setIsBlacklistDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <UserX className="h-4 w-4 mr-2" />
                  Tambah ke Blacklist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Blacklist Pelanggan</DialogTitle>
                  <DialogDescription>
                    Tambahkan pelanggan ke daftar blacklist dengan alasan yang jelas
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="blacklistCustomer">Pilih Pelanggan</Label>
                    <Select 
                      value={blacklistForm.customerId} 
                      onValueChange={(value) => setBlacklistForm({...blacklistForm, customerId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih pelanggan" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.filter(c => c.status === 'active').map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Alasan Blacklist</Label>
                    <Select 
                      value={blacklistForm.reason} 
                      onValueChange={(value) => setBlacklistForm({...blacklistForm, reason: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih alasan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment_default">Gagal Bayar</SelectItem>
                        <SelectItem value="vehicle_damage">Merusak Kendaraan</SelectItem>
                        <SelectItem value="late_return">Sering Terlambat</SelectItem>
                        <SelectItem value="fraudulent_docs">Dokumen Palsu</SelectItem>
                        <SelectItem value="inappropriate_behavior">Perilaku Tidak Pantas</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Tingkat Keparahan</Label>
                    <Select 
                      value={blacklistForm.severity} 
                      onValueChange={(value: any) => setBlacklistForm({...blacklistForm, severity: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Ringan</SelectItem>
                        <SelectItem value="medium">Sedang</SelectItem>
                        <SelectItem value="high">Tinggi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi Detail</Label>
                    <Textarea
                      id="description"
                      value={blacklistForm.description}
                      onChange={(e) => setBlacklistForm({...blacklistForm, description: e.target.value})}
                      placeholder="Jelaskan detail kejadian atau alasan blacklist..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="canAppeal"
                      checked={blacklistForm.canAppeal}
                      onCheckedChange={(checked) => setBlacklistForm({...blacklistForm, canAppeal: checked})}
                    />
                    <Label htmlFor="canAppeal">Izinkan banding dalam 30 hari</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBlacklistDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button variant="destructive" onClick={handleBlacklistCustomer}>
                    Blacklist Pelanggan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {blacklist.map(entry => {
              const customer = customers.find(c => c.id === entry.customerId)
              return (
                <Card key={entry.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {entry.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{entry.customerName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {customer?.phone} • Blacklisted: {new Date(entry.blacklistDate).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(entry.severity)}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFromBlacklist(entry.customerId)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Alasan:</p>
                        <p className="font-medium">{entry.reason}</p>
                      </div>
                      {entry.description && (
                        <div>
                          <p className="text-sm text-muted-foreground">Detail:</p>
                          <p className="text-sm">{entry.description}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Oleh: {entry.blacklistedBy}</span>
                        {entry.canAppeal && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <CheckCircle className="h-3 w-3" />
                            Dapat mengajukan banding
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Total Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customers.length}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {customers.filter(c => c.status === 'active').length} aktif • {customers.filter(c => c.status === 'blacklisted').length} blacklist
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total dari semua pelanggan
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Total Rental
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customers.reduce((sum, c) => sum + c.totalRentals, 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Transaksi rental selesai
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Value Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['VIP', 'Premium', 'Loyal', 'Regular', 'New'].map(value => {
                  const count = customers.filter(c => calculateCustomerValue(c) === value).length
                  const percentage = customers.length > 0 ? (count / customers.length) * 100 : 0
                  
                  return (
                    <div key={value} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getCustomerValueColor(value).replace('text-', 'bg-')}`}></div>
                        <span className="font-medium">{value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{count} pelanggan</span>
                        <span className="text-sm">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Customer History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Histori Pelanggan - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Riwayat transaksi rental dan feedback pelanggan
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {customerHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerHistory.map(history => (
                    <TableRow key={history.transactionId}>
                      <TableCell className="font-medium">{history.invoiceNumber}</TableCell>
                      <TableCell>{history.vehicleName}</TableCell>
                      <TableCell>
                        {new Date(history.startDate).toLocaleDateString('id-ID')} - {new Date(history.endDate).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>Rp {history.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={history.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                          {history.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {history.rating ? `${history.rating}/5` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada histori rental untuk pelanggan ini
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}