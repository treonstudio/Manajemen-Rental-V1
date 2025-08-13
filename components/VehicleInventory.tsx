import { useState, useEffect } from "react"
import { apiClient } from "../utils/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Skeleton } from "./ui/skeleton"
import { Alert, AlertDescription } from "./ui/alert"
import { Plus, Edit, Trash2, Car, Info, Star, Calendar, Fuel, Settings, Eye } from "lucide-react"

interface Vehicle {
  id: string
  license_plate: string
  brand: string
  model: string
  year: number
  type: string
  category: string
  capacity: number
  fuel_type: string
  transmission: string
  daily_rate: number
  with_driver_rate: number
  status: "available" | "rented" | "maintenance"
  features: string[]
  rating: number
  total_reviews: number
  engine_capacity: string
  fuel_consumption: string
  max_speed: string
  color: string
  location: string
  last_maintenance: string
  insurance_type: string
  mileage: number
  condition: "excellent" | "good" | "fair" | "poor"
  created_at: string
  updated_at: string
  image_url?: string
  gallery_images?: string[]
}

const categories = ["ekonomi", "premium", "luxury"]
const vehicleTypes = ["MPV", "Sedan", "SUV", "Van", "Hatchback"]
const statuses = ["available", "rented", "maintenance"]

export function VehicleInventory() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      setApiError(null)
      const response = await apiClient.get('/vehicles')
      if (response.data && Array.isArray(response.data)) {
        setVehicles(response.data)
      } else {
        throw new Error('Invalid data structure')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setApiError(`Using demo data - ${errorMessage}`)
      // Fallback akan dihandle oleh mock API
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    if (!vehicle) return false
    
    const matchesCategory = filterCategory === "all" || vehicle.category === filterCategory
    const matchesStatus = filterStatus === "all" || vehicle.status === filterStatus
    
    // Safe string matching with null checks
    const matchesSearch = searchTerm === "" || [
      vehicle.brand || "",
      vehicle.model || "",
      vehicle.license_plate || ""
    ].some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      available: "default",
      rented: "secondary", 
      maintenance: "destructive"
    } as const

    const labels = {
      available: "Tersedia",
      rented: "Disewa",
      maintenance: "Maintenance"
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      ekonomi: "outline",
      premium: "default",
      luxury: "secondary"
    } as const

    const colors = {
      ekonomi: "text-green-600 bg-green-50",
      premium: "text-blue-600 bg-blue-50", 
      luxury: "text-purple-600 bg-purple-50"
    }

    return (
      <Badge variant={variants[category as keyof typeof variants]} className={colors[category as keyof typeof colors]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    )
  }

  const getConditionBadge = (condition: string) => {
    const colors = {
      excellent: "text-green-600 bg-green-50",
      good: "text-blue-600 bg-blue-50",
      fair: "text-yellow-600 bg-yellow-50",
      poor: "text-red-600 bg-red-50"
    }

    const labels = {
      excellent: "Sangat Baik",
      good: "Baik", 
      fair: "Cukup",
      poor: "Buruk"
    }

    return (
      <Badge variant="outline" className={colors[condition as keyof typeof colors]}>
        {labels[condition as keyof typeof labels]}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsDetailDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Inventaris Kendaraan
            <Badge variant="outline" className="ml-auto">
              {vehicles.length} Unit
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiError && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Cari kendaraan, merek, atau plat nomor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="available">Tersedia</SelectItem>
                <SelectItem value="rented">Disewa</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kendaraan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tambah Kendaraan Baru</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  <div>
                    <Label htmlFor="brand">Merek</Label>
                    <Input id="brand" placeholder="Toyota" />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" placeholder="Avanza" />
                  </div>
                  <div>
                    <Label htmlFor="license_plate">Plat Nomor</Label>
                    <Input id="license_plate" placeholder="B 1234 ABC" />
                  </div>
                  <div>
                    <Label htmlFor="year">Tahun</Label>
                    <Input id="year" type="number" placeholder="2023" />
                  </div>
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Tipe</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="capacity">Kapasitas</Label>
                    <Input id="capacity" type="number" placeholder="7" />
                  </div>
                  <div>
                    <Label htmlFor="fuel_type">Bahan Bakar</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bahan bakar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bensin">Bensin</SelectItem>
                        <SelectItem value="solar">Solar</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="daily_rate">Tarif Harian</Label>
                    <Input id="daily_rate" type="number" placeholder="300000" />
                  </div>
                  <div>
                    <Label htmlFor="with_driver_rate">Tarif + Sopir</Label>
                    <Input id="with_driver_rate" type="number" placeholder="450000" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="features">Fitur (pisahkan dengan koma)</Label>
                    <Textarea id="features" placeholder="AC, Audio System, Power Steering" />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Button onClick={() => setIsAddDialogOpen(false)}>Simpan</Button>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kendaraan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Kapasitas</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Tarif Harian</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                          <div className="text-sm text-muted-foreground">{vehicle.license_plate} • {vehicle.year}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(vehicle.category)}</TableCell>
                      <TableCell>{vehicle.capacity} orang</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{vehicle.rating?.toFixed(1) || '0.0'}</span>
                          <span className="text-xs text-muted-foreground">({vehicle.total_reviews || 0})</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(vehicle.daily_rate || 0)}</TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell>{getConditionBadge(vehicle.condition)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(vehicle)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      Tidak ada kendaraan yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Kendaraan</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{selectedVehicle.brand} {selectedVehicle.model}</h3>
                    <p className="text-muted-foreground">{selectedVehicle.license_plate} • {selectedVehicle.year}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Kategori</Label>
                      <div className="mt-1">{getCategoryBadge(selectedVehicle.category)}</div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedVehicle.status)}</div>
                    </div>
                    <div>
                      <Label>Tipe</Label>
                      <p className="text-sm">{selectedVehicle.type}</p>
                    </div>
                    <div>
                      <Label>Kapasitas</Label>
                      <p className="text-sm">{selectedVehicle.capacity} penumpang</p>
                    </div>
                    <div>
                      <Label>Transmisi</Label>
                      <p className="text-sm capitalize">{selectedVehicle.transmission}</p>
                    </div>
                    <div>
                      <Label>Bahan Bakar</Label>
                      <p className="text-sm capitalize">{selectedVehicle.fuel_type}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Rating & Review</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedVehicle.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                      <span className="text-muted-foreground">({selectedVehicle.total_reviews || 0} review)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tarif Harian</Label>
                      <p className="text-sm font-medium text-green-600">{formatCurrency(selectedVehicle.daily_rate || 0)}</p>
                    </div>
                    <div>
                      <Label>Tarif + Sopir</Label>
                      <p className="text-sm font-medium text-blue-600">{formatCurrency(selectedVehicle.with_driver_rate || 0)}</p>
                    </div>
                    <div>
                      <Label>Warna</Label>
                      <p className="text-sm">{selectedVehicle.color}</p>
                    </div>
                    <div>
                      <Label>Lokasi</Label>
                      <p className="text-sm">{selectedVehicle.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Spesifikasi Teknis</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Kapasitas Mesin</p>
                      <p className="text-sm font-medium">{selectedVehicle.engine_capacity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Konsumsi BBM</p>
                      <p className="text-sm font-medium">{selectedVehicle.fuel_consumption}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kecepatan Max</p>
                      <p className="text-sm font-medium">{selectedVehicle.max_speed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Odometer</p>
                      <p className="text-sm font-medium">{selectedVehicle.mileage?.toLocaleString() || '0'} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Asuransi</p>
                      <p className="text-sm font-medium capitalize">{selectedVehicle.insurance_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kondisi</p>
                      <div className="mt-1">{getConditionBadge(selectedVehicle.condition)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Fitur</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedVehicle.features?.map((feature, index) => (
                      <Badge key={index} variant="outline">{feature}</Badge>
                    )) || <span className="text-sm text-muted-foreground">Tidak ada fitur yang tercatat</span>}
                  </div>
                </div>

                <div>
                  <Label>Maintenance Terakhir</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedVehicle.last_maintenance ? new Date(selectedVehicle.last_maintenance).toLocaleDateString('id-ID') : 'Belum ada data'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}