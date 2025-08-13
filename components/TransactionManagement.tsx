import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Alert, AlertDescription } from "./ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  MessageSquare,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Globe,
  User
} from "lucide-react"
import { apiClient } from "../utils/api-client"

interface Transaction {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  vehicle_id: string
  vehicle_info?: string
  service_type: "with_driver" | "without_driver"
  rental_start: string
  rental_duration: number
  pickup_time: string
  pickup_location: string
  return_location: string
  total_amount: number
  status: "pending" | "confirmed" | "completed" | "cancelled" | "pending_verification"
  payment_status: "pending" | "paid" | "refunded"
  payment_method?: string
  source: "admin" | "public_portal"
  created_at: string
  updated_at: string
  notes?: string
  admin_notes?: string
  pricing_breakdown?: any
}

export function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const [newTransaction, setNewTransaction] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    vehicle_id: "",
    service_type: "without_driver" as "with_driver" | "without_driver",
    rental_start: "",
    rental_duration: 1,
    pickup_time: "09:00",
    pickup_location: "",
    return_location: "",
    total_amount: 0,
    payment_method: "",
    notes: ""
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchTerm, statusFilter, sourceFilter])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getTransactions()
      setTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = transactions

    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customer_phone.includes(searchTerm) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.vehicle_info && transaction.vehicle_info.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.status === statusFilter)
    }

    if (sourceFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.source === sourceFilter)
    }

    setFilteredTransactions(filtered)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      pending_verification: { label: "Perlu Verifikasi", className: "bg-orange-100 text-orange-800" },
      confirmed: { label: "Terkonfirmasi", className: "bg-blue-100 text-blue-800" },
      completed: { label: "Selesai", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Dibatalkan", className: "bg-red-100 text-red-800" }
    }
    
    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Belum Bayar", className: "bg-yellow-100 text-yellow-800" },
      paid: { label: "Lunas", className: "bg-green-100 text-green-800" },
      refunded: { label: "Refund", className: "bg-blue-100 text-blue-800" }
    }
    
    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getSourceBadge = (source: string) => {
    const sourceConfig = {
      admin: { label: "Admin", icon: User, className: "bg-purple-100 text-purple-800" },
      public_portal: { label: "Portal Publik", icon: Globe, className: "bg-blue-100 text-blue-800" }
    }
    
    const config = sourceConfig[source] || { label: source, icon: User, className: "bg-gray-100 text-gray-800" }
    const Icon = config.icon
    
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleUpdateStatus = async (transactionId: string, newStatus: string, adminNotes?: string) => {
    try {
      // If it's a public booking, update via public booking API
      const transaction = transactions.find(t => t.id === transactionId)
      if (transaction?.source === "public_portal") {
        await apiClient.updatePublicBookingStatus(transactionId, newStatus, adminNotes)
      } else {
        // Update regular transaction
        await apiClient.updateTransaction(transactionId, { 
          status: newStatus, 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
      }
      
      // Refresh transactions
      await fetchTransactions()
      setShowTransactionDialog(false)
      
    } catch (error) {
      console.error("Error updating transaction status:", error)
      alert("Gagal mengupdate status transaksi")
    }
  }

  const handleCreateTransaction = async () => {
    try {
      const transactionData = {
        ...newTransaction,
        id: `TRX${Date.now()}`,
        status: "pending",
        payment_status: "pending",
        source: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      await apiClient.createTransaction(transactionData)
      await fetchTransactions()
      setShowCreateDialog(false)
      
      // Reset form
      setNewTransaction({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        vehicle_id: "",
        service_type: "without_driver",
        rental_start: "",
        rental_duration: 1,
        pickup_time: "09:00",
        pickup_location: "",
        return_location: "",
        total_amount: 0,
        payment_method: "",
        notes: ""
      })
      
    } catch (error) {
      console.error("Error creating transaction:", error)
      alert("Gagal membuat transaksi")
    }
  }

  const sendWhatsAppMessage = async (phone: string, transactionId: string) => {
    try {
      const message = `Halo! Ini adalah update mengenai booking Anda dengan ID: ${transactionId}. Tim kami akan segera menghubungi Anda untuk informasi lebih lanjut. Terima kasih!`
      
      await apiClient.sendWhatsAppMessage({
        phone,
        message,
        type: 'transaction_update'
      })
      
      alert("Pesan WhatsApp berhasil dikirim!")
    } catch (error) {
      console.error("Error sending WhatsApp message:", error)
      alert("Gagal mengirim pesan WhatsApp")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl">Manajemen Transaksi</h1>
          <p className="text-muted-foreground">
            Kelola semua transaksi rental kendaraan dari admin dan portal publik
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Transaksi Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Buat Transaksi Baru</DialogTitle>
              <DialogDescription>
                Tambahkan transaksi rental kendaraan baru
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="customer_name">Nama Pelanggan</Label>
                <Input
                  id="customer_name"
                  value={newTransaction.customer_name}
                  onChange={(e) => setNewTransaction(prev => ({...prev, customer_name: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="customer_phone">Nomor HP</Label>
                <Input
                  id="customer_phone"
                  value={newTransaction.customer_phone}
                  onChange={(e) => setNewTransaction(prev => ({...prev, customer_phone: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="customer_email">Email</Label>
                <Input
                  id="customer_email" 
                  type="email"
                  value={newTransaction.customer_email}
                  onChange={(e) => setNewTransaction(prev => ({...prev, customer_email: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="vehicle_id">ID Kendaraan</Label>
                <Input
                  id="vehicle_id"
                  value={newTransaction.vehicle_id}
                  onChange={(e) => setNewTransaction(prev => ({...prev, vehicle_id: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="service_type">Jenis Layanan</Label>
                <Select
                  value={newTransaction.service_type}
                  onValueChange={(value) => setNewTransaction(prev => ({...prev, service_type: value as "with_driver" | "without_driver"}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="without_driver">Tanpa Sopir</SelectItem>
                    <SelectItem value="with_driver">Dengan Sopir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rental_start">Tanggal Mulai</Label>
                <Input
                  id="rental_start"
                  type="date"
                  value={newTransaction.rental_start}
                  onChange={(e) => setNewTransaction(prev => ({...prev, rental_start: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="rental_duration">Durasi (Hari)</Label>
                <Input
                  id="rental_duration"
                  type="number"
                  min="1"
                  value={newTransaction.rental_duration}
                  onChange={(e) => setNewTransaction(prev => ({...prev, rental_duration: parseInt(e.target.value)}))}
                />
              </div>
              <div>
                <Label htmlFor="total_amount">Total Biaya</Label>
                <Input
                  id="total_amount"
                  type="number"
                  value={newTransaction.total_amount}
                  onChange={(e) => setNewTransaction(prev => ({...prev, total_amount: parseInt(e.target.value)}))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="pickup_location">Lokasi Jemput</Label>
                <Input
                  id="pickup_location"
                  value={newTransaction.pickup_location}
                  onChange={(e) => setNewTransaction(prev => ({...prev, pickup_location: e.target.value}))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={newTransaction.notes}
                  onChange={(e) => setNewTransaction(prev => ({...prev, notes: e.target.value}))}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Batal
              </Button>
              <Button type="button" onClick={handleCreateTransaction}>
                Buat Transaksi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                <p className="text-2xl">{transactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl">
                  {transactions.filter(t => t.status === 'pending' || t.status === 'pending_verification').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Selesai</p>
                <p className="text-2xl">
                  {transactions.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Globe className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Portal Publik</p>
                <p className="text-2xl">
                  {transactions.filter(t => t.source === 'public_portal').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari berdasarkan nama, ID, atau nomor HP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="pending_verification">Perlu Verifikasi</SelectItem>
                  <SelectItem value="confirmed">Terkonfirmasi</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter Sumber" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Sumber</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="public_portal">Portal Publik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Kendaraan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pembayaran</TableHead>
                  <TableHead>Sumber</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{transaction.customer_phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{transaction.vehicle_info || `Vehicle ${transaction.vehicle_id}`}</p>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.service_type === "with_driver" ? "Dengan Sopir" : "Tanpa Sopir"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.rental_start).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>{transaction.rental_duration} hari</TableCell>
                    <TableCell>{formatCurrency(transaction.total_amount)}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(transaction.payment_status)}</TableCell>
                    <TableCell>{getSourceBadge(transaction.source)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTransaction(transaction)
                              setShowTransactionDialog(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => sendWhatsAppMessage(transaction.customer_phone, transaction.id)}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Kirim WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Telepon
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Unduh PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada transaksi yang ditemukan</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
            <DialogDescription>
              Informasi lengkap transaksi {selectedTransaction?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informasi Pelanggan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Nama</Label>
                      <p>{selectedTransaction.customer_name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p>{selectedTransaction.customer_email}</p>
                    </div>
                    <div>
                      <Label>Nomor HP</Label>
                      <p>{selectedTransaction.customer_phone}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informasi Rental</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Kendaraan</Label>
                      <p>{selectedTransaction.vehicle_info || `Vehicle ${selectedTransaction.vehicle_id}`}</p>
                    </div>
                    <div>
                      <Label>Jenis Layanan</Label>
                      <Badge variant="secondary">
                        {selectedTransaction.service_type === "with_driver" ? "Dengan Sopir" : "Tanpa Sopir"}
                      </Badge>
                    </div>
                    <div>
                      <Label>Tanggal & Durasi</Label>
                      <p>{new Date(selectedTransaction.rental_start).toLocaleDateString('id-ID')} • {selectedTransaction.rental_duration} hari</p>
                    </div>
                    <div>
                      <Label>Lokasi Jemput</Label>
                      <p>{selectedTransaction.pickup_location}</p>
                    </div>
                    <div>
                      <Label>Lokasi Kembali</Label>
                      <p>{selectedTransaction.return_location}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Status & Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status & Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Status Transaksi</Label>
                      <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                    </div>
                    <div>
                      <Label>Status Pembayaran</Label>
                      <div className="mt-1">{getPaymentStatusBadge(selectedTransaction.payment_status)}</div>
                    </div>
                    <div>
                      <Label>Sumber</Label>
                      <div className="mt-1">{getSourceBadge(selectedTransaction.source)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Total Biaya</Label>
                    <p className="text-2xl text-green-600">{formatCurrency(selectedTransaction.total_amount)}</p>
                  </div>
                  
                  {/* Status Update Actions */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {selectedTransaction.status === "pending_verification" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedTransaction.id, "confirmed", "Dokumen telah diverifikasi")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verifikasi & Konfirmasi
                      </Button>
                    )}
                    
                    {selectedTransaction.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedTransaction.id, "completed", "Rental selesai")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Tandai Selesai
                      </Button>
                    )}
                    
                    {["pending", "pending_verification", "confirmed"].includes(selectedTransaction.status) && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateStatus(selectedTransaction.id, "cancelled", "Dibatalkan oleh admin")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Batalkan
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendWhatsAppMessage(selectedTransaction.customer_phone, selectedTransaction.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Kirim WhatsApp
                    </Button>
                  </div>
                  
                  {/* Notes */}
                  {(selectedTransaction.notes || selectedTransaction.admin_notes) && (
                    <div className="space-y-2 pt-4 border-t">
                      {selectedTransaction.notes && (
                        <div>
                          <Label>Catatan Pelanggan</Label>
                          <p className="text-sm text-muted-foreground">{selectedTransaction.notes}</p>
                        </div>
                      )}
                      {selectedTransaction.admin_notes && (
                        <div>
                          <Label>Catatan Admin</Label>
                          <p className="text-sm text-muted-foreground">{selectedTransaction.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowTransactionDialog(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}