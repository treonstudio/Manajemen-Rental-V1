import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { FileText, Download, Calendar, DollarSign, MapPin, Clock } from "lucide-react"
import { Button } from "./ui/button"

interface VehiclePerformance {
  id: string
  name: string
  plateNumber: string
  category: string
  totalBookings: number
  totalRevenue: number
  utilizationRate: number
  averageRating: number
  totalDistance: number
  maintenanceCost: number
  fuelCost: number
  profitMargin: number
  averageRentalDuration: number
  peakSeason: string
}

const mockPerformanceData: VehiclePerformance[] = [
  {
    id: "1",
    name: "Toyota Avanza",
    plateNumber: "B 1234 ABC",
    category: "MVP",
    totalBookings: 24,
    totalRevenue: 12500000,
    utilizationRate: 85,
    averageRating: 4.7,
    totalDistance: 18500,
    maintenanceCost: 2100000,
    fuelCost: 1800000,
    profitMargin: 68,
    averageRentalDuration: 3.2,
    peakSeason: "Liburan Sekolah"
  },
  {
    id: "2",
    name: "Honda Brio",
    plateNumber: "B 5678 DEF",
    category: "City Car",
    totalBookings: 18,
    totalRevenue: 8750000,
    utilizationRate: 72,
    averageRating: 4.5,
    totalDistance: 14200,
    maintenanceCost: 1500000,
    fuelCost: 1200000,
    profitMargin: 69,
    averageRentalDuration: 2.8,
    peakSeason: "Weekend"
  },
  {
    id: "3",
    name: "Mitsubishi Pajero",
    plateNumber: "B 9012 GHI",
    category: "SUV",
    totalBookings: 15,
    totalRevenue: 18900000,
    utilizationRate: 65,
    averageRating: 4.8,
    totalDistance: 22100,
    maintenanceCost: 3200000,
    fuelCost: 2800000,
    profitMargin: 66,
    averageRentalDuration: 4.5,
    peakSeason: "Mudik & Liburan"
  }
]

export function PerformanceReports() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all")
  const [reportPeriod, setReportPeriod] = useState<string>("6months")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getPerformanceLevel = (rate: number) => {
    if (rate >= 80) return { label: "Excellent", variant: "default" as const }
    if (rate >= 70) return { label: "Good", variant: "secondary" as const }
    if (rate >= 60) return { label: "Average", variant: "outline" as const }
    return { label: "Poor", variant: "destructive" as const }
  }

  const filteredData = selectedVehicle === "all" ? mockPerformanceData : mockPerformanceData.filter(v => v.id === selectedVehicle)

  const totalRevenue = filteredData.reduce((sum, v) => sum + v.totalRevenue, 0)
  const totalBookings = filteredData.reduce((sum, v) => sum + v.totalBookings, 0)
  const avgUtilization = Math.round(filteredData.reduce((sum, v) => sum + v.utilizationRate, 0) / filteredData.length)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Laporan Performa Kendaraan
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Pilih kendaraan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kendaraan</SelectItem>
                {mockPerformanceData.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} - {vehicle.plateNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Periode laporan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 Bulan Terakhir</SelectItem>
                <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
                <SelectItem value="6months">6 Bulan Terakhir</SelectItem>
                <SelectItem value="1year">1 Tahun Terakhir</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Utilization</p>
                <p className="text-2xl font-bold">{avgUtilization}%</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fleet Size</p>
                <p className="text-2xl font-bold">{filteredData.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Reports */}
      <div className="space-y-4">
        {filteredData.map((vehicle) => {
          const performance = getPerformanceLevel(vehicle.utilizationRate)
          return (
            <Card key={vehicle.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{vehicle.name}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.plateNumber} • {vehicle.category}</p>
                  </div>
                  <Badge variant={performance.variant}>{performance.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Revenue & Bookings */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Revenue & Bookings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Revenue</span>
                        <span className="font-medium">{formatCurrency(vehicle.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Bookings</span>
                        <span className="font-medium">{vehicle.totalBookings} kali</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Duration</span>
                        <span className="font-medium">{vehicle.averageRentalDuration} hari</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Customer Rating</span>
                        <span className="font-medium">⭐ {vehicle.averageRating}/5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Metrics */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Operational Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Utilization Rate</span>
                        <span className="font-medium">{vehicle.utilizationRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Distance</span>
                        <span className="font-medium">{vehicle.totalDistance.toLocaleString()} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Peak Season</span>
                        <span className="font-medium">{vehicle.peakSeason}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Financial Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Maintenance Cost</span>
                        <span className="font-medium">{formatCurrency(vehicle.maintenanceCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fuel Cost</span>
                        <span className="font-medium">{formatCurrency(vehicle.fuelCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Profit Margin</span>
                        <span className="font-medium text-green-600">{vehicle.profitMargin}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground text-center">
                    📊 Grafik performa bulanan akan ditampilkan di sini
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Top Performer</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Toyota Avanza memiliki tingkat utilization tertinggi (85%) dengan rating customer 4.7/5.0
              </p>
            </div>
            
            <div className="p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">Improvement Opportunity</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Mitsubishi Pajero memiliki potensi revenue tinggi namun utilization rendah (65%). Pertimbangkan strategi pricing atau marketing.
              </p>
            </div>
            
            <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">Cost Efficiency</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Honda Brio menunjukkan profit margin terbaik (69%) dengan biaya operasional rendah.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}