import { useState, useEffect } from "react"
import { apiClient } from "../utils/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Skeleton } from "./ui/skeleton"
import { Alert, AlertDescription } from "./ui/alert"
import { MapPin, Wifi, Battery, Navigation, Info } from "lucide-react"

interface VehicleStatus {
  id: string
  name: string
  plateNumber: string
  status: "available" | "rented" | "maintenance"
  location: string
  battery: number
  signal: number
  lastUpdate: string
  gpsCoordinates: { lat: number; lng: number }
  driver?: string
  eta?: string
}

const mockVehicleStatuses: VehicleStatus[] = [
  {
    id: "1",
    name: "Toyota Avanza",
    plateNumber: "B 1234 ABC",
    status: "rented",
    location: "Jl. Sudirman, Jakarta Pusat",
    battery: 85,
    signal: 92,
    lastUpdate: "2 menit yang lalu",
    gpsCoordinates: { lat: -6.2088, lng: 106.8456 },
    driver: "Ahmad Rizki",
    eta: "15 menit"
  },
  {
    id: "2",
    name: "Honda Brio",
    plateNumber: "B 5678 DEF",
    status: "available",
    location: "Kantor Pusat - Parking Area",
    battery: 95,
    signal: 88,
    lastUpdate: "1 menit yang lalu",
    gpsCoordinates: { lat: -6.2297, lng: 106.8275 }
  },
  {
    id: "3",
    name: "Mitsubishi Pajero",
    plateNumber: "B 9012 GHI",
    status: "maintenance",
    location: "Workshop Jaya Motor",
    battery: 45,
    signal: 76,
    lastUpdate: "30 menit yang lalu",
    gpsCoordinates: { lat: -6.2615, lng: 106.7812 }
  }
]

export function RealTimeMonitoring() {
  const [vehicleStatuses, setVehicleStatuses] = useState<VehicleStatus[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    loadVehicleStatuses()
    
    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadVehicleStatuses()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadVehicleStatuses = async () => {
    try {
      setApiError(null)
      const response = await apiClient.getVehicleStatuses()
      if (response.data && Array.isArray(response.data)) {
        setVehicleStatuses(response.data)
      } else {
        setApiError('Using demo data - API returned invalid structure')
        setVehicleStatuses(mockVehicleStatuses)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setApiError(`Using demo data - ${errorMessage}`)
      setVehicleStatuses(mockVehicleStatuses) // Fallback to mock data
    } finally {
      setLoading(false)
    }
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

  const getSignalIcon = (signal: number) => {
    if (signal > 80) return <Wifi className="h-4 w-4 text-green-500" />
    if (signal > 50) return <Wifi className="h-4 w-4 text-yellow-500" />
    return <Wifi className="h-4 w-4 text-red-500" />
  }

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return "bg-green-500"
    if (battery > 20) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Monitoring Real-time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apiError && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : vehicleStatuses.length > 0 ? (
              vehicleStatuses.map((vehicle) => (
              <Card 
                key={vehicle.id} 
                className={`cursor-pointer transition-colors ${
                  selectedVehicle === vehicle.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{vehicle.plateNumber}</p>
                    </div>
                    {getStatusBadge(vehicle.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{vehicle.location}</span>
                  </div>
                  
                  {vehicle.driver && (
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span>Driver: {vehicle.driver}</span>
                    </div>
                  )}

                  {vehicle.eta && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">ETA: </span>
                      <span className="font-medium">{vehicle.eta}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Battery className="h-4 w-4" />
                        <span>Battery</span>
                      </div>
                      <span>{Math.round(vehicle.battery)}%</span>
                    </div>
                    <Progress value={vehicle.battery} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      {getSignalIcon(vehicle.signal)}
                      <span>Signal</span>
                    </div>
                    <span>{Math.round(vehicle.signal)}%</span>
                  </div>

                  <div className="text-xs text-muted-foreground border-t pt-2">
                    Update: {vehicle.lastUpdate}
                  </div>
                </CardContent>
              </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Tidak ada data kendaraan yang tersedia
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedVehicle && (
        <Card>
          <CardHeader>
            <CardTitle>GPS Tracking - {vehicleStatuses.find(v => v.id === selectedVehicle)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Peta GPS akan ditampilkan di sini</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Koordinat: {vehicleStatuses.find(v => v.id === selectedVehicle)?.gpsCoordinates.lat}, {vehicleStatuses.find(v => v.id === selectedVehicle)?.gpsCoordinates.lng}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}