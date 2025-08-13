import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, User, Plus, Search, Filter, Bell, Edit, Truck, ArrowRight } from "lucide-react"
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
import { apiClient } from "../utils/api-client"

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

export function ScheduleManagement() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [reminders, setReminders] = useState<ReminderData[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Form states
  const [bookingForm, setBookingForm] = useState({
    vehicleId: "",
    customerName: "",
    customerPhone: "",
    driverId: "",
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropoffLocation: "",
    notes: "",
    needsDelivery: false,
    deliveryTime: "",
    needsPickup: false,
    pickupTime: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [bookingsResponse, vehiclesResponse, remindersResponse] = await Promise.all([
        apiClient.get('/schedules/bookings'),
        apiClient.get('/vehicles'),
        apiClient.get('/schedules/reminders')
      ])

      setBookings(bookingsResponse.data || [])
      setVehicles(vehiclesResponse.data || [])
      setReminders(remindersResponse.data || [])

      // Load drivers (mock for now)
      const mockDrivers = [
        { id: '1', name: 'Ahmad Supri', phone: '081234567890', available: true },
        { id: '2', name: 'Budi Santoso', phone: '081234567891', available: true },
        { id: '3', name: 'Citra Dewi', phone: '081234567892', available: false },
        { id: '4', name: 'Dedi Rahman', phone: '081234567893', available: true },
      ]
      setDrivers(mockDrivers)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBooking = async () => {
    try {
      const newBooking = {
        ...bookingForm,
        totalPrice: calculatePrice(bookingForm.vehicleId, bookingForm.startDate, bookingForm.endDate),
        status: 'pending',
        deliveryScheduled: bookingForm.needsDelivery,
        pickupScheduled: bookingForm.needsPickup
      }

      const response = await apiClient.post('/schedules/bookings', newBooking)
      
      if (response.success) {
        setBookings([...bookings, response.data])
        setIsBookingDialogOpen(false)
        resetBookingForm()
      }
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  const handleUpdateBooking = async (bookingId: string, updates: Partial<BookingData>) => {
    try {
      const response = await apiClient.put(`/schedules/bookings/${bookingId}`, updates)
      
      if (response.success) {
        setBookings(bookings.map(booking => 
          booking.id === bookingId ? { ...booking, ...updates } : booking
        ))
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const handleExtendBooking = async (bookingId: string, newEndDate: string) => {
    await handleUpdateBooking(bookingId, { 
      endDate: newEndDate,
      status: 'active',
      updatedAt: new Date().toISOString()
    })
  }

  const handleAcknowledgeReminder = async (reminderId: string) => {
    try {
      await apiClient.put(`/schedules/reminders/${reminderId}`, { acknowledged: true })
      setReminders(reminders.map(reminder =>
        reminder.id === reminderId ? { ...reminder, acknowledged: true } : reminder
      ))
    } catch (error) {
      console.error('Error acknowledging reminder:', error)
    }
  }

  const calculatePrice = (vehicleId: string, startDate: string, endDate: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (!vehicle) return 0
    
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    return vehicle.dailyRate * days
  }

  const resetBookingForm = () => {
    setBookingForm({
      vehicleId: "",
      customerName: "",
      customerPhone: "",
      driverId: "",
      startDate: "",
      endDate: "",
      pickupLocation: "",
      dropoffLocation: "",
      notes: "",
      needsDelivery: false,
      deliveryTime: "",
      needsPickup: false,
      pickupTime: ""
    })
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: BookingData['status']) => {
    const statusConfig = {
      pending: { label: 'Menunggu', variant: 'secondary' as const },
      confirmed: { label: 'Dikonfirmasi', variant: 'default' as const },
      active: { label: 'Aktif', variant: 'default' as const },
      completed: { label: 'Selesai', variant: 'outline' as const },
      cancelled: { label: 'Dibatalkan', variant: 'destructive' as const },
      overdue: { label: 'Terlambat', variant: 'destructive' as const }
    }
    
    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getActiveReminders = () => reminders.filter(r => !r.acknowledged)

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
          <h1 className="text-2xl font-semibold">Manajemen Jadwal & Pemesanan</h1>
          <p className="text-muted-foreground">
            Kelola jadwal sewa, pemesanan, dan pengantaran kendaraan
          </p>
        </div>
        
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Buat Pemesanan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Buat Pemesanan Baru</DialogTitle>
              <DialogDescription>
                Isi detail pemesanan kendaraan untuk pelanggan
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Kendaraan</Label>
                  <Select 
                    value={bookingForm.vehicleId} 
                    onValueChange={(value) => setBookingForm({...bookingForm, vehicleId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kendaraan" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.filter(v => v.status === 'available').map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} - {vehicle.licensePlate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="driverId">Sopir (Opsional)</Label>
                  <Select 
                    value={bookingForm.driverId} 
                    onValueChange={(value) => setBookingForm({...bookingForm, driverId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tanpa sopir" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.filter(d => d.available).map(driver => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nama Pelanggan</Label>
                  <Input
                    id="customerName"
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({...bookingForm, customerName: e.target.value})}
                    placeholder="Masukkan nama pelanggan"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">No. Telepon</Label>
                  <Input
                    id="customerPhone"
                    value={bookingForm.customerPhone}
                    onChange={(e) => setBookingForm({...bookingForm, customerPhone: e.target.value})}
                    placeholder="Masukkan nomor telepon"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={bookingForm.startDate}
                    onChange={(e) => setBookingForm({...bookingForm, startDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={bookingForm.endDate}
                    onChange={(e) => setBookingForm({...bookingForm, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">Lokasi Penjemputan</Label>
                  <Input
                    id="pickupLocation"
                    value={bookingForm.pickupLocation}
                    onChange={(e) => setBookingForm({...bookingForm, pickupLocation: e.target.value})}
                    placeholder="Alamat penjemputan"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dropoffLocation">Lokasi Pengembalian</Label>
                  <Input
                    id="dropoffLocation"
                    value={bookingForm.dropoffLocation}
                    onChange={(e) => setBookingForm({...bookingForm, dropoffLocation: e.target.value})}
                    placeholder="Alamat pengembalian"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                  placeholder="Catatan tambahan..."
                />
              </div>

              {bookingForm.vehicleId && bookingForm.startDate && bookingForm.endDate && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Total Harga:</span>
                    <span className="font-semibold">
                      Rp {calculatePrice(bookingForm.vehicleId, bookingForm.startDate, bookingForm.endDate).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleCreateBooking}>
                Buat Pemesanan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reminders */}
      {getActiveReminders().length > 0 && (
        <div className="space-y-2">
          {getActiveReminders().map(reminder => (
            <Alert key={reminder.id}>
              <Bell className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{reminder.message}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAcknowledgeReminder(reminder.id)}
                >
                  Tandai Dibaca
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Kalender</TabsTrigger>
          <TabsTrigger value="bookings">Daftar Pemesanan</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
          <TabsTrigger value="delivery">Pengantaran</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Kalender Pemesanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-fit"
                />
                
                <div className="space-y-2">
                  <h4>Jadwal untuk {new Date(selectedDate).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</h4>
                  
                  {filteredBookings
                    .filter(booking => 
                      booking.startDate <= selectedDate && booking.endDate >= selectedDate
                    )
                    .map(booking => (
                      <Card key={booking.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium">{booking.customerName}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.vehicleName}
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="text-right text-sm">
                            <p>{booking.startDate} - {booking.endDate}</p>
                            <p className="text-muted-foreground">
                              Rp {booking.totalPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari pelanggan atau kendaraan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="overdue">Terlambat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {booking.customerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{booking.customerName}</h3>
                        <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Kendaraan</p>
                      <p className="font-medium">{booking.vehicleName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Periode</p>
                      <p className="font-medium">{booking.startDate} - {booking.endDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Harga</p>
                      <p className="font-medium">Rp {booking.totalPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lokasi</p>
                      <p className="font-medium">{booking.pickupLocation}</p>
                    </div>
                  </div>

                  {booking.status === 'active' && (
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <Button size="sm" variant="outline">
                        Perpanjang Sewa
                      </Button>
                      <Button size="sm" variant="outline">
                        Revisi Booking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pemesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings
                  .filter(b => b.status === 'completed' || b.status === 'cancelled')
                  .map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {booking.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.vehicleName} • {booking.startDate} - {booking.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(booking.status)}
                        <p className="text-sm text-muted-foreground mt-1">
                          Rp {booking.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Jadwal Pengantaran & Penjemputan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings
                  .filter(b => b.deliveryScheduled || b.pickupScheduled)
                  .map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Truck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">{booking.vehicleName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          {booking.pickupLocation}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {booking.deliveryTime || booking.pickupTime}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}