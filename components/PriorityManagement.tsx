import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Badge } from "./ui/badge"
import { Star, TrendingUp, Calendar, Users } from "lucide-react"

interface Vehicle {
  id: string
  name: string
  plateNumber: string
  category: string
  status: "available" | "rented" | "maintenance"
  priority: boolean
  demandScore: number
  bookings: number
  revenue: number
  lastRented: string
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Toyota Avanza",
    plateNumber: "B 1234 ABC",
    category: "MVP",
    status: "available",
    priority: true,
    demandScore: 95,
    bookings: 24,
    revenue: 12500000,
    lastRented: "2024-08-09"
  },
  {
    id: "2",
    name: "Honda Brio",
    plateNumber: "B 5678 DEF",
    category: "City Car",
    status: "rented",
    priority: false,
    demandScore: 78,
    bookings: 18,
    revenue: 8750000,
    lastRented: "2024-08-10"
  },
  {
    id: "3",
    name: "Mitsubishi Pajero",
    plateNumber: "B 9012 GHI",
    category: "SUV",
    status: "maintenance",
    priority: true,
    demandScore: 88,
    bookings: 15,
    revenue: 18900000,
    lastRented: "2024-08-05"
  },
  {
    id: "4",
    name: "Toyota Innova",
    plateNumber: "B 3456 JKL",
    category: "MVP",
    status: "available",
    priority: false,
    demandScore: 82,
    bookings: 20,
    revenue: 14200000,
    lastRented: "2024-08-08"
  }
]

export function PriorityManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)

  const togglePriority = (vehicleId: string) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, priority: !vehicle.priority }
        : vehicle
    ))
  }

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

  const getDemandLevel = (score: number) => {
    if (score >= 90) return { label: "Sangat Tinggi", color: "text-red-500" }
    if (score >= 80) return { label: "Tinggi", color: "text-orange-500" }
    if (score >= 70) return { label: "Sedang", color: "text-yellow-500" }
    return { label: "Rendah", color: "text-green-500" }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const priorityVehicles = vehicles.filter(v => v.priority)
  const availablePriorityVehicles = priorityVehicles.filter(v => v.status === "available")

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unit Prioritas</p>
                <p className="text-2xl font-bold">{priorityVehicles.length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prioritas Tersedia</p>
                <p className="text-2xl font-bold">{availablePriorityVehicles.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Demand Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(priorityVehicles.reduce((acc, v) => acc + v.demandScore, 0) / priorityVehicles.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Manajemen Status Prioritas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vehicles.map((vehicle) => {
              const demand = getDemandLevel(vehicle.demandScore)
              return (
                <Card key={vehicle.id} className={vehicle.priority ? "ring-2 ring-yellow-200" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div>
                            <h3 className="font-medium">{vehicle.name}</h3>
                            <p className="text-sm text-muted-foreground">{vehicle.plateNumber} • {vehicle.category}</p>
                          </div>
                          {vehicle.priority && (
                            <Badge variant="default" className="bg-yellow-500">
                              <Star className="h-3 w-3 mr-1" />
                              Prioritas
                            </Badge>
                          )}
                          {getStatusBadge(vehicle.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Demand Score</p>
                            <p className={`font-medium ${demand.color}`}>
                              {vehicle.demandScore}% ({demand.label})
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Booking</p>
                            <p className="font-medium">{vehicle.bookings} kali</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Revenue</p>
                            <p className="font-medium">{formatCurrency(vehicle.revenue)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Terakhir Disewa</p>
                            <p className="font-medium">{vehicle.lastRented}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Status Prioritas</p>
                          <p className="text-sm font-medium">
                            {vehicle.priority ? "Aktif" : "Tidak Aktif"}
                          </p>
                        </div>
                        <Switch
                          checked={vehicle.priority}
                          onCheckedChange={() => togglePriority(vehicle.id)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Priority Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi Prioritas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">Honda Brio (B 5678 DEF)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Kendaraan ini memiliki demand score tinggi (78%) dan sering dibooking. Pertimbangkan untuk menjadikan prioritas.
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Toyota Innova (B 3456 JKL)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Revenue tinggi dengan 20 booking. Ideal untuk status prioritas mengingat kategori MVP sangat diminati.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}