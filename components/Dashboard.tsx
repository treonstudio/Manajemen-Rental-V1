import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Car, DollarSign, CreditCard, Users, Calendar, Clock, AlertCircle, CheckCircle, Wrench, Route } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts"
import { apiClient } from "../utils/api-client"

interface DashboardKPI {
  totalRevenue: number
  totalTransactions: number
  averageTransaction: number
  monthlyGrowth: number
  totalVehicles: number
  availableVehicles: number
  rentedVehicles: number
  maintenanceVehicles: number
  totalDrivers: number
  activeDrivers: number
  totalCustomers: number
  activeRentals: number
  outstandingAmount: number
  collectionRate: number
  utilizationRate: number
}

interface ProfitLossData {
  month: string
  revenue: number
  expenses: number
  profit: number
  margin: number
}

interface VehiclePerformance {
  vehicleId: string
  vehicleName: string
  model: string
  totalRentals: number
  totalRevenue: number
  utilizationRate: number
  averageRentalValue: number
  lastRentalDate: string
  status: 'excellent' | 'good' | 'average' | 'poor'
}

interface DriverPerformance {
  driverId: string
  driverName: string
  totalTrips: number
  totalRevenue: number
  averageRating: number
  completionRate: number
  customerSatisfaction: number
  efficiency: number
  status: 'top' | 'good' | 'average' | 'needs_improvement'
}

interface RealtimeMetrics {
  activeRentals: number
  todayRevenue: number
  todayTransactions: number
  vehicleUtilization: number
  driverUtilization: number
  pendingMaintenance: number
  overduePayments: number
  newCustomers: number
}

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Data states
  const [kpiData, setKpiData] = useState<DashboardKPI | null>(null)
  const [profitLossData, setProfitLossData] = useState<ProfitLossData[]>([])
  const [vehiclePerformance, setVehiclePerformance] = useState<VehiclePerformance[]>([])
  const [driverPerformance, setDriverPerformance] = useState<DriverPerformance[]>([])
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics | null>(null)

  useEffect(() => {
    loadDashboardData()
    
    // Setup real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadRealtimeData()
    }, 30000)

    return () => clearInterval(interval)
  }, [selectedPeriod])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [kpiRes, profitLossRes, vehicleRes, driverRes, realtimeRes] = await Promise.all([
        apiClient.get(`/dashboard/kpi?period=${selectedPeriod}`),
        apiClient.get(`/dashboard/profit-loss?period=${selectedPeriod}`),
        apiClient.get(`/dashboard/vehicle-performance?period=${selectedPeriod}`),
        apiClient.get(`/dashboard/driver-performance?period=${selectedPeriod}`),
        apiClient.get(`/dashboard/realtime`)
      ])

      setKpiData(kpiRes.data)
      setProfitLossData(profitLossRes.data || [])
      setVehiclePerformance(vehicleRes.data || [])
      setDriverPerformance(driverRes.data || [])
      setRealtimeMetrics(realtimeRes.data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRealtimeData = async () => {
    try {
      const response = await apiClient.get('/dashboard/realtime')
      setRealtimeMetrics(response.data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading realtime data:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'top':
        return 'text-green-600 bg-green-50'
      case 'good':
        return 'text-blue-600 bg-blue-50'
      case 'average':
        return 'text-yellow-600 bg-yellow-50'
      case 'poor':
      case 'needs_improvement':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Sangat Baik'
      case 'good':
        return 'Baik'
      case 'average':
        return 'Cukup'
      case 'poor':
        return 'Kurang'
      case 'top':
        return 'Terbaik'
      case 'needs_improvement':
        return 'Perlu Peningkatan'
      default:
        return status
    }
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (value < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-muted animate-pulse rounded"></div>
          <div className="h-80 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard & Analitik</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString('id-ID')}
          </p>
        </div>
        
        <div className="flex gap-2 items-center">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="quarter">Kuartal Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Data
          </div>
        </div>
      </div>

      {/* Real-time Metrics Bar */}
      {realtimeMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card key="active-rentals" className="p-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{realtimeMetrics.activeRentals}</div>
              <div className="text-xs text-muted-foreground">Sewa Aktif</div>
            </div>
          </Card>
          <Card key="today-revenue" className="p-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{formatNumber(realtimeMetrics.todayRevenue)}</div>
              <div className="text-xs text-muted-foreground">Omset Hari Ini</div>
            </div>
          </Card>
          <Card key="today-transactions" className="p-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">{realtimeMetrics.todayTransactions}</div>
              <div className="text-xs text-muted-foreground">Transaksi Hari Ini</div>
            </div>
          </Card>
          <Card key="vehicle-utilization" className="p-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-teal-600">{realtimeMetrics.vehicleUtilization}%</div>
              <div className="text-xs text-muted-foreground">Utilisasi Kendaraan</div>
            </div>
          </Card>
          <Card key="driver-utilization" className="p-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-indigo-600">{realtimeMetrics.driverUtilization}%</div>
              <div className="text-xs text-muted-foreground">Utilisasi Sopir</div>
            </div>
          </Card>
          <Card key="pending-maintenance" className="p-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">{realtimeMetrics.pendingMaintenance}</div>
              <div className="text-xs text-muted-foreground">Pending Maintenance</div>
            </div>
          </Card>
          <Card key="overdue-payments" className="p-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">{realtimeMetrics.overduePayments}</div>
              <div className="text-xs text-muted-foreground">Pembayaran Terlambat</div>
            </div>
          </Card>
          <Card key="new-customers" className="p-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-cyan-600">{realtimeMetrics.newCustomers}</div>
              <div className="text-xs text-muted-foreground">Customer Baru</div>
            </div>
          </Card>
        </div>
      )}

      {/* Main KPI Cards (FR-DAS-001) */}
      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Omset</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {formatCurrency(kpiData.totalRevenue)}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(kpiData.monthlyGrowth)}
                    <span className={kpiData.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {kpiData.monthlyGrowth >= 0 ? '+' : ''}{kpiData.monthlyGrowth.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">dari periode lalu</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Transaksi</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {kpiData.totalTransactions}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rata-rata: {formatCurrency(kpiData.averageTransaction)}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status Kendaraan</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-600">{kpiData.availableVehicles}</p>
                      <p className="text-xs text-muted-foreground">Tersedia</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-blue-600">{kpiData.rentedVehicles}</p>
                      <p className="text-xs text-muted-foreground">Disewa</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-orange-600">{kpiData.maintenanceVehicles}</p>
                      <p className="text-xs text-muted-foreground">Maintenance</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={kpiData.utilizationRate} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Utilisasi: {kpiData.utilizationRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Car className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ringkasan Bisnis</p>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Sewa Aktif</span>
                      <span className="font-medium">{kpiData.activeRentals}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sopir Aktif</span>
                      <span className="font-medium">{kpiData.activeDrivers}/{kpiData.totalDrivers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Customer</span>
                      <span className="font-medium">{kpiData.totalCustomers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Collection Rate</span>
                      <span className="font-medium text-green-600">{kpiData.collectionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profit Loss Chart (FR-DAS-002) */}
      <Card>
        <CardHeader>
          <CardTitle>Grafik Laba Rugi Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={profitLossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatNumber(value)} />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  if (name === 'margin') {
                    return [`${value.toFixed(1)}%`, 'Margin']
                  }
                  return [formatCurrency(value), name === 'revenue' ? 'Pendapatan' : name === 'expenses' ? 'Pengeluaran' : 'Laba']
                }}
              />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="revenue" />
              <Area type="monotone" dataKey="expenses" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="expenses" />
              <Area type="monotone" dataKey="profit" stackId="3" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} name="profit" />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div key="total-revenue" className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Pendapatan</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(profitLossData.reduce((sum, item) => sum + item.revenue, 0))}
              </p>
            </div>
            <div key="total-expenses" className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
              <p className="text-lg font-semibold text-orange-600">
                {formatCurrency(profitLossData.reduce((sum, item) => sum + item.expenses, 0))}
              </p>
            </div>
            <div key="total-profit" className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Laba</p>
              <p className="text-lg font-semibold text-blue-600">
                {formatCurrency(profitLossData.reduce((sum, item) => sum + item.profit, 0))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics (FR-DAS-003) */}
      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicles">Pencapaian Per Unit</TabsTrigger>
          <TabsTrigger value="drivers">Pencapaian Per Sopir</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Kendaraan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {vehiclePerformance.map((vehicle) => (
                  <div key={vehicle.vehicleId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{vehicle.vehicleName}</h4>
                          <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                        </div>
                        <Badge className={getStatusColor(vehicle.status)} variant="secondary">
                          {getStatusLabel(vehicle.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Sewa</p>
                          <p className="font-medium">{vehicle.totalRentals}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-medium text-green-600">{formatCurrency(vehicle.totalRevenue)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Utilisasi</p>
                          <p className="font-medium">{vehicle.utilizationRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Value</p>
                          <p className="font-medium">{formatCurrency(vehicle.averageRentalValue)}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={vehicle.utilizationRate} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Sopir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {driverPerformance.map((driver) => (
                  <div key={driver.driverId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{driver.driverName}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>⭐ {driver.averageRating.toFixed(1)}</span>
                            <span>•</span>
                            <span>{driver.totalTrips} trips</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(driver.status)} variant="secondary">
                          {getStatusLabel(driver.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-medium text-green-600">{formatCurrency(driver.totalRevenue)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Completion Rate</p>
                          <p className="font-medium">{driver.completionRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Customer Satisfaction</p>
                          <p className="font-medium">{driver.customerSatisfaction.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Efficiency</p>
                          <p className="font-medium">{driver.efficiency.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Completion</span>
                            <span>{driver.completionRate.toFixed(0)}%</span>
                          </div>
                          <Progress value={driver.completionRate} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Satisfaction</span>
                            <span>{driver.customerSatisfaction.toFixed(0)}%</span>
                          </div>
                          <Progress value={driver.customerSatisfaction} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Efficiency</span>
                            <span>{driver.efficiency.toFixed(0)}%</span>
                          </div>
                          <Progress value={driver.efficiency} className="h-1" />
                        </div>
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