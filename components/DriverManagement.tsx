import { useState, useEffect } from "react"
import { User, UserCheck, UserX, Search, Plus, Eye, Edit, Clock, Car, MapPin, Phone, Mail, Calendar, DollarSign, Filter, MoreHorizontal, AlertCircle, CheckCircle, XCircle, Receipt, Activity, TrendingUp } from "lucide-react"
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
import { Progress } from "./ui/progress"
import { apiClient } from "../utils/api-client"

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
  status: 'available' | 'on_duty' | 'off_duty' | 'on_leave' | 'suspended' | 'maintenance'
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
}

interface DriverExpense {
  id: string
  driverId: string
  driverName: string
  date: string
  category: string
  description: string
  amount: number
  vehicleId?: string
  vehicleName?: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedDate?: string
  receipt?: string
  notes?: string
  type?: 'fuel' | 'toll' | 'parking' | 'meal' | 'maintenance' | 'other'
  location?: string
  receiptPhoto?: string
  reviewedBy?: string
  reviewNotes?: string
  submittedAt?: string
  reviewedAt?: string
  approvedAt?: string
}

interface DriverAssignment {
  id: string
  driverId: string
  driverName: string
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

export function DriverManagement() {
  const [drivers, setDrivers] = useState<DriverData[]>([])
  const [expenses, setExpenses] = useState<DriverExpense[]>([])
  const [assignments, setAssignments] = useState<DriverAssignment[]>([])
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null)
  const [selectedTab, setSelectedTab] = useState("drivers")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [isDriverDetailOpen, setIsDriverDetailOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingDriver, setEditingDriver] = useState<DriverData | null>(null)

  // Form states
  const [driverForm, setDriverForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    dateOfBirth: "",
    idNumber: "",
    drivingLicense: "",
    licenseExpiryDate: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: ""
  })

  const [expenseForm, setExpenseForm] = useState({
    driverId: "",
    type: "fuel" as const,
    amount: "",
    description: "",
    location: "",
    receiptPhoto: ""
  })

  useEffect(() => {
    loadDrivers()
    loadExpenses()
    loadAssignments()
  }, [])

  const loadDrivers = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get('/drivers')
      const driversData = Array.isArray(response.data) ? response.data : []
      // Ensure all drivers have required properties
      const validDrivers = driversData.filter(driver => 
        driver && 
        typeof driver.name === 'string' && 
        driver.name.length > 0
      )
      setDrivers(validDrivers)
    } catch (error) {
      console.error('Error loading drivers:', error)
      // Set empty array as fallback
      setDrivers([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadExpenses = async () => {
    try {
      const response = await apiClient.get('/drivers/expenses')
      const expensesData = Array.isArray(response.data) ? response.data : []
      // Filter out any invalid expense objects
      const validExpenses = expensesData.filter(expense => 
        expense && 
        expense.id && 
        expense.driverId && 
        expense.amount !== undefined
      )
      setExpenses(validExpenses)
    } catch (error) {
      console.error('Error loading driver expenses:', error)
      setExpenses([])
    }
  }

  const loadAssignments = async () => {
    try {
      const response = await apiClient.get('/drivers/assignments')
      const assignmentsData = Array.isArray(response.data) ? response.data : []
      // Filter out any invalid assignment objects
      const validAssignments = assignmentsData.filter(assignment => 
        assignment && 
        assignment.id && 
        assignment.driverId
      )
      setAssignments(validAssignments)
    } catch (error) {
      console.error('Error loading driver assignments:', error)
      setAssignments([])
    }
  }

  const handleCreateDriver = async () => {
    try {
      const newDriver = {
        ...driverForm,
        status: 'available',
        totalTrips: 0,
        totalEarnings: 0,
        totalExpenses: 0,
        joinDate: new Date().toISOString()
      }

      const response = await apiClient.post('/drivers', newDriver)
      
      if (response.data) {
        setDrivers([...drivers, response.data])
        setIsDriverDialogOpen(false)
        resetDriverForm()
      }
    } catch (error) {
      console.error('Error creating driver:', error)
    }
  }

  const handleUpdateDriver = async () => {
    if (!editingDriver) return

    try {
      const response = await apiClient.put(`/drivers/${editingDriver.id}`, driverForm)
      
      if (response.data) {
        setDrivers(drivers.map(d => 
          d.id === editingDriver.id ? response.data : d
        ))
        setIsDriverDialogOpen(false)
        setEditingDriver(null)
        resetDriverForm()
      }
    } catch (error) {
      console.error('Error updating driver:', error)
    }
  }

  const handleSubmitExpense = async () => {
    try {
      const expenseData = {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        date: new Date().toISOString().split('T')[0],
        submittedAt: new Date().toISOString(),
        status: 'pending'
      }

      const response = await apiClient.post('/drivers/expenses', expenseData)
      
      if (response.data) {
        setExpenses([...expenses, response.data])
        setIsExpenseDialogOpen(false)
        resetExpenseForm()
      }
    } catch (error) {
      console.error('Error submitting expense:', error)
    }
  }

  const handleUpdateDriverStatus = async (driverId: string, status: DriverData['status']) => {
    try {
      const response = await apiClient.put(`/drivers/${driverId}/status`, { status })
      
      if (response.data) {
        setDrivers(drivers.map(d => 
          d.id === driverId ? { ...d, status, lastActive: new Date().toISOString() } : d
        ))
      }
    } catch (error) {
      console.error('Error updating driver status:', error)
    }
  }

  const handleViewDriverDetails = async (driver: DriverData) => {
    setSelectedDriver(driver)
    setIsDriverDetailOpen(true)
  }

  const handleEditDriver = (driver: DriverData) => {
    setEditingDriver(driver)
    setDriverForm({
      name: driver.name,
      phone: driver.phone,
      email: driver.email || "",
      address: driver.address || "",
      dateOfBirth: driver.dateOfBirth || "",
      idNumber: driver.idNumber || "",
      drivingLicense: driver.drivingLicense,
      licenseExpiryDate: driver.licenseExpiryDate,
      emergencyContact: driver.emergencyContact || "",
      emergencyPhone: driver.emergencyPhone || "",
      notes: driver.notes || ""
    })
    setIsDriverDialogOpen(true)
  }

  const resetDriverForm = () => {
    setDriverForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      dateOfBirth: "",
      idNumber: "",
      drivingLicense: "",
      licenseExpiryDate: "",
      emergencyContact: "",
      emergencyPhone: "",
      notes: ""
    })
  }

  const resetExpenseForm = () => {
    setExpenseForm({
      driverId: "",
      type: "fuel",
      amount: "",
      description: "",
      location: "",
      receiptPhoto: ""
    })
  }

  const filteredDrivers = drivers.filter(driver => {
    if (!driver || !driver.name) return false
    
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (driver.phone && driver.phone.includes(searchTerm)) ||
                         (driver.email && driver.email.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: DriverData['status']) => {
    const statusConfig = {
      available: { label: 'Tersedia', variant: 'default' as const, icon: UserCheck },
      on_duty: { label: 'Bertugas', variant: 'default' as const, icon: Car },
      off_duty: { label: 'Off Duty', variant: 'secondary' as const, icon: Clock },
      on_leave: { label: 'Cuti', variant: 'secondary' as const, icon: Calendar },
      suspended: { label: 'Suspended', variant: 'destructive' as const, icon: UserX },
      maintenance: { label: 'Maintenance', variant: 'secondary' as const, icon: AlertCircle }
    }
    
    const config = statusConfig[status] || statusConfig.available
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getExpenseStatusBadge = (status: DriverExpense['status']) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
      approved: { label: 'Disetujui', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Ditolak', variant: 'destructive' as const, icon: XCircle }
    }
    
    const config = statusConfig[status]
    if (!config) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Unknown
        </Badge>
      )
    }
    
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getExpenseTypeLabel = (expense: DriverExpense | null | undefined) => {
    if (!expense) return 'Unknown'
    const type = expense.type || expense.category || 'other'
    const typeLabels = {
      fuel: 'Bahan Bakar',
      toll: 'Tol',
      parking: 'Parkir',
      meal: 'Makan',
      maintenance: 'Perawatan',
      other: 'Lainnya'
    }
    return typeLabels[type as keyof typeof typeLabels] || type || 'Unknown'
  }

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return 'Rp 0'
    }
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  const availableDriversCount = drivers.filter(d => d.status === 'available').length
  const onDutyDriversCount = drivers.filter(d => d.status === 'on_duty').length
  const pendingExpensesCount = expenses.filter(e => e && e.status === 'pending').length

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
          <h1 className="text-2xl font-semibold">Manajemen Sopir</h1>
          <p className="text-muted-foreground">
            Kelola sopir, ketersediaan, dan pengajuan pengeluaran
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Sopir
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingDriver ? 'Edit Sopir' : 'Tambah Sopir Baru'}
                </DialogTitle>
                <DialogDescription>
                  {editingDriver ? 'Perbarui informasi sopir' : 'Masukkan data sopir baru'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={driverForm.name}
                      onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                      placeholder="Nama lengkap sopir"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                      id="phone"
                      value={driverForm.phone}
                      onChange={(e) => setDriverForm({...driverForm, phone: e.target.value})}
                      placeholder="081234567890"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={driverForm.email}
                      onChange={(e) => setDriverForm({...driverForm, email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={driverForm.dateOfBirth}
                      onChange={(e) => setDriverForm({...driverForm, dateOfBirth: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    value={driverForm.address}
                    onChange={(e) => setDriverForm({...driverForm, address: e.target.value})}
                    placeholder="Alamat lengkap"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="drivingLicense">No. SIM</Label>
                    <Input
                      id="drivingLicense"
                      value={driverForm.drivingLicense}
                      onChange={(e) => setDriverForm({...driverForm, drivingLicense: e.target.value})}
                      placeholder="Nomor SIM"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiryDate">Tanggal Berakhir SIM</Label>
                    <Input
                      id="licenseExpiryDate"
                      type="date"
                      value={driverForm.licenseExpiryDate}
                      onChange={(e) => setDriverForm({...driverForm, licenseExpiryDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsDriverDialogOpen(false)
                  setEditingDriver(null)
                  resetDriverForm()
                }}>
                  Batal
                </Button>
                <Button onClick={editingDriver ? handleUpdateDriver : handleCreateDriver}>
                  {editingDriver ? 'Update' : 'Simpan'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sopir Tersedia</p>
                <p className="text-2xl font-semibold text-green-600">{availableDriversCount}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sedang Bertugas</p>
                <p className="text-2xl font-semibold text-blue-600">{onDutyDriversCount}</p>
              </div>
              <Car className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sopir</p>
                <p className="text-2xl font-semibold">{drivers.length}</p>
              </div>
              <User className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expense Pending</p>
                <p className="text-2xl font-semibold text-orange-600">{pendingExpensesCount}</p>
              </div>
              <Receipt className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="drivers">Daftar Sopir</TabsTrigger>
          <TabsTrigger value="expenses">Pengajuan Pengeluaran</TabsTrigger>
          <TabsTrigger value="assignments">Assignment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="space-y-4">
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
                <SelectItem value="available">Tersedia</SelectItem>
                <SelectItem value="on_duty">Bertugas</SelectItem>
                <SelectItem value="off_duty">Off Duty</SelectItem>
                <SelectItem value="on_leave">Cuti</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Driver List */}
          <div className="space-y-4">
            {filteredDrivers.map(driver => (
              <Card key={driver.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{driver.name}</h3>
                          {driver.rating && (
                            <span className="text-sm text-yellow-600">
                              ⭐ {driver.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {driver.phone}
                          </span>
                          {driver.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {driver.email}
                            </span>
                          )}
                        </div>
                        {driver.currentVehicleName && (
                          <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                            <Car className="h-3 w-3" />
                            {driver.currentVehicleName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(driver.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleViewDriverDetails(driver)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Detail Sopir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditDriver(driver)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Trip</p>
                      <p className="font-medium">{driver.totalTrips || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Earnings</p>
                      <p className="font-medium">{formatCurrency(driver.totalEarnings)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Expenses</p>
                      <p className="font-medium">{formatCurrency(driver.totalExpenses)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Join Date</p>
                      <p className="font-medium">
                        {driver.joinDate ? new Date(driver.joinDate).toLocaleDateString('id-ID') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredDrivers.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Tidak ada sopir yang ditemukan</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Pengajuan Pengeluaran Sopir</h2>
            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajukan Pengeluaran
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajukan Pengeluaran Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan detail pengeluaran untuk persetujuan
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="expenseDriverId">Sopir</Label>
                    <Select
                      value={expenseForm.driverId}
                      onValueChange={(value) => setExpenseForm({...expenseForm, driverId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih sopir" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map(driver => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expenseType">Jenis Pengeluaran</Label>
                    <Select
                      value={expenseForm.type}
                      onValueChange={(value: any) => setExpenseForm({...expenseForm, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fuel">Bahan Bakar</SelectItem>
                        <SelectItem value="toll">Tol</SelectItem>
                        <SelectItem value="parking">Parkir</SelectItem>
                        <SelectItem value="meal">Makan</SelectItem>
                        <SelectItem value="maintenance">Perawatan</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expenseAmount">Jumlah</Label>
                    <Input
                      id="expenseAmount"
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expenseDescription">Deskripsi</Label>
                    <Textarea
                      id="expenseDescription"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                      placeholder="Detail pengeluaran..."
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSubmitExpense}>
                    Ajukan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Sopir</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.filter(expense => expense != null).map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {expense.date ? new Date(expense.date).toLocaleDateString('id-ID') : 'N/A'}
                      </TableCell>
                      <TableCell>{expense.driverName || 'Unknown Driver'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getExpenseTypeLabel(expense)}</Badge>
                      </TableCell>
                      <TableCell>{expense.description || 'No description'}</TableCell>
                      <TableCell>{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>{getExpenseStatusBadge(expense.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Detail
                            </DropdownMenuItem>
                            {expense.status === 'pending' && (
                              <>
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Setujui
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Tolak
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {expenses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        Belum ada pengajuan pengeluaran
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Sopir</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sopir</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.filter(assignment => assignment != null).map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.driverName || 'Unknown Driver'}</TableCell>
                      <TableCell>{assignment.vehicleName || 'Unknown Vehicle'}</TableCell>
                      <TableCell>{assignment.customerName || 'N/A'}</TableCell>
                      <TableCell>
                        {assignment.startTime ? new Date(assignment.startTime).toLocaleString('id-ID') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={assignment.status === 'active' ? 'default' : assignment.status === 'completed' ? 'secondary' : 'destructive'}>
                          {assignment.status === 'active' ? 'Aktif' : 
                           assignment.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(assignment.earnings)}</TableCell>
                    </TableRow>
                  ))}
                  
                  {assignments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Belum ada assignment
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Tingkat Kehadiran</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} />
                  
                  <div className="flex justify-between items-center">
                    <span>Rating Rata-rata</span>
                    <span className="font-medium">4.7/5</span>
                  </div>
                  <Progress value={94} />
                  
                  <div className="flex justify-between items-center">
                    <span>Completion Rate</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <Progress value={96} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Tersedia</span>
                    </div>
                    <span>{availableDriversCount} sopir</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Bertugas</span>
                    </div>
                    <span>{onDutyDriversCount} sopir</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span>Off Duty</span>
                    </div>
                    <span>{drivers.filter(d => d.status === 'off_duty').length} sopir</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Driver Detail Dialog */}
      <Dialog open={isDriverDetailOpen} onOpenChange={setIsDriverDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Sopir</DialogTitle>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>
                    {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedDriver.name}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedDriver.status)}
                    {selectedDriver.rating && (
                      <span className="text-sm text-yellow-600">
                        ⭐ {selectedDriver.rating.toFixed(1)} rating
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Phone</Label>
                  <p>{selectedDriver.phone}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p>{selectedDriver.email || 'N/A'}</p>
                </div>
                <div>
                  <Label>SIM Expires</Label>
                  <p>{new Date(selectedDriver.licenseExpiryDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <Label>Join Date</Label>
                  <p>{new Date(selectedDriver.joinDate).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">{selectedDriver.totalTrips}</p>
                  <p className="text-xs text-muted-foreground">Total Trips</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(selectedDriver.totalEarnings)}</p>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(selectedDriver.totalExpenses)}</p>
                  <p className="text-xs text-muted-foreground">Total Expenses</p>
                </div>
              </div>
              
              {selectedDriver.notes && (
                <div>
                  <Label>Catatan</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedDriver.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}